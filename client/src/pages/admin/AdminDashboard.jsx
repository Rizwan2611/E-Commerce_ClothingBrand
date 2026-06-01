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
      <AdminLayout title="System Overview">
        <LoadingSpinner fullPage={false} />
      </AdminLayout>
    );
  }

  const stats = [
    { label: 'Total Revenue', value: `Rs ${data?.totals?.totalRevenue?.toLocaleString() || 0}`, icon: DollarSign },
    { label: 'Total Orders', value: data?.totals?.totalOrders || 0, icon: ShoppingBag },
    { label: 'Pending Orders', value: data?.totals?.pendingOrders || 0, icon: Package },
    { label: 'Success Rate', value: '98.4%', icon: Truck },
  ];

  return (
    <AdminLayout title="System Overview">
      {/* ── Operational Metrics ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-ink/10 mb-20 border border-ink/10">
        {stats.map((s) => (
          <div key={s.label} className="glass-premium p-10 group interactive transition-all hover:bg-canvas/60">
            <div className="flex items-center justify-between mb-8">
              <p className="text-whisper text-[9px] text-accent tracking-[0.4em]">{s.label}</p>
              <s.icon size={14} className="text-ink opacity-20 group-hover:text-accent transition-colors" />
            </div>
            <div className="space-y-1">
              <p className="logo-heritage text-4xl text-ink tracking-tighter">
                {s.value}
              </p>
              <div className="h-px w-8 bg-ink/10 group-hover:w-full transition-all duration-700" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
        {/* ── Performance Spectrum (Chart) ── */}
        <div className="lg:col-span-2 border border-ink/10 bg-canvas p-10 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-accent" />
                <h3 className="text-whisper text-[10px] text-ink font-black tracking-[0.4em] uppercase">Revenue . Trajectory</h3>
              </div>
              <span className="text-[10px] font-black text-ink/40 tracking-widest uppercase">Real-time . Analytics</span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.salesData || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false} 
                  horizontal={true} 
                  stroke="rgba(42, 34, 27, 0.1)" 
                />
                <XAxis 
                  dataKey="_id" 
                  stroke="#2A221B" 
                  fontSize={10} 
                  fontWeight="900" 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => val.charAt(0).toUpperCase() + val.slice(1)} 
                  dy={10}
                />
                <YAxis 
                  stroke="#2A221B" 
                  fontSize={10} 
                  fontWeight="900" 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `Rs ${val/1000}K`} 
                  dx={-10}
                />
                <Tooltip 
                  cursor={{fill: 'rgba(42, 34, 27, 0.05)'}}
                  contentStyle={{ 
                    backgroundColor: '#EADDCA', 
                    border: '2px solid #2A221B', 
                    padding: '12px', 
                    fontSize: '11px', 
                    textTransform: 'uppercase', 
                    fontWeight: '900',
                    letterSpacing: '0.1em', 
                    color: '#2A221B' 
                  }}
                  itemStyle={{ color: '#2A221B' }}
                  formatter={(value) => [`Rs ${value.toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#2A221B" radius={0} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Recent Transmission (Orders) ── */}
        <div className="lg:col-span-1 border border-ink/10 bg-canvas p-10 relative">
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-4">
               <div className="w-1 h-1 bg-accent" />
               <h3 className="text-whisper text-[10px] text-ink font-bold tracking-widest">Recent . Transmissions</h3>
            </div>
          </div>
          <div className="space-y-10">
            {data?.recentOrders?.map((order) => (
              <div key={order._id} className="flex justify-between items-center group interactive border-b border-ink/10 pb-6 last:border-0">
                <div className="min-w-0">
                  <p className="text-whisper text-[9px] text-accent mb-1">{order.orderId}</p>
                  <p className="text-ink text-xs font-bold truncate uppercase">{order.customerDetails?.name}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="logo-heritage text-sm text-ink mb-2">Rs {order.totalAmount.toLocaleString()}</p>
                  <span className={`text-[8px] font-mono uppercase tracking-widest ${
                    order.status === 'delivered' ? 'text-green-400' : 'text-accent'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            {(!data?.recentOrders || data.recentOrders.length === 0) && (
              <div className="py-20 flex flex-col items-center justify-center opacity-30">
                <p className="text-whisper text-[9px] uppercase tracking-widest">Archive . Empty</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
