export interface ICartItem {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    imageUrl: string;
    brandName: string;
    stockQuantity: number;
    rating: number;
    reviewsCount: number;
    shopName: string;
    tags: string[];
    isInWishlist: boolean;
    imageUrls?: string[];
}