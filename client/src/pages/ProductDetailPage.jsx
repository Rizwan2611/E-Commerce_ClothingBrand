import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.get(`/products/${id}`).then((r) => r.data),
    initialData: () => {
      const featured = queryClient.getQueryData(['featured-products']);
      const featuredProd = featured?.products?.find((p) => p._id === id);
      if (featuredProd) return { product: featuredProd };

      const queries = queryClient.getQueriesData({ queryKey: ['products'] });
      for (const [_, qData] of queries) {
        const p = qData?.products?.find((p) => p._id === id) || qData?.find?.((p) => p._id === id);
        if (p) return { product: p };
      }
      return undefined;
    },
    staleTime: 30000,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data?.product) {
    return (
      <div className="min-h-screen bg-canvas section-quiet text-center">
        <p className="text-whisper">Product not identified</p>
        <button onClick={() => navigate('/shop')} className="text-whisper text-accent mt-8 border-b border-accent pb-1">Return to Archive</button>
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
    <div className="bg-canvas geometric-grid min-h-screen section-quiet px-6 sm:px-12 lg:px-24">
      <div className="bg-grain opacity-[0.03]" />

      {/* Navigation & Context */}
      <div className="flex justify-between items-center mb-16">
        <button onClick={() => navigate(-1)} className="text-whisper flex items-center gap-4 group interactive">
          <ChevronLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back to Archive
        </button>
        <p className="text-whisper opacity-40">Detail . 0{product._id.slice(-2)}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        {/* Imagery System */}
        <div className="lg:col-span-7 space-y-8">
          <div className="relative aspect-[4/5] lg:aspect-auto lg:h-[75vh] max-h-[850px] overflow-hidden border border-border group bg-canvas/20 flex items-center justify-center">
            {images[activeImage]?.url ? (
              <img 
                key={activeImage}
                src={images[activeImage].url} 
                alt={product.title} 
                className="max-w-[95%] max-h-[95%] object-contain grayscale hover:grayscale-0 transition-all duration-500 ease-out transform-gpu" 
              />
            ) : (
              <div className="w-full h-full bg-border/5 flex items-center justify-center">
                <Package size={24} className="text-mute" />
              </div>
            )}
            
            {images.length > 1 && (
              <div className="absolute bottom-8 right-8 flex gap-4 z-10">
                <button onClick={() => setActiveImage((p) => (p - 1 + images.length) % images.length)}
                  className="w-10 h-10 border border-ink/10 bg-canvas/40 backdrop-blur-sm flex items-center justify-center text-ink hover:bg-accent hover:text-canvas transition-all interactive">
                  <ChevronLeft size={14} />
                </button>
                <button onClick={() => setActiveImage((p) => (p + 1) % images.length)}
                  className="w-10 h-10 border border-ink/10 bg-canvas/40 backdrop-blur-sm flex items-center justify-center text-ink hover:bg-accent hover:text-canvas transition-all interactive">
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-6 overflow-x-auto hide-scrollbar reveal-hidden">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)}
                  className={`shrink-0 w-24 h-32 overflow-hidden border transition-all duration-500 ${i === activeImage ? 'border-accent' : 'border-border grayscale opacity-40 hover:opacity-100 hover:grayscale-0'} interactive`}>
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Technical Data & Actions */}
        <div className="lg:col-span-5 flex flex-col gap-12 reveal-hidden">
          <div className="space-y-6">
            <div className="flex gap-4">
              <span className="text-whisper text-accent">{product.category}</span>
              {product.subCategory && <span className="text-whisper opacity-30">{product.subCategory}</span>}
            </div>
            <h1 className="logo-heritage text-5xl md:text-7xl text-ink leading-tight">{product.title}</h1>
            <p className="text-whisper text-3xl text-accent">
              <span className="opacity-40 italic lowercase mr-2">rs.</span>
              {product.price.toLocaleString()}
            </p>
          </div>

          <p className="font-body text-ink/60 leading-loose italic text-sm">{product.description}</p>

          <div className="h-px bg-border/40 w-full" />

          {/* Configuration */}
          <div className="space-y-10">
            {product.sizes?.length > 0 && (
              <div>
                <p className="text-whisper mb-6">Select Proportion</p>
                <div className="flex gap-4 flex-wrap">
                  {product.sizes.map((s) => (
                    <button key={s} onClick={() => setSelectedSize(s)}
                      className={`text-whisper px-6 py-3 border transition-all duration-500 ${
                        selectedSize === s
                          ? 'border-accent text-accent bg-accent/5'
                          : 'border-border text-mute hover:border-ink hover:text-ink'
                      } interactive`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors?.length > 0 && (
              <div>
                <p className="text-whisper mb-6">Color Essence: <span className="text-ink">{selectedColor || '—'}</span></p>
                <div className="flex gap-4 flex-wrap">
                  {product.colors.map((c) => (
                    <button key={c.name} onClick={() => setSelectedColor(c.name)}
                      className={`w-10 h-10 border transition-all ${
                        selectedColor === c.name ? 'border-accent scale-110' : 'border-border'
                      } interactive`}
                      style={{ backgroundColor: c.hex || '#888' }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-12">
              <p className="text-whisper">Quantity</p>
              <div className="flex items-center gap-8 border border-border px-4 py-2">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-mute hover:text-accent interactive"><Minus size={12} /></button>
                <span className="text-whisper w-4 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-mute hover:text-accent interactive"><Plus size={12} /></button>
              </div>
            </div>
          </div>

          {/* Primary Actions */}
          <div className="flex flex-col gap-6 pt-8">
            <button id="buy-now-btn" onClick={handleBuyNow} disabled={product.stock === 0}
              className="btn-primary w-full disabled:opacity-30">
              Buy It Now
            </button>
            <button id="add-to-cart-btn" onClick={handleAddToCart} disabled={product.stock === 0}
              className="btn-secondary w-full disabled:opacity-30">
              Add to Cart
            </button>
          </div>

          <p className={`text-whisper ${product.stock > 0 ? 'text-accent' : 'text-red-900/50'}`}>
            {product.stock > 0 ? `Inventory: 0${product.stock} Units` : 'Inventory: Depleted'}
          </p>

        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
