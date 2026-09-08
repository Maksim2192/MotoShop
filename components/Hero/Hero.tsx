import Link from "next/link";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.badge}>
            <span className={styles.badgeDot} />
            MOTO SHOP · НОВИЙ СЕЗОН
          </span>

          <h1 className={styles.title}>
            Все необхідне
            <span> для твого мотоцикла</span>
          </h1>

          <p className={styles.description}>
            Аксесуари, запчастини та все необхідне
            для комфортних і впевнених поїздок.
            Обирай, замовляй — ми подбаємо про решту.
          </p>

          <div className={styles.actions}>
            <Link
              href="/products"
              className={styles.primaryButton}
            >
              Перейти до каталогу
              <span>→</span>
            </Link>

            <Link
              href="/products?discount=true"
              className={styles.secondaryButton}
            >
              Дивитися акції
            </Link>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <strong>100+</strong>
              <span>товарів</span>
            </div>

            <div className={styles.statDivider} />

            <div className={styles.stat}>
              <strong>24/7</strong>
              <span>приймаємо замовлення</span>
            </div>

            <div className={styles.statDivider} />

            <div className={styles.stat}>
              <strong>UA</strong>
              <span>доставка по Україні</span>
            </div>
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.glow} />
          <div className={styles.circle} />

          <div className={styles.visualContent}>
            <span className={styles.visualSmall}>
              RIDE
            </span>

            <strong className={styles.visualTitle}>
              MOTO
            </strong>

            <span className={styles.visualBottom}>
              SHOP
            </span>
          </div>

          <div className={`${styles.decor} ${styles.decorOne}`} />
          <div className={`${styles.decor} ${styles.decorTwo}`} />
          <div className={`${styles.decor} ${styles.decorThree}`} />
        </div>
      </div>
    </section>
  );
}