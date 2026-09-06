"use client";

import {
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import styles from "./page.module.css";

interface User {
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        setError("");

        const response = await fetch(
          "/api/auth/me",
          {
            cache: "no-store",
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

        if (response.status === 401) {
          router.push("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Не вдалося завантажити профіль"
          );
        }

        setUser(result.data);
      } catch (error) {
        console.error(
          "PROFILE ERROR:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Не вдалося завантажити профіль"
        );
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [router]);

  if (loading) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.loading}>
            Завантаження профілю...
          </div>
        </div>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.error}>
            {error ||
              "Не вдалося завантажити профіль"}
          </div>
        </div>
      </main>
    );
  }

  const initials =
    user.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <span className={styles.label}>
              Особистий кабінет
            </span>

            <h1>Мій профіль</h1>

            <p>
              Керуй особистими даними,
              замовленнями та налаштуваннями
              акаунта.
            </p>
          </div>
        </header>

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <div className={styles.userCard}>
              <div className={styles.avatar}>
                {initials}
              </div>

              <div>
                <strong>
                  {user.name}
                </strong>

                <span>
                  {user.email}
                </span>
              </div>
            </div>

            <nav className={styles.nav}>
              <Link
                href="/profile"
                className={styles.active}
              >
                <span>Профіль</span>
                <span>→</span>
              </Link>

              <Link href="/profile/orders">
                <span>
                  Мої замовлення
                </span>

                <span>→</span>
              </Link>

              <Link href="/favorites">
                <span>Обране</span>
                <span>→</span>
              </Link>
            </nav>
          </aside>

          <section className={styles.content}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <span>
                    Особисті дані
                  </span>

                  <h2>
                    Інформація акаунта
                  </h2>
                </div>

                <div className={styles.status}>
                  Активний
                </div>
              </div>

              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span>Ім&apos;я</span>

                  <strong>
                    {user.name}
                  </strong>
                </div>

                <div className={styles.infoItem}>
                  <span>Email</span>

                  <strong>
                    {user.email}
                  </strong>
                </div>

                <div className={styles.infoItem}>
                  <span>
                    Тип акаунта
                  </span>

                  <strong>
                    {user.role === "ADMIN"
                      ? "Адміністратор"
                      : "Користувач"}
                  </strong>
                </div>

                <div className={styles.infoItem}>
                  <span>
                    Дата реєстрації
                  </span>

                  <strong>
                    {new Date(
                      user.createdAt
                    ).toLocaleDateString(
                      "uk-UA",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </strong>
                </div>
              </div>
            </div>

            <div className={styles.quickGrid}>
              <Link
                href="/profile/orders"
                className={styles.quickCard}
              >
                <span className={styles.number}>
                  01
                </span>

                <div>
                  <h3>
                    Мої замовлення
                  </h3>

                  <p>
                    Переглядай історію
                    покупок і статуси
                    замовлень.
                  </p>
                </div>

                <span className={styles.arrow}>
                  →
                </span>
              </Link>

              <Link
                href="/favorites"
                className={styles.quickCard}
              >
                <span className={styles.number}>
                  02
                </span>

                <div>
                  <h3>Обране</h3>

                  <p>
                    Товари, які ти
                    зберіг для себе.
                  </p>
                </div>

                <span className={styles.arrow}>
                  →
                </span>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}