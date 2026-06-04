import {formatDate, getInitial} from "@/utils/utils";
import {renderStars} from "@/utils/utilsJSX";
import "./review.css"

export const ReviewCard = ({review}: any) => {
    return (
        <>
            <div className="review-card">
                <div className="review-card-header">
                    <div className="review-avatar">
                        {getInitial(review.userName)}
                    </div>
                    <div className="review-user-info">
                        <div className="review-user-name-row">
                            <span className="review-user-name">{review?.userName || "Аноним"}</span>
                        </div>
                        <div className="review-stars-row">
                            {renderStars(review.rating)}
                        </div>
                    </div>
                    <span className="review-date">
                                                {formatDate(review.createdAtUtc)}
                                            </span>
                </div>

                {/* Изображения отзыва */}
                {review.imagePaths && review.imagePaths.length > 0 && (
                    <div className="review-images">
                        {review.imagePaths.map((path, idx) => (
                            <img key={idx} src={path} alt={`Фото отзыва ${idx + 1}`} />
                        ))}
                    </div>
                )}

                <p className="review-comment">{review.comment}</p>
            </div>
        </>
    )
}