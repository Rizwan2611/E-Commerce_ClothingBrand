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
    country: 'India',
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
      <div className="bg-canvas min-h-screen flex flex-col items-center justify-center px-4 text-center section-quiet">
        <p className="text-whisper mb-12">Identification successful</p>
        <h2 className="logo-heritage text-5xl md:text-7xl text-ink mb-12">Order Placed</h2>
        <p className="text-whisper text-accent mb-2">Protocol ID: {success.orderId}</p>
        <p className="text-whisper opacity-40 mb-12">
          Total Amount: Rs. {success.totalAmount?.toLocaleString()}
        </p>
        <div className="flex gap-12 items-center">
          <button onClick={() => navigate('/orders')} className="text-whisper text-accent border-b border-accent pb-1 interactive">View Orders</button>
          <button onClick={() => navigate('/shop')} className="text-whisper opacity-40 interactive">Return to Archive</button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="bg-canvas geometric-grid min-h-screen section-quiet px-6 sm:px-12 lg:px-24">
      <div className="bg-grain opacity-[0.03]" />

      <div className="mb-20 pt-24 md:pt-32 text-center flex flex-col items-center">
        <p className="text-whisper mb-6 opacity-60">Finalize . Protocol</p>
        <h1 className="logo-heritage text-3xl sm:text-5xl md:text-6xl text-ink mb-6 tracking-widest">Checkout</h1>
        <div className="w-24 h-px bg-accent/30" />
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        {/* Form Fields */}
        <div className="lg:col-span-8 space-y-16">
          {/* Identity */}
          <div className="animate-fade-in">
            <p className="text-whisper mb-12">01 . Identity</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              <div className="space-y-4">
                <label className="text-whisper opacity-40">Full Name</label>
                <input name="name" value={form.name} onChange={handleChange}
                  className="w-full bg-transparent border-b border-border py-4 text-whisper focus:outline-none focus:border-accent" required />
              </div>
              <div className="space-y-4">
                <label className="text-whisper opacity-40">Phone Signature</label>
                <input name="phone" value={form.phone} onChange={handleChange}
                  className="w-full bg-transparent border-b border-border py-4 text-whisper focus:outline-none focus:border-accent" required />
              </div>
            </div>
          </div>

          {/* Logistics */}
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <p className="text-whisper mb-12">02 . Logistics</p>
            <div className="space-y-12">
              <div className="space-y-4">
                <label className="text-whisper text-ink/60 font-black">Address String</label>
                <input name="street" value={form.street} onChange={handleChange}
                  className="w-full bg-transparent border-b border-border py-4 text-whisper font-bold focus:outline-none focus:border-accent" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
                <div className="space-y-4">
                  <label className="text-whisper text-ink/60 font-black">City</label>
                  <input name="city" value={form.city} onChange={handleChange}
                    className="w-full bg-transparent border-b border-border py-4 text-whisper font-bold focus:outline-none focus:border-accent" required />
                </div>
                <div className="space-y-4">
                  <label className="text-whisper text-ink/60 font-black">Province</label>
                  <input name="state" value={form.state} onChange={handleChange}
                    className="w-full bg-transparent border-b border-border py-4 text-whisper font-bold focus:outline-none focus:border-accent" required />
                </div>
                <div className="space-y-4">
                  <label className="text-whisper text-ink/60 font-black">Postal</label>
                  <input name="postalCode" value={form.postalCode} onChange={handleChange}
                    className="w-full bg-transparent border-b border-border py-4 text-whisper font-bold focus:outline-none focus:border-accent" required />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Protocol */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <p className="text-whisper mb-12">03 . Protocol</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              {[
                { value: 'cod', label: 'Cash Settlement' },
                { value: 'online', label: 'Digital Transfer' },
              ].map((pm) => (
                <label key={pm.value}
                  className={`flex flex-col gap-4 p-8 border transition-all cursor-pointer ${
                    form.paymentMethod === pm.value
                      ? 'border-accent bg-accent/5'
                      : 'border-border opacity-40 hover:opacity-100'
                  } interactive`}>
                  <div className="flex justify-between items-center">
                    <span className="text-whisper">{pm.label}</span>
                    <input type="radio" name="paymentMethod" value={pm.value}
                      checked={form.paymentMethod === pm.value} onChange={handleChange}
                      className="accent-accent" />
                  </div>
                  <p className="text-whisper text-[10px] opacity-40">Standard logistics protocol for nationwide delivery.</p>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Final Summary */}
        <div className="lg:col-span-4">
          <div className="border border-border p-12 bg-border/5 reveal-hidden">
            <p className="text-whisper mb-12">Final Summary</p>
            <div className="space-y-6 mb-12 max-h-80 overflow-y-auto hide-scrollbar">
              {cart.map((item, i) => (
                <div key={i} className="flex gap-6 items-center opacity-60 hover:opacity-100 transition-opacity">
                  <div className="w-12 aspect-[3/4] overflow-hidden border border-border shrink-0">
                    {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-whisper text-[10px] truncate mb-2">{item.title}</p>
                    <p className="text-whisper text-[8px] text-accent">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-ink/10 pt-8 mb-12">
              <div className="flex justify-between text-whisper text-2xl font-black">
                <span>Total Due</span>
                <span className="text-accent">Rs. {totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <button id="place-order-btn" type="submit" disabled={loading}
              className="btn-primary w-full disabled:opacity-30">
              {loading ? (
                <div className="w-4 h-4 border-2 border-canvas border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                'Place Order'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
