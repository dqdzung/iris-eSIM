import { GlobalDataContext } from '@/contexts/GlobalDataContext';
import { useContext } from 'react';

export const useGlobalDataContext = () => {
  const context = useContext(GlobalDataContext);
  if (!context) {
    throw new Error('useGlobalDataContext must be used within a GlobalDataProvider');
  }
  return context;
};
