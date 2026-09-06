"use client";

import {
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import styles from "./page.module.css";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  images: string[];
}

interface Favorite {
  id: number;
  productId: number;
  product: Product;
}

export default function FavoritesPage() {
  const router = useRouter();

  const [favorites, setFavorites] =
    useState<Favorite[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [actionId, setActionId] =
    useState<number | null>(null);

  const loadFavorites = async () => {
    try {
      setError("");

      const response = await fetch(
        "/api/favorites",
        {
          cache: "no-store",
        }
      );

      const text =
        await response.text();

      let result;

      try {
        result = text
          ? JSON.parse(text)
          : {};
      } catch {
        throw new Error(
          "Сервер повернув некоректну відповідь"
        );
      }

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Не вдалося завантажити обране"
        );
      }

      setFavorites(
        result.data ?? []
      );
    } catch (error) {
      console.error(
        "LOAD FAVORITES ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Не вдалося завантажити обране"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleRemove = async (
    productId: number
  ) => {
    try {
      setActionId(productId);

      const response = await fetch(
        `/api/favorites/${productId}`,
        {
          method: "DELETE",
        }
      );

      const text =
        await response.text();

      let result;

      try {
        result = text
          ? JSON.parse(text)
          : {};
      } catch {
        result = {};
      }

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Не вдалося видалити товар"
        );
      }

      setFavorites((current) =>
        current.filter(
          (favorite) =>
            favorite.productId !==
            productId
        )
      );

      window.dispatchEvent(
        new Event("favorites-updated")
      );
    } catch (error) {
      console.error(
        "REMOVE FAVORITE ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Не вдалося видалити товар"
      );
    } finally {
      setActionId(null);
    }
  };

  if (loading) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.loading}>
            Завантаження обраного...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <span className={styles.label}>
              Особистий кабінет
            </span>

            <h1>Обране</h1>

            <p>
              Тут зберігаються товари,
              які ти додав до обраного.
            </p>
          </div>

          <Link
            href="/profile"
            className={styles.back}
          >
            ← До профілю
          </Link>
        </header>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        {!error &&
          favorites.length === 0 && (
            <div className={styles.empty}>
              <span>♡</span>

              <h2>
                Обраних товарів немає
              </h2>

              <p>
                Додай товари до обраного,
                щоб швидко знайти їх пізніше.
              </p>

              <Link href="/products">
                Перейти до каталогу
              </Link>
            </div>
          )}

        <div className={styles.grid}>
          {favorites.map(
            (favorite) => {
              const product =
                favorite.product;

              const image =
                product.images?.[0] ||
                "";

              const discount =
                product.oldPrice &&
                product.oldPrice >
                  product.price
                  ? Math.round(
                      ((product.oldPrice -
                        product.price) /
                        product.oldPrice) *
                        100
                    )
                  : 0;

              return (
                <article
                  key={favorite.id}
                  className={
                    styles.card
                  }
                >
                  <Link
                    href={`/products/${product.slug}`}
                    className={
                      styles.imageWrap
                    }
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={product.name}
                      />
                    ) : (
                      <div
                        className={
                          styles.noImage
                        }
                      >
                        Немає фото
                      </div>
                    )}

                    {discount > 0 && (
                      <span
                        className={
                          styles.discount
                        }
                      >
                        -{discount}%
                      </span>
                    )}
                  </Link>

                  <div
                    className={
                      styles.cardBody
                    }
                  >
                    <div
                      className={
                        styles.cardTop
                      }
                    >
                      <Link
                        href={`/products/${product.slug}`}
                      >
                        <h2>
                          {product.name}
                        </h2>
                      </Link>

                      <button
                        type="button"
                        className={
                          styles.remove
                        }
                        onClick={() =>
                          handleRemove(
                            product.id
                          )
                        }
                        disabled={
                          actionId ===
                          product.id
                        }
                        aria-label="Видалити з обраного"
                      >
                        {actionId ===
                        product.id
                          ? "..."
                          : "×"}
                      </button>
                    </div>

                    <div
                      className={
                        styles.price
                      }
                    >
                      <strong>
                        {product.price} грн
                      </strong>

                      {product.oldPrice &&
                        product.oldPrice >
                          product.price && (
                          <span>
                            {
                              product.oldPrice
                            }{" "}
                            грн
                          </span>
                        )}
                    </div>

                    <div
                      className={
                        styles.stock
                      }
                    >
                      {product.stock > 0
                        ? "В наявності"
                        : "Немає в наявності"}
                    </div>

                    <Link
                      href={`/products/${product.slug}`}
                      className={
                        styles.details
                      }
                    >
                      Переглянути товар
                      <span>→</span>
                    </Link>
                  </div>
                </article>
              );
            }
          )}
        </div>
      </div>
    </main>
  );
}