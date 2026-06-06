import Link from "next/link";
import React from "react";
import "./placeholder.css"

interface Props {
    title: string;
    text: string;
    buttonText: string;
    img: string;
    nav?: string;
    onButtonClick?: () => void;
}

export const Placeholder = ({ title, text, buttonText, img, nav, onButtonClick }: Props) => {
    return (
        <div className="cart-page__empty">
            <img className="cart-page__empty-image" src={img} alt={title} />
            <h2 className="cart-page__empty-title">{title}</h2>
            <p className="cart-page__empty-text">{text}</p>
            {onButtonClick ? (
                <button onClick={onButtonClick} className="cart-page__continue-link">
                    {buttonText}
                </button>
            ): (
                <Link href={nav || "/"} className="cart-page__continue-link">
                    {buttonText}
                </Link>
            )}
        </div>
    );
};