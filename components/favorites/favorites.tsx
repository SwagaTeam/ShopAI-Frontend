import {Header} from "@/components/header/header";
import {ProductCard} from "@/components/product-card/product-card";
import React, { useEffect } from "react";
import { useFavoritesStore } from "@/data/store/useFavoritesStore";
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