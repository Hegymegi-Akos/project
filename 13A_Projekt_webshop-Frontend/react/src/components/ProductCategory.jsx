import React from 'react';
import { useParams } from 'react-router-dom';
import ProductList from './ProductList';

// Összes alkategória konfigurációja egy helyen
const categoryConfig = {
  // Kutya alkategóriák
  dogfood: { title: 'Kutya Tápok', category: 'kutya', subcategory: 'tap' },
  leash: { title: 'Kutyapórázak', category: 'kutya', subcategory: 'poraz' },
  collar: { title: 'Kutya Nyakörvek', category: 'kutya', subcategory: 'nyakorv' },
  flea: { title: 'Bolhairtó Termékek', category: 'kutya', subcategory: 'bolha' },
  dogbowl: { title: 'Kutya Tálak', category: 'kutya', subcategory: 'tal' },
  dogharness: { title: 'Kutya Hámok', category: 'kutya', subcategory: 'ham' },
  
  // Macska alkategóriák
  catfood: { title: 'Macska Tápok', category: 'macska', subcategory: 'tapm' },
  cattoy: { title: 'Macska Játékok', category: 'macska', subcategory: 'jatek' },
  
  // Rágcsáló alkategóriák
  rodentfood: { title: 'Rágcsáló Tápok', category: 'ragcsalo', subcategory: 'tap' },
  rodentcage: { title: 'Rágcsáló Ketrecek', category: 'ragcsalo', subcategory: 'ketrec' },
  
  // Hüllő alkategóriák
  reptilefood: { title: 'Hüllő Tápok', category: 'hullo', subcategory: 'tap' },
  terrarium: { title: 'Terráriumok', category: 'hullo', subcategory: 'terrarium' },
  
  // Madár alkategóriák
  birdfood: { title: 'Madár Tápok', category: 'madar', subcategory: 'tap' },
  birdcage: { title: 'Madár Ketrecek', category: 'madar', subcategory: 'ketrec' },
  
  // Hal alkategóriák
  fishfood: { title: 'Hal Tápok', category: 'hal', subcategory: 'tap' },
  aquarium: { title: 'Akváriumok', category: 'hal', subcategory: 'akvarium' },
};

// Dinamikus komponens a kategóriákhoz
const ProductCategory = ({ type }) => {
  const config = categoryConfig[type];
  
  if (!config) {
    return <div className="container"><h2>Kategória nem található</h2></div>;
  }
  
  return <ProductList title={config.title} category={config.category} subcategory={config.subcategory} />;
};

export default ProductCategory;

// Export a konfig is, ha máshol kellene
export { categoryConfig };
