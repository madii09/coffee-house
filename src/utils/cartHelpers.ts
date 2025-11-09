
import toast from 'react-hot-toast';

export const showTopNotification = (msg: string, type: 'success' | 'error' = 'success') => {
  if (type === 'success') {
    toast.success(msg, { duration: 3000, position: 'top-right' });
  } else {
    toast.error(msg, { duration: 3000, position: 'top-right' });
  }
};
