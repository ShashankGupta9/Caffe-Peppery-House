"use client";
import { useState, useEffect } from "react";
import { ShoppingCart, Star, Plus, Minus, X } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  is_available: boolean;
  image_url?: string;
};

type CartItem = MenuItem & { quantity: number };

const SAMPLE_MENU: MenuItem[] = [
  // Hot Coffee
  { id: "hc1", name: "Classic Espresso", description: "Rich, bold single shot", price: 220, category: "Hot Coffee", is_available: true },
  { id: "hc2", name: "Caramel Latte", description: "Espresso + steamed milk + caramel drizzle", price: 280, category: "Hot Coffee", is_available: true },
  { id: "hc3", name: "Cappuccino", description: "Espresso + thick foam + cinnamon", price: 260, category: "Hot Coffee", is_available: true },
  { id: "hc4", name: "Filter Coffee", description: "South Indian decoction + milk", price: 200, category: "Hot Coffee", is_available: true },
  { id: "hc5", name: "Mocha", description: "Espresso + chocolate + steamed milk", price: 290, category: "Hot Coffee", is_available: true },
  { id: "hc6", name: "Flat White", description: "Double shot + velvety micro-foam", price: 270, category: "Hot Coffee", is_available: true },
  // Cold Coffee
  { id: "cc1", name: "Cold Brew", description: "12-hour steeped, smooth & strong", price: 280, category: "Cold Coffee", is_available: true },
  { id: "cc2", name: "Iced Caramel Latte", description: "Espresso + ice + caramel milk", price: 300, category: "Cold Coffee", is_available: true },
  { id: "cc3", name: "Frappé", description: "Blended iced coffee + cream", price: 320, category: "Cold Coffee", is_available: true },
  { id: "cc4", name: "Vietnamese Iced Coffee", description: "Strong drip + condensed milk", price: 260, category: "Cold Coffee", is_available: true },
  { id: "cc5", name: "Mint Cold Brew", description: "Cold brew + fresh mint + sugar", price: 290, category: "Cold Coffee", is_available: true },
  { id: "cc6", name: "Dalgona Coffee", description: "Whipped coffee over cold milk", price: 310, category: "Cold Coffee", is_available: true },
  // Snacks
  { id: "sn1", name: "Bruschetta", description: "Toasted bread + tomato + basil", price: 220, category: "Snacks", is_available: true },
  { id: "sn2", name: "Chicken Sandwich", description: "Grilled chicken + lettuce + sauce", price: 280, category: "Snacks", is_available: true },
  { id: "sn3", name: "Veg Panini", description: "Grilled panini + cheese + veggies", price: 250, category: "Snacks", is_available: true },
  { id: "sn4", name: "Fries & Dip", description: "Crispy golden fries + aioli", price: 200, category: "Snacks", is_available: true },
  { id: "sn5", name: "Samosa Chaat", description: "Crispy samosa + chutneys + sev", price: 210, category: "Snacks", is_available: true },
  { id: "sn6", name: "Club Sandwich", description: "Triple-decker + chips on the side", price: 290, category: "Snacks", is_available: true },
  // Desserts
  { id: "ds1", name: "Chocolate Brownie", description: "Warm fudge brownie + vanilla scoop", price: 260, category: "Desserts", is_available: true },
  { id: "ds2", name: "Cheesecake Slice", description: "New York style + berry coulis", price: 300, category: "Desserts", is_available: true },
  { id: "ds3", name: "Tiramisu", description: "Classic Italian + espresso layers", price: 320, category: "Desserts", is_available: true },
  { id: "ds4", name: "Belgian Waffle", description: "Crispy waffle + cream + caramel", price: 290, category: "Desserts", is_available: true },
  { id: "ds5", name: "Gulab Jamun", description: "Soft milk dumplings + rose syrup", price: 200, category: "Desserts", is_available: true },
  { id: "ds6", name: "Crème Brûlée", description: "Silky custard + caramelised sugar", price: 340, category: "Desserts", is_available: true },
];

const CATEGORIES = ["All", "Hot Coffee", "Cold Coffee", "Snacks", "Desserts"];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const filtered = activeCategory === "All"
    ? SAMPLE_MENU
    : SAMPLE_MENU.filter((i) => i.category === activeCategory);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const gst = Math.round(cartTotal * 0.05);
  const deliveryFee = cartTotal >= 299 ? 0 : 30;
  const grandTotal = cartTotal + gst + deliveryFee;

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const exists = prev.find((c) => c.id === item.id);
      if (exists) return prev.map((c) => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { ...item, quantity: 1 }];
    });
    toast.success(`${item.name} added to cart`);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const item = prev.find((c) => c.id === id);
      if (!item) return prev;
      if (item.quantity === 1) return prev.filter((c) => c.id !== id);
      return prev.map((c) => c.id === id ? { ...c, quantity: c.quantity - 1 } : c);
    });
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-cream/95 backdrop-blur-md border-b border-caramel/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-display text-xl text-raisin font-bold">
            Peppery <span className="text-caramel">House</span>
          </Link>
          <button
            onClick={() => setCartOpen(true)}
            className="relative btn-primary flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-raisin text-cream text-xs rounded-full flex items-center justify-center font-medium">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="section-title mb-2">Our Menu</h1>
        <p className="font-body text-espresso mb-8">Fresh daily · ₹200–₹400 · 5% GST inclusive</p>

        {/* Category filter */}
        <div className="flex gap-3 overflow-x-auto pb-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-body font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-caramel text-cream"
                  : "bg-white/60 text-espresso border border-caramel/20 hover:border-caramel/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <div key={item.id} className="card flex flex-col justify-between gap-3 hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-display text-lg text-raisin font-semibold">{item.name}</h3>
                  <span className="badge ml-2 shrink-0">{item.category}</span>
                </div>
                <p className="font-body text-sm text-espresso leading-relaxed">{item.description}</p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="font-body font-semibold text-raisin text-lg">₹{item.price}</span>
                <button
                  onClick={() => addToCart(item)}
                  disabled={!item.is_available}
                  className="btn-primary !py-2 !px-4 text-sm flex items-center gap-1 disabled:opacity-40"
                >
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-raisin/40" onClick={() => setCartOpen(false)} />
          <div className="w-full max-w-sm bg-cream shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-caramel/10">
              <h2 className="font-display text-xl text-raisin font-semibold">Your Cart</h2>
              <button onClick={() => setCartOpen(false)} className="text-espresso hover:text-caramel transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {cart.length === 0 ? (
                <p className="text-center text-espresso font-body py-10">Your cart is empty</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="font-body font-medium text-raisin text-sm">{item.name}</p>
                      <p className="font-body text-xs text-espresso">₹{item.price} each</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => removeFromCart(item.id)} className="w-6 h-6 rounded-full border border-caramel/30 flex items-center justify-center text-caramel hover:bg-caramel hover:text-cream transition-colors">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-body font-medium text-raisin w-4 text-center">{item.quantity}</span>
                      <button onClick={() => addToCart(item)} className="w-6 h-6 rounded-full border border-caramel/30 flex items-center justify-center text-caramel hover:bg-caramel hover:text-cream transition-colors">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="font-body font-semibold text-raisin text-sm w-16 text-right">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="border-t border-caramel/10 px-6 py-4 space-y-2">
                <div className="flex justify-between font-body text-sm text-espresso">
                  <span>Subtotal</span><span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between font-body text-sm text-espresso">
                  <span>GST (5%)</span><span>₹{gst}</span>
                </div>
                <div className="flex justify-between font-body text-sm text-espresso">
                  <span>Delivery</span>
                  <span>{deliveryFee === 0 ? <span className="text-green-600">Free</span> : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between font-body font-semibold text-raisin text-base pt-2 border-t border-caramel/10">
                  <span>Total</span><span>₹{grandTotal}</span>
                </div>
                <Link
                  href="/customer/orders"
                  className="btn-primary w-full text-center block mt-3"
                  onClick={() => setCartOpen(false)}
                >
                  Proceed to checkout
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
