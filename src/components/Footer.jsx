import React from 'react';

const Footer = () => {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-col">
          <h4>Kisállat webshop</h4>
          <p>Minőségi állateledel és kiegészítők — gyors kiszállítás.</p>
        </div>
        <div className="footer-col">
          <h4>Kapcsolat</h4>
          <p>info@kisallatwebshop.hu<br/>+36 30 123 4567</p>
        </div>
        <div className="footer-col">
          <h4>Gyors linkek</h4>
          <p><a href="/">Kezdőlap</a><br/><a href="/about">Rólunk</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;