import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { Package, Star, ChevronRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const OrderReviewPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState('pending');
  const [verification, setVerification] = useState({
    quality: false,
    size: false,
    integrity: false
  });

  const allVerified = verification.quality && verification.size && verification.integrity && deliveryStatus === 'delivered';

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order-review', orderId],
    queryFn: () => api.get(`/orders/${orderId}`).then(res => res.data.order),
  });

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !comment.trim()) return;

    setIsSubmitting(true);
    try {
      await api.post(`/products/${selectedProduct._id}/reviews`, {
        rating,
        comment,
      });
      toast.success('Contribution archived successfully');
      setComment('');
      setRating(5);
      // Mark as reviewed locally or refresh
      queryClient.invalidateQueries(['order-review', orderId]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to archive contribution');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-canvas flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error || !order) return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center section-quiet">
      <p className="text-whisper opacity-40 mb-8 text-center">Order protocol not identified or link expired.</p>
      <button onClick={() => navigate('/')} className="text-whisper text-accent border-b border-accent pb-1">Return to Archive</button>
    </div>
  );

  return (
    <div className="bg-canvas geometric-grid min-h-screen section-quiet px-6 sm:px-12 lg:px-24">
      <div className="bg-grain opacity-[0.03]" />
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-24 reveal-hidden">
          <p className="text-whisper text-accent mb-6">Review . Protocol</p>
          <h1 className="logo-heritage text-5xl md:text-8xl text-ink">Private Legacy</h1>
          <p className="text-whisper opacity-40 mt-8">Order ID: {order.orderId}</p>
        </div>

        {/* ── Post-Delivery Protocol Section ── */}
        <div className="mb-24 reveal-hidden">
          <div className="flex items-center gap-6 mb-12">
            <p className="text-whisper text-accent uppercase tracking-[0.4em] text-[10px]">Post-Delivery Protocol</p>
            <p className="text-whisper opacity-20 italic text-[9px]">Verify components to finalize acquisition</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { id: 'quality', label: 'Quality Verified', sub: 'fabric & stitching audit' },
              { id: 'size', label: 'Size Verified', sub: 'measurement accuracy' },
              { id: 'integrity', label: 'Integrity Verified', sub: 'identity tags intact' }
            ].map((check) => (
              <button
                key={check.id}
                onClick={() => setVerification(v => ({ ...v, [check.id]: !v[check.id] }))}
                className={`flex flex-col p-10 border transition-all duration-700 relative overflow-hidden group interactive ${
                  verification[check.id] 
                    ? 'bg-ink border-ink text-canvas' 
                    : 'bg-canvas border-ink/5 text-ink hover:border-ink/20'
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <p className={`text-whisper text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-700 ${verification[check.id] ? '!text-canvas' : 'text-ink'}`}>{check.label}</p>
                  <div className={`w-3 h-3 rounded-full border transition-all duration-700 ${
                    verification[check.id] ? 'bg-accent border-accent scale-110' : 'border-ink/10'
                  }`} />
                </div>
                <p className={`text-[10px] italic font-medium transition-all duration-700 ${verification[check.id] ? '!text-canvas/70 opacity-100' : 'text-ink/40 opacity-40'}`}>
                  {check.sub}
                </p>
              </button>
            ))}
          </div>

          <button
            disabled={!allVerified}
            className={`w-full py-8 text-whisper text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-1000 ${
              allVerified 
                ? 'bg-ink text-canvas hover:bg-accent interactive translate-y-0' 
                : 'bg-ink/10 text-ink/20 cursor-not-allowed translate-y-2'
            }`}
          >
            {allVerified ? 'Finalize Acquisition Protocol' : 'Verify Components & Delivery to Finalize'}
          </button>
        </div>

        {/* ── Logistics Outcome Selection ── */}
        <div className="mb-24 reveal-hidden">
          <p className="text-whisper text-accent uppercase tracking-[0.4em] text-[10px] mb-12">Logistics Outcome</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: 'delivered', label: 'Delivered', sub: 'acquisition successful' },
              { id: 'pending', label: 'Pending', sub: 'in heritage transit' },
              { id: 'not_received', label: 'Not Received', sub: 'logistics discrepancy' }
            ].map((outcome) => (
              <button
                key={outcome.id}
                onClick={() => setDeliveryStatus(outcome.id)}
                className={`flex flex-col p-10 border transition-all duration-700 interactive ${
                  deliveryStatus === outcome.id 
                    ? outcome.id === 'not_received' ? 'bg-red-900 border-red-900 text-canvas' : 'bg-ink border-ink text-canvas' 
                    : 'bg-canvas border-ink/5 text-ink hover:border-ink/20'
                }`}
              >
                <p className={`text-whisper text-[10px] font-black uppercase tracking-[0.2em] mb-4 transition-colors duration-700 ${deliveryStatus === outcome.id ? '!text-canvas' : 'text-ink'}`}>{outcome.label}</p>
                <p className={`text-[10px] italic font-medium transition-all duration-700 ${deliveryStatus === outcome.id ? '!text-canvas/70 opacity-100' : 'text-ink/40 opacity-40'}`}>
                  {outcome.sub}
                </p>
              </button>
            ))}
          </div>
          
          {deliveryStatus === 'not_received' && (
            <div className="mt-8 p-8 border border-red-900/20 bg-red-900/5 animate-fade-in">
              <p className="text-whisper text-red-900 text-xs italic">
                We apologize for this discrepancy. Please <Link to="/location" className="border-b border-red-900 font-black">Contact our Atelier</Link> immediately for resolution.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Order Items List */}
          <div className="lg:col-span-5 space-y-8">
            <p className="text-whisper opacity-30 mb-8 uppercase tracking-[0.3em]">Select Piece to Review</p>
            {order.items.map((item) => (
              <button
                key={item.product}
                onClick={() => setSelectedProduct({ _id: item.product, title: item.title, image: item.image })}
                className={`w-full flex gap-6 items-center p-6 border transition-all duration-500 interactive ${
                  selectedProduct?._id === item.product 
                    ? 'border-accent bg-accent/5' 
                    : 'border-border grayscale opacity-60 hover:opacity-100 hover:grayscale-0'
                }`}
              >
                <div className="w-16 aspect-[3/4] overflow-hidden border border-border">
                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="text-left">
                  <p className="text-whisper text-[10px] mb-2">{item.title}</p>
                  <p className="text-[9px] font-mono opacity-30 uppercase">{item.size || 'Standard'} . {item.color || 'Oasis'}</p>
                </div>
                <ChevronRight size={14} className={`ml-auto transition-transform ${selectedProduct?._id === item.product ? 'translate-x-2 text-accent' : 'opacity-20'}`} />
              </button>
            ))}
          </div>

          {/* Review Form Area */}
          <div className="lg:col-span-7">
            {selectedProduct ? (
              <div className="bg-ink/[0.02] border border-border/10 p-12 relative overflow-hidden animate-fade-in">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <Package size={80} />
                </div>

                <div className="flex items-center gap-6 mb-12">
                  <div className="w-12 h-16 border border-border overflow-hidden">
                    <img src={selectedProduct.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-whisper text-accent text-sm">{selectedProduct.title}</p>
                    <p className="text-[9px] font-mono opacity-20 uppercase mt-1">Heritage . Documentation</p>
                  </div>
                </div>

                <form onSubmit={handleReviewSubmit} className="space-y-12">
                  <div className="space-y-4">
                    <p className="text-whisper">Heritage Rating</p>
                    <div className="flex gap-4">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button key={num} type="button" onClick={() => setRating(num)}
                          className={`text-whisper w-10 h-10 border transition-all ${
                            rating === num ? 'border-accent text-accent bg-accent/5' : 'border-border text-mute hover:border-ink hover:text-ink'
                          } interactive`}>
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-whisper">Narrative Specification</p>
                    <textarea 
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Document your acquisition experience..."
                      className="w-full bg-transparent border-b border-ink/10 focus:border-accent py-4 text-sm font-body italic focus:outline-none transition-all min-h-[120px] text-ink"
                      required
                    />
                  </div>

                  <button type="submit" disabled={isSubmitting}
                    className="w-full bg-ink text-canvas text-[10px] font-bold tracking-[0.3em] uppercase py-6 hover:bg-accent transition-all disabled:opacity-40 disabled:cursor-not-allowed interactive">
                    {isSubmitting ? 'Archiving...' : 'Finalize Documentation'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="h-full border border-dashed border-border/20 flex flex-col items-center justify-center p-20 text-center">
                <CheckCircle2 size={32} className="text-ink/10 mb-6" />
                <p className="text-whisper opacity-20 italic">Select an item from the archive <br />to begin documentation.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderReviewPage;
