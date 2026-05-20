import {Header} from "@/components/header/header";
import {ItemInterface} from "@/data/interfaces/ItemInterface";
import {ProductCard} from "@/components/product-card/product-card";
import React from "react";

export const Favorites = () => {
    return (
        <div className="page">
            <Header isCompact={false} />
            <main className="main">
                <section className="selections">
                    <div className="section__header">
                        <h2 className="section__title">Избранное</h2>
                    </div>

                    <div className="selections__grid">
                        {personalSelections.map((item: ItemInterface) => (
                            <ProductCard item={item} key={item.productId} />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    )
}