import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 2000,
          style: {
            maxWidth: '350px',
          },
        }}
      />
    </AuthProvider>
  );
}