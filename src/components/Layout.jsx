import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { useAuth } from '../hooks/useAuth';
import { 
  LayoutDashboard, 
  Target, 
  BookOpen, 
  DollarSign, 
  LogOut, 
  Moon, 
  Sun,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const Layout = () => {
  const { user, theme, toggleTheme } = useStore();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/goals', icon: Target, label: 'Goals' },
    { to: '/recaps', icon: BookOpen, label: 'Recaps' },
    { to: '/finance', icon: DollarSign, label: 'Finance' },
  ];

  const NavItem = ({ to, icon: Icon, label, mobile = false }) => (
    <NavLink
      to={to}
      onClick={() => mobile && setMobileMenuOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
          mobile ? 'w-full' : ''
        } ${
          isActive
            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`
      }
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 min-h-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  Life Tracker
                </h1>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold">
                {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.displayName || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={toggleTheme}
                className="flex-1 btn btn-secondary h-10"
                title="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={handleSignOut}
                className="flex-1 btn btn-secondary h-10 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              Life Tracker
            </h1>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-900 dark:text-white" />
            ) : (
              <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="fixed top-16 right-0 bottom-0 w-64 bg-white dark:bg-gray-800 shadow-xl animate-slide-down"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="p-4 space-y-2">
              {navItems.map((item) => (
                <NavItem key={item.to} {...item} mobile />
              ))}
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold">
                  {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user?.displayName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={toggleTheme}
                  className="flex-1 btn btn-secondary h-10"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-4 h-4 mr-2" />
                      Light
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 mr-2" />
                      Dark
                    </>
                  )}
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex-1 btn btn-secondary h-10 text-red-600 dark:text-red-400"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="px-4 py-6 lg:px-8 mt-16 lg:mt-0">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pb-safe">
        <div className="grid grid-cols-4 gap-1 p-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 dark:text-gray-400'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
