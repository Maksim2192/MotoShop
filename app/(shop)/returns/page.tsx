import Link from "next/link";
import styles from "./page.module.css";

export default function ReturnsPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <section className={styles.header}>
          <span className={styles.label}>
            Допомога
          </span>

          <h1>Повернення</h1>

          <p>
            Якщо товар не підійшов або виникла
            проблема, ми допоможемо оформити
            повернення або обмін.
          </p>
        </section>

        <section className={styles.conditions}>
          <article className={styles.card}>
            <span className={styles.number}>
              01
            </span>

            <h2>
              Товар у належному стані
            </h2>

            <p>
              Повернення можливе, якщо товар
              не використовувався та збережено
              його товарний вигляд.
            </p>

            <ul>
              <li>Без слідів використання</li>
              <li>Збережена комплектація</li>
              <li>Збережене пакування</li>
            </ul>
          </article>

          <article className={styles.card}>
            <span className={styles.number}>
              02
            </span>

            <h2>
              Обмін товару
            </h2>

            <p>
              Якщо товар не підійшов, можна
              звернутися до нас для обміну на
              іншу позицію.
            </p>

            <ul>
              <li>Уточнюємо наявність</li>
              <li>Погоджуємо обмін</li>
              <li>Організовуємо відправлення</li>
            </ul>
          </article>

          <article className={styles.card}>
            <span className={styles.number}>
              03
            </span>

            <h2>
              Повернення коштів
            </h2>

            <p>
              Після отримання та перевірки
              поверненого товару оформлюємо
              повернення коштів.
            </p>

            <ul>
              <li>Перевірка товару</li>
              <li>Підтвердження повернення</li>
              <li>Повернення оплати</li>
            </ul>
          </article>
        </section>

        <section className={styles.process}>
          <div className={styles.processHeader}>
            <span>
              Як оформити повернення
            </span>

            <h2>
              Простий процес у 3 кроки
            </h2>
          </div>

          <div className={styles.steps}>
            <div className={styles.step}>
              <span>01</span>

              <div>
                <h3>
                  Зв&apos;яжись з нами
                </h3>

                <p>
                  Повідом номер замовлення та
                  коротко опиши причину
                  повернення.
                </p>
              </div>
            </div>

            <div className={styles.step}>
              <span>02</span>

              <div>
                <h3>
                  Отримай інструкцію
                </h3>

                <p>
                  Ми підкажемо, як правильно
                  підготувати та відправити
                  товар.
                </p>
              </div>
            </div>

            <div className={styles.step}>
              <span>03</span>

              <div>
                <h3>
                  Отримай обмін або кошти
                </h3>

                <p>
                  Після перевірки товару
                  завершуємо обмін або
                  повернення коштів.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.notice}>
          <div>
            <span>
              Потрібна допомога?
            </span>

            <h2>
              Зв&apos;яжись з нами перед
              відправленням товару
            </h2>

            <p>
              Так ми зможемо швидше обробити
              звернення та підказати правильний
              порядок повернення.
            </p>
          </div>

          <Link
            href="/products"
            className={styles.button}
          >
            Повернутися до магазину
          </Link>
        </section>
      </div>
    </main>
  );
}