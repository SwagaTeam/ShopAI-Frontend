import { useRef, useState, useEffect } from "react";
import { useFavoritesStore } from "@/data/store/useFavoritesStore";
import { triggerConfetti } from "@/utils/confetti";
import { Heart } from "lucide-react";
import "./like-button.css"

export function LikeButton(props: { itemId: string; initialIsFavorite?: boolean }) {
    const [isAnimating, setIsAnimating] = useState(false);
    const { items, toggleFavorite } = useFavoritesStore();
    const buttonRef = useRef<HTMLButtonElement>(null);

    const isFavorite = items.some(item => item.id === props.itemId) || props.initialIsFavorite || false;

    useEffect(() => {
        const isInStore = items.some(item => item.id === props.itemId);
        if (!isInStore && props.initialIsFavorite) {
        }
    }, [items, props.itemId, props.initialIsFavorite]);

    const handleLikeClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isAnimating) return;

        try {
            setIsAnimating(true);
            const result = await toggleFavorite(props.itemId);

            if (result && buttonRef.current) {
                triggerConfetti(buttonRef.current);
            }
        } catch (error) {
            console.error('Ошибка при изменении избранного:', error);
        } finally {
            setIsAnimating(false);
        }
    };

    return (
        <button
            ref={buttonRef}
            className={`product-card__like-btn ${isFavorite ? 'active' : ''} ${isAnimating ? 'animating' : ''}`}
            onClick={handleLikeClick}
            title={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
            disabled={isAnimating}
        >
            <Heart
                size={20}
                className="product-card__like-icon"
                color={isFavorite ? "#FF4444" : "#99A1AF"}
                fill={isFavorite ? "#FF4444" : "none"}
            />
        </button>
    );
}