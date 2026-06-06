import React from 'react';
import './skeleton.css';

export const ProductCardSkeleton = () => {
    return (
        <div className="product-card-skeleton">
            <div className="skeleton product-card-skeleton__image" />
            <div className="skeleton product-card-skeleton__title" />
            <div className="product-card-skeleton__bottom">
                <div className="skeleton product-card-skeleton__price" />
                <div className="skeleton product-card-skeleton__rating" />
            </div>
            <div className="skeleton product-card-skeleton__button" />
        </div>
    );
};

export const StatCardSkeleton = () => {
    return (
        <div className="stat-card-skeleton">
            <div className="skeleton stat-card-skeleton__icon" />
            <div className="skeleton stat-card-skeleton__value" />
            <div className="skeleton stat-card-skeleton__label" />
        </div>
    );
};
