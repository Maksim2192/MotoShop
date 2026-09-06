"use client";

import {
  useEffect,
  useState,
} from "react";

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

export default function ProductReviews({
  productId,
}: ProductReviewsProps) {
  const [data, setData] =
    useState<ReviewsResponse>({
      reviews: [],
      rating: 0,
      count: 0,
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
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

        const text =
          await response.text();

        let result: any = {};

        try {
          result = text
            ? JSON.parse(text)
            : {};
        } catch {
          throw new Error(
            "Сервер повернув некоректну відповідь"
          );
        }

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Не вдалося завантажити відгуки"
          );
        }

        const reviews: Review[] =
          Array.isArray(result.data)
            ? result.data
            : Array.isArray(
                  result.data?.reviews
                )
              ? result.data.reviews
              : [];

        const calculatedRating =
          reviews.length > 0
            ? reviews.reduce(
                (
                  sum,
                  review
                ) =>
                  sum +
                  Number(
                    review.rating
                  ),
                0
              ) / reviews.length
            : 0;

        const rating =
          Array.isArray(result.data)
            ? calculatedRating
            : Number(
                result.data?.rating ??
                  calculatedRating
              );

        const count =
          Array.isArray(result.data)
            ? reviews.length
            : Number(
                result.data?.count ??
                  reviews.length
              );

        setData({
          reviews,

          rating:
            Math.round(
              rating * 10
            ) / 10,

          count,
        });
      } catch (error) {
        console.error(
          "LOAD REVIEWS ERROR:",
          error
        );

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
        setLoading(false);
      }
    };

    if (productId) {
      loadReviews();
    }
  }, [productId]);

  if (loading) {
    return (
      <section className={styles.section}>
        <p className={styles.loading}>
          Завантаження відгуків...
        </p>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <span className={styles.label}>
            Відгуки покупців
          </span>

          <h2>
            Оцінки та коментарі
          </h2>
        </div>

        <div className={styles.ratingBox}>
          <strong>
            {data.rating.toFixed(1)}
          </strong>

          <div>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map(
                (star) => (
                  <span
                    key={star}
                    className={
                      star <=
                      Math.round(
                        data.rating
                      )
                        ? styles.starActive
                        : styles.star
                    }
                  >
                    ★
                  </span>
                )
              )}
            </div>

            <span>
              {data.count}{" "}
              {data.count === 1
                ? "відгук"
                : data.count >= 2 &&
                    data.count <= 4
                  ? "відгуки"
                  : "відгуків"}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {!error &&
        data.reviews.length === 0 && (
          <div className={styles.empty}>
            <span>☆</span>

            <h3>
              Відгуків поки немає
            </h3>

            <p>
              Після отримання замовлення
              покупці зможуть залишити
              свою оцінку.
            </p>
          </div>
        )}

      {!error &&
        data.reviews.length > 0 && (
          <div className={styles.reviews}>
            {data.reviews.map(
              (review) => {
                const userName =
                  review.user?.name ||
                  "Користувач";

                const initial =
                  userName
                    .charAt(0)
                    .toUpperCase();

                return (
                  <article
                    key={review.id}
                    className={
                      styles.review
                    }
                  >
                    <div
                      className={
                        styles.reviewTop
                      }
                    >
                      <div
                        className={
                          styles.user
                        }
                      >
                        <div
                          className={
                            styles.avatar
                          }
                        >
                          {initial}
                        </div>

                        <div>
                          <strong>
                            {userName}
                          </strong>

                          <span>
                            {new Date(
                              review.createdAt
                            ).toLocaleDateString(
                              "uk-UA",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>

                      <div
                        className={
                          styles.reviewStars
                        }
                      >
                        {[1, 2, 3, 4, 5].map(
                          (star) => (
                            <span
                              key={star}
                              className={
                                star <=
                                review.rating
                                  ? styles.starActive
                                  : styles.star
                              }
                            >
                              ★
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    {review.comment && (
                      <p
                        className={
                          styles.comment
                        }
                      >
                        {review.comment}
                      </p>
                    )}

                    <div
                      className={
                        styles.verified
                      }
                    >
                      ✓ Підтверджена покупка
                    </div>
                  </article>
                );
              }
            )}
          </div>
        )}
    </section>
  );
}