import {Header} from "@/components/header/header";
import {ProductCard} from "@/components/product-card/product-card";
import React, { useEffect } from "react";
import { useFavoritesStore } from "@/data/store/useFavoritesStore";
import Link from "next/link";

export const Favorites = () => {
    const { items, isLoading, error, fetchFavorites } = useFavoritesStore();

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    return (
        <div className="page">
            <Header isCompact={false} />
            <main className="main">
                <section className="selections">
                    <div className="section__header">
                        <h2 className="section__title">Избранное</h2>
                    </div>

                    <div className="selections__grid">
                        {isLoading ? (
                            <p>Загрузка...</p>
                        ) : error ? (
                            <p style={{ color: 'red' }}>{error}</p>
                        ) : items.length === 0 ? (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0' }}>
                                <p>У вас нет избранных товаров</p>
                                <Link href="/main" style={{ color: '#1570EF', textDecoration: 'none' }}>
                                    Вернуться на главную
                                </Link>
                            </div>
                        ) : (
                            items.map((item) => (
                                <ProductCard 
                                    item={{
                                        productId: item.id,
                                        productName: item.name,
                                        price: item.price,
                                        imageUrl: item.imageUrl
                                    }} 
                                    key={item.id} 
                                />
                            ))
                        )}
                    </div>
                </section>
            </main>
        </div>
    )
}