"use client";

import { FormEvent, useState } from "react";
import styles from "./ReviewForm.module.css";

interface ReviewFormProps {
  productId: number;
  productName: string;
}

export default function ReviewForm({
  productId,
  productName,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (rating < 1) {
      setError("Оберіть оцінку від 1 до 5 зірок");
      return;
    }

    const trimmedComment = comment.trim();

    if (trimmedComment.length < 2) {
      setError("Напишіть короткий коментар");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `/api/reviews/product/${productId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rating,
            comment: trimmedComment,
          }),
        }
      );

      const text = await response.text();

      let result: { message?: string } = {};

      try {
        result = text ? JSON.parse(text) : {};
      } catch {
        result = {};
      }

      if (response.status === 401) {
        throw new Error(
          "Щоб залишити відгук, потрібно увійти в акаунт"
        );
      }

      if (!response.ok) {
        throw new Error(
          result.message || "Не вдалося залишити відгук"
        );
      }

      setSuccess(true);

      window.dispatchEvent(
        new Event("reviews-updated")
      );
    } catch (error) {
      console.error("CREATE REVIEW ERROR:", error);

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
        <div className={styles.successIcon}>✓</div>

        <div className={styles.successContent}>
          <strong>Дякуємо за відгук!</strong>

          <p>
            Ваша оцінка товару «{productName}» успішно
            опублікована.
          </p>
        </div>
      </div>
    );
  }

  const selectedRating = hoverRating || rating;

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
    >
      <div className={styles.top}>
        <div className={styles.heading}>
          <span className={styles.label}>
            Оцінка товару
          </span>

          <h3>Як вам {productName}?</h3>
        </div>

        <div
          className={styles.stars}
          onMouseLeave={() => setHoverRating(0)}
          aria-label="Оберіть оцінку"
        >
          {[1, 2, 3, 4, 5].map((star) => {
            const active = star <= selectedRating;

            return (
              <button
                key={star}
                type="button"
                className={`${styles.star} ${
                  active ? styles.starActive : ""
                }`}
                onClick={() => {
                  setRating(star);
                  setError("");
                }}
                onMouseEnter={() =>
                  setHoverRating(star)
                }
                disabled={loading}
                aria-label={`${star} з 5 зірок`}
                aria-pressed={rating === star}
              >
                ★
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.ratingHint}>
        {selectedRating > 0
          ? `${selectedRating} з 5`
          : "Оберіть оцінку"}
      </div>

      <div className={styles.field}>
        <label htmlFor={`review-${productId}`}>
          Ваш коментар
        </label>

        <div className={styles.textareaWrapper}>
          <textarea
            id={`review-${productId}`}
            value={comment}
            onChange={(event) => {
              setComment(event.target.value);
              setError("");
            }}
            placeholder="Наприклад: якість хороша, товар відповідає опису..."
            rows={5}
            maxLength={1000}
            disabled={loading}
          />

          <span className={styles.counter}>
            {comment.length}/1000
          </span>
        </div>
      </div>

      {error && (
        <div
          className={styles.error}
          role="alert"
        >
          <span className={styles.errorIcon}>!</span>
          <span>{error}</span>
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

        <span
          className={styles.submitArrow}
          aria-hidden="true"
        >
          {loading ? "..." : "→"}
        </span>
      </button>
    </form>
  );
}