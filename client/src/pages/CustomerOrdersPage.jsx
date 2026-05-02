import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { Package, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const CustomerOrdersPage = () => {
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => api.get('/orders/my').then((r) => r.data.orders),
  });

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
      <div className="pt-24 max-w-5xl mx-auto px-4 py-10">
        <h1 className="section-title mb-8">My Orders</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card h-40 animate-pulse bg-zinc-900" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
      <h1 className="section-title mb-8">My Orders</h1>

      {orders?.length === 0 ? (
        <div className="text-center py-20">
          <Package size={48} className="text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-400">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders?.map((order) => (
            <div key={order._id} className="card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-4 mb-4 gap-4">
                <div>
                  <p className="text-green-400 font-bold mb-1">{order.orderId}</p>
                  <p className="text-zinc-500 text-sm">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge badge-${order.status} capitalize`}>{order.status}</span>
                  {['pending', 'confirmed'].includes(order.status) && (
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to cancel this order?')) {
                          cancelMutation.mutate(order._id);
                        }
                      }}
                      className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1 font-medium transition-colors"
                      disabled={cancelMutation.isPending}
                    >
                      <XCircle size={16} /> Cancel
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-12 h-16 bg-zinc-800 rounded-lg overflow-hidden shrink-0">
                      {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{item.title}</p>
                      <p className="text-zinc-500 text-xs mt-0.5">
                        {item.size && `${item.size} · `}
                        {item.color && `${item.color} · `}
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-white text-sm font-semibold">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-800 pt-4 mt-4 flex justify-between items-center">
                <p className="text-zinc-400 text-sm">Payment: <span className="uppercase text-zinc-300">{order.paymentMethod}</span></p>
                <p className="text-green-400 font-bold">Total: Rs. {order.totalAmount.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerOrdersPage;
