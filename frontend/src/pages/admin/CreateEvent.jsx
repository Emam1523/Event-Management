import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiTrash2, FiUpload, FiCalendar, FiClock, FiMapPin, FiTag, FiUsers, FiInfo } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import api, { eventsAPI } from '../../services/api';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fullDescription: '',
    date: '',
    time: '',
    endTime: '',
    location: '',
    googleMapUrl: '',
    venue: '',
    address: '',
    category: '',
    image: null,
    capacity: '',
    tags: [],
    ticketTypes: [
      { name: 'General Admission', price: '', available: '', description: '' }
    ]
  });

  const [categories, setCategories] = useState([
    'Concert', 'Festival', 'Workshop', 'Conference', 'Sports', 'Theater',
    'Comedy Show', 'Networking Event', 'Art Show', 'Food & Drink'
  ]);
  const [cities, setCities] = useState([
    'Dhaka', 'Chattogram', 'Sylhet', 'Khulna', 'Rajshahi', 'Barishal'
  ]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const { data } = await eventsAPI.getFilters();
        if (data && data.success) {
          if (data.categories && data.categories.length > 0) {
            setCategories(data.categories);
          }
          if (data.locations && data.locations.length > 0) {
            setCities(data.locations);
          }
        }
      } catch (err) {
        console.error('Error fetching categories and cities:', err);
      }
    };
    fetchFilters();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('Invalid file format. Only JPEG, PNG, WEBP, and GIF images are allowed!');
        e.target.value = '';
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File size exceeds the 5MB limit. Please upload a smaller image.');
        e.target.value = '';
        return;
      }

      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  const handleTicketChange = (index, field, value) => {
    const updatedTickets = [...formData.ticketTypes];
    updatedTickets[index][field] = value;
    setFormData({
      ...formData,
      ticketTypes: updatedTickets
    });
  };

  const addTicketType = () => {
    setFormData({
      ...formData,
      ticketTypes: [
        ...formData.ticketTypes,
        { name: '', price: '', available: '', description: '' }
      ]
    });
  };

  const removeTicketType = (index) => {
    if (formData.ticketTypes.length === 1) return;
    const updatedTickets = formData.ticketTypes.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      ticketTypes: updatedTickets
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.title || !formData.date || !formData.time || !formData.location) {
        throw new Error('Please fill in all required fields');
      }

      let imageUrl = formData.image;
      
      // 1. Upload image if it's a file
      if (formData.image instanceof File) {
        const uploadData = new FormData();
        uploadData.append('image', formData.image);
        const uploadRes = await api.post('/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrl = uploadRes.data?.url || uploadRes.data;
      }

      // 2. Prepare JSON payload
      const eventData = {
        title: formData.title,
        description: formData.description || formData.fullDescription,
        category: formData.category,
        date: formData.date,
        time: formData.time,
        endTime: formData.endTime,
        location: formData.venue ? `${formData.location}, ${formData.venue}` : formData.location,
        googleMapUrl: formData.googleMapUrl,
        price: Number(formData.ticketTypes[0]?.price || 0),
        image: imageUrl,
        tickets: formData.ticketTypes.map(t => ({
          name: t.name,
          price: Number(t.price),
          capacity: Number(t.available || 0),
          description: t.description
        }))
      };
      
      await api.post('/events', eventData);
      
      alert('Event created successfully!');
      navigate('/admin/manage-events');
    } catch (error) {
      console.error('Error creating event:', error);
      alert(error.response?.data?.message || error.message || 'Failed to create event.');
    } finally {
      setIsLoading(false);
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2 uppercase">Create <span className="text-brand-orange">Masterpiece</span></h1>
          <p className="text-zinc-500 font-medium">Design an experience that will be remembered for a lifetime.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Concept & Vision */}
        <motion.section 
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-zinc-950 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-3xl relative overflow-hidden"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
              <FiInfo className="text-2xl" />
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Concept & Vision</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8 md:col-span-2">
              <div className="group">
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4 ml-2 group-focus-within:text-brand-orange transition-colors">Event Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 px-8 text-white placeholder:text-zinc-700 focus:outline-none focus:border-brand-orange/50 focus:ring-4 focus:ring-brand-orange/10 transition-all font-bold text-lg"
                  placeholder="e.g. Midnight Jazz Symphony"
                  required
                />
              </div>

              <div className="group">
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4 ml-2 group-focus-within:text-brand-orange transition-colors">Short Teaser</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 px-8 text-white placeholder:text-zinc-700 focus:outline-none focus:border-brand-orange/50 focus:ring-4 focus:ring-brand-orange/10 transition-all font-medium resize-none"
                  rows="2"
                  placeholder="One catchy sentence to grab attention..."
                  required
                ></textarea>
              </div>

              <div className="group">
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4 ml-2 group-focus-within:text-brand-orange transition-colors">Event Narrative</label>
                <textarea
                  name="fullDescription"
                  value={formData.fullDescription}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 px-8 text-white placeholder:text-zinc-700 focus:outline-none focus:border-brand-orange/50 focus:ring-4 focus:ring-brand-orange/10 transition-all font-medium"
                  rows="6"
                  placeholder="Describe the experience in detail..."
                  required
                ></textarea>
              </div>
            </div>

            <div className="group">
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4 ml-2 group-focus-within:text-brand-orange transition-colors">Category</label>
              <div className="relative">
                <FiTag className="absolute left-8 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 pl-16 pr-8 text-white focus:outline-none focus:border-brand-orange/50 focus:ring-4 focus:ring-brand-orange/10 transition-all appearance-none font-bold cursor-pointer"
                  required
                >
                  <option value="" className="bg-zinc-950">Select a genre</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-zinc-950">{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="group">
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4 ml-2 group-focus-within:text-brand-orange transition-colors">Total Attendance</label>
              <div className="relative">
                <FiUsers className="absolute left-8 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 pl-16 pr-8 text-white placeholder:text-zinc-700 focus:outline-none focus:border-brand-orange/50 focus:ring-4 focus:ring-brand-orange/10 transition-all font-bold"
                  placeholder="e.g. 500"
                  required
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Schedule */}
        <motion.section 
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-zinc-950 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-3xl"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <FiCalendar className="text-2xl" />
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Timeline</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group">
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4 ml-2 group-focus-within:text-blue-500 transition-colors">Date</label>
              <div className="relative">
                <FiCalendar className="absolute left-8 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 pl-16 pr-8 text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold"
                  required
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4 ml-2 group-focus-within:text-blue-500 transition-colors">Start Time</label>
              <div className="relative">
                <FiClock className="absolute left-8 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 pl-16 pr-8 text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold"
                  required
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4 ml-2 group-focus-within:text-blue-500 transition-colors">End Time</label>
              <div className="relative">
                <FiClock className="absolute left-8 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 pl-16 pr-8 text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold"
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Location */}
        <motion.section 
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-zinc-950 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-3xl"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <FiMapPin className="text-2xl" />
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Precise Coordinates</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group">
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4 ml-2 group-focus-within:text-emerald-500 transition-colors">Location Name</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 px-8 text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold"
                  placeholder="e.g. Royal Grand Ballroom"
                  required
                />
            </div>
            <div className="group">
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4 ml-2 group-focus-within:text-emerald-500 transition-colors">City</label>
                <div className="relative">
                  <FiMapPin className="absolute left-8 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                  <select
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 pl-16 pr-8 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all appearance-none font-bold cursor-pointer"
                    required
                  >
                    <option value="" className="bg-zinc-950">Select a city</option>
                    {cities.map((city) => (
                      <option key={city} value={city} className="bg-zinc-950">{city}</option>
                    ))}
                  </select>
                </div>
            </div>
            <div className="group md:col-span-2">
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4 ml-2 group-focus-within:text-emerald-500 transition-colors">Google Maps URL</label>
                <div className="relative">
                  <FiMapPin className="absolute left-8 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                  <input
                    type="url"
                    name="googleMapUrl"
                    value={formData.googleMapUrl}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 pl-16 pr-8 text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold"
                    placeholder="https://www.google.com/maps/embed?pb=..."
                  />
                </div>
                <p className="mt-2 text-[10px] text-zinc-600 font-medium ml-2">Tip: Use the "Embed a map" URL from Google Maps for best results.</p>
            </div>
          </div>
        </motion.section>

        {/* Visual Identity */}
        <motion.section 
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-zinc-950 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-3xl"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
              <FiUpload className="text-2xl" />
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Visual Identity</h2>
          </div>
          
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-[2rem] p-12 hover:border-brand-orange/50 transition-all cursor-pointer group relative overflow-hidden bg-white/[0.02]">
            {formData.imagePreview ? (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                  <p className="text-white font-black uppercase tracking-widest text-[10px]">Replace Media Asset</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-zinc-600 group-hover:text-brand-orange transition-colors">
                  <FiUpload className="text-3xl" />
                </div>
                <div className="text-center">
                  <p className="text-white font-black uppercase tracking-[0.2em] text-[10px] mb-2">Upload Core Artifact</p>
                  <p className="text-zinc-600 font-medium text-xs">High resolution assets (1920x1080) recommended</p>
                </div>
              </div>
            )}
            <input
              type="file"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept="image/*"
            />
          </div>
        </motion.section>

        {/* Tickets */}
        <motion.section 
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-zinc-950 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-3xl"
        >
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <FiTag className="text-2xl" />
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Elite Pass Tiers</h2>
            </div>
            <button
              type="button"
              onClick={addTicketType}
              className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all flex items-center gap-2"
            >
              <FiPlus /> New Tier
            </button>
          </div>
          
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {formData.ticketTypes.map((ticket, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative p-8 bg-black/40 border border-white/5 rounded-3xl"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">Pass Name</label>
                      <input
                        type="text"
                        value={ticket.name}
                        onChange={(e) => handleTicketChange(index, 'name', e.target.value)}
                        className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-4 px-6 text-white focus:outline-none focus:border-brand-orange/50 transition-all font-bold"
                        placeholder="e.g. Black Tier Diamond"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">Price (৳)</label>
                      <input
                        type="number"
                        value={ticket.price}
                        onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
                        className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-4 px-6 text-white focus:outline-none focus:border-brand-orange/50 transition-all font-bold"
                        placeholder="0"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">Quantity</label>
                      <input
                        type="number"
                        value={ticket.available}
                        onChange={(e) => handleTicketChange(index, 'available', e.target.value)}
                        className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-4 px-6 text-white focus:outline-none focus:border-brand-orange/50 transition-all font-bold"
                        placeholder="100"
                        required
                      />
                    </div>
                  </div>
                  
                  {formData.ticketTypes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTicketType(index)}
                      className="absolute -top-3 -right-3 w-10 h-10 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-red-500/20 shadow-xl shadow-red-500/10"
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Final Actions */}
        <div className="flex flex-col sm:flex-row gap-6 pt-10">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-3 group relative px-12 py-6 bg-brand-orange text-white rounded-[2rem] font-black flex items-center justify-center gap-4 overflow-hidden shadow-2xl shadow-brand-orange/20 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <FiPlus className="text-2xl" />
                <span className="uppercase tracking-[0.3em] text-sm">Initialize Exhibition</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/manage-events')}
            className="flex-1 px-12 py-6 bg-white/5 hover:bg-white/10 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm border border-white/10 transition-all"
          >
            Abort
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;