import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Menu, X } from 'lucide-react';
// import { Lock, BookHeart, Image, MessageCircle } from 'lucide-react'; // สำหรับหน้าเพิ่มเติม

type NavLink = { path: string; label: string; icon?: React.ComponentType<{ className?: string }> };

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: NavLink[] = [
    // { path: '/', label: 'หน้าแรก' },
    // { path: '/our-story', label: 'เรื่องราวของเรา', icon: BookHeart },
    // { path: '/memories', label: 'ความทรงจำ', icon: Image },
    // { path: '/love-letters', label: 'จดหมายรัก', icon: MessageCircle },
    // { path: '/private', label: 'พื้นที่ลับ', icon: Lock },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-lg shadow-lg'
          : 'bg-transparent'
      }`}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/">
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
              >
                <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
              </motion.div>
              <span className="text-xl font-semibold bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
                For My Love
              </span>
            </motion.div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link, index) => {
              const isActive = location.pathname === link.path;
              const Icon = link.icon;

              return (
                <Link key={link.path} to={link.path}>
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'text-rose-600'
                        : 'text-gray-700 hover:text-rose-600'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {Icon && <Icon className="w-4 h-4" />}
                      {link.label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-500 to-pink-600"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-rose-100"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-rose-600" />
            ) : (
              <Menu className="w-6 h-6 text-rose-600" />
            )}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-lg border-t border-rose-100"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navLinks.map((link, index) => {
                const isActive = location.pathname === link.path;
                const Icon = link.icon;

                return (
                  <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-rose-100 text-rose-600'
                          : 'hover:bg-rose-50 text-gray-700'
                      }`}
                    >
                      {Icon && <Icon className="w-4 h-4" />}
                      <span>{link.label}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
