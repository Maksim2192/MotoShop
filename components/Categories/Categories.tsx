import Link from "next/link";

import styles from "./Categories.module.css";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface CategoriesResponse {
  data?: Category[];
}

const categoryIcons = [
  "⚙",
  "🔧",
  "💡",
  "🪞",
  "🛞",
  "🏍",
];

export default async function Categories() {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      return null;
    }

    const response = await fetch(
      `${apiUrl}/api/categories`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const result: CategoriesResponse =
      await response.json();

    const categories =
      result.data ?? [];

    if (!categories.length) {
      return null;
    }

    return (
      <section
        className={styles.section}
        aria-labelledby="categories-title"
      >
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <span className={styles.label}>
                Обирай швидше
              </span>

              <h2
                id="categories-title"
                className={styles.title}
              >
                Категорії товарів
              </h2>

              <p className={styles.subtitle}>
                Знайди потрібні аксесуари та
                компоненти для свого мотоцикла.
              </p>
            </div>

            <Link
              href="/products"
              className={styles.allLink}
            >
              Весь каталог →
            </Link>
          </div>

          <div className={styles.grid}>
            {categories.map(
              (category, index) => (
                <Link
                  key={category.id}
                  href={`/products?category=${encodeURIComponent(
                    category.slug
                  )}`}
                  className={styles.card}
                >
                  <div className={styles.top}>
                    <span
                      className={
                        styles.icon
                      }
                      aria-hidden="true"
                    >
                      {
                        categoryIcons[
                          index %
                            categoryIcons.length
                        ]
                      }
                    </span>

                    <span
                      className={
                        styles.number
                      }
                    >
                      {String(
                        index + 1
                      ).padStart(2, "0")}
                    </span>
                  </div>

                  <div
                    className={
                      styles.cardBottom
                    }
                  >
                    <h3
                      className={
                        styles.cardTitle
                      }
                    >
                      {category.name}
                    </h3>

                    <span
                      className={
                        styles.arrow
                      }
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </div>
                </Link>
              )
            )}
          </div>
        </div>
      </section>
    );
  } catch {
    return null;
  }
}