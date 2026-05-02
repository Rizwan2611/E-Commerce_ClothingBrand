import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../lib/axios';
import AdminLayout from '../../components/AdminLayout';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Image as ImageIcon, X, Box } from 'lucide-react';

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', page],
    queryFn: () => adminApi.get(`/admin/products?page=${page}&limit=10`).then((r) => r.data),
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.delete(`/admin/products/${id}`),
    onSuccess: () => {
      toast.success('Product deleted successfully');
      queryClient.invalidateQueries(['admin-products']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete product'),
  });

  const openForm = (product = null) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  return (
    <AdminLayout title="Products">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <Box className="text-black" size={24} />
              <h2 className="text-2xl font-bold uppercase tracking-tight text-black">All Products</h2>
           </div>
          <p className="text-zinc-400 font-semibold text-xs">{data?.pagination?.total || 0} products in inventory</p>
        </div>
        <button 
          onClick={() => openForm()} 
          className="bg-black hover:bg-zinc-800 text-white font-bold uppercase tracking-wide text-xs py-4 px-8 rounded-2xl transition-all shadow-xl shadow-black/10 flex items-center gap-3 active:scale-95"
        >
          <Plus size={18} /> Add New Product
        </button>
      </div>

      {isLoading ? (
        <div className="h-96 bg-white border-2 border-zinc-100 rounded-[2.5rem] animate-pulse shadow-sm" />
      ) : (
        <div className="bg-white border-2 border-black rounded-[2.5rem] overflow-hidden shadow-xl shadow-black/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black text-white text-xs font-bold uppercase tracking-wide">
                  <th className="p-6">Product</th>
                  <th className="p-6">Category</th>
                  <th className="p-6">Price</th>
                  <th className="p-6">Stock</th>
                  <th className="p-6">Status</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {data?.products?.map((product) => (
                  <tr key={product._id} className="hover:bg-zinc-50 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-zinc-100 border border-black/5 rounded-2xl overflow-hidden shrink-0 shadow-inner">
                          {product.images?.[0]?.url ? (
                            <img src={product.images[0].url} alt="" className="w-full h-full object-contain p-1" />
                          ) : (
                            <ImageIcon size={20} className="w-full h-full p-3 text-zinc-300" />
                          )}
                        </div>
                        <div>
                          <p className="text-black font-bold text-sm line-clamp-1">{product.title}</p>
                          <p className="text-zinc-400 text-xs">ID: {product._id.slice(-6).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                       <span className="text-zinc-500 font-semibold text-xs capitalize bg-zinc-100 px-3 py-1.5 rounded-lg border border-black/5">
                        {product.category}
                      </span>
                    </td>
                    <td className="p-6 text-black font-bold text-sm">Rs {product.price.toLocaleString()}</td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-400' : product.stock > 0 ? 'bg-amber-400' : 'bg-red-500 animate-pulse'}`} />
                        <span className={`text-xs font-bold ${product.stock > 0 ? 'text-black' : 'text-red-500'}`}>
                          {product.stock} in stock
                        </span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`inline-block px-3 py-1.5 rounded-xl text-xs font-bold border-2 ${
                        product.isActive 
                        ? 'bg-zinc-50 border-black text-black' 
                        : 'bg-white border-zinc-100 text-zinc-300'
                      }`}>
                        {product.isActive ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                        <button 
                          onClick={() => openForm(product)} 
                          className="w-10 h-10 bg-white border-2 border-black text-black hover:bg-black hover:text-white rounded-xl flex items-center justify-center transition-all shadow-md"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => { if(confirm('Are you sure you want to delete this product?')) deleteMutation.mutate(product._id) }}
                          className="w-10 h-10 bg-white border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl flex items-center justify-center transition-all shadow-md"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(isLoading === false && (!data?.products || data.products.length === 0)) && (
              <div className="py-24 flex flex-col items-center justify-center text-zinc-300">
                <Box size={64} className="mb-4 opacity-10" />
                <p className="text-sm font-bold text-zinc-400">No products found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pagination */}
      {data?.pagination?.pages > 1 && (
        <div className="flex justify-center gap-3 mt-12">
          {[...Array(data.pagination.pages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-12 h-12 rounded-2xl text-xs font-bold transition-all border-2 ${
                page === i + 1 
                ? 'bg-black text-white border-black shadow-lg scale-110' 
                : 'bg-white text-zinc-400 border-zinc-100 hover:border-black hover:text-black shadow-sm'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {isModalOpen && (
        <ProductModal 
          product={currentProduct} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => { setIsModalOpen(false); queryClient.invalidateQueries(['admin-products']) }}
        />
      )}
    </AdminLayout>
  );
};

const ProductModal = ({ product, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: product?.title || '',
    description: product?.description || '',
    price: product?.price || '',
    stock: product?.stock || '',
    category: product?.category || 't-shirts',
    isActive: product !== null ? product?.isActive : true,
  });
  const [images, setImages] = useState([]);

  const categories = ['t-shirts', 'shirts', 'jeans', 'jackets'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    
    // Default sizes match customer requests
    if(!product) formData.append('sizes', JSON.stringify(['S', 'M', 'L', 'XL']));
    
    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }
    }

    try {
      if (product) {
        await adminApi.put(`/admin/products/${product._id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' }});
        toast.success('Product updated successfully');
      } else {
        await adminApi.post('/admin/products', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
        toast.success('Product created successfully');
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
      <div className="bg-white border-2 border-black rounded-[3rem] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-slide-up">
        <div className="flex justify-between items-center p-10 border-b-2 border-black sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold text-black">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-sm text-zinc-400 mt-1">Fill in the product details below</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 bg-zinc-50 border-2 border-black/10 rounded-2xl flex items-center justify-center text-black hover:bg-black hover:text-white transition-all">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto">
          <div>
            <label className="block text-black font-bold text-sm mb-3">Product Name</label>
            <input 
              type="text" 
              value={form.title} 
              onChange={e=>setForm({...form, title: e.target.value})} 
              className="w-full bg-zinc-50 border-2 border-zinc-100 focus:border-black rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none transition-all" 
              placeholder="e.g. Void Oversized Tee"
              required 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-black font-bold text-sm mb-3">Price (Rs)</label>
              <input 
                type="number" 
                value={form.price} 
                onChange={e=>setForm({...form, price: e.target.value})} 
                className="w-full bg-zinc-50 border-2 border-zinc-100 focus:border-black rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none transition-all" 
                required 
                min="0" 
              />
            </div>
            <div>
              <label className="block text-black font-bold text-sm mb-3">Stock Quantity</label>
              <input 
                type="number" 
                value={form.stock} 
                onChange={e=>setForm({...form, stock: e.target.value})} 
                className="w-full bg-zinc-50 border-2 border-zinc-100 focus:border-black rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none transition-all" 
                required 
                min="0" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-black font-bold text-sm mb-3">Category</label>
              <select 
                value={form.category} 
                onChange={e=>setForm({...form, category: e.target.value})} 
                className="w-full bg-zinc-50 border-2 border-zinc-100 focus:border-black rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none transition-all cursor-pointer appearance-none capitalize"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.replace('-', ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-black font-bold text-sm mb-3">Status</label>
              <select 
                value={form.isActive} 
                onChange={e=>setForm({...form, isActive: e.target.value === 'true'})} 
                className="w-full bg-zinc-50 border-2 border-zinc-100 focus:border-black rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none transition-all cursor-pointer appearance-none"
              >
                <option value="true">Active</option>
                <option value="false">Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-black font-bold text-sm mb-3">Description</label>
            <textarea 
              value={form.description} 
              onChange={e=>setForm({...form, description: e.target.value})} 
              className="w-full bg-zinc-50 border-2 border-zinc-100 focus:border-black rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none transition-all min-h-[120px]" 
              required 
            />
          </div>
          
          <div>
            <label className="block text-black font-bold text-sm mb-3">Images {product && '(Add More)'}</label>
            <div className="relative group">
               <input 
                 type="file" 
                 multiple 
                 accept="image/*" 
                 onChange={e=>setImages(e.target.files)} 
                 className="w-full bg-zinc-100 border-2 border-dashed border-black/10 hover:border-black hover:bg-zinc-50 rounded-2xl p-10 text-xs font-medium text-zinc-400 transition-all cursor-pointer file:hidden" 
               />
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-zinc-300 group-hover:text-black group-hover:scale-110 transition-all">
                  <ImageIcon size={32} className="mb-2" />
                  <span className="text-xs font-bold">Click to upload images</span>
               </div>
            </div>
          </div>

          <div className="pt-10 flex gap-4 mt-10">
            <button type="button" onClick={onClose} className="flex-1 bg-white border-2 border-black text-black font-bold text-sm py-5 rounded-2xl hover:bg-zinc-50 transition-all">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="flex-[2] bg-black text-white font-bold text-sm py-5 rounded-2xl hover:bg-zinc-800 transition-all shadow-xl shadow-black/10 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProducts;
