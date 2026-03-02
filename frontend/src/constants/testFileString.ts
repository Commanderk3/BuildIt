const testFile = {
  "/App.tsx": `
    import { useEffect } from "react";
    
    export default function App() {
      useEffect(() => {

        document.addEventListener("click", (e) => {
          const el = e.target as HTMLElement;
        
          const nodeId = el.getAttribute("data-node-id");
          if (!nodeId) return;

          window.parent.postMessage(
            {
              type: "ELEMENT_SELECTED",
              payload: {
                tag: el.tagName,
                nodeId,
                className: el.className,
                inlineStyle: el.getAttribute("style")
              },
            },
            "*",
          );
        });
    
        window.addEventListener("message", (event: MessageEvent) => {
          if (!selected) return;
    
          if (event.data?.type === "APPLY_STYLE") {
            const { property, value } = event.data.payload;
            (selected.style as any)[property] = value;
          }
    
          if (event.data?.type === "APPLY_TEXT") {
            selected.textContent = event.data.payload;
          }
        });
    
      }, []);
    
      return (
        <div className="container bg-gray-500" data-node-id="1" style={{ padding: 20 }}>
          <h1 className="title" data-node-id="2" style={{ color: "red" }}>Hello Builder</h1>
          <button className="buttoner" data-node-id="3">Click me</button>
          <p className="info" data-node-id="4">A paragraph here</p>
        </div>
      );
    }
    `,
  "/index.tsx": `
    import { createRoot } from "react-dom/client";
    import App from "./App";
    
    const root = createRoot(document.getElementById("root")!);
    root.render(<App />);
    `,
};

const testFile5 = {
  "/tailwind.config.js":
    "/** @type {import('tailwindcss').Config} */\nmodule.exports = {\n  content: [\n    \"./index.html\",\n    \"./**/*.{js,ts,jsx,tsx}\",\n  ],\n  theme: {\n    extend: {\n      fontFamily: {\n        sans: ['Inter', 'sans-serif'], // A modern, elegant sans-serif font\n        serif: ['Lora', 'serif'], // A classic serif font for headings or highlights\n      },\n      colors: {\n        'primary-dark': '#1a202c', // Dark almost black background\n        'secondary-dark': '#2d3748', // Slightly lighter dark for cards/sections\n        'accent-gold': '#d4af37', // Gold accent for buttons, highlights\n        'text-light': '#f7fafc', // Light text on dark backgrounds\n        'text-muted': '#a0aec0', // Muted text for descriptions\n        'border-gray': '#4a5568', // Subtle border color\n      }\n    },\n  },\n  plugins: [],\n}",
  "/index.css":
    "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\nbody {\n  @apply bg-primary-dark text-text-light font-sans;\n}",
  "/types.ts":
    "export interface Product {\n  id: string;\n  name: string;\n  price: number;\n  category: 'Watch' | 'Shoe';\n  brand: string;\n  sizes?: string[]; // Only relevant for shoes\n}\n\nexport interface CartItem extends Product {\n  quantity: number;\n}\n\nexport interface FilterState {\n  category: 'All' | 'Watch' | 'Shoe';\n  brands: string[];\n  sizes: string[];\n  priceRange: { min: number; max: number };\n}\n",
  "/data.ts":
    "import { Product } from './types';\n\nexport const MOCK_PRODUCTS: Product[] = [\n  {\n    id: 'p1',\n    name: 'Classic Chronograph Watch',\n    price: 1250.00,\n    category: 'Watch',\n    brand: 'LuxoTime',\n  },\n  {\n    id: 'p2',\n    name: 'Premium Leather Loafers',\n    price: 499.99,\n    category: 'Shoe',\n    brand: 'EleganceStride',\n    sizes: ['US 8', 'US 9', 'US 10', 'US 11'],\n  },\n  {\n    id: 'p3',\n    name: 'Sporty Diver Watch',\n    price: 980.00,\n    category: 'Watch',\n    brand: 'AquaLux',\n  },\n  {\n    id: 'p4',\n    name: 'Italian Suede Boots',\n    price: 720.00,\n    category: 'Shoe',\n    brand: 'VelvetFootwear',\n    sizes: ['US 7', 'US 8', 'US 9', 'US 10'],\n  },\n  {\n    id: 'p5',\n    name: 'Minimalist Dress Watch',\n    price: 850.00,\n    category: 'Watch',\n    brand: 'Timeless',\n  },\n  {\n    id: 'p6',\n    name: 'Bespoke Oxford Shoes',\n    price: 650.00,\n    category: 'Shoe',\n    brand: 'EleganceStride',\n    sizes: ['US 9', 'US 10', 'US 11', 'US 12'],\n  },\n  {\n    id: 'p7',\n    name: 'Pilot GMT Watch',\n    price: 1500.00,\n    category: 'Watch',\n    brand: 'LuxoTime',\n  },\n  {\n    id: 'p8',\n    name: 'Casual Driving Shoes',\n    price: 380.00,\n    category: 'Shoe',\n    brand: 'VelvetFootwear',\n    sizes: ['US 8', 'US 9', 'US 10'],\n  },\n  {\n    id: 'p9',\n    name: 'Automatic Skeleton Watch',\n    price: 2100.00,\n    category: 'Watch',\n    brand: 'AquaLux',\n  },\n  {\n    id: 'p10',\n    name: 'High-Top Sneakers',\n    price: 320.00,\n    category: 'Shoe',\n    brand: 'EleganceStride',\n    sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11'],\n  },\n];\n",
  "/contexts/ProductContext.tsx":
    "import React, { createContext, useContext, ReactNode } from 'react';\nimport { Product } from '../types';\nimport { MOCK_PRODUCTS } from '../data';\n\ninterface ProductContextType {\n  products: Product[];\n}\n\nconst ProductContext = createContext<ProductContextType | undefined>(undefined);\n\nexport const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {\n  const products = MOCK_PRODUCTS;\n\n  return (\n    <ProductContext.Provider value={{ products }}>\n      {children}\n    </ProductContext.Provider>\n  );\n};\n\nexport const useProducts = () => {\n  const context = useContext(ProductContext);\n  if (context === undefined) {\n    throw new Error('useProducts must be used within a ProductProvider');\n  }\n  return context;\n};\n",
  "/contexts/CartContext.tsx":
    "import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';\nimport { CartItem, Product } from '../types';\n\ninterface CartContextType {\n  cartItems: CartItem[];\n  addItem: (product: Product, quantity?: number) => void;\n  removeItem: (productId: string) => void;\n  updateItemQuantity: (productId: string, quantity: number) => void;\n  cartTotal: number;\n  cartItemCount: number;\n}\n\nconst CartContext = createContext<CartContextType | undefined>(undefined);\n\nexport const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {\n  const [cartItems, setCartItems] = useState<CartItem[]>([]);\n\n  const addItem = useCallback((product: Product, quantity: number = 1) => {\n    setCartItems(prevItems => {\n      const existingItem = prevItems.find(item => item.id === product.id);\n      if (existingItem) {\n        return prevItems.map(item =>\n          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item\n        );\n      } else {\n        return [...prevItems, { ...product, quantity }];\n      }\n    });\n  }, []);\n\n  const removeItem = useCallback((productId: string) => {\n    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));\n  }, []);\n\n  const updateItemQuantity = useCallback((productId: string, quantity: number) => {\n    setCartItems(prevItems => {\n      if (quantity <= 0) {\n        return prevItems.filter(item => item.id !== productId);\n      }\n      return prevItems.map(item =>\n        item.id === productId ? { ...item, quantity } : item\n      );\n    });\n  }, []);\n\n  const cartTotal = useMemo(() => {\n    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);\n  }, [cartItems]);\n\n  const cartItemCount = useMemo(() => {\n    return cartItems.reduce((count, item) => count + item.quantity, 0);\n  }, [cartItems]);\n\n  const value = useMemo(() => ({\n    cartItems,\n    addItem,\n    removeItem,\n    updateItemQuantity,\n    cartTotal,\n    cartItemCount,\n  }), [cartItems, addItem, removeItem, updateItemQuantity, cartTotal, cartItemCount]);\n\n  return (\n    <CartContext.Provider value={value}>\n      {children}\n    </CartContext.Provider>\n  );\n};\n\nexport const useCart = () => {\n  const context = useContext(CartContext);\n  if (context === undefined) {\n    throw new Error('useCart must be used within a CartProvider');\n  }\n  return context;\n};\n",
  "/contexts/FilterContext.tsx":
    "import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';\nimport { FilterState, Product } from '../types';\nimport { useProducts } from './ProductContext';\n\ninterface FilterContextType {\n  filters: FilterState;\n  setCategory: (category: 'All' | 'Watch' | 'Shoe') => void;\n  toggleBrand: (brand: string) => void;\n  toggleSize: (size: string) => void;\n  setPriceRange: (min: number, max: number) => void;\n  filteredProducts: Product[];\n  allBrands: string[];\n  allSizes: string[];\n}\n\nconst FilterContext = createContext<FilterContextType | undefined>(undefined);\n\nexport const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {\n  const { products } = useProducts();\n\n  const initialMinPrice = useMemo(() => Math.min(...products.map(p => p.price)), [products]);\n  const initialMaxPrice = useMemo(() => Math.max(...products.map(p => p.price)), [products]);\n\n  const [filters, setFilters] = useState<FilterState>({\n    category: 'All',\n    brands: [],\n    sizes: [],\n    priceRange: { min: initialMinPrice, max: initialMaxPrice },\n  });\n\n  const allBrands = useMemo(() => Array.from(new Set(products.map(p => p.brand))).sort(), [products]);\n  const allSizes = useMemo(() => Array.from(new Set(products.flatMap(p => p.sizes || []))).sort(), [products]);\n\n  const setCategory = useCallback((category: 'All' | 'Watch' | 'Shoe') => {\n    setFilters(prev => ({\n      ...prev,\n      category,\n      sizes: category === 'Shoe' ? prev.sizes : [], // Clear sizes if not shoes\n    }));\n  }, []);\n\n  const toggleBrand = useCallback((brand: string) => {\n    setFilters(prev => ({\n      ...prev,\n      brands: prev.brands.includes(brand)\n        ? prev.brands.filter(b => b !== brand)\n        : [...prev.brands, brand],\n    }));\n  }, []);\n\n  const toggleSize = useCallback((size: string) => {\n    setFilters(prev => ({\n      ...prev,\n      sizes: prev.sizes.includes(size)\n        ? prev.sizes.filter(s => s !== size)\n        : [...prev.sizes, size],\n    }));\n  }, []);\n\n  const setPriceRange = useCallback((min: number, max: number) => {\n    setFilters(prev => ({\n      ...prev,\n      priceRange: { min, max },\n    }));\n  }, []);\n\n  const filteredProducts = useMemo(() => {\n    return products.filter(product => {\n      // Category filter\n      if (filters.category !== 'All' && product.category !== filters.category) {\n        return false;\n      }\n      // Brand filter\n      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {\n        return false;\n      }\n      // Size filter (only for shoes and if sizes are selected)\n      if (filters.category === 'Shoe' && filters.sizes.length > 0) {\n        if (!product.sizes || !product.sizes.some(size => filters.sizes.includes(size))) {\n          return false;\n        }\n      }\n      // Price range filter\n      if (product.price < filters.priceRange.min || product.price > filters.priceRange.max) {\n        return false;\n      }\n      return true;\n    });\n  }, [products, filters]);\n\n  const value = useMemo(() => ({\n    filters,\n    setCategory,\n    toggleBrand,\n    toggleSize,\n    setPriceRange,\n    filteredProducts,\n    allBrands,\n    allSizes,\n  }), [filters, setCategory, toggleBrand, toggleSize, setPriceRange, filteredProducts, allBrands, allSizes]);\n\n  return (\n    <FilterContext.Provider value={value}>\n      {children}\n    </FilterContext.Provider>\n  );\n};\n\nexport const useFilters = () => {\n  const context = useContext(FilterContext);\n  if (context === undefined) {\n    throw new Error('useFilters must be used within a FilterProvider');\n  }\n  return context;\n};\n",
  "/components/Header.tsx":
    'import React from \'react\';\nimport { Link } from \'react-router-dom\';\nimport { useCart } from \'../contexts/CartContext\';\n\nconst Header: React.FC = () => {\n  const { cartItemCount } = useCart();\n\n  return (\n    <header className="bg-secondary-dark text-text-light p-4 shadow-lg">\n      <div className="container mx-auto flex justify-between items-center">\n        <Link to="/" className="text-2xl font-serif text-accent-gold hover:text-white transition-colors">\n          Luxury Wear\n        </Link>\n        <nav className="hidden md:flex space-x-6 text-lg">\n          <Link to="/" className="hover:text-accent-gold transition-colors">\n            Home\n          </Link>\n          <Link to="/cart" className="hover:text-accent-gold transition-colors flex items-center">\n            Cart ({cartItemCount})\n          </Link>\n        </nav>\n        <div className="md:hidden">\n          {/* Mobile menu icon (hamburger) would go here */}\n          <Link to="/cart" className="relative p-2 rounded-md hover:bg-gray-700 transition-colors">\n            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>\n            </svg>\n            {cartItemCount > 0 && (\n              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">\n                {cartItemCount}\n              </span>\n            )}\n          </Link>\n        </div>\n      </div>\n    </header>\n  );\n};\n\nexport default Header;\n',
  "/components/Footer.tsx":
    'import React from \'react\';\n\nconst Footer: React.FC = () => {\n  return (\n    <footer className="bg-secondary-dark text-text-muted p-4 mt-8 text-center text-sm">\n      <div className="container mx-auto">\n        <p>&copy; {new Date().getFullYear()} Luxury Wear. All rights reserved.</p>\n      </div>\n    </footer>\n  );\n};\n\nexport default Footer;\n',
  "/components/ProductCard.tsx":
    'import React from \'react\';\nimport { Product } from \'../types\';\nimport { useCart } from \'../contexts/CartContext\';\n\ninterface ProductCardProps {\n  product: Product;\n}\n\nconst ProductCard: React.FC<ProductCardProps> = ({ product }) => {\n  const { addItem } = useCart();\n\n  return (\n    <div className="bg-secondary-dark rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out border border-border-gray">\n      <div className="p-4 flex flex-col items-center justify-between h-full">\n        <div className="w-full h-32 bg-gray-700 rounded-md mb-4 flex items-center justify-center text-text-muted text-sm">\n          Product Image Placeholder\n        </div>\n        <h3 className="text-xl font-semibold text-text-light mb-2 text-center">\n          {product.name}\n        </h3>\n        <p className="text-accent-gold text-lg font-bold mb-4">\n          ${product.price.toFixed(2)}\n        </p>\n        <button\n          onClick={() => addItem(product)}\n          className="mt-auto w-full bg-accent-gold text-primary-dark py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75"\n        >\n          Add to Cart\n        </button>\n      </div>\n    </div>\n  );\n};\n\nexport default ProductCard;\n',
  "/components/ProductGrid.tsx":
    "import React from 'react';\nimport { Product } from '../types';\nimport ProductCard from './ProductCard';\n\ninterface ProductGridProps {\n  products: Product[];\n}\n\nconst ProductGrid: React.FC<ProductGridProps> = ({ products }) => {\n  return (\n    <div className=\"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4\">\n      {products.length === 0 ? (\n        <p className=\"col-span-full text-center text-text-muted text-xl py-10\">No products found matching your filters.</p>\n      ) : (\n        products.map(product => (\n          <ProductCard key={product.id} product={product} />\n        ))\n      )}\n    </div>\n  );\n};\n\nexport default ProductGrid;\n",
  "/components/filters/BrandFilter.tsx":
    'import React from \'react\';\nimport { useFilters } from \'../../contexts/FilterContext\';\n\nconst BrandFilter: React.FC = () => {\n  const { filters, toggleBrand, allBrands } = useFilters();\n\n  return (\n    <div className="p-4 border-b border-border-gray">\n      <h4 className="text-lg font-semibold text-text-light mb-3">Brand</h4>\n      <div className="space-y-2">\n        {allBrands.map(brand => (\n          <label key={brand} className="flex items-center text-text-muted hover:text-text-light cursor-pointer">\n            <input\n              type="checkbox"\n              checked={filters.brands.includes(brand)}\n              onChange={() => toggleBrand(brand)}\n              className="form-checkbox h-5 w-5 text-accent-gold bg-secondary-dark border-border-gray rounded focus:ring-accent-gold mr-2"\n            />\n            {brand}\n          </label>\n        ))}\n      </div>\n    </div>\n  );\n};\n\nexport default BrandFilter;\n',
  "/components/filters/CategoryFilter.tsx":
    "import React from 'react';\nimport { useFilters } from '../../contexts/FilterContext';\n\nconst CategoryFilter: React.FC = () => {\n  const { filters, setCategory } = useFilters();\n\n  return (\n    <div className=\"p-4 border-b border-border-gray\">\n      <h4 className=\"text-lg font-semibold text-text-light mb-3\">Category</h4>\n      <div className=\"flex flex-col space-y-2\">\n        <button\n          onClick={() => setCategory('All')}\n          className={`py-2 px-4 rounded-md text-sm font-medium ${filters.category === 'All' ? 'bg-accent-gold text-primary-dark' : 'bg-gray-700 text-text-light hover:bg-gray-600'} transition-colors`}\n        >\n          All Products\n        </button>\n        <button\n          onClick={() => setCategory('Watch')}\n          className={`py-2 px-4 rounded-md text-sm font-medium ${filters.category === 'Watch' ? 'bg-accent-gold text-primary-dark' : 'bg-gray-700 text-text-light hover:bg-gray-600'} transition-colors`}\n        >\n          Watches\n        </button>\n        <button\n          onClick={() => setCategory('Shoe')}\n          className={`py-2 px-4 rounded-md text-sm font-medium ${filters.category === 'Shoe' ? 'bg-accent-gold text-primary-dark' : 'bg-gray-700 text-text-light hover:bg-gray-600'} transition-colors`}\n        >\n          Shoes\n        </button>\n      </div>\n    </div>\n  );\n};\n\nexport default CategoryFilter;\n",
  "/components/filters/PriceFilter.tsx":
    'import React, { useState, useEffect } from \'react\';\nimport { useFilters } from \'../../contexts/FilterContext\';\nimport { useProducts } from \'../../contexts/ProductContext\';\n\nconst PriceFilter: React.FC = () => {\n  const { setPriceRange, filters } = useFilters();\n  const { products } = useProducts();\n\n  const maxProductPrice = Math.max(...products.map(p => p.price));\n  const minProductPrice = Math.min(...products.map(p => p.price));\n\n  const [minInput, setMinInput] = useState(filters.priceRange.min);\n  const [maxInput, setMaxInput] = useState(filters.priceRange.max);\n\n  // Update local state when context filters change (e.g., if category changes and resets price)\n  useEffect(() => {\n    setMinInput(filters.priceRange.min);\n    setMaxInput(filters.priceRange.max);\n  }, [filters.priceRange]);\n\n  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {\n    const value = Number(e.target.value);\n    if (!isNaN(value)) {\n      setMinInput(value);\n    }\n  };\n\n  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {\n    const value = Number(e.target.value);\n    if (!isNaN(value)) {\n      setMaxInput(value);\n    }\n  };\n\n  const applyPriceFilter = () => {\n    const finalMin = Math.max(minProductPrice, Math.min(minInput, maxInput));\n    const finalMax = Math.min(maxProductPrice, Math.max(minInput, maxInput));\n    setPriceRange(finalMin, finalMax);\n  };\n\n  return (\n    <div className="p-4 border-b border-border-gray">\n      <h4 className="text-lg font-semibold text-text-light mb-3">Price Range</h4>\n      <div className="flex items-center space-x-2 mb-3">\n        <input\n          type="number"\n          value={minInput}\n          onChange={handleMinChange}\n          onBlur={applyPriceFilter}\n          min={minProductPrice}\n          max={maxProductPrice}\n          className="w-1/2 p-2 bg-secondary-dark border border-border-gray rounded-md text-text-light focus:outline-none focus:ring-1 focus:ring-accent-gold"\n        />\n        <span className="text-text-muted">-</span>\n        <input\n          type="number"\n          value={maxInput}\n          onChange={handleMaxChange}\n          onBlur={applyPriceFilter}\n          min={minProductPrice}\n          max={maxProductPrice}\n          className="w-1/2 p-2 bg-secondary-dark border border-border-gray rounded-md text-text-light focus:outline-none focus:ring-1 focus:ring-accent-gold"\n        />\n      </div>\n      <div className="text-sm text-text-muted">\n        Current: ${filters.priceRange.min.toFixed(2)} - ${filters.priceRange.max.toFixed(2)}\n      </div>\n    </div>\n  );\n};\n\nexport default PriceFilter;\n',
  "/components/filters/SizeFilter.tsx":
    'import React from \'react\';\nimport { useFilters } from \'../../contexts/FilterContext\';\n\nconst SizeFilter: React.FC = () => {\n  const { filters, toggleSize, allSizes } = useFilters();\n\n  // Only show size filter if \'Shoe\' category is selected\n  if (filters.category !== \'Shoe\') {\n    return null;\n  }\n\n  return (\n    <div className="p-4 border-b border-border-gray">\n      <h4 className="text-lg font-semibold text-text-light mb-3">Size</h4>\n      <div className="grid grid-cols-2 gap-2">\n        {allSizes.map(size => (\n          <label key={size} className="flex items-center text-text-muted hover:text-text-light cursor-pointer">\n            <input\n              type="checkbox"\n              checked={filters.sizes.includes(size)}\n              onChange={() => toggleSize(size)}\n              className="form-checkbox h-5 w-5 text-accent-gold bg-secondary-dark border-border-gray rounded focus:ring-accent-gold mr-2"\n            />\n            {size}\n          </label>\n        ))}\n      </div>\n    </div>\n  );\n};\n\nexport default SizeFilter;\n',
  "/components/FilterSidebar.tsx":
    "import React from 'react';\nimport PriceFilter from './filters/PriceFilter';\nimport CategoryFilter from './filters/CategoryFilter';\nimport BrandFilter from './filters/BrandFilter';\nimport SizeFilter from './filters/SizeFilter';\n\nconst FilterSidebar: React.FC = () => {\n  return (\n    <aside className=\"w-full md:w-64 bg-secondary-dark shadow-lg md:mr-6 rounded-lg overflow-hidden border border-border-gray\">\n      <h3 className=\"text-xl font-semibold text-text-light p-4 bg-gray-700\">Filters</h3>\n      <CategoryFilter />\n      <PriceFilter />\n      <BrandFilter />\n      <SizeFilter />\n    </aside>\n  );\n};\n\nexport default FilterSidebar;\n",
  "/pages/ProductCataloguePage.tsx":
    "import React from 'react';\nimport ProductGrid from '../components/ProductGrid';\nimport FilterSidebar from '../components/FilterSidebar';\nimport { useFilters } from '../contexts/FilterContext';\n\nconst ProductCataloguePage: React.FC = () => {\n  const { filteredProducts } = useFilters();\n\n  return (\n    <div className=\"container mx-auto px-4 py-8 flex flex-col md:flex-row\">\n      <FilterSidebar />\n      <main className=\"flex-1 mt-8 md:mt-0\">\n        <h2 className=\"text-3xl font-serif text-text-light mb-6 text-center md:text-left\">Our Exquisite Collection</h2>\n        <ProductGrid products={filteredProducts} />\n      </main>\n    </div>\n  );\n};\n\nexport default ProductCataloguePage;\n",
  "/components/CartItem.tsx":
    'import React from \'react\';\nimport { CartItem as CartItemType } from \'../types\';\nimport { useCart } from \'../contexts/CartContext\';\n\ninterface CartItemProps {\n  item: CartItemType;\n}\n\nconst CartItem: React.FC<CartItemProps> = ({ item }) => {\n  const { updateItemQuantity, removeItem } = useCart();\n\n  const subtotal = item.price * item.quantity;\n\n  return (\n    <div className="flex items-center border-b border-border-gray py-4 last:border-b-0">\n      <div className="w-24 h-24 bg-gray-700 rounded-md mr-4 flex-shrink-0 flex items-center justify-center text-text-muted text-xs">\n        Item Image\n      </div>\n      <div className="flex-grow">\n        <h3 className="text-lg font-semibold text-text-light">{item.name}</h3>\n        <p className="text-text-muted">Price: ${item.price.toFixed(2)}</p>\n        <div className="flex items-center mt-2">\n          <button\n            onClick={() => updateItemQuantity(item.id, item.quantity - 1)}\n            className="bg-gray-700 text-text-light px-3 py-1 rounded-l-md hover:bg-gray-600 transition-colors"\n          >\n            -\n          </button>\n          <span className="bg-gray-800 text-text-light px-4 py-1 border-y border-border-gray">\n            {item.quantity}\n          </span>\n          <button\n            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}\n            className="bg-gray-700 text-text-light px-3 py-1 rounded-r-md hover:bg-gray-600 transition-colors"\n          >\n            +\n          </button>\n          <button\n            onClick={() => removeItem(item.id)}\n            className="ml-4 text-red-500 hover:text-red-400 transition-colors text-sm"\n          >\n            Remove\n          </button>\n        </div>\n      </div>\n      <div className="text-right">\n        <p className="text-accent-gold text-lg font-bold">${subtotal.toFixed(2)}</p>\n      </div>\n    </div>\n  );\n};\n\nexport default CartItem;\n',
  "/components/CartSummary.tsx":
    'import React from \'react\';\nimport { useCart } from \'../contexts/CartContext\';\n\nconst CartSummary: React.FC = () => {\n  const { cartTotal } = useCart();\n\n  return (\n    <div className="bg-secondary-dark p-6 rounded-lg shadow-xl border border-border-gray mt-8">\n      <h3 className="text-xl font-semibold text-text-light mb-4">Order Summary</h3>\n      <div className="flex justify-between items-center mb-4">\n        <span className="text-text-light">Subtotal:</span>\n        <span className="text-accent-gold font-bold text-xl">${cartTotal.toFixed(2)}</span>\n      </div>\n      <button className="w-full bg-accent-gold text-primary-dark py-3 rounded-md text-lg font-medium hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75">\n        Proceed to Checkout\n      </button>\n    </div>\n  );\n};\n\nexport default CartSummary;\n',
  "/pages/ShoppingCartPage.tsx":
    'import React from \'react\';\nimport { useCart } from \'../contexts/CartContext\';\nimport CartItem from \'../components/CartItem\';\nimport CartSummary from \'../components/CartSummary\';\nimport { Link } from \'react-router-dom\';\n\nconst ShoppingCartPage: React.FC = () => {\n  const { cartItems } = useCart();\n\n  return (\n    <div className="container mx-auto px-4 py-8">\n      <h2 className="text-3xl font-serif text-text-light mb-8 text-center">Your Shopping Cart</h2>\n\n      {cartItems.length === 0 ? (\n        <div className="text-center bg-secondary-dark p-8 rounded-lg shadow-xl border border-border-gray max-w-lg mx-auto">\n          <p className="text-xl text-text-muted mb-4">Your cart is empty.</p>\n          <Link to="/" className="inline-block bg-accent-gold text-primary-dark py-2 px-6 rounded-md hover:bg-yellow-600 transition-colors text-lg">\n            Start Shopping\n          </Link>\n        </div>\n      ) : (\n        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">\n          <div className="lg:col-span-2 bg-secondary-dark p-6 rounded-lg shadow-xl border border-border-gray">\n            {cartItems.map(item => (\n              <CartItem key={item.id} item={item} />\n            ))}\n          </div>\n          <div className="lg:col-span-1">\n            <CartSummary />\n          </div>\n        </div>\n      )}\n    </div>\n  );\n};\n\nexport default ShoppingCartPage;\n',
  "/App.tsx":
    "import React from 'react';\nimport { BrowserRouter as Router, Routes, Route } from 'react-router-dom';\nimport { ProductProvider } from './contexts/ProductContext';\nimport { CartProvider } from './contexts/CartContext';\nimport { FilterProvider } from './contexts/FilterContext';\nimport Header from './components/Header';\nimport Footer from './components/Footer';\nimport ProductCataloguePage from './pages/ProductCataloguePage';\nimport ShoppingCartPage from './pages/ShoppingCartPage';\n\nconst App: React.FC = () => {\n  return (\n    <Router>\n      <ProductProvider>\n        <CartProvider>\n          <FilterProvider>\n            <div className=\"min-h-screen flex flex-col\">\n              <Header />\n              <main className=\"flex-grow\">\n                <Routes>\n                  <Route path=\"/\" element={<ProductCataloguePage />} />\n                  <Route path=\"/cart\" element={<ShoppingCartPage />} />\n                </Routes>\n              </main>\n              <Footer />\n            </div>\n          </FilterProvider>\n        </CartProvider>\n      </ProductProvider>\n    </Router>\n  );\n};\n\nexport default App;\n",
  "/index.tsx":
    "import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport './index.css';\nimport App from './App';\n\nconst root = ReactDOM.createRoot(\n  document.getElementById('root') as HTMLElement\n);\nroot.render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);\n",
};

const testFile2 = {
  "/App.tsx": `import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    let hoveredEl: HTMLElement | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;

      const el = target.closest("[data-node-id]") as HTMLElement | null;
      if (!el) return;

      // If same element, do nothing
      if (hoveredEl === el) return;

      // Remove old highlight
      if (hoveredEl) {
        hoveredEl.style.outline = "";
      }

      // Add new highlight
      el.style.outline = "2px solid #3b82f6"; // Tailwind blue-500
      el.style.outlineOffset = "-2px";

      hoveredEl = el;
    };

    const handleMouseLeave = () => {
      if (hoveredEl) {
        hoveredEl.style.outline = "";
        hoveredEl = null;
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;

      const el = target.closest("[data-node-id]");
      if (!el) return;

      const nodeId = el.getAttribute("data-node-id");
      if (!nodeId) return;

      let directText = "";

      el.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          directText += node.textContent;
        }
      });

      window.parent.postMessage(
        {
          type: "ELEMENT_SELECTED",
          payload: {
            tag: el.tagName,
            nodeId,
            className: el.className,
            inlineStyle: el.getAttribute("style"),
            text: directText.trim(),
          },
        },
        "*"
      );
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Simple Test Page
      </h1>
      
      <div className="border rounded-lg p-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">
          Card 1
        </h2>
        <p className="text-gray-600 mb-4">
          This is a simple card
        </p>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Click
        </button>
      </div>

      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">
          Card 2
        </h2>
        <p className="text-gray-600 mb-4">
          Another simple card
        </p>
        <button 
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Click
        </button>
      </div>
    </div>
  );
}`,
  "/index.tsx": `import { createRoot } from "react-dom/client";
import App from "./App";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);`,
};

const testFile4 = {
  "/styles.css": `
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Your custom styles */
body {
  margin: 0;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
}`,
  "/App.tsx": `import { useEffect } from "react";
import "./styles.css";

export default function App() {

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;

      const el = target.closest("[data-node-id]");
      if (!el) return;
  
      const nodeId = el.getAttribute("data-node-id");
      if (!nodeId) return;

      console.log(el.getAttribute("style"));

      window.parent.postMessage(
        {
          type: "ELEMENT_SELECTED",
          payload: {
            tag: el.tagName,
            nodeId,
            className: el.className,
            inlineStyle: el.getAttribute("style"),
          },
        },
        "*",
      );
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div className="p-5 text-white rounded-lg bg-green-500">
      <h1 className="text-2xl font-bold border-2 mb-4">Hello Builder</h1>
      <button className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded">Click me</button>
      <p className="mt-4 text-white/80">Diwangshu Kakoty</p>
    </div>
  );
}`,
  "/index.tsx": `import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);`,
};

const testFile3 = {
  "/styles.css": `@import 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';

/* Your custom styles */
body {
  margin: 0;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
}`,
  "/App.tsx": `import { useEffect } from "react";
import "./styles.css";

export default function App() {

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;

      const el = target.closest("[data-node-id]");
      if (!el) return;
  
      const nodeId = el.getAttribute("data-node-id");
      if (!nodeId) return;

      window.parent.postMessage(
        {
          type: "ELEMENT_SELECTED",
          payload: {
            tag: el.tagName,
            nodeId,
            className: el.className,
            inlineStyle: el.getAttribute("style"),
          },
        },
        "*",
      );
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div className="p-5 text-white rounded-lg bg-red-200">
      <h1 className="text-2xl font-bold mb-4">Hello Builder</h1>
      <button className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded">Click me</button>
      <p className="mt-4 text-white/80">Diwangshu Kakoty</p>
    </div>
  );
}`,
  "/index.tsx": `import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);`,
};

export { testFile, testFile2, testFile3, testFile5 };
