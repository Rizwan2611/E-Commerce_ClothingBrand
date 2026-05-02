import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/axios';
import toast from 'react-hot-toast';
import { Package, CheckCircle } from 'lucide-react';

const CheckoutPage = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { customer } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Pakistan',
    paymentMethod: 'cod',
    notes: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.phone || !form.street || !form.city || !form.state || !form.postalCode) {
      return toast.error('Please fill all required fields');
    }
    if (cart.length === 0) return toast.error('Your cart is empty');

    setLoading(true);
    try {
      const { data } = await api.post('/orders', {
        items: cart.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          size: i.size,
          color: i.color,
        })),
        customerDetails: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: {
            street: form.street,
            city: form.city,
            state: form.state,
            postalCode: form.postalCode,
            country: form.country,
          },
        },
        paymentMethod: form.paymentMethod,
        notes: form.notes,
      });

      clearCart();
      setSuccess(data.order);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order placement failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="pt-24 min-h-screen flex flex-col items-center justify-center px-4 text-center animate-slide-up">
        <div className="w-20 h-20 bg-green-400/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={48} className="text-green-400" />
        </div>
        <h2 className="font-playfair text-3xl font-bold text-white mb-3">Order Placed!</h2>
        <p className="text-zinc-400 mb-2">Your order has been received successfully.</p>
        <p className="text-amber-400 font-bold text-xl mb-2">{success.orderId}</p>
        <p className="text-zinc-500 text-sm mb-8">
          Total: <span className="text-white">Rs. {success.totalAmount?.toLocaleString()}</span><br/>
          We'll send updates to your phone. Payment on delivery.
        </p>
        <div className="flex gap-3">
          <button onClick={() => navigate('/orders')} className="btn-primary">View My Orders</button>
          <button onClick={() => navigate('/shop')} className="btn-secondary">Continue Shopping</button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="pt-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
      <h1 className="section-title mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact */}
          <div className="card">
            <h3 className="font-playfair text-lg font-bold text-white mb-5">Contact Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 text-sm mb-1.5 block">Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange}
                    className="input-field" placeholder="Ahmed Khan" required />
                </div>
                <div>
                  <label className="text-zinc-400 text-sm mb-1.5 block">Phone Number *</label>
                  <input name="phone" value={form.phone} onChange={handleChange}
                    className="input-field" placeholder="+92 300 0000000" required />
                </div>
              </div>
              <div>
                <label className="text-zinc-400 text-sm mb-1.5 block">Email Address</label>
                <input name="email" type="email" value={form.email} onChange={handleChange}
                  className="input-field" placeholder="you@example.com" />
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="card">
            <h3 className="font-playfair text-lg font-bold text-white mb-5">Delivery Address</h3>
            <div className="space-y-4">
              <div>
                <label className="text-zinc-400 text-sm mb-1.5 block">Street Address *</label>
                <input name="street" value={form.street} onChange={handleChange}
                  className="input-field" placeholder="House #, Street Name" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 text-sm mb-1.5 block">City *</label>
                  <input name="city" value={form.city} onChange={handleChange}
                    className="input-field" placeholder="Karachi" required />
                </div>
                <div>
                  <label className="text-zinc-400 text-sm mb-1.5 block">Province/State *</label>
                  <input name="state" value={form.state} onChange={handleChange}
                    className="input-field" placeholder="Sindh" required />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 text-sm mb-1.5 block">Postal Code *</label>
                  <input name="postalCode" value={form.postalCode} onChange={handleChange}
                    className="input-field" placeholder="74000" required />
                </div>
                <div>
                  <label className="text-zinc-400 text-sm mb-1.5 block">Country</label>
                  <input name="country" value={form.country} onChange={handleChange}
                    className="input-field" placeholder="Pakistan" />
                </div>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="card">
            <h3 className="font-playfair text-lg font-bold text-white mb-5">Payment Method</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'cod', label: 'Cash on Delivery', icon: '💵' },
                { value: 'online', label: 'Online Payment', icon: '💳' },
              ].map((pm) => (
                <label key={pm.value}
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    form.paymentMethod === pm.value
                      ? 'border-amber-400 bg-amber-400/5'
                      : 'border-zinc-700 hover:border-zinc-500'
                  }`}>
                  <input type="radio" name="paymentMethod" value={pm.value}
                    checked={form.paymentMethod === pm.value} onChange={handleChange}
                    className="accent-amber-400" />
                  <span className="text-xl">{pm.icon}</span>
                  <span className="text-white text-sm font-medium">{pm.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="card">
            <label className="text-zinc-400 text-sm mb-1.5 block">Order Notes (Optional)</label>
            <textarea name="notes" value={form.notes} onChange={handleChange}
              className="input-field resize-none" rows={3} placeholder="Any special instructions?" />
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h3 className="font-playfair text-xl font-bold text-white mb-5">Order Summary</h3>
            <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
              {cart.map((item, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <div className="w-12 h-14 bg-zinc-800 rounded-lg overflow-hidden shrink-0">
                    {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium line-clamp-1">{item.title}</p>
                    <p className="text-zinc-500 text-xs">{item.size && `${item.size} · `}x{item.quantity}</p>
                    <p className="text-amber-400 text-xs font-bold">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-zinc-800 pt-4 mb-6">
              <div className="flex justify-between text-zinc-400 text-sm mb-2">
                <span>Subtotal</span>
                <span>Rs. {totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-white">
                <span>Total</span>
                <span className="text-amber-400 text-xl">Rs. {totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <button id="place-order-btn" type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <Package size={18} /> Place Order
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
