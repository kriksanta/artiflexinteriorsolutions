/**
 * ARTIFLEX DATA STORE
 * Dynamic Photo & Content CMS Engine with LocalStorage Persistence
 */

(function (window) {
  'use strict';

  const STORAGE_KEY_GALLERY = 'artiflex_gallery_photos_v1';
  const STORAGE_KEY_SETTINGS = 'artiflex_site_settings_v1';

  // Curated High-Resolution Default Photos
  const DEFAULT_PHOTOS = [
    {
      id: 'p1',
      title: 'Minimalist Pavilion Dining',
      category: 'interiors',
      categoryLabel: 'Luxury Interiors',
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=85',
      desc: 'Fluted aluminium pocket doors, seamless open-concept living, and warm microcement flooring.',
      location: 'Indiranagar, Bangalore',
      span: 'span-8'
    },
    {
      id: 'p2',
      title: 'Illuminated Acrylic Logo',
      category: 'signage',
      categoryLabel: '3D Signage',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=85',
      desc: 'Precision laser-cut 3D architectural signage with waterproof dual-temperature LED halo illumination.',
      location: 'Whitefield, Bangalore',
      span: 'span-4'
    },
    {
      id: 'p3',
      title: 'Acoustic Slimline Glass',
      category: 'aluminium',
      categoryLabel: 'Aluminium & UPVC',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85',
      desc: 'Black powder-coated aluminium frames with sound-dampening acoustic tempered glass partitions.',
      location: 'HSR Layout, Bangalore',
      span: 'span-4'
    },
    {
      id: 'p4',
      title: 'Floating Cantilever Tread',
      category: 'fabrication',
      categoryLabel: 'Steel Fabrication',
      image: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1400&q=85',
      desc: 'Structural SS 304 staircase with concealed wall anchoring and natural smoked teak treads.',
      location: 'Koramangala, Bangalore',
      span: 'span-8'
    },
    {
      id: 'p5',
      title: 'Recessed Cove Lighting',
      category: 'finishes',
      categoryLabel: 'Ceilings & Finishes',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85',
      desc: 'Seamless gypsum drop ceiling with warm indirect cove LEDs and textured lime-wash finish.',
      location: 'Jayanagar, Bangalore',
      span: 'span-6'
    },
    {
      id: 'p6',
      title: 'Herringbone Smoked Oak',
      category: 'interiors',
      categoryLabel: 'Flooring & Interiors',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85',
      desc: 'Hand-finished engineered oak flooring arranged in traditional Scandinavian herringbone weave.',
      location: 'Sadashivanagar, Bangalore',
      span: 'span-6'
    },
    {
      id: 'p7',
      title: 'Monolithic Quartz Kitchen',
      category: 'aluminium',
      categoryLabel: 'Aluminium Modular',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85',
      desc: 'Full-waterproof modular aluminium carcass paired with Calacatta quartz waterfall counters.',
      location: 'Hebbal, Bangalore',
      span: 'span-6'
    },
    {
      id: 'p8',
      title: 'Modern Facade Metalwork',
      category: 'fabrication',
      categoryLabel: 'Steel Fabrication',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85',
      desc: 'Laser-cut exterior decorative aluminium screening and custom cantilevered entryway canopy.',
      location: 'Lavelle Road, Bangalore',
      span: 'span-6'
    }
  ];

  const DEFAULT_SETTINGS = {
    heroHome: 'assets/home-interior.jpg',
    heroSignage: 'assets/signage-night.jpg',
    beforeImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=1800&q=85',
    afterImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85',
    facebook: 'https://www.facebook.com',
    instagram: 'https://www.instagram.com/artiflex.interiors',
    youtube: 'https://www.youtube.com/@artiflexsolutions',
    whatsapp: 'https://wa.me/917012067527',
    phone: '+91 70120 67527',
    address: 'No. 32, Shop No. 2, Near Anganwadi Kendra, Kanakapura Main Road, K. Channasandra, Horamavu Post, Bengaluru, Karnataka 560113, India',
    email: 'hello@artilex.com'
  };

  const ArtiflexStore = {
    // Get all photos
    getPhotos: function () {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_GALLERY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        }
      } catch (e) {
        console.error('Error reading Artiflex photo store:', e);
      }
      return DEFAULT_PHOTOS;
    },

    // Save full list of photos
    savePhotos: function (photos) {
      try {
        localStorage.setItem(STORAGE_KEY_GALLERY, JSON.stringify(photos));
        return true;
      } catch (e) {
        console.error('Error saving Artiflex photo store:', e);
        return false;
      }
    },

    // Add a new photo
    addPhoto: function (photoData) {
      const photos = this.getPhotos();
      const newPhoto = {
        id: 'p_' + Date.now(),
        title: photoData.title || 'Untitled Project',
        category: photoData.category || 'interiors',
        categoryLabel: photoData.categoryLabel || this.getCategoryLabel(photoData.category),
        image: photoData.image,
        desc: photoData.desc || '',
        location: photoData.location || 'Bangalore, India',
        span: photoData.span || 'span-6'
      };
      photos.unshift(newPhoto);
      if (!this.savePhotos(photos)) throw new Error('Gallery storage is full. Try smaller photos.');
      return newPhoto;
    },

    // Delete a photo by ID
    deletePhoto: function (photoId) {
      let photos = this.getPhotos();
      photos = photos.filter(p => p.id !== photoId);
      this.savePhotos(photos);
      return photos;
    },

    // Update an existing photo
    updatePhoto: function (photoId, updatedFields) {
      const photos = this.getPhotos();
      const index = photos.findIndex(p => p.id === photoId);
      if (index !== -1) {
        photos[index] = Object.assign({}, photos[index], updatedFields);
        this.savePhotos(photos);
        return photos[index];
      }
      return null;
    },

    // Reset to defaults
    resetPhotos: function () {
      localStorage.removeItem(STORAGE_KEY_GALLERY);
      return DEFAULT_PHOTOS;
    },

    getSettings: function () {
      try { return Object.assign({}, DEFAULT_SETTINGS, JSON.parse(localStorage.getItem(STORAGE_KEY_SETTINGS) || '{}')); }
      catch (e) { return Object.assign({}, DEFAULT_SETTINGS); }
    },
    saveSettings: function (settings) {
      try { localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(Object.assign(this.getSettings(), settings))); return true; }
      catch (e) { return false; }
    },
    getDefaultSettings: function () { return Object.assign({}, DEFAULT_SETTINGS); },

    // Category label helper
    getCategoryLabel: function (cat) {
      switch (cat) {
        case 'signage': return '3D Signage';
        case 'interiors': return 'Luxury Interiors';
        case 'aluminium': return 'Aluminium & UPVC';
        case 'fabrication': return 'Steel Fabrication';
        case 'finishes': return 'Ceilings & Finishes';
        default: return 'Architectural Work';
      }
    }
  };

  window.ArtiflexStore = ArtiflexStore;
})(window);
