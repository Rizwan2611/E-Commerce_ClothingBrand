import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { Package, XCircle, Clock, Truck, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const CustomerOrdersPage = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const highlightOrderId = searchParams.get('orderId');

  const { data: orders, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => api.get('/orders/my').then((r) => r.data.orders),
  });

  useEffect(() => {
    if (highlightOrderId) {
      const element = document.getElementById(highlightOrderId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightOrderId, orders]);

  const cancelMutation = useMutation({
    mutationFn: (orderId) => api.patch(`/orders/${orderId}/cancel`),
    onSuccess: () => {
      toast.success('Order cancelled successfully');
      queryClient.invalidateQueries(['my-orders']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    },
  });

  if (isLoading) {
    return (
      <div className="bg-canvas min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-canvas geometric-grid min-h-screen section-quiet px-6 sm:px-12 lg:px-24">
      <div className="bg-grain opacity-[0.03]" />

      <header className="pt-48 pb-20 px-4 section-quiet text-center relative">
        <p className="text-whisper mb-12 animate-fade-in">Sovereign Archive . Identity</p>
        <h1 className="logo-heritage text-[10vw] md:text-[8rem] text-ink leading-none tracking-tight animate-fade-in">
          ACCOUNT HISTORY
        </h1>
      </header>

      {orders?.length === 0 ? (
        <div className="text-center py-40 border border-dashed border-border reveal-hidden">
          <p className="text-whisper opacity-40">No records found in the archive</p>
        </div>
      ) : (
        <div className="space-y-24">
          {orders?.map((order, idx) => {
            const isHighlighted = order.orderId === highlightOrderId;
            return (
              <div 
                key={order._id} 
                id={order.orderId}
                className={`border-b border-border pb-20 animate-fade-in transition-all duration-1000 ${
                  isHighlighted ? 'bg-accent/[0.03] ring-1 ring-accent/10 p-8 -mx-8 scale-[1.02]' : ''
                }`} 
                style={{ transitionDelay: `${idx * 0.1}s` }}
              >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8">
                <div>
                  <p className="text-whisper text-accent text-3xl mb-4">{order.orderId}</p>
                  <p className="text-whisper text-[12px] opacity-40">Logged on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-12">
                  <span className="text-whisper border border-accent text-accent px-4 py-1 lowercase">{order.status}</span>
                  {['pending', 'confirmed'].includes(order.status) && (
                    <button
                      onClick={() => {
                        if (confirm('Verify order cancellation?')) {
                          cancelMutation.mutate(order._id);
                        }
                      }}
                      className="text-whisper text-red-900 opacity-40 hover:opacity-100 transition-all interactive"
                      disabled={cancelMutation.isPending}
                    >
                      Cancel Entry
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
                {order.items.map((item, i) => (
                  <div key={i} className="flex gap-6 items-center">
                    <div className="w-16 aspect-[3/4] overflow-hidden border border-border grayscale hover:grayscale-0 transition-all duration-700">
                      {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div>
                      <p className="text-whisper text-lg mb-3 tracking-[0.2em]">{item.title}</p>
                      <p className="text-whisper text-[11px] opacity-40">
                        {item.size && `${item.size} . `}
                        {item.quantity} Units
                      </p>
                      <p className="text-whisper text-[12px] text-accent mt-4">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center py-12 border-y border-border border-dashed my-12">
                <p className="text-whisper text-[12px] opacity-40">Method . {order.paymentMethod}</p>
                <p className="text-whisper text-2xl text-accent">Total . Rs. {order.totalAmount.toLocaleString()}</p>
              </div>

              {/* Delivery Tracking & Verification Protocol */}
              {['pending', 'confirmed', 'processing', 'shipped', 'delivered'].includes(order.status) && (
                <div className="space-y-16 mt-16">
                   <div className="bg-ink/[0.02] border border-border/10 p-12 animate-fade-in">
                    {order.isVerified ? (
                      <div className="flex items-center gap-6 text-accent">
                        <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
                        <p className="text-whisper text-[14px]">Acquisition Verified . {new Date(order.verificationChecklist?.verifiedAt).toLocaleDateString()}</p>
                      </div>
                    ) : (
                      <DeliveryVerification orderId={order._id} />
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
};

function DeliveryVerification({ orderId }) {
  const [deliveryStatus, setDeliveryStatus] = useState('pending');
  const [checks, setChecks] = useState({
    quality: false,
    size: false,
    integrity: false
  });
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const isComplete = deliveryStatus === 'delivered' 
    ? Object.values(checks).every(v => v)
    : deliveryStatus !== 'pending'; // Allow submission for 'not_received'

  const handleVerify = async () => {
    setLoading(true);
    try {
      await api.patch(`/orders/${orderId}/verify`, {
        isQualityVerified: deliveryStatus === 'delivered' ? checks.quality : false,
        isSizeVerified: deliveryStatus === 'delivered' ? checks.size : false,
        isIntegrityVerified: deliveryStatus === 'delivered' ? checks.integrity : false,
        deliveryStatus: deliveryStatus
      });
      toast.success('Acquisition certified successfully');
      queryClient.invalidateQueries(['my-orders']);
    } catch (err) {
      toast.error('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <div>
        <div className="flex items-end gap-6 mb-12">
          <p className="text-whisper text-accent uppercase tracking-[0.4em] text-[10px]">Logistics Outcome</p>
          <p className="text-[9px] font-mono opacity-20 italic">Verify your receipt status</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { id: 'delivered', label: 'Delivered', sub: 'acquisition successful' },
            { id: 'pending', label: 'Pending', sub: 'in heritage transit' },
            { id: 'not_received', label: 'Not Received', sub: 'logistics discrepancy' }
          ].map((outcome) => (
            <button
              key={outcome.id}
              onClick={() => setDeliveryStatus(outcome.id)}
              className={`flex flex-col p-8 border transition-all duration-700 interactive ${
                deliveryStatus === outcome.id 
                  ? outcome.id === 'not_received' ? 'bg-red-900 border-red-900 text-canvas' : 'bg-ink border-ink text-canvas' 
                  : 'bg-canvas border-ink/5 text-ink hover:border-ink/20'
              }`}
            >
              <p className={`text-whisper text-[10px] font-black uppercase tracking-[0.2em] mb-3 transition-colors duration-700 ${deliveryStatus === outcome.id ? '!text-canvas' : 'text-ink'}`}>{outcome.label}</p>
              <p className={`text-[10px] italic font-medium transition-all duration-700 ${deliveryStatus === outcome.id ? '!text-canvas/70 opacity-100' : 'text-ink/40 opacity-40'}`}>
                {outcome.sub}
              </p>
            </button>
          ))}
        </div>
        {deliveryStatus === 'not_received' && (
          <div className="mt-8 p-6 border border-red-900/20 bg-red-900/5 animate-fade-in">
            <p className="text-whisper text-red-900 text-[10px] italic">
              We apologize. Please contact our Atelier immediately for resolution.
            </p>
          </div>
        )}
      </div>

      {deliveryStatus === 'delivered' && (
        <>
          <div className="h-px bg-border/40 w-full" />
          <div className="animate-fade-in">
            <div className="flex items-end gap-6 mb-12">
              <p className="text-whisper text-accent uppercase tracking-[0.4em] text-[10px]">Component Audit</p>
              <p className="text-[9px] font-mono opacity-20 italic">Verify piece integrity</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { id: 'quality', label: 'Quality Verified', sub: 'Fabric & Stitching Audit' },
                { id: 'size', label: 'Size Verified', sub: 'Measurement Accuracy' },
                { id: 'integrity', label: 'Integrity Verified', sub: 'Identity Tags Intact' }
              ].map(check => (
                <button 
                  key={check.id}
                  onClick={() => setChecks(prev => ({ ...prev, [check.id]: !prev[check.id] }))}
                  className={`flex flex-col text-left p-8 border transition-all duration-700 interactive ${
                    checks[check.id] ? 'bg-ink border-ink text-canvas' : 'bg-canvas border-ink/5 text-ink hover:border-ink/20'
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className={`text-whisper text-[10px] font-black uppercase tracking-[0.1em] transition-colors duration-700 ${checks[check.id] ? '!text-canvas' : 'text-ink'}`}>{check.label}</span>
                    <div className={`w-2 h-2 rounded-full transition-all duration-700 ${checks[check.id] ? 'bg-accent' : 'bg-mute/20'}`} />
                  </div>
                  <p className={`text-[10px] italic font-medium transition-all duration-700 ${checks[check.id] ? '!text-canvas/70 opacity-100' : 'text-ink/40 opacity-40'}`}>
                    {check.sub}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <button
        onClick={handleVerify}
        disabled={!isComplete || loading}
        className={`w-full py-8 text-whisper text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-1000 ${
          isComplete 
            ? 'bg-ink text-canvas hover:bg-accent interactive translate-y-0' 
            : 'bg-ink/10 text-ink/20 cursor-not-allowed translate-y-2'
        }`}
      >
        {loading ? 'Certifying...' : isComplete ? 'Finalize Status Update' : 
          deliveryStatus === 'delivered' ? 'Complete All Checks to Finalize' : 'Select Status to Update'}
      </button>
    </div>
  );
};export default CustomerOrdersPage;
