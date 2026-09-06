import Link from "next/link";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.badge}>
            Новий сезон
          </span>

          <h1 className={styles.title}>
            Все для твого
            <span> мотоцикла</span>
          </h1>

          <p className={styles.text}>
            Компоненти, аксесуари та екіпірування
            для комфортних і впевнених поїздок.
          </p>

          <div className={styles.actions}>
            <Link
              href="/products"
              className={styles.primaryButton}
            >
              Перейти до каталогу
            </Link>

            <Link
              href="/products?discount=true"
              className={styles.secondaryButton}
            >
              Переглянути акції
            </Link>
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.circle} />

          <div className={styles.visualText}>
            <span>MOTO</span>
            <strong>RIDE</strong>
          </div>
        </div>
      </div>
    </section>
  );
}