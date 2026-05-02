import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const categories = ['all', 'shirts', 'jeans', 'jackets', 't-shirts'];
const sortOptions = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
];

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [sort, setSort] = useState('-createdAt');
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['products', category, page, sort, search],
    queryFn: () =>
      api.get('/products', {
        params: {
          category: category === 'all' ? undefined : category,
          page,
          limit: 12,
          sort,
          search: search || undefined,
        },
      }).then((r) => r.data),
    keepPreviousData: true,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="pt-32 px-4 sm:px-6 lg:px-8 max-w-full mx-auto pb-16">
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-rock-salt text-3xl font-black uppercase mb-2">Shop Collection</h1>
        <p className="text-zinc-500 font-medium font-rock-salt text-sm">
          {data?.pagination?.total || 0} pieces available in the faction
        </p>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 relative group">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-black group-focus-within:text-green-500 group-focus-within:scale-110 transition-all duration-300" />
          <input
            id="shop-search"
            type="text"
            placeholder="SEARCH THE VOID..."
            className="w-full bg-white border-2 border-black rounded-xl py-3.5 pl-12 pr-4 text-sm font-[1000] tracking-tighter focus:outline-none focus:ring-4 focus:ring-green-400/20 focus:border-green-400 transition-all uppercase placeholder:text-zinc-300"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          {search && (
            <button type="button" onClick={() => { setSearch(''); setPage(1); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-green-500 transition-colors">
              <X size={18} />
            </button>
          )}
        </form>

        {/* Sort */}
        <select
          id="shop-sort"
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          className="bg-white border-2 border-black rounded-xl px-6 py-3.5 text-xs font-[1000] tracking-tighter cursor-pointer focus:outline-none focus:ring-4 focus:ring-green-400/20 focus:border-green-400 transition-all uppercase appearance-none"
        >
          {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            id={`cat-${cat}`}
            onClick={() => { setCategory(cat); setPage(1); }}
            className={`shrink-0 px-6 py-2.5 rounded-xl text-xs font-[1000] tracking-tighter transition-all duration-300 uppercase border-2 ${
              category === cat
                ? 'bg-green-400 text-black border-green-400 shadow-lg shadow-green-400/20'
                : 'bg-white text-zinc-400 border-zinc-100 hover:border-green-400 hover:text-green-500'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-zinc-50 rounded-2xl animate-pulse aspect-[3/4]" />
          ))}
        </div>
      ) : data?.products?.length === 0 ? (
        <div className="text-center py-32 border-2 border-dashed border-zinc-100 rounded-3xl">
          <p className="text-zinc-400 font-rock-salt font-black text-xl mb-4">NO DROPS FOUND</p>
          <button onClick={() => { setSearch(''); setCategory('all'); }}
            className="text-green-500 font-black font-rock-salt underline text-sm uppercase hover:text-green-400 transition-colors">Reset Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
          {data?.products?.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}

      {/* Pagination */}
      {data?.pagination?.pages > 1 && (
        <div className="flex justify-center gap-3 mt-16">
          {[...Array(data.pagination.pages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-12 h-12 rounded-xl text-sm font-black transition-all font-rock-salt border-2 ${
                page === i + 1
                  ? 'bg-green-400 text-black border-green-400 shadow-lg shadow-green-400/20'
                  : 'bg-white text-zinc-400 border-zinc-100 hover:border-green-400 hover:text-green-500'
              }`}
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
