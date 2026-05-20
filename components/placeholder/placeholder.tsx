import Link from "next/link";
import React from "react";
import "./placeholder.css"

interface Props {
    title: string;
    text: string;
    buttonText: string;
    img: string;
    nav: string;
}

export const Placeholder = ({title, text, buttonText, img, nav} : Props) => {
    return (
        <div className="cart-page__empty">
            <img className="cart-page__empty-image" src={img} alt={"Пустая корзина"}/>
            <h2 className="cart-page__empty-title">{title}</h2>
            <p className="cart-page__empty-text">{text}</p>
            <Link href={nav} className="cart-page__continue-link">
                {buttonText}
            </Link>
        </div>
    )
}