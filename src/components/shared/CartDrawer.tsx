'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'سيروم فيتامين سي للبشرة',
    price: 129,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=200&fit=crop',
    category: 'بشرة',
  },
  {
    id: 'prod-2',
    name: 'زيت أرغان مغربي أصلي',
    price: 89,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=200&h=200&fit=crop',
    category: 'شعر',
  },
  {
    id: 'prod-3',
    name: 'مرطب شفاه بلون طبيعي',
    price: 45,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=200&h=200&fit=crop',
    category: 'تجميل',
  },
  {
    id: 'prod-4',
    name: 'كريم واقي شمس SPF 50',
    price: 99,
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&h=200&fit=crop',
    category: 'بشرة',
  },
  {
    id: 'prod-5',
    name: 'ماسكارا تطويل الرموش',
    price: 75,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200&h=200&fit=crop',
    category: 'تجميل',
  },
  {
    id: 'prod-6',
    name: 'شامبو كيراتين للشعر',
    price: 65,
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=200&h=200&fit=crop',
    category: 'شعر',
  },
  {
    id: 'prod-7',
    name: 'عطر ربيعي ناعم',
    price: 199,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=200&h=200&fit=crop',
    category: 'عطور',
  },
  {
    id: 'prod-8',
    name: 'قناع الوجه بالطين الأزفري',
    price: 55,
    image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=200&h=200&fit=crop',
    category: 'بشرة',
  },
];

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Drawer panel - slides from right */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] glass-strong z-50 shadow-[var(--shadow-xl)] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-primary/15 flex items-center justify-center">
                  <ShoppingBag className="h-4.5 w-4.5 text-primary" />
                </div>
                <h2 className="text-lg font-heading font-bold text-text-main">
                  سلة التسوق
                </h2>
                {cartItems.length > 0 && (
                  <span className="bg-gradient-primary text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    {cartItems.length}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full glass-subtle flex items-center justify-center cursor-pointer hover:bg-primary/10 transition-colors"
              >
                <X className="h-4 w-4 text-text-main" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-5">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-primary/10 flex items-center justify-center mb-4">
                    <ShoppingBag className="h-8 w-8 text-primary/40" />
                  </div>
                  <p className="text-sm text-text-subtle mb-1">سلة التسوق فارغة</p>
                  <p className="text-xs text-text-subtle/60">
                    تصفحي المنتجات وأضيفي ما يعجبك
                  </p>

                  {/* Quick add sample products */}
                  <div className="mt-6 w-full">
                    <p className="text-xs font-medium text-text-subtle mb-3 text-right">
                      منتجات مقترحة
                    </p>
                    <div className="space-y-2">
                      {PRODUCTS.slice(0, 4).map((product) => (
                        <motion.button
                          key={product.id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => addToCart(product)}
                          className="w-full flex items-center gap-3 glass-subtle rounded-xl p-3 text-right cursor-pointer hover:bg-primary/5 transition-colors"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-text-main truncate">
                              {product.name}
                            </p>
                            <p className="text-[11px] text-primary font-bold mt-0.5">
                              {product.price} ر.س
                            </p>
                          </div>
                          <Plus className="h-4 w-4 text-primary flex-shrink-0" />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="glass-subtle rounded-xl p-4"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-main truncate mb-1">
                            {item.name}
                          </p>
                          <p className="text-xs text-primary font-bold">
                            {item.price} ر.س
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-text-subtle/40 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                        <span className="text-xs text-text-subtle">
                          المجموع: {item.price * item.quantity} ر.س
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-7 h-7 rounded-lg glass-subtle flex items-center justify-center text-text-subtle hover:text-primary cursor-pointer transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-7 text-center text-sm font-bold text-text-main">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-7 h-7 rounded-lg bg-gradient-primary/15 flex items-center justify-center text-primary hover:bg-gradient-primary hover:text-white cursor-pointer transition-all"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer with total and checkout */}
            {cartItems.length > 0 && (
              <div className="p-5 border-t border-border/50 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-subtle">المجموع الكلي</span>
                  <span className="text-xl font-heading font-bold text-gradient">
                    {totalPrice} ر.س
                  </span>
                </div>
                <button className="w-full btn-primary text-sm py-3 cursor-pointer">
                  إتمام الشراء
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
