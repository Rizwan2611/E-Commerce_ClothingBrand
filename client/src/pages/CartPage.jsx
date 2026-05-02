import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="pt-24 min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={36} className="text-zinc-600" />
        </div>
        <h2 className="font-rock-salt text-2xl text-black mb-3">Your cart is empty</h2>
        <p className="text-zinc-600 mb-8 font-bold uppercase tracking-widest text-[10px]">Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">Shopping Cart</h1>
        <button onClick={clearCart} className="text-zinc-500 hover:text-red-400 text-sm flex items-center gap-1 transition-colors">
          <Trash2 size={14} /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, i) => (
            <div key={`${item.productId}-${item.size}-${item.color}`} className="card flex gap-4 !p-4 hover:border-green-400/30 transition-colors">
              {/* Image */}
              <div className="w-20 h-24 bg-zinc-800 rounded-xl overflow-hidden shrink-0 group cursor-pointer" onClick={() => navigate(`/product/${item.productId}`)}>
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag size={24} className="text-zinc-600" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm leading-tight line-clamp-2 mb-1">{item.title}</h3>
                <div className="flex gap-2 mb-3">
                  {item.size && <span className="badge bg-zinc-700 text-zinc-300">{item.size}</span>}
                  {item.color && <span className="badge bg-zinc-700 text-zinc-300">{item.color}</span>}
                </div>
                <div className="flex items-center justify-between">
                  {/* Quantity */}
                  <div className="flex items-center gap-2 bg-zinc-800 rounded-xl p-1">
                    <button onClick={() => {
                      if (item.quantity === 1) removeFromCart(item.productId, item.size, item.color);
                      else updateQuantity(item.productId, item.size, item.color, item.quantity - 1);
                    }} className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-green-400 rounded-lg hover:bg-zinc-700 transition-colors">
                      <Minus size={14} />
                    </button>
                    <span className="text-white text-sm font-semibold w-5 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-green-400 rounded-lg hover:bg-zinc-700 transition-colors">
                      <Plus size={14} />
                    </button>
                  </div>
                  {/* Price */}
                  <div className="text-right">
                    <p className="text-green-400 font-bold">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                    <p className="text-zinc-600 text-xs">Rs. {item.price.toLocaleString()} each</p>
                  </div>
                </div>
              </div>

              {/* Remove */}
              <button onClick={() => removeFromCart(item.productId, item.size, item.color)}
                className="text-zinc-600 hover:text-red-400 transition-colors self-start">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h3 className="font-playfair text-xl font-bold text-white mb-6">Order Summary</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-zinc-400 text-sm">
                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>Rs. {totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-400 text-sm">
                <span>Delivery</span>
                <span className="text-green-400">Free</span>
              </div>
              <div className="border-t border-zinc-800 pt-3 flex justify-between text-white font-bold">
                <span>Total</span>
                <span className="text-green-400 text-xl">Rs. {totalPrice.toLocaleString()}</span>
              </div>
            </div>
            <button id="checkout-btn" onClick={() => navigate('/checkout')} className="btn-primary w-full text-center">
              Proceed to Checkout
            </button>
            <Link to="/shop" className="flex items-center justify-center gap-2 text-zinc-500 hover:text-green-400 text-sm mt-4 transition-colors">
              <ArrowLeft size={14} /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
