import Link from "next/link";
import styles from "./Categories.module.css";

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default async function Categories() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
    {
      cache: "no-store",
    }
  );

  const result = await response.json();

  const categories: Category[] =
    result.data ?? [];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>
            Обирай швидше
          </span>

          <h2 className={styles.title}>
            Категорії товарів
          </h2>

          <p className={styles.subtitle}>
            Знайди потрібні компоненти та аксесуари
            для свого мотоцикла.
          </p>
        </div>

        <div className={styles.grid}>
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className={styles.card}
            >
              <div className={styles.number}>
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>
                  {category.name}
                </h3>

                <span className={styles.linkText}>
                  Переглянути товари
                  <span>→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}