import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../lib/axios';
import AdminLayout from '../../components/AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { DollarSign, ShoppingBag, Package, Truck } from 'lucide-react';

const AdminDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => adminApi.get('/admin/analytics').then((r) => r.data.analytics),
  });

  if (isLoading) {
    return (
      <AdminLayout title="Dashboard">
        <LoadingSpinner fullPage={false} />
      </AdminLayout>
    );
  }

  const stats = [
    { label: 'Total Revenue', value: `Rs ${data?.totals?.totalRevenue?.toLocaleString() || 0}`, icon: DollarSign },
    { label: 'Total Orders', value: data?.totals?.totalOrders || 0, icon: ShoppingBag },
    { label: 'Pending Orders', value: data?.totals?.pendingOrders || 0, icon: Package },
    { label: 'Delivered', value: data?.totals?.deliveredOrders || 0, icon: Truck },
  ];

  return (
    <AdminLayout title="Dashboard">
      {/* Top Stats - 3D Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 relative z-10">
        {stats.map((s) => (
          <div key={s.label} className="three-d-card glass-premium border-2 border-white/50 rounded-[2.5rem] p-8 depth-md hover:depth-lg transition-all duration-500">
            <div className="flex items-center justify-between mb-8">
              <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center shadow-lg border-2 border-green-400/20 group-hover:scale-110 transition-transform">
                <s.icon size={24} className="text-green-400" />
              </div>
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#50C878]" />
            </div>
            <div className="space-y-2">
              <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-[0.4em] mb-1">{s.label}</p>
              <p className="text-black font-[1000] text-4xl tracking-tighter font-sans leading-none pb-1">
                {s.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Chart Card - 3D Glass */}
        <div className="three-d-card glass-premium border-2 border-white/50 rounded-[3rem] p-10 lg:col-span-2 depth-lg overflow-hidden relative">
          <div className="flex items-center justify-between mb-10 border-b border-zinc-100 pb-6">
             <h3 className="text-black font-[1000] uppercase tracking-[0.2em] text-sm flex items-center gap-3">
               <div className="w-2 h-2 bg-green-400 rounded-full" />
               Revenue Overview
             </h3>
             <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Real-time Analytics</span>
          </div>
          <div className="h-80 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.salesData || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false} 
                  horizontal={true} 
                  stroke="#e4e4e7" 
                  strokeOpacity={0.5}
                />
                <XAxis 
                  dataKey="_id" 
                  stroke="#71717a" 
                  fontSize={10} 
                  fontWeight="900" 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => val.charAt(0).toUpperCase() + val.slice(1)} 
                />
                <YAxis 
                  stroke="#71717a" 
                  fontSize={10} 
                  fontWeight="900" 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `Rs ${val/1000}K`} 
                />
                <Tooltip 
                  cursor={{fill: 'rgba(80,200,120,0.05)'}}
                  contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', borderColor: 'rgba(80,200,120,0.2)', borderWidth: '2px', color: '#000', borderRadius: '1.5rem', fontWeight: '1000', fontSize: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                  formatter={(value) => [`Rs ${value.toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#000" radius={[10, 10, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders Card - 3D Glass */}
        <div className="three-d-card glass-premium border-2 border-white/50 rounded-[3rem] p-10 lg:col-span-1 depth-lg">
          <div className="flex justify-between items-center mb-10 border-b border-zinc-100 pb-6">
            <h3 className="text-black font-[1000] uppercase tracking-[0.2em] text-sm">Recent Activity</h3>
          </div>
          <div className="space-y-8">
            {data?.recentOrders?.map((order) => (
              <div key={order._id} className="flex justify-between items-center group cursor-pointer hover:translate-x-1 transition-transform">
                <div className="min-w-0">
                  <p className="text-black text-xs font-[1000] uppercase tracking-tighter truncate group-hover:text-green-500 transition-colors">{order.orderId}</p>
                  <p className="text-zinc-400 text-[10px] font-bold truncate lowercase mt-1">{order.customerDetails?.name}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-black text-xs font-[1000] tracking-tight">Rs {order.totalAmount.toLocaleString()}</p>
                  <span className={`inline-block text-[8px] font-black uppercase px-2 py-1 rounded-full border border-zinc-100 mt-2 ${
                    order.status === 'delivered' ? 'bg-green-50 text-green-600' : 'bg-black text-white'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            {(!data?.recentOrders || data.recentOrders.length === 0) && (
              <div className="py-16 flex flex-col items-center justify-center text-zinc-300">
                <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mb-4 opacity-50">
                  <Package size={24} />
                </div>
                <p className="text-[10px] font-[1000] text-zinc-400 uppercase tracking-widest">No activity yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
