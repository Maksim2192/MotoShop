import Image from "next/image";
import Link from "next/link";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.label}>
            <span className={styles.labelDot} />
            MOTO SHOP · 2026
          </div>

          <h1 className={styles.title}>
            Все для
            <br />
            <span>твого мото</span>
          </h1>

          <p className={styles.description}>
            Запчастини, аксесуари та екіпіровка для тих,
            хто не уявляє життя без дороги.
          </p>

          <div className={styles.actions}>
            <Link href="/products" className={styles.primaryButton}>
              <span>Перейти до каталогу</span>
              <span className={styles.buttonIcon}>↗</span>
            </Link>

            <Link
              href="/products?discount=true"
              className={styles.secondaryButton}
            >
              Дивитися акції
            </Link>
          </div>

          <div className={styles.features}>
            <div className={styles.feature}>
              <strong>01</strong>
              <span>Запчастини</span>
            </div>

            <div className={styles.feature}>
              <strong>02</strong>
              <span>Аксесуари</span>
            </div>

            <div className={styles.feature}>
              <strong>03</strong>
              <span>Екіпіровка</span>
            </div>
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.imageFrame}>
            <Image
              src="/images/viclop.jpg"
              alt="Мотоцикл"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 58vw"
              className={styles.image}
            />

            <div className={styles.imageOverlay} />

            <div className={styles.imageTop}>
              <span>RIDE</span>
              <span>01 / 03</span>
            </div>

            <div className={styles.imageBottom}>
              <div>
                <span className={styles.smallText}>MOTO SHOP</span>
                <strong>RIDE YOUR WAY</strong>
              </div>

              <span className={styles.arrow}>↗</span>
            </div>
          </div>

          <div className={styles.verticalLabel}>
            <span>EST.</span>
            <span>2026</span>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.bottomItem}>
          <span className={styles.bottomIcon}>✓</span>
          <span>Перевірені товари</span>
        </div>

        <div className={styles.bottomItem}>
          <span className={styles.bottomIcon}>✓</span>
          <span>Доставка по Україні</span>
        </div>

        <div className={styles.bottomItem}>
          <span className={styles.bottomIcon}>✓</span>
          <span>Безпечна оплата</span>
        </div>

        <Link href="/products" className={styles.allProducts}>
          Переглянути всі товари
          <span>→</span>
        </Link>
      </div>
    </section>
  );
}