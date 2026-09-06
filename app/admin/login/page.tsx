"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import styles from "./page.module.css";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      if (!response.ok) {
        setError(
          "Невірний email або пароль"
        );

        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (error) {
      console.error(
        "ADMIN LOGIN ERROR:",
        error
      );

      setError(
        "Не вдалося виконати вхід. Спробуйте ще раз."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      {/* LEFT SIDE */}

      <section className={styles.visual}>
        <Link
          href="/"
          className={styles.logo}
        >
          MOTO<span>SHOP</span>
        </Link>

        <div
          className={
            styles.visualContent
          }
        >
          <span
            className={styles.eyebrow}
          >
            MotoShop Admin
          </span>

          <h1>
            Панель
            <span> керування.</span>
          </h1>

          <p>
            Керуйте товарами,
            замовленнями,
            користувачами та
            повідомленнями магазину
            в одному місці.
          </p>
        </div>

        <div className={styles.security}>
          <div
            className={
              styles.securityIcon
            }
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
            >
              <rect
                x="5"
                y="10"
                width="14"
                height="10"
                rx="2"
                stroke="currentColor"
                strokeWidth="2"
              />

              <path
                d="M8 10V7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7V10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div>
            <strong>
              Захищений доступ
            </strong>

            <span>
              Тільки для
              адміністраторів
            </span>
          </div>
        </div>
      </section>

      {/* RIGHT SIDE */}

      <section
        className={styles.formSection}
      >
        <div className={styles.formBox}>
          <div
            className={styles.formHeader}
          >
            <span
              className={
                styles.adminLabel
              }
            >
              Admin access
            </span>

            <h2>
              Вхід до панелі
            </h2>

            <p>
              Введіть дані
              адміністратора для
              продовження.
            </p>
          </div>

          <form
            className={styles.form}
            onSubmit={handleSubmit}
          >
            {/* EMAIL */}

            <div
              className={styles.field}
            >
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="admin@motoshop.com"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                autoComplete="email"
                required
              />
            </div>

            {/* PASSWORD */}

            <div
              className={styles.field}
            >
              <label htmlFor="password">
                Пароль
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
                  placeholder="Введіть пароль"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  autoComplete="current-password"
                  required
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

            {/* ERROR */}

            {error && (
              <div
                className={styles.error}
              >
                <span
                  className={
                    styles.errorIcon
                  }
                >
                  !
                </span>

                <p>{error}</p>
              </div>
            )}

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className={styles.submit}
              disabled={loading}
            >
              <span>
                {loading
                  ? "Виконуємо вхід..."
                  : "Увійти"}
              </span>

              {!loading && (
                <span>→</span>
              )}
            </button>
          </form>

          {/* BACK */}

          <div className={styles.back}>
            <Link href="/">
              ← Повернутися до магазину
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}