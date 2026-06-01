import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { api } from '../lib/axios';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const categoryMap = {
  't-shirts': [
    'Crew Neck', 'V-Neck', 'Oversized', 'Polo', 'Henley', 'Graphic', 'Plain', 'Pocket', 
    'Raglan', 'Long Sleeve', 'Crop', 'Compression', 'Muscle Fit', 'Sleeveless', 'Hoodie', 
    'Striped', 'Printed', 'Acid Wash', 'Drop Shoulder', 'Mock Neck', 'Performance', 
    'Tie-Dye', 'Thermal', 'Mandarin Collar', 'Ringer', 'Boxy Fit'
  ],
  'shirts': [
    'Formal', 'Casual', 'Oxford', 'Denim', 'Flannel', 'Linen', 'Cuban Collar', 'Mandarin Collar', 
    'Checked', 'Plaid', 'Printed', 'Chambray', 'Dress', 'Overshirt', 'Utility', 'Corduroy', 
    'Satin', 'Silk', 'Hawaiian', 'Polo Shirt', 'Slim Fit', 'Regular Fit', 'Oversized', 
    'Half Sleeve', 'Full Sleeve', 'Military', 'Band Collar', 'Button-Down', 'Western', 'Tuxedo'
  ],
  'jeans': [
    'Skinny', 'Slim Fit', 'Straight Fit', 'Regular Fit', 'Relaxed Fit', 'Loose Fit', 'Baggy', 
    'Bootcut', 'Flared', 'Wide Leg', 'Tapered', 'Cargo', 'Carpenter', 'Distressed', 'Ripped', 
    'Acid Wash', 'Mom', 'Dad', 'High-Waist', 'Low-Rise', 'Mid-Rise', 'Cropped', 'Stacked', 
    'Stretch', 'Vintage', 'Biker', 'Jogger', 'Raw Denim', 'Selvedge', 'Patchwork'
  ],
  'jackets': [
    'Denim', 'Leather', 'Bomber', 'Varsity', 'Puffer', 'Windbreaker', 'Trucker', 'Biker', 
    'Parka', 'Rain', 'Utility', 'Field', 'Military', 'Quilted', 'Fleece', 'Harrington', 
    'Blazer', 'Track', 'Hoodie', 'Sherpa', 'Suede', 'Down', 'Cropped', 'Longline', 
    'Moto', 'Softshell', 'Peacoat', 'Trench Coat', 'Overcoat', 'Ski'
  ],
  'accessories': [],
  'footwear': [],
  'other': []
};

const categories = ['all', 't-shirts', 'shirts', 'jeans', 'jackets'];
const sortOptions = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
];

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [subCategory, setSubCategory] = useState(searchParams.get('subCategory') || 'all');
  const [sort, setSort] = useState('-createdAt');
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['products', category, subCategory, page, sort, search],
    queryFn: () =>
      api.get('/products', {
        params: {
          category: category === 'all' ? undefined : category,
          subCategory: subCategory === 'all' ? undefined : subCategory,
          page,
          limit: 12,
          sort,
          search: search || undefined,
        },
      }).then((r) => r.data),
    placeholderData: keepPreviousData,
  });

  // Extract predefined subcategories from the map based on active category
  const availableSubCategories = category !== 'all' && categoryMap[category]
    ? ['all', ...categoryMap[category]]
    : ['all'];

  useEffect(() => {
    setSubCategory('all');
    setPage(1);
  }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="bg-canvas geometric-grid min-h-screen section-quiet px-6 sm:px-12 lg:px-24">
      <div className="bg-grain opacity-[0.03]" />

      {/* Header: Geometric Silence */}
      <div className="mb-20 pt-24 md:pt-32 text-center flex flex-col items-center">
        <p className="text-whisper mb-6 opacity-60">Archive . Selection</p>
        <h1 className="logo-heritage text-3xl sm:text-5xl md:text-6xl text-ink mb-6 tracking-widest">The Collection</h1>
        <div className="w-24 h-px bg-accent/30 mb-6" />
        <p className="text-whisper opacity-80">
          {data?.pagination?.total || 0} unique pieces identified
        </p>
      </div>

        {/* Controls: Minimal & Precise */}
        <div className="flex flex-col lg:flex-row gap-12 mb-16 md:mb-20 items-start lg:items-end">
          {/* Search */}
          <form onSubmit={handleSearch} className="w-full lg:max-w-md relative group">
            <Search size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-mute group-focus-within:text-ink transition-colors" />
            <input
              id="shop-search"
              type="text"
              placeholder="SEARCH THE VOID..."
              className="w-full bg-transparent border-b border-border py-4 pl-8 text-whisper focus:outline-none focus:border-accent transition-all placeholder:text-mute"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
            {search && (
              <button type="button" onClick={() => { setSearch(''); setPage(1); }}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-mute hover:text-accent transition-colors interactive">
                <X size={14} />
              </button>
            )}
          </form>

          {/* Categories & Filter Toggle */}
          <div className="flex flex-col md:flex-row items-center justify-between w-full lg:flex-1 gap-12 relative border-t border-b border-ink/5 py-8 md:py-0 md:border-none">
            <div className="flex gap-10 overflow-x-auto hide-scrollbar w-full md:w-auto justify-center md:justify-start">
              {categories.map((cat) => (
                <button
                  key={cat}
                  id={`cat-${cat}`}
                  onClick={() => { setCategory(cat); setPage(1); setSubCategory('all'); }}
                  className={`text-whisper whitespace-nowrap transition-all duration-500 pb-2 border-b-2 font-bold ${
                    category === cat
                      ? 'text-accent border-accent'
                      : 'text-mute border-transparent hover:text-ink'
                  } interactive`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative">
              <button 
                onClick={() => setFilterOpen(!filterOpen)}
                className={`flex items-center gap-3 text-whisper px-6 py-2 border transition-all duration-500 interactive ${
                  filterOpen || subCategory !== 'all' ? 'border-accent text-accent' : 'border-border text-mute'
                }`}
              >
                <SlidersHorizontal size={12} />
                <span className="tracking-[0.4em]">FILTER</span>
                {subCategory !== 'all' && <div className="w-1.5 h-1.5 bg-accent rounded-full ml-2" />}
              </button>

              {/* Vertical Dropdown Protocol */}
              {filterOpen && (
                <div className="absolute right-0 top-full mt-4 w-72 bg-canvas border border-ink/10 shadow-2xl z-[50] animate-fade-in-up">
                  <div className="p-8 space-y-12 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Sub-Categories */}
                    <div className="space-y-6">
                       <p className="text-[8px] text-mute uppercase tracking-[0.4em] font-bold border-b border-ink/5 pb-2">Classification</p>
                       <div className="flex flex-col gap-2">
                          {availableSubCategories.map((sub) => (
                            <button
                              key={sub}
                              onClick={() => { setSubCategory(sub); setPage(1); setFilterOpen(false); }}
                              className={`text-[10px] text-left px-4 py-2 uppercase tracking-widest transition-all ${
                                subCategory === sub
                                  ? 'text-accent font-bold'
                                  : 'text-mute hover:text-ink hover:pl-6'
                              } interactive`}
                            >
                              {sub}
                            </button>
                          ))}
                       </div>
                    </div>

                    {/* Sorting */}
                    <div className="space-y-6">
                       <p className="text-[8px] text-mute uppercase tracking-[0.4em] font-bold border-b border-ink/5 pb-2">Sequence</p>
                       <div className="flex flex-col gap-2">
                          {sortOptions.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => { setSort(opt.value); setPage(1); setFilterOpen(false); }}
                              className={`text-[10px] text-left px-4 py-2 uppercase tracking-widest transition-all ${
                                sort === opt.value
                                  ? 'text-accent font-bold'
                                  : 'text-mute hover:text-ink hover:pl-6'
                              } interactive`}
                            >
                              {opt.label}
                            </button>
                          ))}
                       </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-border/5 animate-pulse rounded-sm" />
          ))}
        </div>
      ) : data?.products?.length === 0 ? (
        <div className="text-center py-40 border border-dashed border-border rounded-sm">
          <p className="text-whisper mb-8">Zero items match your inquiry</p>
          <button onClick={() => { setSearch(''); setCategory('all'); }}
            className="text-whisper text-accent border-b border-accent pb-1 interactive">Reset Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20">
          {data?.products?.map((p, idx) => (
            <div key={p._id} className="animate-fade-in" style={{ animationDelay: `${(idx % 4) * 0.1}s` }}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data?.pagination?.pages > 1 && (
        <div className="flex justify-center gap-12 mt-32 border-t border-border pt-12">
          {[...Array(data.pagination.pages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`text-whisper transition-all pb-2 border-b-2 ${
                page === i + 1
                  ? 'text-accent border-accent'
                  : 'text-mute border-transparent hover:text-ink'
              } interactive`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopPage;
