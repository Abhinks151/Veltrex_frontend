import { BrowserRouter } from 'react-router-dom';
import IndexRoutes from './routes/IndexRoutes';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import type { RootState } from './app/store/store';

const App = () => {
  const { isInitialized } = useSelector((state: RootState) => state.auth);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <div>
        <BrowserRouter>
          <Toaster position="top-right" reverseOrder={false} />
          <IndexRoutes />
        </BrowserRouter>
      </div>
    </>
  );
};

export default App;

// test
