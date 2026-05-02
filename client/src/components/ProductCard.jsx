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
    <Link to={`/product/${product._id}`} className="group block perspective-1000">
      <div className="three-d-card overflow-hidden !p-0 depth-sm hover:depth-lg rounded-2xl bg-white border border-zinc-200">
        {/* Image Container with 3D Parallax */}
        <div className="relative aspect-[3/4] overflow-hidden bg-zinc-50 border-b-2 border-zinc-100 p-8 flex items-center justify-center transition-all duration-500 group-hover:bg-green-50/30">
          {product.images?.[0]?.url ? (
            <img
              src={product.images[0].url}
              alt={product.title}
              className="max-w-[85%] max-h-[85%] object-contain group-hover:scale-125 group-hover:-translate-y-4 group-hover:rotate-6 transition-all duration-700 ease-out drop-shadow-xl group-hover:drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
              style={{ transformStyle: 'preserve-3d', transform: 'translateZ(50px)' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ transform: 'translateZ(50px)' }}>
              <ShoppingBag size={48} className="text-zinc-300" />
            </div>
          )}
          {/* Stock badge */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-[1000] text-xs bg-red-600 px-3 py-1 rounded-lg uppercase">Out of Stock</span>
            </div>
          )}
          {/* Category tag */}
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-white border border-black text-black text-[10px] font-[1000] uppercase tracking-tighter shadow-sm group-hover:bg-green-400 group-hover:border-green-400 group-hover:text-black transition-all duration-300">
              {product.category}
            </span>
          </div>
          {/* Quick add */}
          <button
            onClick={handleQuickAdd}
            disabled={product.stock === 0}
            className="absolute bottom-3 right-3 bg-green-400 text-black p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 disabled:opacity-0 shadow-xl hover:bg-green-300 hover:scale-110"
          >
            <ShoppingBag size={16} />
          </button>
        </div>

        {/* Info */}
        <div className="p-6 flex flex-col min-h-[150px] bg-white">
          <div className="flex-1">
            <p className="text-black font-[1000] text-xs uppercase tracking-[0.2em] line-clamp-1 mb-3 group-hover:text-green-500 transition-colors duration-300">
              {product.title}
            </p>
            {/* Sizes preview */}
            <div className="min-h-[28px] mb-4">
              {product.sizes?.length > 0 && (
                <div className="flex gap-2">
                  {product.sizes.slice(0, 4).map((s) => (
                    <span key={s} className="text-[9px] px-2.5 py-1.5 bg-zinc-50 text-zinc-500 border border-zinc-100 rounded-lg font-bold uppercase tracking-widest group-hover:border-green-400/20 group-hover:bg-green-50 transition-colors duration-300">
                      {s}
                    </span>
                  ))}
                  {product.sizes.length > 4 && (
                    <span className="text-[9px] px-2.5 py-1.5 bg-zinc-50 text-zinc-400 border border-zinc-100 rounded-lg font-bold uppercase tracking-widest">+{product.sizes.length - 4}</span>
                  )}
                </div>
              )}
            </div>
          </div>
          <p className="text-black font-[1000] text-2xl tracking-tighter group-hover:text-green-500 transition-colors duration-300">
            <span className="text-sm mr-1">Rs</span>
            {product.price.toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
