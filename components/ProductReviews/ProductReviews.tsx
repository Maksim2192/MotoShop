"use client";

import { useEffect, useState } from "react";
import styles from "./ProductReviews.module.css";

interface Review {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    id: number;
    name: string;
  };
}

interface ReviewsResponse {
  reviews: Review[];
  rating: number;
  count: number;
}

interface ProductReviewsProps {
  productId: number;
}

const getReviewWord = (count: number) => {
  if (count === 1) return "відгук";
  if (count >= 2 && count <= 4) return "відгуки";
  return "відгуків";
};

const getInitial = (name: string) => {
  return name.trim().charAt(0).toUpperCase() || "К";
};

const formatDate = (date: string) => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export default function ProductReviews({
  productId,
}: ProductReviewsProps) {
  const [data, setData] = useState<ReviewsResponse>({
    reviews: [],
    rating: 0,
    count: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!productId) return;

    let cancelled = false;

    const loadReviews = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/reviews/product/${productId}`,
          {
            cache: "no-store",
          }
        );

        const text = await response.text();

        let result: {
          data?: Review[] | {
            reviews?: Review[];
            rating?: number;
            count?: number;
          };
          message?: string;
        } = {};

        try {
          result = text ? JSON.parse(text) : {};
        } catch {
          throw new Error(
            "Сервер повернув некоректну відповідь"
          );
        }

        if (!response.ok) {
          throw new Error(
            result.message || "Не вдалося завантажити відгуки"
          );
        }

        const reviews = Array.isArray(result.data)
          ? result.data
          : Array.isArray(result.data?.reviews)
            ? result.data.reviews
            : [];

        const calculatedRating =
          reviews.length > 0
            ? reviews.reduce(
                (sum, review) => sum + Number(review.rating),
                0
              ) / reviews.length
            : 0;

        const rating = Array.isArray(result.data)
          ? calculatedRating
          : Number(result.data?.rating ?? calculatedRating);

        const count = Array.isArray(result.data)
          ? reviews.length
          : Number(result.data?.count ?? reviews.length);

        if (cancelled) return;

        setData({
          reviews,
          rating: Math.round(rating * 10) / 10,
          count,
        });
      } catch (error) {
        if (cancelled) return;

        console.error("LOAD REVIEWS ERROR:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Не вдалося завантажити відгуки"
        );

        setData({
          reviews: [],
          rating: 0,
          count: 0,
        });
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadReviews();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.loading}>
          <span className={styles.loadingSpinner} />
          <span>Завантаження відгуків...</span>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.heading}>
          <span className={styles.label}>
            Відгуки покупців
          </span>

          <h2>Оцінки та коментарі</h2>
        </div>

        <div className={styles.ratingBox}>
          <strong>{data.rating.toFixed(1)}</strong>

          <div className={styles.ratingInfo}>
            <div
              className={styles.stars}
              aria-label={`Середня оцінка ${data.rating} з 5`}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={
                    star <= Math.round(data.rating)
                      ? styles.starActive
                      : styles.star
                  }
                  aria-hidden="true"
                >
                  ★
                </span>
              ))}
            </div>

            <span>
              {data.count} {getReviewWord(data.count)}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className={styles.error} role="alert">
          <span className={styles.errorIcon}>!</span>
          <span>{error}</span>
        </div>
      )}

      {!error && data.reviews.length === 0 && (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>☆</div>

          <h3>Відгуків поки немає</h3>

          <p>
            Після отримання замовлення покупці зможуть
            залишити свою оцінку та поділитися враженнями.
          </p>
        </div>
      )}

      {!error && data.reviews.length > 0 && (
        <div className={styles.reviews}>
          {data.reviews.map((review) => {
            const userName =
              review.user?.name?.trim() || "Користувач";

            return (
              <article
                key={review.id}
                className={styles.review}
              >
                <div className={styles.reviewTop}>
                  <div className={styles.user}>
                    <div className={styles.avatar}>
                      {getInitial(userName)}
                    </div>

                    <div className={styles.userInfo}>
                      <strong>{userName}</strong>

                      <span>
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div
                    className={styles.reviewStars}
                    aria-label={`Оцінка ${review.rating} з 5`}
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={
                          star <= review.rating
                            ? styles.starActive
                            : styles.star
                        }
                        aria-hidden="true"
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                {review.comment?.trim() && (
                  <p className={styles.comment}>
                    {review.comment}
                  </p>
                )}

                <div className={styles.verified}>
                  <span>✓</span>
                  Підтверджена покупка
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}