export interface CoffeeItem {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  imageUrl: string;
  extras?: Extra[];
  sizes?: Size[];
}

export interface Size {
  name: string;
  price: number;
  discountPrice?: number;
}

export interface Extra {
  name: string;
  price: number;
  discountPrice?: number;
}
