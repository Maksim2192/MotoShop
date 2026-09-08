import Link from "next/link";

import ProductCard from "@/components/ProductCard/ProductCard";

import styles from "./PopularProducts.module.css";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  images: string[];
  rating?: number;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
}

interface ProductsResponse {
  data?: Product[];
}

export default async function PopularProducts() {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      return null;
    }

    const response = await fetch(
      `${apiUrl}/api/products`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const result: ProductsResponse =
      await response.json();

    const products =
      result.data ?? [];

    const popularProducts =
      products
        .filter(
          (product) => product.stock > 0
        )
        .slice(0, 4);

    if (!popularProducts.length) {
      return null;
    }

    return (
      <section
        className={styles.section}
        aria-labelledby="popular-products-title"
      >
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <span
                className={styles.label}
              >
                Рекомендуємо
              </span>

              <h2
                id="popular-products-title"
                className={styles.title}
              >
                Популярні товари
              </h2>

              <p
                className={styles.subtitle}
              >
                Те, що найчастіше обирають
                наші покупці.
              </p>
            </div>

            <Link
              href="/products"
              className={styles.allLink}
            >
              <span>
                Дивитися всі
              </span>

              <span aria-hidden="true">
                →
              </span>
            </Link>
          </div>

          <div className={styles.grid}>
            {popularProducts.map(
              (product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              )
            )}
          </div>
        </div>
      </section>
    );
  } catch {
    return null;
  }
}