import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ThemeProvider } from './context/ThemeContext';

// Fő oldalak
import Home from './components/Home';
import Dog from './components/Dog';
import Cat from './components/Cat';
import Reptile from './components/Reptile';
import Rodent from './components/Rodent';
import Bird from './components/Bird';
import Fish from './components/Fish';

// Felhasználói funkciók
import Auth from './components/Auth';
import ForgotPassword from './components/ForgotPassword';
import Cart from './components/Cart';
import Orders from './components/Orders';
import MyCoupons from './components/MyCoupons';
import Favorites from './components/Favorites';

// Egyéb oldalak
import About from './components/About';
import Search from './components/Search';
import Gallery from './components/Gallery';
import Wall from './components/Wall';
import Tips from './components/Tips';

// Termék alkategóriák - összevonva
import ProductCategory from './components/ProductCategory';

// Layout komponensek
import Header from './components/Header';
import Footer from './components/Footer';

// Admin felület
import Admin from './components/Admin';
import AdminProducts from './components/AdminProducts';
import AdminUsers from './components/AdminUsers';
import AdminCoupons from './components/AdminCoupons';

function App() {
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <CartProvider>
            <Router>
              <Header />
              <button
                onClick={scrollToTop}
                id="felfele-gomb"
                className="scroll-top"
                aria-label="Oldal tetejére"
                title="Feljebb"
                style={{
                  display: showScrollButton ? 'block' : 'none',
                  fontSize: '150%'
                }}
              >
                👆
              </button>
              <Routes>
                <Route path="/" element={
                  <>
                    <p className="kezdolapu">Üdvözlünk a Kisállat Webshop webáruházban!</p>
                    <Home />
                  </>
                } />
                <Route path="/dog" element={<Dog />} />
                <Route path="/cat" element={<Cat />} />
                <Route path="/reptile" element={<Reptile />} />
                <Route path="/rodent" element={<Rodent />} />
                <Route path="/bird" element={<Bird />} />
                <Route path="/fish" element={<Fish />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/register" element={<Auth />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/about" element={<About />} />
                <Route path="/search" element={<Search />} />
                <Route path="/tips" element={<Tips />} />
                {/* Kutya alkategóriák */}
            <Route path="/dogfood" element={<ProductCategory type="dogfood" />} />
            <Route path="/leash" element={<ProductCategory type="leash" />} />
            <Route path="/collar" element={<ProductCategory type="collar" />} />
            <Route path="/flea" element={<ProductCategory type="flea" />} />
            <Route path="/dogbowl" element={<ProductCategory type="dogbowl" />} />
            <Route path="/dogharness" element={<ProductCategory type="dogharness" />} />
            {/* Macska alkategóriák */}
            <Route path="/catfood" element={<ProductCategory type="catfood" />} />
            <Route path="/cattoy" element={<ProductCategory type="cattoy" />} />
            {/* Rágcsáló alkategóriák */}
            <Route path="/rodentfood" element={<ProductCategory type="rodentfood" />} />
            <Route path="/rodentcage" element={<ProductCategory type="rodentcage" />} />
            {/* Hüllő alkategóriák */}
            <Route path="/reptilefood" element={<ProductCategory type="reptilefood" />} />
            <Route path="/terrarium" element={<ProductCategory type="terrarium" />} />
            {/* Madár alkategóriák */}
            <Route path="/birdfood" element={<ProductCategory type="birdfood" />} />
            <Route path="/birdcage" element={<ProductCategory type="birdcage" />} />
            {/* Hal alkategóriák */}
            <Route path="/fishfood" element={<ProductCategory type="fishfood" />} />
            <Route path="/aquarium" element={<ProductCategory type="aquarium" />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/coupons" element={<MyCoupons />} />
            <Route path="/wall" element={<Wall />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/coupons" element={<AdminCoupons />} />
              </Routes>
              <Footer />
            </Router>
          </CartProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
