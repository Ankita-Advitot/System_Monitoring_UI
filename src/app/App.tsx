import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { Toaster } from '@/components/ui/sonner';
import { SystemStreamManager } from './components/SystemStreamManager';

export const App = () => {
  return (
    <BrowserRouter>
      <SystemStreamManager />
      <AppRoutes />
      <Toaster position="bottom-right" expand={true} gap={12} offset={20} richColors={true} duration={10000} visibleToasts={9} />
    </BrowserRouter>
  );
};

export default App;
