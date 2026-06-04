import React from "react";
import {Heart, Plus, Minus, Trash2, CircleOff} from "lucide-react";
import "./cart-item.css"
import {ICartItem} from "@/data/interfaces/ICartItem";
import Link from "next/link";

export const CartItem = ({ item, onToggle, onIncrement, onDecrement, onRemove, onToggleFavorite }: {
    item: ICartItem;
    onToggle?: () => void;
    onIncrement?: () => void;
    onDecrement?: () => void;
    onRemove?: () => void;
    onToggleFavorite?: () => void;
}) => {
    return (
        <div className="cart-item">
            <Link href={`/product/${item.productId}`} className="cart-item__image-wrap">
                {item.imageUrl ? (<img src={item.imageUrl} alt={item.productName}/>) : (<CircleOff size={60} color={"#d1d1d1"}/>)}
            </Link>
            <Link href={`/product/${item.productId}`} className="cart-item__info">
                <h3 className="cart-item__name">{item.productName}</h3>
                <p className="cart-item__price">{item.price} ₽</p>
            </Link>
            <div className="cart-item__controls">
                <div className="cart-item__counter">
                    <button className="cart-item__counter-btn" onClick={onDecrement}>
                        <Minus size={16} color={"#0A0A0A"} />
                    </button>
                    <span className="cart-item__counter-value">{item.quantity}</span>
                    <button className="cart-item__counter-btn" onClick={onIncrement}>
                        <Plus size={16} color={"#0A0A0A"}/>
                    </button>
                </div>
                <div className="cart-item__actions">
                    <button className="cart-item__action-btn" onClick={onToggleFavorite}>
                        <Heart size={20} color={"#99A1AF"} />
                    </button>
                    <button className="cart-item__action-btn" onClick={onRemove}>
                        <Trash2 size={20} color={"#99A1AF"} />
                    </button>
                </div>
            </div>
        </div>
    );
};