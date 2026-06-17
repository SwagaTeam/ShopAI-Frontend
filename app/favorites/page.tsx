"use client"

import {Header} from "@/components/header/header";
import {ProductCard} from "@/components/product-card/product-card";
import React, { useEffect } from "react";
import { useFavoritesStore } from "@/data/store/useFavoritesStore";
import { useAuthStore } from "@/data/store/useAuthStore";
import "./favorites.css"
import {Placeholder} from "@/components/placeholder/placeholder";
import {ProductCardSkeleton} from "@/components/skeleton/skeleton";

export  default function Page () {
    const { items, isLoading, error, fetchFavorites } = useFavoritesStore();
    const token = useAuthStore((state) => state.token);

    useEffect(() => {
        if (token) {
            fetchFavorites();
        }
    }, [token, fetchFavorites]);

    return (
        <div className="page">
            <Header isCompact={false} />
            <main className="main">
                <section className="selections">
                    <div className="section__header">
                        <h2 className="section__title favorites">Избранное</h2>
                    </div>

                    {isLoading ? (
                        <div className="selections__grid">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <ProductCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : error ? (
                        <Placeholder
                            title={"Что-то пошло не так"}
                            text={"Я уже пытаюсь это починить"}
                            buttonText={"Обновить страницу"}
                            img={"/images/robot-error.png"}
                            onButtonClick={() => window.location.reload()}
                        />
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
                                    item={item}
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
