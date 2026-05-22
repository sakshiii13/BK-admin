/**
 * Format date to readable string
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format currency
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Format number with commas
 */
export const formatNumber = (num) => {
  return num.toLocaleString();
};

/**
 * Truncate text
 */
export const truncateText = (text, length = 50) => {
  return text?.length > length ? text.substring(0, length) + '...' : text;
};
