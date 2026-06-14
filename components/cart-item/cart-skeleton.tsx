import React from 'react';
import './cart-item.css';

export const CartSkeleton = ({ count = 3 }: { count?: number }) => {
    return (
        <div className="cart-skeleton">
            {[...Array(count)].map((_, index) => (
                <div className="cart-skeleton__item" key={index}>
                    <div className="cart-skeleton__image"></div>
                    <div className="cart-skeleton__info">
                        <div className="cart-skeleton__name"></div>
                        <div className="cart-skeleton__price"></div>
                    </div>
                    <div className="cart-skeleton__controls">
                        <div className="cart-skeleton__counter">
                            <div className="cart-skeleton__counter-btn"></div>
                            <div className="cart-skeleton__counter-value"></div>
                            <div className="cart-skeleton__counter-btn"></div>
                        </div>
                        <div className="cart-skeleton__actions">
                            <div className="cart-skeleton__action-btn"></div>
                            <div className="cart-skeleton__action-btn"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};