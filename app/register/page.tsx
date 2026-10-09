"use client";

import {
  FormEvent,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import styles from "./page.module.css";

function getRegisterError(result: unknown): string {
  let data = result;

  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch {
      return "Не вдалося створити акаунт. Спробуй ще раз.";
    }
  }

  const objectData =
    typeof data === "object" && data !== null
      ? (data as Record<string, unknown>)
      : null;

  const errors = Array.isArray(data)
    ? data
    : Array.isArray(objectData?.errors)
      ? objectData.errors
      : [];

  if (errors.length > 0) {
    const emailError = errors.some((item) => {
      if (typeof item !== "object" || item === null) {
        return false;
      }

      const error = item as {
        path?: unknown[];
        message?: string;
      };

      return (
        error.path?.includes("email") ||
        error.message === "Некоректний email"
      );
    });

    if (emailError) {
      return "Введи коректну адресу електронної пошти, наприклад name@gmail.com.";
    }

    return "Перевір правильність заповнення всіх полів.";
  }

  const message =
    typeof objectData?.message === "string"
      ? objectData.message
      : "";

  if (/email/i.test(message)) {
    return "Введи коректну адресу електронної пошти.";
  }

  if (/already exists|already registered|вже існує|вже зареєстр/i.test(message)) {
    return "Ця електронна пошта вже зареєстрована. Спробуй увійти.";
  }

  if (/password/i.test(message)) {
    return "Перевір правильність пароля.";
  }

  if (/network|fetch/i.test(message)) {
    return "Не вдалося з'єднатися із сервером. Спробуй пізніше.";
  }

  return "Не вдалося створити акаунт. Перевір дані та спробуй ще раз.";
}

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      setError("Ім'я повинно містити мінімум 2 символи.");
      return;
    }

    if (!email.trim()) {
      setError("Введи адресу електронної пошти.");
      return;
    }

    if (password.length < 8) {
      setError("Пароль повинен містити мінімум 8 символів.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Паролі не збігаються. Перевір їх і спробуй ще раз.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const text = await response.text();

      let result: unknown = {};

      try {
        result = text ? JSON.parse(text) : {};
      } catch {
        setError("Сервер тимчасово недоступний. Спробуй пізніше.");
        return;
      }

      if (!response.ok) {
        setError(getRegisterError(result));
        return;
      }

      window.dispatchEvent(new Event("auth-updated"));

      router.push("/");
      router.refresh();
    } catch {
      setError(
        "Не вдалося з'єднатися із сервером. Перевір інтернет і спробуй ще раз."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.wrapper}>
        <section className={styles.visual}>
          <Link href="/" className={styles.logo}>
            MOTO<span>SHOP</span>
          </Link>

          <div className={styles.visualContent}>
            <span className={styles.eyebrow}>
              Твій MotoShop
            </span>

            <h1>
              Створи акаунт
              для нових
              <span>{" "}маршрутів.</span>
            </h1>

            <p>
              Зберігай обрані товари,
              переглядай історію
              замовлень і оформлюй
              покупки швидше.
            </p>
          </div>

          <div className={styles.benefits}>
            <div>
              <span>01</span>
              <p>Історія замовлень</p>
            </div>

            <div>
              <span>02</span>
              <p>Обрані товари</p>
            </div>

            <div>
              <span>03</span>
              <p>Швидке оформлення</p>
            </div>
          </div>
        </section>

        <section className={styles.formSection}>
          <div className={styles.formBox}>
            <div className={styles.formHeader}>
              <Link href="/" className={styles.back}>
                ← На головну
              </Link>

              <span>Реєстрація</span>

              <h2>Створити акаунт</h2>

              <p>
                Введи свої дані, щоб
                зареєструватися.
              </p>
            </div>

            <form
              className={styles.form}
              onSubmit={handleSubmit}
              noValidate
            >
              <div className={styles.field}>
                <label htmlFor="name">Ім&apos;я</label>

                <input
                  id="name"
                  type="text"
                  placeholder="Максим"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setError("");
                  }}
                  autoComplete="name"
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="email">Email</label>

                <input
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                  }}
                  autoComplete="email"
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="password">Пароль</label>

                <div className={styles.passwordField}>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Мінімум 8 символів"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError("");
                    }}
                    autoComplete="new-password"
                    required
                    minLength={8}
                  />

                  <button
                    type="button"
                    className={styles.showPassword}
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                  >
                    {showPassword ? "Сховати" : "Показати"}
                  </button>
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="confirmPassword">
                  Повторіть пароль
                </label>

                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Повторіть пароль"
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    setError("");
                  }}
                  autoComplete="new-password"
                  required
                  minLength={8}
                />
              </div>

              {error && (
                <div
                  className={styles.error}
                  role="alert"
                  aria-live="polite"
                >
                  <span className={styles.errorIcon}>!</span>

                  <div className={styles.errorContent}>
                    <strong>Перевір дані</strong>
                    <p>{error}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className={styles.submit}
                disabled={submitting}
              >
                <span>
                  {submitting
                    ? "Створення..."
                    : "Створити акаунт"}
                </span>

                <span>{submitting ? "…" : "→"}</span>
              </button>
            </form>

            <div className={styles.divider}>
              <span />
              <p>або</p>
              <span />
            </div>

            <div className={styles.login}>
              Уже маєш акаунт?
              <Link href="/login">Увійти</Link>
            </div>

            <p className={styles.terms}>
              Створюючи акаунт, ти погоджуєшся з{" "}
              <Link href="/terms">
                умовами використання
              </Link>{" "}
              та{" "}
              <Link href="/privacy">
                політикою конфіденційності
              </Link>.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}