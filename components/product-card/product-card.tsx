import {ItemInterface} from "@/data/interfaces/ItemInterface";
import "./product-card.css"
import {LikeButton} from "../like-button/like-button";



export const ProductCard = ({ item }: { item: ItemInterface }) => {
    return (
        <div key={item.productId} className="product-card">
            <div className="product-card__image-wrapper">
                <img src={item.imageUrl} alt={item.productName} className="product-card__image" />
                <LikeButton itemId={item.productId} />
            </div>
            <h3 className="product-card__title">{item.productName}</h3>
            <div className="product-card__price">{item.price} ₽</div>
            <button className="product-card__btn">Открыть</button>
        </div>
    )
}