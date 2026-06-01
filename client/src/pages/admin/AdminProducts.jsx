import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../lib/axios';
import AdminLayout from '../../components/AdminLayout';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Image as ImageIcon, X, Box } from 'lucide-react';

const categoryMap = {
  't-shirts': ['Crew Neck', 'V-Neck', 'Oversized', 'Polo', 'Henley', 'Graphic', 'Plain', 'Pocket', 'Raglan', 'Long Sleeve', 'Crop', 'Compression', 'Muscle Fit', 'Sleeveless', 'Hoodie', 'Striped', 'Printed', 'Acid Wash', 'Drop Shoulder', 'Mock Neck', 'Performance', 'Tie-Dye', 'Thermal', 'Mandarin Collar', 'Ringer', 'Boxy Fit'],
  'shirts': ['Formal', 'Casual', 'Oxford', 'Denim', 'Flannel', 'Linen', 'Cuban Collar', 'Mandarin Collar', 'Checked', 'Plaid', 'Printed', 'Chambray', 'Dress', 'Overshirt', 'Utility', 'Corduroy', 'Satin', 'Silk', 'Hawaiian', 'Polo Shirt', 'Slim Fit', 'Regular Fit', 'Oversized', 'Half Sleeve', 'Full Sleeve', 'Military', 'Band Collar', 'Button-Down', 'Western', 'Tuxedo'],
  'jeans': ['Skinny', 'Slim Fit', 'Straight Fit', 'Regular Fit', 'Relaxed Fit', 'Loose Fit', 'Baggy', 'Bootcut', 'Flared', 'Wide Leg', 'Tapered', 'Cargo', 'Carpenter', 'Distressed', 'Ripped', 'Acid Wash', 'Mom', 'Dad', 'High-Waist', 'Low-Rise', 'Mid-Rise', 'Cropped', 'Stacked', 'Stretch', 'Vintage', 'Biker', 'Jogger', 'Raw Denim', 'Selvedge', 'Patchwork'],
  'jackets': ['Denim', 'Leather', 'Bomber', 'Varsity', 'Puffer', 'Windbreaker', 'Trucker', 'Biker', 'Parka', 'Rain', 'Utility', 'Field', 'Military', 'Quilted', 'Fleece', 'Harrington', 'Blazer', 'Track', 'Hoodie', 'Sherpa', 'Suede', 'Down', 'Cropped', 'Longline', 'Moto', 'Softshell', 'Peacoat', 'Trench Coat', 'Overcoat', 'Ski'],
  'accessories': [], 'footwear': [], 'other': []
};

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
    <AdminLayout title="Inventory Archive">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16">
        <div>
           <div className="flex items-center gap-4 mb-4">
              <div className="w-2 h-2 bg-accent" />
              <h2 className="text-whisper text-[10px] font-bold uppercase tracking-[0.4em] text-ink">Product . Protocol</h2>
           </div>
          <p className="text-whisper text-[11px] opacity-70 font-mono">Archive . Count: {data?.pagination?.total || 0} Units</p>
        </div>
        <button 
          onClick={() => openForm()} 
          className="bg-ink text-canvas font-bold text-[10px] tracking-[0.3em] py-5 px-10 flex items-center gap-4 transition-all interactive hover:bg-accent uppercase"
        >
          <Plus size={14} /> Initiate New Entry
        </button>
      </div>

      {isLoading ? (
        <div className="h-96 bg-canvas border border-ink/10 animate-pulse" />
      ) : (
        <div className="border border-ink/10 bg-canvas relative">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-ink/10 text-whisper text-[9px] font-bold uppercase tracking-[0.4em] opacity-40">
                  <th className="p-8">Specification</th>
                  <th className="p-8">Classification</th>
                  <th className="p-8">Valuation</th>
                  <th className="p-8">Availability</th>
                  <th className="p-8">State</th>
                  <th className="p-8 text-right">Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {data?.products?.map((product) => (
                  <tr key={product._id} className="group hover:bg-ink/[0.02] transition-colors interactive">
                    <td className="p-8">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-canvas border border-ink/10 relative overflow-hidden group-hover:border-accent/30 transition-colors">
                          {product.images?.[0]?.url ? (
                            <img src={product.images[0].url} alt="" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center opacity-10">
                              <ImageIcon size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-ink font-bold text-xs uppercase tracking-widest mb-1">{product.title}</p>
                          <p className="text-[9px] font-mono opacity-60">ID_{product._id.slice(-6).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="flex flex-wrap gap-3">
                        <span className="text-accent text-[9px] font-bold uppercase tracking-widest border border-accent/20 px-3 py-1 bg-accent/5">
                          {product.category}
                        </span>
                      </div>
                    </td>
                    <td className="p-8">
                      <p className="logo-heritage text-lg text-ink">Rs {product.price.toLocaleString()}</p>
                    </td>
                    <td className="p-8">
                      <div className="flex items-center gap-3">
                        <div className={`w-1 h-1 ${product.stock > 10 ? 'bg-accent' : product.stock > 0 ? 'bg-orange-400' : 'bg-red-500 animate-pulse'}`} />
                        <span className="text-[10px] font-mono text-ink opacity-60 uppercase tracking-widest">
                          {product.stock} Units
                        </span>
                      </div>
                    </td>
                    <td className="p-8">
                      <span className={`text-[9px] font-bold uppercase tracking-widest ${
                        product.isActive ? 'text-accent' : 'text-ink/20'
                      }`}>
                        {product.isActive ? 'Active' : 'Archived'}
                      </span>
                    </td>
                    <td className="p-8 text-right">
                      <div className="flex justify-end gap-6 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <button 
                          onClick={() => openForm(product)} 
                          className="text-ink hover:text-accent transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => { if(confirm('Confirm Archival Deletion?')) deleteMutation.mutate(product._id) }}
                          className="text-red-900/50 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(isLoading === false && (!data?.products || data.products.length === 0)) && (
              <div className="py-32 flex flex-col items-center justify-center opacity-20">
                <Box size={40} className="mb-6" />
                <p className="text-whisper text-[9px] font-bold uppercase tracking-widest">Repository . Empty</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pagination Protocol */}
      {data?.pagination?.pages > 1 && (
        <div className="flex justify-center gap-px mt-12 border border-ink/10 bg-ink/10">
          {[...Array(data.pagination.pages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-12 h-12 text-[10px] font-bold transition-all ${
                page === i + 1 
                ? 'bg-ink text-canvas' 
                : 'bg-canvas text-ink/40 hover:text-ink hover:bg-ink/[0.03]'
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
    category: product?.category || 't-shirts',
    subCategory: product?.subCategory || '',
    stock: product?.stock || '',
    isActive: product !== null ? product?.isActive : true,
    sizes: product?.sizes || [],
    colors: product?.colors || [],
    tags: product?.tags || [],
  });

  useEffect(() => {
    const currentCategory = form.category || 't-shirts';
    const validSubs = categoryMap[currentCategory] || [];
    if (form.subCategory && !validSubs.includes(form.subCategory)) {
       setForm(prev => ({ ...prev, subCategory: '' }));
    }
  }, [form.category]);

  const [images, setImages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (form.sizes.length === 0) {
      setLoading(false);
      return toast.error('Please select at least one proportion');
    }

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('category', form.category);
    formData.append('subCategory', form.subCategory);
    formData.append('stock', form.stock);
    formData.append('isActive', form.isActive);
    formData.append('sizes', JSON.stringify(form.sizes));
    
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60">
      <div className="bg-canvas border border-ink/20 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative animate-fade-in">
        <div className="flex justify-between items-center p-12 border-b border-ink/10 sticky top-0 bg-canvas z-10">
          <div>
            <h2 className="logo-heritage text-3xl text-ink">
              {product ? 'Refine Entry' : 'New Protocol'}
            </h2>
            <p className="text-whisper text-[9px] text-accent tracking-widest mt-2">Operational . Data . Entry</p>
          </div>
          <button onClick={onClose} className="text-ink hover:text-accent transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-12 space-y-10 overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            <label className="text-whisper text-[9px] text-ink opacity-70 uppercase tracking-widest">Product Identity</label>
            <input 
              type="text" 
              value={form.title} 
              onChange={e=>setForm({...form, title: e.target.value})} 
              className="w-full bg-transparent border-b border-ink/10 focus:border-accent py-4 text-sm font-medium focus:outline-none transition-all placeholder:text-ink/10 text-ink" 
              placeholder="ENTRY NAME..."
              required 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-12">
            <div className="space-y-4">
              <label className="text-whisper text-[9px] text-ink opacity-70 uppercase tracking-widest">Valuation (Rs)</label>
              <input 
                type="number" 
                value={form.price} 
                onChange={e=>setForm({...form, price: e.target.value})} 
                className="w-full bg-transparent border-b border-ink/10 focus:border-accent py-4 text-sm font-medium focus:outline-none transition-all text-ink" 
                required 
                min="0" 
              />
            </div>
            <div className="space-y-4">
              <label className="text-whisper text-[9px] text-ink opacity-70 uppercase tracking-widest">Unit Count</label>
              <input 
                type="number" 
                value={form.stock} 
                onChange={e=>setForm({...form, stock: e.target.value})} 
                className="w-full bg-transparent border-b border-ink/10 focus:border-accent py-4 text-sm font-medium focus:outline-none transition-all text-ink" 
                required 
                min="0" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <label className="text-whisper text-[9px] text-ink opacity-70 uppercase tracking-widest">Classification</label>
              <select 
                value={form.category} 
                onChange={e=>setForm({...form, category: e.target.value})} 
                className="w-full bg-transparent border-b border-ink/10 focus:border-accent py-4 text-sm font-medium focus:outline-none transition-all cursor-pointer text-ink"
              >
                {Object.keys(categoryMap).map(cat => (
                  <option key={cat} value={cat} className="bg-canvas text-ink">{cat.toUpperCase()}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-4">
              <label className="text-whisper text-[9px] text-ink opacity-70 uppercase tracking-widest">Sub . Classification</label>
              <select 
                value={form.subCategory} 
                onChange={e=>setForm({...form, subCategory: e.target.value})} 
                className="w-full bg-transparent border-b border-ink/10 focus:border-accent py-4 text-sm font-medium focus:outline-none transition-all cursor-pointer text-ink"
                required
              >
                <option value="">SELECT SUB-CATEGORY</option>
                {(categoryMap[form.category] || []).map(sub => (
                  <option key={sub} value={sub} className="bg-canvas text-ink">{sub.toUpperCase()}</option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              <label className="text-whisper text-[9px] text-ink opacity-70 uppercase tracking-widest">State</label>
              <select 
                value={form.isActive} 
                onChange={e=>setForm({...form, isActive: e.target.value === 'true'})} 
                className="w-full bg-transparent border-b border-ink/10 focus:border-accent py-4 text-sm font-medium focus:outline-none transition-all cursor-pointer text-ink"
              >
                <option value="true" className="bg-canvas">ACTIVE</option>
                <option value="false" className="bg-canvas">ARCHIVED</option>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            <label className="text-whisper text-[9px] text-ink opacity-70 uppercase tracking-widest">Available Proportions</label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'FREE SIZE'].map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    const newSizes = form.sizes.includes(size)
                      ? form.sizes.filter(s => s !== size)
                      : [...form.sizes, size];
                    setForm({ ...form, sizes: newSizes });
                  }}
                  className={`py-4 text-[10px] font-bold border transition-all duration-500 ${
                    form.sizes.includes(size)
                      ? 'border-accent text-accent bg-accent/5'
                      : 'border-ink/10 text-ink/40 hover:border-ink/30'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-whisper text-[9px] text-ink opacity-70 uppercase tracking-widest">Narrative Specification</label>
            <textarea 
              value={form.description} 
              onChange={e=>setForm({...form, description: e.target.value})} 
              className="w-full bg-transparent border-b border-ink/10 focus:border-accent py-4 text-sm font-medium focus:outline-none transition-all min-h-[100px] text-ink" 
              required 
            />
          </div>
          
          <div className="space-y-4">
            <label className="text-whisper text-[9px] text-ink opacity-40 uppercase tracking-widest">Visual Matrix</label>
            <div className="relative group border border-dashed border-ink/10 p-12 text-center hover:border-accent transition-all">
               <input 
                 type="file" 
                 multiple 
                 accept="image/*" 
                 onChange={e=>setImages(e.target.files)} 
                 className="absolute inset-0 opacity-0 cursor-pointer z-10" 
               />
               <div className="flex flex-col items-center justify-center text-ink/20 group-hover:text-accent transition-all">
                  <ImageIcon size={24} className="mb-4" />
                  <span className="text-[9px] font-bold tracking-widest uppercase">Select Archive Images</span>
               </div>
            </div>
          </div>

          <div className="pt-12 flex gap-8">
            <button type="button" onClick={onClose} className="flex-1 border border-ink/10 text-whisper text-[9px] font-bold tracking-widest py-5 uppercase hover:bg-ink hover:text-canvas transition-all">
              Abort
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="flex-[2] bg-ink text-canvas font-bold text-[9px] tracking-widest py-5 uppercase hover:bg-accent transition-all shadow-xl shadow-black/10 disabled:opacity-50"
            >
              {loading ? 'PROCESSING...' : (product ? 'UPDATE PROTOCOL' : 'FINALIZE ENTRY')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProducts;
