import Link from "next/link";
import styles from "./PopularProducts.module.css";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  oldPrice: number | null;
  images: string[];
}

export default async function PopularProducts() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
    {
      cache: "no-store",
    }
  );

  const result = await response.json();

  const products: Product[] = result.data ?? [];

  const popularProducts = products.slice(0, 4);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <span className={styles.label}>
              Рекомендуємо
            </span>

            <h2 className={styles.title}>
              Популярні товари
            </h2>
          </div>

          <Link
            href="/products"
            className={styles.allLink}
          >
            Дивитися всі →
          </Link>
        </div>

        <div className={styles.grid}>
          {popularProducts.map((product) => {
            const discount =
              product.oldPrice !== null
                ? Math.round(
                    ((product.oldPrice -
                      product.price) /
                      product.oldPrice) *
                      100
                  )
                : 0;

            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className={styles.card}
              >
                <div className={styles.imageWrapper}>
                  {discount > 0 && (
                    <span className={styles.discount}>
                      -{discount}%
                    </span>
                  )}

                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className={styles.image}
                  />
                </div>

                <div className={styles.cardContent}>
                  <h3 className={styles.productName}>
                    {product.name}
                  </h3>

                  <div className={styles.priceRow}>
                    <span className={styles.price}>
                      {product.price} грн
                    </span>

                    {product.oldPrice !== null && (
                      <span className={styles.oldPrice}>
                        {product.oldPrice} грн
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}