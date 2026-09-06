import Link from "next/link";

import styles from "./ProductCard.module.css";
import FavoriteButton from "@/components/FavoriteButton/FavoriteButton";

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

  return (
    <article className={styles.card}>
      <div className={styles.favorite}>
        <FavoriteButton
          productId={product.id}
        />
      </div>

      <div className={styles.imageWrapper}>
        <Link
          href={`/products/${product.slug}`}
          className={styles.imageLink}
        >
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className={styles.image}
            />
          ) : (
            <div className={styles.noImage}>
              Немає фото
            </div>
          )}
        </Link>

        {discount > 0 && (
          <span className={styles.discount}>
            -{discount}%
          </span>
        )}

        {product.stock <= 0 && (
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
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={
                    star <= Math.round(rating)
                      ? styles.starActive
                      : styles.star
                  }
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
              {product.price} грн
            </span>

            {product.oldPrice !== null &&
              product.oldPrice > product.price && (
                <span className={styles.oldPrice}>
                  {product.oldPrice} грн
                </span>
              )}
          </div>

          <span
            className={`${styles.stock} ${
              product.stock > 0
                ? styles.inStock
                : styles.noStock
            }`}
          >
            {product.stock > 0
              ? "В наявності"
              : "Немає в наявності"}
          </span>
        </div>
      </Link>
    </article>
  );
}