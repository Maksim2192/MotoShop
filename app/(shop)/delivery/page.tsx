import Link from "next/link";
import styles from "./page.module.css";

export default function DeliveryPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span>Допомога</span>

          <h1>Доставка</h1>

          <p>
            Доставляємо замовлення по всій Україні.
            Обери зручний спосіб отримання під час
            оформлення замовлення.
          </p>
        </div>

        <div className={styles.grid}>
          <article className={styles.card}>
            <span className={styles.number}>01</span>

            <h2>Нова пошта</h2>

            <p>
              Доставка у відділення Нової пошти
              або поштомат у вашому місті.
            </p>

            <ul>
              <li>Доставка по всій Україні</li>
              <li>Відділення та поштомати</li>
              <li>Відстеження посилки</li>
            </ul>
          </article>

          <article className={styles.card}>
            <span className={styles.number}>02</span>

            <h2>Термін доставки</h2>

            <p>
              Після підтвердження замовлення
              ми готуємо товар до відправлення.
            </p>

            <ul>
              <li>Обробка замовлення</li>
              <li>Передача перевізнику</li>
              <li>Отримання у вашому місті</li>
            </ul>
          </article>

          <article className={styles.card}>
            <span className={styles.number}>03</span>

            <h2>Вартість</h2>

            <p>
              Вартість доставки розраховується
              відповідно до тарифів перевізника.
            </p>

            <ul>
              <li>Залежить від розміру посилки</li>
              <li>Залежить від ваги</li>
              <li>Оплачується за тарифами служби</li>
            </ul>
          </article>
        </div>

        <section className={styles.info}>
          <div>
            <span>Є питання?</span>

            <h2>
              Ми допоможемо з оформленням
              замовлення
            </h2>
          </div>

          <Link
            href="/products"
            className={styles.button}
          >
            Перейти до каталогу
          </Link>
        </section>
      </div>
    </main>
  );
}