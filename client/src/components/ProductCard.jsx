import { ShoppingBag, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, product.sizes?.[0] || null, product.colors?.[0]?.name || null);
  };

  return (
    <Link to={`/product/${product._id}`} className="group block interactive">
      <div className="card-minimal shadow-premium overflow-hidden !p-0 rounded-sm transition-[box-shadow] duration-300 hover:shadow-deep">
        {/* Image Container with 3D Parallax */}
        <div className="relative aspect-[4/5] overflow-hidden bg-canvas/20 flex items-center justify-center transition-all duration-300">
          {product.images?.[0]?.url ? (
            <img
              src={product.images[0].url}
              alt={product.title}
              className="max-w-[90%] max-h-[90%] object-contain group-hover:scale-110 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag size={48} className="text-ink/10" />
            </div>
          )}
          
          {/* Glassy Overlay on Hover */}
          <div className="absolute inset-0 bg-ink/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-md" />

          {/* Stock badge */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-ink/60 flex items-center justify-center backdrop-blur-lg">
              <span className="text-canvas font-black text-[10px] tracking-[0.3em] uppercase">Sold Out</span>
            </div>
          )}

          {/* Category tag - Staggered reveal */}
          <div className="absolute top-6 left-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <span className="text-whisper text-accent font-black tracking-widest uppercase bg-canvas/40 px-3 py-1 backdrop-blur-md border border-white/20 rounded-sm">
              {product.category}
            </span>
          </div>

          {/* Quick add - Heavy Glassy button */}
          <button
            onClick={handleQuickAdd}
            disabled={product.stock === 0}
            className="absolute bottom-6 right-6 bg-white/10 backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_rgba(42,34,27,0.1)] p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75 disabled:opacity-0 interactive rounded-sm"
          >
            <ShoppingBag size={14} className="text-ink" />
          </button>
        </div>

        {/* Info */}
        <div className="p-8 flex flex-col min-h-[160px] bg-canvas border-t border-ink/5">
          <div className="flex-1">
            <p className="text-whisper !text-[12px] font-black mb-6 group-hover:text-accent transition-colors duration-500 tracking-wider">
              {product.title}
            </p>
            {/* Sizes preview */}
            <div className="min-h-[24px] mb-6 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-300">
              {product.sizes?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.sizes.slice(0, 4).map((s) => (
                    <span key={s} className="text-[9px] px-3 py-1 bg-ink/5 text-ink border border-ink/10 rounded-sm font-black uppercase tracking-tighter">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <p className="text-whisper text-accent font-black tracking-widest text-lg">
            <span className="opacity-40 mr-2 italic lowercase font-normal text-xs">rs.</span>
            {product.price.toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
