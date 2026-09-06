interface Category {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    oldPrice: number | null;
    stock: number;
    rating: number;
    images: string[];
    specs: {
        [key: string]: string | number;
    };
    category: Category;
    categoryId: number;
    createdAt: string;
    updatedAt: string;
}