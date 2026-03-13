import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

const formatDate = (dateString) =>
  formatDistanceToNow(new Date(dateString), {
    addSuffix: true,
    locale: id,
  });

const truncateText = (text, maxLength = 150) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength).trim()}...`;
};

export { formatDate, truncateText };
