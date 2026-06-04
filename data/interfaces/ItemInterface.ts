export interface ItemInterface {
    id: string,
    name: string,
    price: number,
    imageUrl: string
    quantity: number;
    brandName: string;
    stockQuantity: number;
    rating: number;
    reviewsCount: number;
    shopName: string;
    tags: string[];
    isInWishlist: boolean;
    imageUrls?: string[];
    cartQuantity: number;
}