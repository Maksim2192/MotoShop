import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link
              href="/"
              className={styles.logo}
            >
              MOTO<span>SHOP</span>
            </Link>

            <p>
              Все необхідне для мотоцикла,
              поїздок і нових маршрутів.
            </p>
          </div>

          <div className={styles.column}>
            <h3>Магазин</h3>

            <Link href="/products">
              Каталог
            </Link>

            <Link href="sales">
              Акції
            </Link>

            <Link href="/about">
              Про нас
            </Link>
          </div>

          <div className={styles.column}>
            <h3>Допомога</h3>

            <Link href="/delivery">
              Доставка
            </Link>

            <Link href="/payment">
              Оплата
            </Link>

            <Link href="/returns">
              Повернення
            </Link>
          </div>

          <div className={styles.column}>
            <h3>Контакти</h3>

            <p>Пн–Сб: 09:00–19:00</p>

            <a href="tel:+380998638236">
              +380 99 863 8236
            </a>

            <a href="mailto:shop@example.com">
              shop@example.com
            </a>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>
            © 2026 MotoShop. Всі права захищені.
          </p>

          <div className={styles.bottomLinks}>
            <Link href="/privacy">
              Політика конфіденційності
            </Link>

            <Link href="/terms">
              Умови використання
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}