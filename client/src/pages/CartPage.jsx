import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, X } from 'lucide-react';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="bg-canvas min-h-screen flex flex-col items-center justify-center px-4 text-center section-quiet">
        <p className="text-whisper mb-12">Your selection is currently empty</p>
        <Link to="/shop" className="text-whisper text-accent border-b border-accent pb-1 interactive">Browse Archive</Link>
      </div>
    );
  }

  return (
    <div className="bg-canvas geometric-grid min-h-screen section-quiet px-6 sm:px-12 lg:px-24">
      <div className="bg-grain opacity-[0.03]" />

      <div className="mb-20 pt-24 md:pt-32 text-center flex flex-col items-center">
        <p className="text-whisper mb-6 opacity-60">Selections</p>
        <h1 className="logo-heritage text-3xl sm:text-5xl md:text-6xl text-ink mb-6 tracking-widest">The Bag</h1>
        <div className="w-24 h-px bg-accent/30 mb-12" />
        <button onClick={clearCart} className="text-whisper opacity-40 hover:opacity-100 hover:text-ink transition-all flex items-center gap-4 interactive">
          <Trash2 size={12} /> Clear Archive
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        {/* Cart Items */}
        <div className="lg:col-span-8 space-y-12">
          {cart.map((item, i) => (
            <div key={`${item.productId}-${item.size}-${item.color}`} className="flex flex-col sm:flex-row gap-12 border-b border-border pb-12 animate-fade-in">
              {/* Image */}
              <div className="w-40 aspect-[3/4] overflow-hidden border border-border grayscale hover:grayscale-0 transition-all duration-1000 shrink-0 cursor-pointer" onClick={() => navigate(`/product/${item.productId}`)}>
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-[2s]" />
                ) : (
                  <div className="w-full h-full bg-border/5 flex items-center justify-center">
                    <ShoppingBag size={24} className="text-mute" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="logo-heritage text-3xl text-ink tracking-tight">{item.title}</h3>
                    <button onClick={() => removeFromCart(item.productId, item.size, item.color)} className="text-mute hover:text-ink transition-all">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="flex gap-8 mb-8">
                    {item.size && <span className="text-whisper font-black text-accent">{item.size}</span>}
                    {item.color && <span className="text-whisper font-black text-accent">{item.color}</span>}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  {/* Quantity */}
                  <div className="flex items-center gap-8 border border-border px-4 py-2">
                    <button onClick={() => {
                      if (item.quantity === 1) removeFromCart(item.productId, item.size, item.color);
                      else updateQuantity(item.productId, item.size, item.color, item.quantity - 1);
                    }} className="text-mute hover:text-accent transition-colors">
                      <Minus size={12} />
                    </button>
                    <span className="text-whisper w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                      className="text-mute hover:text-accent transition-colors">
                      <Plus size={12} />
                    </button>
                  </div>
                  {/* Price */}
                  <p className="text-whisper text-accent text-lg">
                    <span className="opacity-40 italic mr-2">rs.</span>
                    {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <div className="border border-border p-12 bg-ink/5">
            <p className="text-whisper mb-12 font-black">Summary</p>
            <div className="space-y-6 mb-12">
              <div className="flex justify-between text-whisper opacity-60 font-bold">
                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} units)</span>
                <span>Rs. {totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-whisper opacity-60 font-bold">
                <span>Logistics</span>
                <span className="text-accent italic lowercase">Included</span>
              </div>
              <div className="border-t border-ink/10 pt-6 flex justify-between text-whisper text-2xl font-black">
                <span>Total</span>
                <span className="text-accent">Rs. {totalPrice.toLocaleString()}</span>
              </div>
            </div>
            <button onClick={() => navigate('/checkout')} className="btn-primary w-full">
              Proceed to Acquisition
            </button>
            <Link to="/shop" className="flex items-center justify-center gap-4 text-whisper opacity-40 hover:opacity-100 transition-all mt-8 interactive">
              <ArrowLeft size={12} /> Continue Discovery
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
