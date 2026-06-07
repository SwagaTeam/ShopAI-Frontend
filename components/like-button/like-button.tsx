import { useRef, useState } from "react";
import { useFavoritesStore } from "@/data/store/useFavoritesStore";
import { triggerConfetti } from "@/utils/confetti";
import { Heart } from "lucide-react";
import { sileo } from "sileo";
import "./like-button.css"

export function LikeButton(props: { itemId: string; initialIsFavorite?: boolean }) {
    const [isRequesting, setIsRequesting] = useState(false);
    const { items, isFetched, toggleFavorite } = useFavoritesStore();
    const buttonRef = useRef<HTMLButtonElement>(null);

    const isFavorite = isFetched
        ? items.some(item => item.id === props.itemId)
        : props.initialIsFavorite || false;

    const handleLikeClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isRequesting) return;

        // Триггерим конфетти сразу, если товар добавляется в избранное
        if (!isFavorite && buttonRef.current) {
            triggerConfetti(buttonRef.current);
        }

        try {
            setIsRequesting(true);
            await toggleFavorite(props.itemId);
        } catch (error) {
            sileo.error({
                title: "Ошибка",
                description: "Не удалось обновить список избранного",
                duration: 2000
            });
        } finally {
            setIsRequesting(false);
        }
    };

    return (
        <button
            ref={buttonRef}
            className={`product-card__like-btn ${isFavorite ? 'active' : ''} ${isRequesting ? 'requesting' : ''}`}
            onClick={handleLikeClick}
            title={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
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
