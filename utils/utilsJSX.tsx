import {Star} from "lucide-react";

export const renderStars = (rating: number, size: number = 16) => {
    return Array.from({ length: 5 }, (_, i) => (
        <Star
            key={i}
            size={size}
            fill={i < rating ? '#4b77e4' : '#e5e7eb'}
            stroke={i < rating ? '#3867da' : '#e5e7eb'}
        />
    ));
};