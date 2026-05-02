import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, ChevronLeft, ChevronRight, Minus, Plus, Package } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { customer } = useAuth();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.get(`/products/${id}`).then((r) => r.data),
  });

  if (isLoading) {
    return (
      <div className="pt-24 max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-zinc-800 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-zinc-800 rounded-xl w-3/4" />
            <div className="h-12 bg-zinc-800 rounded-xl w-1/3" />
            <div className="h-32 bg-zinc-800 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.product) {
    return (
      <div className="pt-24 text-center py-20">
        <Package size={48} className="text-zinc-600 mx-auto mb-4" />
        <p className="text-zinc-400">Product not found</p>
      </div>
    );
  }

  const product = data.product;
  const images = product.images?.length ? product.images : [{ url: null }];

  const handleAddToCart = () => {
    if (product.sizes?.length && !selectedSize) {
      return toast.error('Please select a size');
    }
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  const handleBuyNow = () => {
    if (product.sizes?.length && !selectedSize) {
      return toast.error('Please select a size');
    }
    if (!customer) {
      toast.error('Please sign in to place an order');
      return navigate('/login');
    }
    addToCart(product, quantity, selectedSize, selectedColor);
    navigate('/checkout');
  };

  return (
    <div className="pt-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
      {/* Back button */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-400 hover:text-green-500 mb-8 text-sm transition-colors duration-300">
        <ChevronLeft size={18} /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Images */}
        <div>
          <div className="relative aspect-square bg-zinc-900 rounded-2xl overflow-hidden mb-4 group">
            {images[activeImage]?.url ? (
              <img src={images[activeImage].url} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package size={64} className="text-zinc-700" />
              </div>
            )}
            {images.length > 1 && (
              <>
                <button onClick={() => setActiveImage((p) => (p - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 hover:bg-green-400 hover:text-black rounded-full flex items-center justify-center text-white transition-all duration-300">
                  <ChevronLeft size={18} />
                </button>
                <button onClick={() => setActiveImage((p) => (p + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 hover:bg-green-400 hover:text-black rounded-full flex items-center justify-center text-white transition-all duration-300">
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)}
                  className={`shrink-0 w-18 h-18 rounded-xl overflow-hidden border-2 transition-all ${i === activeImage ? 'border-green-400 shadow-lg shadow-green-400/20' : 'border-zinc-700 hover:border-green-400/50'}`}>
                  <img src={img.url} alt="" className="w-16 h-16 object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-5">
          <div>
            <span className="badge bg-green-400/15 text-green-400 mb-3 capitalize">{product.category}</span>
            <h1 className="font-playfair text-3xl font-bold text-white mb-2">{product.title}</h1>
            <p className="text-4xl font-bold text-green-400">Rs. {product.price.toLocaleString()}</p>
          </div>

          <p className="text-zinc-400 leading-relaxed">{product.description}</p>

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div>
              <p className="text-zinc-400 text-sm mb-2 font-medium">Size <span className="text-zinc-600">(Required)</span></p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((s) => (
                  <button key={s} id={`size-${s}`} onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                      selectedSize === s
                        ? 'bg-green-400 border-green-400 text-black shadow-lg shadow-green-400/20'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-green-400 hover:text-green-400'
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div>
              <p className="text-zinc-400 text-sm mb-2 font-medium">
                Color: <span className="text-white">{selectedColor || 'None selected'}</span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((c) => (
                  <button key={c.name} onClick={() => setSelectedColor(c.name)}
                    title={c.name}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === c.name ? 'border-green-400 scale-110 shadow-lg shadow-green-400/30' : 'border-zinc-600 hover:border-green-400/50'
                    }`}
                    style={{ backgroundColor: c.hex || '#888' }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <p className="text-zinc-400 text-sm font-medium">Quantity</p>
            <div className="flex items-center gap-3 bg-zinc-800 rounded-xl p-1">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-green-400 rounded-lg hover:bg-zinc-700 transition-colors">
                <Minus size={16} />
              </button>
              <span className="text-white font-semibold w-6 text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-green-400 rounded-lg hover:bg-zinc-700 transition-colors">
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Stock */}
          <p className={`text-sm ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {product.stock > 0 ? `✓ ${product.stock} in stock` : '✗ Out of stock'}
          </p>

          {/* CTAs */}
          <div className="flex gap-3">
            <button id="add-to-cart-btn" onClick={handleAddToCart} disabled={product.stock === 0}
              className="btn-secondary flex items-center gap-2 flex-1 justify-center disabled:opacity-50 hover:shadow-green-400/10">
              <ShoppingBag size={18} /> Add to Cart
            </button>
            <button id="buy-now-btn" onClick={handleBuyNow} disabled={product.stock === 0}
              className="btn-primary flex items-center gap-2 flex-1 justify-center disabled:opacity-50">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
