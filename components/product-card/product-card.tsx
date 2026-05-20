import React from "react";
import {ItemInterface} from "@/data/interfaces/ItemInterface";
import "./product-card.css"

export const ProductCard = ({item}: { item: ItemInterface }) => {
    return (
        <div key={item.productId} className="selection-card">
            <img src={item.imageUrl} alt={item.productName} className="selection-card__image" />
            <h3 className="selection-card__title">{item.productName}</h3>
            <div className="selection-card__price">{item.price} ₽</div>
            <button className="selection-card__btn">Открыть</button>
        </div>
    )
}