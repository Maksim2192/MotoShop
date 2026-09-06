"use client";

import {
  FormEvent,
  useState,
} from "react";
import Link from "next/link";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import styles from "./page.module.css";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams =
    useSearchParams();

  const token =
    searchParams.get("token") || "";

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!token) {
      setError(
        "Посилання для скидання пароля некоректне"
      );

      return;
    }

    if (password.length < 8) {
      setError(
        "Пароль повинен містити мінімум 8 символів"
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Паролі не співпадають"
      );

      return;
    }

    try {
      setSubmitting(true);

      const response =
        await fetch(
          "/api/auth/reset-password",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              token,
              password,
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
            "Не вдалося змінити пароль"
        );
      }

      setSuccess(
        "Пароль успішно змінено. Зараз перенаправимо вас на сторінку входу."
      );

      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.push("/login");
      }, 1800);
    } catch (error) {
      console.error(
        "RESET PASSWORD ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Не вдалося змінити пароль"
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

          <div
            className={styles.visualContent}
          >
            <span
              className={styles.eyebrow}
            >
              Новий пароль
            </span>

            <h1>
              Повертаємо
              <span> доступ.</span>
            </h1>

            <p>
              Створи новий пароль для свого
              акаунта MotoShop.
            </p>
          </div>
        </section>

        <section
          className={styles.formSection}
        >
          <div
            className={styles.formBox}
          >
            <div
              className={styles.formHeader}
            >
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
                Новий пароль
              </h2>

              <p>
                Введи новий пароль двічі.
              </p>
            </div>

            {!token ? (
              <div className={styles.error}>
                Посилання не містить токена
                відновлення.
              </div>
            ) : (
              <form
                className={styles.form}
                onSubmit={handleSubmit}
              >
                <div
                  className={styles.field}
                >
                  <label htmlFor="password">
                    Новий пароль
                  </label>

                  <div
                    className={
                      styles.passwordField
                    }
                  >
                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Мінімум 8 символів"
                      value={password}
                      onChange={(e) =>
                        setPassword(
                          e.target.value
                        )
                      }
                      required
                      minLength={8}
                    />

                    <button
                      type="button"
                      className={
                        styles.showPassword
                      }
                      onClick={() =>
                        setShowPassword(
                          (current) =>
                            !current
                        )
                      }
                    >
                      {showPassword
                        ? "Сховати"
                        : "Показати"}
                    </button>
                  </div>
                </div>

                <div
                  className={styles.field}
                >
                  <label
                    htmlFor="confirmPassword"
                  >
                    Повторіть пароль
                  </label>

                  <input
                    id="confirmPassword"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Повторіть пароль"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    required
                    minLength={8}
                  />
                </div>

                {success && (
                  <div
                    className={styles.success}
                  >
                    {success}
                  </div>
                )}

                {error && (
                  <div
                    className={styles.error}
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className={styles.submit}
                  disabled={
                    submitting ||
                    Boolean(success)
                  }
                >
                  {submitting
                    ? "Збереження..."
                    : "Змінити пароль"}

                  <span>→</span>
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}