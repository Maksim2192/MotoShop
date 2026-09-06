import Link from "next/link";
import styles from "./page.module.css";

export default function PaymentPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <section className={styles.header}>
          <span className={styles.label}>
            Допомога
          </span>

          <h1>Оплата</h1>

          <p>
            Обирай зручний спосіб оплати під час
            оформлення замовлення. Нижче зібрали
            основну інформацію про доступні варіанти.
          </p>
        </section>

        <section className={styles.paymentGrid}>
          <article className={styles.paymentCard}>
            <div className={styles.cardTop}>
              <span className={styles.number}>
                01
              </span>

              <span className={styles.icon}>
                ₴
              </span>
            </div>

            <h2>Оплата при отриманні</h2>

            <p>
              Оплати замовлення після його отримання
              у відділенні служби доставки.
            </p>

            <ul>
              <li>
                Перевіряєш посилку при отриманні
              </li>

              <li>
                Оплачуєш у відділенні
              </li>

              <li>
                Доступно для доставки Новою поштою
              </li>
            </ul>
          </article>

          <article className={styles.paymentCard}>
            <div className={styles.cardTop}>
              <span className={styles.number}>
                02
              </span>

              <span className={styles.icon}>
                ◇
              </span>
            </div>

            <h2>Оплата карткою</h2>

            <p>
              Оплати покупку банківською карткою
              онлайн під час оформлення замовлення.
            </p>

            <ul>
              <li>Visa та Mastercard</li>

              <li>
                Швидке підтвердження платежу
              </li>

              <li>
                Дані картки не зберігаються магазином
              </li>
            </ul>
          </article>
        </section>

        <section className={styles.process}>
          <div className={styles.processHeader}>
            <span>Як це працює</span>

            <h2>
              Від кошика до оплати
            </h2>
          </div>

          <div className={styles.steps}>
            <div className={styles.step}>
              <span>01</span>

              <div>
                <h3>
                  Додай товар
                </h3>

                <p>
                  Обери необхідні товари та
                  додай їх до кошика.
                </p>
              </div>
            </div>

            <div className={styles.step}>
              <span>02</span>

              <div>
                <h3>
                  Оформи замовлення
                </h3>

                <p>
                  Вкажи контактні дані,
                  місто та спосіб доставки.
                </p>
              </div>
            </div>

            <div className={styles.step}>
              <span>03</span>

              <div>
                <h3>
                  Обери оплату
                </h3>

                <p>
                  Обери доступний спосіб
                  оплати замовлення.
                </p>
              </div>
            </div>

            <div className={styles.step}>
              <span>04</span>

              <div>
                <h3>
                  Отримай товар
                </h3>

                <p>
                  Слідкуй за статусом доставки
                  та отримай своє замовлення.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.notice}>
          <div>
            <span className={styles.noticeLabel}>
              Важливо
            </span>

            <h2>
              Перевіряй замовлення при отриманні
            </h2>

            <p>
              Рекомендуємо перевірити комплектність
              та стан товару перед завершенням
              отримання посилки.
            </p>
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