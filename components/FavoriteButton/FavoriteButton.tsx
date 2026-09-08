"use client";

import {
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import styles from "./FavoriteButton.module.css";

interface FavoriteButtonProps {
  productId: number;
}

interface Favorite {
  id: number;
  productId: number;
}

export default function FavoriteButton({
  productId,
}: FavoriteButtonProps) {
  const router = useRouter();

  const [isFavorite, setIsFavorite] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    let cancelled = false;

    const checkFavorite = async () => {
      try {
        const response = await fetch(
          "/api/favorites",
          {
            cache: "no-store",
          }
        );

        if (response.status === 401) {
          return;
        }

        if (!response.ok) {
          return;
        }

        const result = await response.json();

        const favorites: Favorite[] =
          result.data ?? [];

        if (cancelled) {
          return;
        }

        setIsFavorite(
          favorites.some(
            (item) =>
              item.productId === productId
          )
        );
      } catch {
        // Користувач може бути не авторизований.
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    checkFavorite();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  const handleFavorite = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        `/api/favorites/${productId}`,
        {
          method: isFavorite
            ? "DELETE"
            : "POST",
        }
      );

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      const text = await response.text();

      let result: {
        message?: string;
      } = {};

      try {
        result = text
          ? JSON.parse(text)
          : {};
      } catch {
        result = {};
      }

      if (!response.ok) {
        throw new Error(
          result.message ??
            "Не вдалося оновити обране"
        );
      }

      setIsFavorite(
        (current) => !current
      );

      window.dispatchEvent(
        new Event("favorites-updated")
      );
    } catch (error) {
      console.error(
        "FAVORITE ERROR:",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  const label = isFavorite
    ? "Видалити з обраного"
    : "Додати в обране";

  return (
    <button
      type="button"
      className={`${styles.button} ${
        isFavorite ? styles.active : ""
      }`}
      onClick={handleFavorite}
      disabled={isLoading}
      aria-label={label}
      title={label}
      aria-pressed={isFavorite}
    >
      {isLoading ? (
        <span
          className={styles.spinner}
          aria-hidden="true"
        />
      ) : (
        <svg
          className={styles.icon}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M20.84 4.61C20.3292 4.099 19.7228 3.69365 19.0554 3.41708C18.3879 3.14052 17.6725 2.99818 16.95 2.99818C16.2275 2.99818 15.5121 3.14052 14.8446 3.41708C14.1772 3.69365 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.1917 3.5783 3.16 4.61C2.1283 5.6417 1.5487 7.04097 1.5487 8.5C1.5487 9.95903 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7564 11.2728 22.0329 10.6054C22.3095 9.9379 22.4518 9.22249 22.4518 8.5C22.4518 7.77751 22.3095 7.0621 22.0329 6.39464C21.7564 5.72719 21.351 5.12075 20.84 4.61Z"
            fill={
              isFavorite
                ? "currentColor"
                : "none"
            }
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}