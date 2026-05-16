// Format currency to Kenyan Shillings
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Format date
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-KE', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Calculate nights between dates
export const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays || 1;
};

// Validate Kenyan phone number
export const validateKenyanPhone = (phone) => {
  if (!phone || !phone.trim()) {
    return {
      valid: false,
      formatted: '',
      error: 'Phone number is required'
    };
  }

  const cleaned = phone.replace(/[\s-+]/g, '');

  // Format to 2547XXXXXXXX
  let formatted = cleaned;
  if (formatted.startsWith('0')) {
    formatted = '254' + formatted.substring(1);
  }
  if (formatted.startsWith('7') || formatted.startsWith('1')) {
    formatted = '254' + formatted;
  }

  const regex = /^254(7|1)\d{8}$/;
  
  if (!regex.test(formatted)) {
    return {
      valid: false,
      formatted: formatted,
      original: phone,
      error: 'Invalid phone format. Use 2547XXXXXXXX, 07XXXXXXXX, or +2547XXXXXXXX'
    };
  }

  return {
    valid: true,
    formatted: formatted,
    original: phone
  };
};

// Generate booking reference
export const generateBookingRef = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `HB-${timestamp}-${random}`;
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Class name merger (for tailwind)
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};