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

export const ProductPageSkeleton = () => {
    return (
        <div className="product-page-skeleton">
            <div className="skeleton product-page-skeleton__breadcrumbs" />

            <div className="product-page-skeleton__main">
                <div className="product-page-skeleton__gallery">
                    <div className="product-page-skeleton__thumbs">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="skeleton product-page-skeleton__thumb" />
                        ))}
                    </div>
                    <div className="skeleton product-page-skeleton__main-img" />
                </div>

                <div className="product-page-skeleton__info">
                    <div className="skeleton product-page-skeleton__brand" />
                    <div className="skeleton product-page-skeleton__title" />
                    <div className="skeleton product-page-skeleton__rating" />
                    <div className="skeleton product-page-skeleton__price" />
                    <div className="skeleton product-page-skeleton__stock" />
                    <div className="product-page-skeleton__actions">
                        <div className="skeleton product-page-skeleton__btn" />
                        <div className="skeleton product-page-skeleton__btn" />
                    </div>
                </div>
            </div>

            <div className="product-page-skeleton__tabs">
                {[1, 2, 3].map(i => (
                    <div key={i} className="skeleton product-page-skeleton__tab" />
                ))}
            </div>
        </div>
    );
};

