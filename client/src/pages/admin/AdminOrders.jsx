import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../lib/axios';
import AdminLayout from '../../components/AdminLayout';
import toast from 'react-hot-toast';
import { ChevronDown, ExternalLink, Package, MessageSquare, Truck, CheckCircle2, Clock, Ban, Trash2, MapPin } from 'lucide-react';

const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const statusIcons = {
  pending: Clock,
  confirmed: CheckCircle2,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle2,
  cancelled: Ban,
};

const AdminOrders = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', page, statusFilter],
    queryFn: () => adminApi.get('/admin/orders', { params: { page, limit: 10, status: statusFilter || undefined } }).then((r) => r.data),
    keepPreviousData: true,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => adminApi.patch(`/admin/orders/${id}/status`, { status }),
    onSuccess: () => {
      toast.success('Order status updated');
      queryClient.invalidateQueries(['admin-orders']);
      queryClient.invalidateQueries(['admin-analytics']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update status'),
  });

  const deleteOrderMutation = useMutation({
    mutationFn: (id) => adminApi.delete(`/admin/orders/${id}`),
    onSuccess: () => {
      toast.success('Order deleted successfully');
      queryClient.invalidateQueries(['admin-orders']);
      queryClient.invalidateQueries(['admin-analytics']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete order'),
  });

  const sendTrackingMutation = useMutation({
    mutationFn: (id) => adminApi.post(`/orders/admin/${id}/send-tracking-link`),
    onSuccess: () => {
      toast.success('Logistics Link Dispatched');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to dispatch link'),
  });

  return (
    <AdminLayout title="Transmission Log">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16">
        <div>
           <div className="flex items-center gap-4 mb-4">
              <div className="w-2 h-2 bg-accent" />
              <h2 className="text-whisper text-[10px] font-bold uppercase tracking-[0.4em] text-ink">Order . Transmissions</h2>
           </div>
          <p className="text-whisper text-[11px] opacity-40 font-mono">Archive . Records: {data?.pagination?.total || 0} Entries</p>
        </div>
        
        <div className="relative group">
          <select 
            className="bg-transparent border border-ink/20 text-whisper text-[10px] font-bold uppercase tracking-widest py-4 pl-6 pr-12 focus:outline-none focus:border-accent transition-all cursor-pointer text-ink"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="" className="bg-canvas">ALL PROTOCOLS</option>
            {statuses.map(s => <option key={s} value={s} className="bg-canvas">{s.toUpperCase()}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-accent" />
        </div>
      </div>

      {isLoading ? (
        <div className="h-96 bg-canvas border border-ink/10 animate-pulse" />
      ) : (
        <div className="space-y-12">
          {data?.orders?.map((order) => (
            <div key={order._id} className="border border-ink/10 bg-canvas overflow-hidden group">
              {/* Order Header Protocol */}
              <div className="flex flex-col lg:flex-row justify-between lg:items-center p-10 border-b border-ink/10 gap-8 bg-ink/[0.01]">
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span className="text-accent font-bold text-[10px] tracking-[0.2em] font-mono">{order.orderId}</span>
                    <div className="w-1 h-1 bg-ink/20" />
                    <span className="text-ink opacity-30 text-[9px] uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-ink text-xs font-bold uppercase tracking-widest">
                    {order.customerDetails.name} 
                    <span className="mx-3 opacity-20">/</span>
                    <span className="text-[10px] opacity-40 font-mono">{order.customerDetails.phone}</span>
                  </p>
                </div>
                
                <div className="flex items-center gap-12">
                  <div className="text-right">
                    <p className="logo-heritage text-3xl text-ink">Rs {order.totalAmount.toLocaleString()}</p>
                    <p className="text-whisper text-[8px] text-accent tracking-widest uppercase mt-2">{order.paymentMethod}</p>
                  </div>
                  
                  {/* Status Protocol Selection */}
                  <div className="relative group/select">
                    <select
                      className="appearance-none bg-ink text-canvas font-bold text-[9px] uppercase tracking-widest px-8 py-4 border border-ink focus:outline-none transition-all pr-12 hover:bg-accent hover:border-accent interactive"
                      value={order.status}
                      disabled={order.status === 'cancelled' || updateStatusMutation.isPending}
                      onChange={(e) => {
                        if(confirm(`Override Protocol to "${e.target.value}"?`)) {
                          updateStatusMutation.mutate({ id: order._id, status: e.target.value });
                        }
                      }}
                    >
                      {statuses.map(s => <option key={s} value={s} className="bg-canvas text-ink">{s.toUpperCase()}</option>)}
                    </select>
                    <ChevronDown size={12} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-canvas opacity-60" />
                  </div>

                  <button
                    onClick={() => {
                      if(confirm('Purge this transmission from archive?')) {
                        deleteOrderMutation.mutate(order._id);
                      }
                    }}
                    disabled={deleteOrderMutation.isPending}
                    className="text-ink/20 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Transmission Details */}
              <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-20">
                {/* Manifest */}
                <div>
                  <h4 className="text-whisper text-[9px] text-accent font-bold uppercase tracking-[0.4em] mb-10 flex items-center gap-4">
                    <Package size={12} /> Manifest . Elements
                  </h4>
                  <div className="space-y-8">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex gap-8 group items-center">
                        <div className="w-20 h-20 bg-canvas border border-ink/10 relative shrink-0 p-2">
                          {item.image && <img src={item.image} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt="" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-ink text-xs font-bold uppercase tracking-widest mb-3">{item.title}</p>
                          <div className="flex items-center gap-6">
                             {item.size && <span className="text-accent text-[9px] font-bold border border-accent/20 px-2 py-0.5">{item.size}</span>}
                             <span className="text-ink/40 text-[9px] font-mono tracking-widest uppercase">Qty: {item.quantity}</span>
                             <span className="text-ink/20 text-[9px] font-mono">@ Rs {item.price.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Routing Matrix */}
                <div>
                   <h4 className="text-whisper text-[9px] text-accent font-bold uppercase tracking-[0.4em] mb-10 flex items-center gap-4">
                    <Truck size={12} /> Routing . Matrix
                  </h4>
                  <div className="border border-ink/10 p-10 relative">
                    <div className="text-ink text-[11px] font-medium leading-relaxed space-y-2 uppercase tracking-widest">
                      <p className="font-bold">{order.customerDetails.address.street}</p>
                      <p className="opacity-40">{order.customerDetails.address.city}, {order.customerDetails.address.state} {order.customerDetails.address.postalCode}</p>
                      {order.customerDetails.address.country && order.customerDetails.address.country.toUpperCase() !== 'PAKISTAN' && (
                        <p className="opacity-20">{order.customerDetails.address.country}</p>
                      )}
                    </div>
                    {order.notes && (
                      <div className="mt-8 pt-8 border-t border-ink/5">
                        <p className="text-accent text-[9px] font-bold mb-3 uppercase tracking-widest flex items-center gap-3">
                           <MessageSquare size={10} /> Transmission Note:
                        </p>
                        <p className="text-ink opacity-40 text-[10px] italic">"{order.notes}"</p>
                      </div>
                    )}
                  </div>
                    <div className="mt-8 space-y-4">
                      {(() => {
                        const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5173' : window.location.origin;
                        return (
                          <>
                            {['shipped', 'delivered'].includes(order.status) && (
                              <div className="space-y-4">
                                <button
                                  onClick={() => sendTrackingMutation.mutate(order._id)}
                                  disabled={sendTrackingMutation.isPending}
                                  className="w-full border border-ink text-whisper text-[9px] font-bold tracking-widest py-5 flex items-center justify-center gap-4 bg-ink text-canvas hover:bg-accent hover:border-accent transition-all interactive uppercase"
                                >
                                  <Truck size={14} />
                                  {sendTrackingMutation.isPending ? 'Dispatching...' : 'Dispatch Tracking Link'}
                                </button>

                                <button
                                  onClick={() => {
                                    const link = `${baseUrl}/orders?orderId=${order.orderId}`;
                                    navigator.clipboard.writeText(link);
                                    toast.success('Tracking Link Copied');
                                  }}
                                  className="w-full border border-ink/10 text-ink text-[9px] font-bold tracking-widest py-5 flex items-center justify-center gap-4 hover:bg-ink hover:text-canvas transition-all interactive uppercase"
                                >
                                  <MapPin size={14} />
                                  Copy Tracking Link
                                </button>
                              </div>
                            )}

                            {order.status === 'delivered' && (
                              <div className="space-y-4 pt-4 border-t border-ink/5">
                                <a 
                                  href={`https://wa.me/${order.customerDetails.phone.replace(/[^0-9]/g, '')}${
                                    `?text=${encodeURIComponent(`Greetings. Your acquisition ${order.orderId} from HABIBI has been archived. We invite you to document your legacy here: ${baseUrl}/order-review/${order._id}`)}`
                                  }`} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="w-full border border-ink/10 text-whisper text-[9px] font-bold tracking-widest py-5 flex items-center justify-center gap-4 hover:bg-ink hover:text-canvas transition-all interactive opacity-60 hover:opacity-100 uppercase"
                                >
                                  <ExternalLink size={14} />
                                  Share Review Protocol
                                </a>

                                <button
                                  onClick={() => {
                                    const link = `${baseUrl}/order-review/${order._id}`;
                                    navigator.clipboard.writeText(link);
                                    toast.success('Protocol Link Copied');
                                  }}
                                  className="w-full border border-accent/20 text-accent text-[9px] font-bold tracking-widest py-5 flex items-center justify-center gap-4 hover:bg-accent hover:text-canvas transition-all interactive uppercase"
                                >
                                  <MessageSquare size={14} />
                                  Copy Review Link
                                </button>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                </div>
              </div>
            </div>
          ))}

          {(!isLoading && (!data?.orders || data.orders.length === 0)) && (
            <div className="py-32 flex flex-col items-center justify-center border border-dashed border-ink/10">
              <Package size={40} className="mb-6 opacity-10" />
              <p className="text-whisper text-[9px] font-bold uppercase tracking-widest opacity-30">Archive . Empty</p>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      {data?.pagination?.pages > 1 && (
        <div className="flex justify-center gap-6 mt-20">
          {[...Array(data.pagination.pages)].map((_, i) => (
            <button 
              key={i} 
              onClick={() => setPage(i + 1)}
              className={`w-12 h-12 text-[10px] font-mono transition-all border ${
                page === i + 1 
                ? 'bg-ink text-canvas border-ink font-bold' 
                : 'border-ink/10 text-ink opacity-40 hover:opacity-100 hover:border-ink/30'
              }`}
            >
              {String(i + 1).padStart(2, '0')}
            </button>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
