"use client";

import {
  FormEvent,
  useState,
} from "react";

import styles from "./ReviewForm.module.css";

interface ReviewFormProps {
  productId: number;
  productName: string;
}

export default function ReviewForm({
  productId,
  productName,
}: ReviewFormProps) {
  const [rating, setRating] =
    useState(0);

  const [hoverRating, setHoverRating] =
    useState(0);

  const [comment, setComment] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (rating < 1) {
      setError(
        "Оберіть оцінку від 1 до 5 зірок"
      );
      return;
    }

    if (comment.trim().length < 2) {
      setError(
        "Напишіть короткий коментар"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `/api/reviews/product/${productId}`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            rating,
            comment:
              comment.trim(),
          }),
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
            "Не вдалося залишити відгук"
        );
      }

      setSuccess(true);
    } catch (error) {
      console.error(
        "CREATE REVIEW ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Не вдалося залишити відгук"
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.success}>
        <div className={styles.successIcon}>
          ✓
        </div>

        <div>
          <strong>
            Дякуємо за відгук!
          </strong>

          <p>
            Ваша оцінка товару
            «{productName}» опублікована.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
    >
      <div className={styles.top}>
        <div>
          <span className={styles.label}>
            Оцінка товару
          </span>

          <h3>
            Як вам {productName}?
          </h3>
        </div>

        <div className={styles.stars}>
          {[1, 2, 3, 4, 5].map(
            (star) => {
              const active =
                star <=
                (hoverRating ||
                  rating);

              return (
                <button
                  key={star}
                  type="button"
                  className={`${styles.star} ${
                    active
                      ? styles.starActive
                      : ""
                  }`}
                  onClick={() =>
                    setRating(star)
                  }
                  onMouseEnter={() =>
                    setHoverRating(
                      star
                    )
                  }
                  onMouseLeave={() =>
                    setHoverRating(0)
                  }
                  aria-label={`${star} зірок`}
                >
                  ★
                </button>
              );
            }
          )}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor={`review-${productId}`}>
          Ваш коментар
        </label>

        <textarea
          id={`review-${productId}`}
          value={comment}
          onChange={(event) =>
            setComment(
              event.target.value
            )
          }
          placeholder="Наприклад: якість хороша, товар відповідає опису..."
          rows={4}
          maxLength={1000}
        />

        <span className={styles.counter}>
          {comment.length}/1000
        </span>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <button
        type="submit"
        className={styles.submit}
        disabled={loading}
      >
        <span>
          {loading
            ? "Публікація..."
            : "Надіслати відгук"}
        </span>

        <span>→</span>
      </button>
    </form>
  );
}