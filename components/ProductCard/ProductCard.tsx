import Link from "next/link";

import FavoriteButton from "@/components/FavoriteButton/FavoriteButton";

import styles from "./ProductCard.module.css";

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

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  const discount =
    product.oldPrice !== null &&
    product.oldPrice > product.price
      ? Math.round(
          ((product.oldPrice - product.price) /
            product.oldPrice) *
            100
        )
      : 0;

  const rating = product.rating ?? 0;
  const isAvailable = product.stock > 0;

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <Link
          href={`/products/${product.slug}`}
          className={styles.imageLink}
          aria-label={`Переглянути ${product.name}`}
        >
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className={styles.image}
            />
          ) : (
            <div className={styles.noImage}>
              <span>Немає фото</span>
            </div>
          )}
        </Link>

        <div className={styles.favorite}>
          <FavoriteButton productId={product.id} />
        </div>

        {discount > 0 && (
          <span className={styles.discount}>
            -{discount}%
          </span>
        )}

        {!isAvailable && (
          <span className={styles.outOfStock}>
            Немає в наявності
          </span>
        )}
      </div>

      <Link
        href={`/products/${product.slug}`}
        className={styles.contentLink}
      >
        <div className={styles.content}>
          {product.category && (
            <span className={styles.category}>
              {product.category.name}
            </span>
          )}

          <h3 className={styles.name}>
            {product.name}
          </h3>

          <div className={styles.rating}>
            <div
              className={styles.stars}
              aria-label={`Рейтинг ${rating.toFixed(1)} з 5`}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={
                    star <= Math.round(rating)
                      ? styles.starActive
                      : styles.star
                  }
                  aria-hidden="true"
                >
                  ★
                </span>
              ))}
            </div>

            <span className={styles.ratingValue}>
              {rating.toFixed(1)}
            </span>
          </div>

          <div className={styles.priceRow}>
            <span className={styles.price}>
              {product.price.toLocaleString("uk-UA")} грн
            </span>

            {product.oldPrice !== null &&
              product.oldPrice > product.price && (
                <span className={styles.oldPrice}>
                  {product.oldPrice.toLocaleString("uk-UA")} грн
                </span>
              )}
          </div>
          <div
            className={`${styles.stock} ${
              isAvailable
                ? styles.inStock
                : styles.noStock
            }`}
          >
            <span className={styles.stockDot} />

            {isAvailable
              ? product.stock <= 5
                ? `Залишилось ${product.stock} шт.`
                : "В наявності"
              : "Немає в наявності"}
          </div>
        </div>
      </Link>
    </article>
  );
}