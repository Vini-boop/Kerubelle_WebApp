import { RouterProvider } from 'react-router-dom';
import { CartProvider } from './providers/CartProvider';
import { WishlistProvider } from './providers/WishlistProvider';
import { AuthProvider } from './providers/AuthProvider';
import { StoreProvider } from './providers/StoreProvider';
import { NotificationProvider } from './providers/NotificationProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { router } from './routes';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StoreProvider>
          <NotificationProvider>
            <CartProvider>
              <WishlistProvider>
                <RouterProvider router={router} />
              </WishlistProvider>
            </CartProvider>
          </NotificationProvider>
        </StoreProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}