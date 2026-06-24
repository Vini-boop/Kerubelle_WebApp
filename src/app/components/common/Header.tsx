import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, User, Menu, X, Moon, Sun } from 'lucide-react';
import { useCart } from '../../providers/CartProvider';
import { useWishlist } from '../../providers/WishlistProvider';
import { useAuth } from '../../providers/AuthProvider';
import { useTheme } from '../../providers/ThemeProvider';
import { useState, useRef, useEffect } from 'react';

export function Header() {
  const { getCartCount } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    logout();
  };

  // Close account dropdown when clicking outside or pressing Escape
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (accountOpen && accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setAccountOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [accountOpen]);

  // Close on route change
  useEffect(() => {
    setAccountOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
    { path: '/new', label: 'New Arrivals' },
    { path: '/limited', label: 'Limited Edition' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-[#F8C8DC]/20 dark:border-gray-700/50 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
              style={{ background: 'linear-gradient(135deg, #F8C8DC, #D4A5B8)' }}>
              <img src="/logo.png" alt="KeruBelle" className="w-6 h-6 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
            </div>
            <div className="flex flex-col">
              <span
                className="text-xl font-bold bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] bg-clip-text text-transparent"
                style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontStyle: 'italic' }}
              >
                KeruBelle
              </span>
              <span className="text-[10px] text-[#D4A5B8] -mt-1">Luxury Handbags</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors ${location.pathname === link.path
                  ? 'text-[#F8C8DC]'
                  : 'text-gray-600 dark:text-gray-300 hover:text-[#F8C8DC] dark:hover:text-[#F8C8DC]'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="p-2 hover:bg-[#F8C8DC]/10 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              {theme === 'dark'
                ? <Sun className="w-5 h-5 text-yellow-400" />
                : <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              }
            </button>

            <Link
              to="/wishlist"
              className="relative p-2 hover:bg-[#F8C8DC]/10 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <Heart className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F8C8DC] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative p-2 hover:bg-[#F8C8DC]/10 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F8C8DC] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {isLoading ? (
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-8 h-8 border-2 border-[#F8C8DC] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : user ? (
              <div ref={accountRef} className="hidden md:flex items-center relative">
                <button
                  onClick={() => setAccountOpen(o => !o)}
                  className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-[#F8C8DC]/10 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F8C8DC] to-[#D4A5B8] flex items-center justify-center text-white font-semibold text-sm">
                    {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-200">{user.name || 'User'}</span>
                </button>
                {accountOpen && (
                  <div className="absolute right-0 mt-12 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-[#F8C8DC]/10 dark:border-gray-700">
                    <Link to="/dashboard" onClick={() => setAccountOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">My Account</Link>
                    <button onClick={() => { setAccountOpen(false); handleLogout(); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-[#F8C8DC]/10 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#F8C8DC]/20 dark:border-gray-700/50">
            <nav className="flex flex-col space-y-3">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg transition-colors ${location.pathname === link.path
                    ? 'bg-[#F8C8DC]/20 text-[#F8C8DC]'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-[#F8C8DC]/10 dark:hover:bg-gray-700'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              {/* Theme toggle in mobile menu */}
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-[#F8C8DC]/10 dark:hover:bg-gray-700 transition-colors"
              >
                {theme === 'dark'
                  ? <><Sun className="w-4 h-4 text-yellow-400" /><span>Light Mode</span></>
                  : <><Moon className="w-4 h-4" /><span>Dark Mode</span></>
                }
              </button>
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <div className="w-6 h-6 border-2 border-[#F8C8DC] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : user ? (
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-[#F8C8DC]/10 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span>My Account</span>
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-[#F8C8DC]/10 dark:hover:bg-gray-700 transition-colors text-left"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white text-center font-medium hover:opacity-90 transition-opacity"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] text-white text-center font-medium hover:opacity-90 transition-opacity"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}