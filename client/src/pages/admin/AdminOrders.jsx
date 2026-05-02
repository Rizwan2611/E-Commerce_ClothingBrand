import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../lib/axios';
import AdminLayout from '../../components/AdminLayout';
import toast from 'react-hot-toast';
import { ChevronDown, ExternalLink, Package, MessageSquare, Truck, CheckCircle2, Clock, Ban, Trash2 } from 'lucide-react';

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

  return (
    <AdminLayout title="Orders">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <Truck className="text-black" size={24} />
              <h2 className="text-2xl font-bold uppercase tracking-tight text-black">All Orders</h2>
           </div>
          <p className="text-zinc-400 font-semibold text-xs">{data?.pagination?.total || 0} total orders</p>
        </div>
        
        <div className="relative group">
          <select 
            className="bg-white border-2 border-black rounded-2xl py-4 pl-6 pr-12 text-xs font-bold uppercase tracking-wide focus:outline-none appearance-none cursor-pointer shadow-xl shadow-black/5 hover:translate-y-[-2px] transition-all"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Statuses</option>
            {statuses.map(s => <option key={s} value={s} className="uppercase">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black" />
        </div>
      </div>

      {isLoading ? (
        <div className="h-96 bg-white border-2 border-zinc-100 rounded-[2.5rem] animate-pulse shadow-sm" />
      ) : (
        <div className="space-y-8">
          {data?.orders?.map((order) => (
            <div key={order._id} className="bg-white border-2 border-black rounded-[2.5rem] overflow-hidden shadow-xl shadow-black/5 group hover:shadow-black/10 transition-all">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-zinc-50/50 p-8 border-b-2 border-black gap-6">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-black font-bold text-lg tracking-tight">{order.orderId}</span>
                    <span className="text-zinc-400 font-semibold text-xs">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-black text-sm font-semibold flex items-center gap-2">
                    {order.customerDetails.name} 
                    <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full" /> 
                    <span className="text-zinc-400">{order.customerDetails.phone}</span>
                  </p>
                </div>
                
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-black font-bold text-2xl tracking-tight mb-1">Rs {order.totalAmount.toLocaleString()}</p>
                    <p className="text-zinc-400 text-xs font-semibold capitalize">{order.paymentMethod}</p>
                  </div>
                  
                  {/* Status Dropdown */}
                  <div className="relative group/select">
                    <select
                      className={`appearance-none bg-black text-white font-bold text-xs uppercase tracking-wide px-6 py-4 rounded-2xl cursor-pointer border-2 border-black focus:outline-none transition-all pr-12`}
                      value={order.status}
                      disabled={order.status === 'cancelled' || updateStatusMutation.isPending}
                      onChange={(e) => {
                        if(confirm(`Change order status to "${e.target.value}"?`)) {
                          updateStatusMutation.mutate({ id: order._id, status: e.target.value });
                        }
                      }}
                    >
                      {statuses.map(s => <option key={s} value={s} className="bg-white text-black">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white opacity-60 group-hover/select:translate-y-[-40%] transition-transform" />
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => {
                      if(confirm('Are you sure you want to permanently delete this order?')) {
                        deleteOrderMutation.mutate(order._id);
                      }
                    }}
                    disabled={deleteOrderMutation.isPending}
                    className="w-12 h-12 bg-white border-2 border-red-300 text-red-400 hover:bg-red-500 hover:border-red-500 hover:text-white rounded-2xl flex items-center justify-center transition-all shadow-sm"
                    title="Delete order"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Order Content */}
              <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Order Items */}
                <div>
                  <h4 className="text-black font-bold text-sm uppercase tracking-wide mb-6 flex items-center gap-2">
                    <Package size={14} /> Order Items
                  </h4>
                  <div className="space-y-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex gap-5 group items-center">
                        <div className="w-16 h-16 bg-zinc-50 border border-black/5 rounded-2xl overflow-hidden shrink-0 shadow-inner p-1">
                          {item.image && <img src={item.image} className="w-full h-full object-contain" alt="" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-black text-sm font-bold line-clamp-1">{item.title}</p>
                          <div className="flex items-center gap-3 mt-1">
                             {item.size && <span className="text-white bg-black px-2 py-0.5 rounded text-xs font-bold">{item.size}</span>}
                             <span className="text-zinc-400 text-xs font-semibold">Qty: {item.quantity}</span>
                             <span className="text-zinc-400 text-xs">@ Rs {item.price.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Details */}
                <div>
                   <h4 className="text-black font-bold text-sm uppercase tracking-wide mb-6 flex items-center gap-2">
                    <Truck size={14} /> Shipping Address
                  </h4>
                  <div className="bg-zinc-50 rounded-3xl p-6 border-2 border-dashed border-zinc-200">
                    <div className="text-black text-sm font-medium leading-relaxed space-y-1">
                      <p className="font-bold">{order.customerDetails.address.street}</p>
                      <p className="text-zinc-500">{order.customerDetails.address.city}, {order.customerDetails.address.state} {order.customerDetails.address.postalCode}</p>
                      <p className="text-zinc-400">{order.customerDetails.address.country}</p>
                    </div>
                    {order.notes && (
                      <div className="mt-6 pt-6 border-t-2 border-white">
                        <p className="text-black text-xs font-bold mb-2 flex items-center gap-2">
                           <MessageSquare size={12} /> Customer Note:
                        </p>
                        <p className="text-zinc-500 text-sm italic">"{order.notes}"</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-6">
                    <a 
                      href={`https://wa.me/${order.customerDetails.phone.replace(/[^0-9]/g, '')}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="w-full bg-zinc-50 hover:bg-black text-zinc-400 hover:text-white py-5 rounded-2xl border-2 border-black flex items-center justify-center gap-3 transition-all duration-300 text-sm font-bold group/wa shadow-sm"
                    >
                      <ExternalLink size={16} className="group-hover/wa:rotate-45 transition-transform" />
                      <span>Contact on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {(!isLoading && (!data?.orders || data.orders.length === 0)) && (
            <div className="py-24 flex flex-col items-center justify-center text-zinc-300 border-2 border-dashed border-zinc-200 rounded-[3rem]">
              <Package size={64} className="mb-4 opacity-10" />
              <p className="text-sm font-bold text-zinc-400">No orders found</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {data?.pagination?.pages > 1 && (
        <div className="flex justify-center gap-3 mt-16">
          {[...Array(data.pagination.pages)].map((_, i) => (
            <button 
              key={i} 
              onClick={() => setPage(i + 1)}
              className={`w-12 h-12 rounded-2xl text-xs font-bold transition-all border-2 ${
                page === i + 1 
                ? 'bg-black text-white border-black shadow-lg scale-110' 
                : 'bg-white text-zinc-400 border-zinc-100 hover:border-black hover:text-black shadow-sm'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
