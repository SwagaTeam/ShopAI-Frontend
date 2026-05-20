import React from 'react';
import './cart-item.css';

export const CartSkeleton = ({ count = 3 }: { count?: number }) => {
    return (
        <div className="cart-skeleton">
            {[...Array(count)].map((_, index) => (
                <div className="cart-skeleton__item" key={index}>
                    <div className="cart-skeleton__checkbox"></div>
                    <div className="cart-skeleton__image"></div>
                    <div className="cart-skeleton__info">
                        <div className="cart-skeleton__name"></div>
                        <div className="cart-skeleton__price"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};