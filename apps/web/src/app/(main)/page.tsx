'use client';
import axios from 'axios';
import { getUserCurrentLocation } from '@/utils/getUserCurrentLocation';
import { getClosestWarehouse } from '@/api/warehouse';
import ListCategories from '@/components/ListCategories';
import LandingProducts from '@/components/LandingProducts';
import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';

export default function Home() {
  const [userLoc, setUserLoc] = useState<{ lon: number; lat: number }>();
  const [closestWarehouseId, setClosestWarehouseId] = useState<number>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, fetchCart, cart } = useCart();

  const base_api = 'http://localhost:8000/api';

  const getWarehouseId = async () => {
    const data = await getClosestWarehouse();
    setClosestWarehouseId(data);
  };

  const getProducts = async (id: number | undefined) => {
    if (!id) return;
    const res = await axios.get(`${base_api}/products`);

    console.log(res.data);

    const filteredProducts = res.data.filter((item: Product) =>
      item.productStocks.some((stock) => stock.warehouse.id === id),
    );

    setProducts(filteredProducts);
  };

  useEffect(() => {
    setUserLoc(getUserCurrentLocation());
    getWarehouseId();
    fetchCart();
  }, [closestWarehouseId]);

  useEffect(() => {
    if (closestWarehouseId) {
      getProducts(closestWarehouseId);
    }
  }, [closestWarehouseId]);

  return (
    <main>
      <div className="hero max-w-[80%] bg-pinky m-auto p-5 rounded-lg">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="">
            <p className="text-xs font-bold">Welcome to Hemart</p>
            <h1 className="text-3xl font-bold">
              Your One-Stop Shop for Fresh & Affordable Groceries
            </h1>
            <p className="py-6">
              At Hemart, we believe that everyone deserves access to fresh,
              high-quality groceries at prices that wont break the bank. Explore
              our wide selection of fresh produce, pantry staples, and household
              essentials. Shop smart, live healthy—only at Hemart.
            </p>
            <button className="btn btn-primary">Start Shopping!</button>
          </div>
        </div>
      </div>
      <section>
        <ListCategories />
      </section>
      <section>
        <LandingProducts catHeader={'New Products'} products={products} />
        <LandingProducts catHeader={'Instant Food'} products={products} />
        <LandingProducts catHeader={'Beverages'} products={products} />
      </section>
    </main>
  );
}