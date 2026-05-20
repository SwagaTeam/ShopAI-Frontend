import React from "react";
import { Heart, Plus, Minus, Trash2 } from "lucide-react";
import "./cart-item.css"

export const CartItem = ({ item, onToggle, onIncrement, onDecrement, onRemove, onToggleFavorite }: {
    item: any;
    onToggle?: () => void;
    onIncrement?: () => void;
    onDecrement?: () => void;
    onRemove?: () => void;
    onToggleFavorite?: () => void;
}) => {
    return (
        <div className="cart-item">
            <div className="cart-item__checkbox-wrap">
                <input
                    type="checkbox"
                    className="cart-item__checkbox"
                    defaultChecked={item.checked}
                    onChange={onToggle}
                />
            </div>
            <div className="cart-item__image-wrap"></div>
            <div className="cart-item__info">
                <h3 className="cart-item__name">{item.name}</h3>
                <p className="cart-item__price">{item.price}</p>
            </div>
            <div className="cart-item__controls">
                <div className="cart-item__counter">
                    <button className="cart-item__counter-btn" onClick={onDecrement}>
                        <Minus size={16} color={"#0A0A0A"} />
                    </button>
                    <span className="cart-item__counter-value">{item.count}</span>
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