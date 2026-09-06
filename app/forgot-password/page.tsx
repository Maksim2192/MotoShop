"use client";

import {
  FormEvent,
  useState,
} from "react";
import Link from "next/link";

import styles from "./page.module.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        "/api/auth/forgot-password",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email: email.trim(),
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
        throw new Error(
          "Сервер повернув некоректну відповідь"
        );
      }

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Не вдалося надіслати інструкцію"
        );
      }

      setSuccess(
        result.message ||
          "Інструкцію надіслано на email"
      );
    } catch (error) {
      console.error(
        "FORGOT PASSWORD ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Не вдалося виконати запит"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.wrapper}>
        <section className={styles.visual}>
          <Link
            href="/"
            className={styles.logo}
          >
            MOTO<span>SHOP</span>
          </Link>

          <div className={styles.visualContent}>
            <span className={styles.eyebrow}>
              Відновлення доступу
            </span>

            <h1>
              Забув пароль?
              <span> Не проблема.</span>
            </h1>

            <p>
              Вкажи email свого акаунта, і ми
              надішлемо посилання для створення
              нового пароля.
            </p>
          </div>
        </section>

        <section className={styles.formSection}>
          <div className={styles.formBox}>
            <div className={styles.formHeader}>
              <Link
                href="/login"
                className={styles.back}
              >
                ← Назад до входу
              </Link>

              <span>
                Скидання пароля
              </span>

              <h2>
                Відновити доступ
              </h2>

              <p>
                Введи email, який використовував
                під час реєстрації.
              </p>
            </div>

            <form
              className={styles.form}
              onSubmit={handleSubmit}
            >
              <div className={styles.field}>
                <label htmlFor="email">
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  autoComplete="email"
                  required
                />
              </div>

              {success && (
                <div className={styles.success}>
                  {success}
                </div>
              )}

              {error && (
                <div className={styles.error}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className={styles.submit}
                disabled={submitting}
              >
                {submitting
                  ? "Надсилання..."
                  : "Надіслати посилання"}

                <span>→</span>
              </button>
            </form>

            <p className={styles.note}>
              Посилання для скидання пароля
              дійсне 30 хвилин.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}