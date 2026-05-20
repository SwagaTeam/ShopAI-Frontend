import {Header} from "@/components/header/header";
import {ProductCard} from "@/components/product-card/product-card";
import React, { useEffect } from "react";
import { useFavoritesStore } from "@/data/store/useFavoritesStore";
import Link from "next/link";
import "./favorites.css"
import {Placeholder} from "@/components/placeholder/placeholder";

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
                    {items.length !== 0 && (
                        <div className="section__header">
                            <h2 className="section__title favorites">Избранное</h2>
                        </div>
                    )}


                        {isLoading ? (
                            <p>Загрузка...</p>
                        ) : error ? (
                            <p style={{ color: 'red' }}>{error}</p>
                        ) : items.length === 0 ? (
                            <Placeholder
                                title={"У вас нет избранных товаров"}
                                text={"Добавьте что-нибудь, чтобы я не грустил"}
                                buttonText={"Вернуться на главную"}
                                img={"/images/placeholder.png"}
                                nav={"/main"} />
                        ) : (
                            <div className="selections__grid">
                                {items.map((item) => (
                                    <ProductCard
                                        item={{
                                            productId: item.id,
                                            productName: item.name,
                                            price: item.price,
                                            imageUrl: item.imageUrl
                                        }}
                                        key={item.id}
                                    />
                                ))}
                            </div>
                        )}

                </section>
            </main>
        </div>
    )
}