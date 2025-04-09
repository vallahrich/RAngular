export interface Restaurant {
    restaurantId: number;
    name: string;
    address: string;
    neighborhood: string;
    openingHours: string;
    cuisine: string;
    priceRange: string; // 'L', 'M', or 'H'
    dietaryOptions: string;
    createdAt: Date;
}