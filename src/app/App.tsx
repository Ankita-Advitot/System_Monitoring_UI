import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { Toaster } from '@/components/ui/sonner';
import { SystemStreamManager } from './components/SystemStreamManager';

export const App = () => {
  return (
    <BrowserRouter>
      <SystemStreamManager />
      <AppRoutes />
      <Toaster position="top-right" expand={true} richColors={true} duration={10000} visibleToasts={1} />
    </BrowserRouter>
  );
};

export default App;
