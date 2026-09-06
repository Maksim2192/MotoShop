"use client";

import {
    FormEvent,
    useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import styles from "./page.module.css";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState("");

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        try {
            setSubmitting(true);
            setError("");

            const response = await fetch(
                "/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        email: email.trim(),
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
                    "Не вдалося увійти"
                );
            }

            window.dispatchEvent(
                new Event("auth-updated")
            );

            router.push("/");
            router.refresh();
        } catch (error) {
            console.error(
                "LOGIN ERROR:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "Не вдалося увійти"
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
                            З поверненням
                        </span>

                        <h1>
                            Продовжуй
                            <span> свій маршрут.</span>
                        </h1>

                        <p>
                            Увійди в акаунт, щоб переглядати
                            замовлення, обрані товари та швидше
                            оформлювати покупки.
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
                            <Link
                                href="/"
                                className={styles.back}
                            >
                                ← На головну
                            </Link>

                            <span>Вхід</span>

                            <h2>
                                Увійти в акаунт
                            </h2>

                            <p>
                                Введи email та пароль.
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

                            <div className={styles.field}>
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
                                        onChange={(e) =>
                                            setPassword(
                                                e.target.value
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
                            <div
                                className={styles.forgotPassword}
                            >
                                <Link href="/forgot-password">
                                    Забули пароль?
                                </Link>
                            </div>

                            {error && (
                                <div
                                    className={
                                        styles.error
                                    }
                                >
                                    <span>!</span>

                                    <p>{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                className={
                                    styles.submit
                                }
                                disabled={submitting}
                            >
                                <span>
                                    {submitting
                                        ? "Вхід..."
                                        : "Увійти"}
                                </span>

                                <span>→</span>
                            </button>
                        </form>

                        <div className={styles.divider}>
                            <span />
                            <p>або</p>
                            <span />
                        </div>

                        <div className={styles.register}>
                            Немає акаунта?

                            <Link href="/register">
                                Зареєструватися
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}