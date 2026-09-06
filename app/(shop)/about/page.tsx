import Link from "next/link";
import styles from "./page.module.css";

export default function AboutPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.label}>
              Про MotoShop
            </span>

            <h1>
              Все для тих, хто живе
              <span> мотоциклами</span>
            </h1>

            <p>
              MotoShop — магазин мототоварів,
              екіпірування, аксесуарів та запчастин.
              Ми створили місце, де райдер може
              знайти все необхідне для комфортних
              і безпечних поїздок.
            </p>

            <Link
              href="/products"
              className={styles.catalogButton}
            >
              Перейти до каталогу
            </Link>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.bigText}>
              MOTO
            </div>

            <span>
              RIDE YOUR WAY
            </span>
          </div>
        </section>

        <section className={styles.about}>
          <div className={styles.aboutTitle}>
            <span>Хто ми</span>

            <h2>
              Магазин, створений для
              мотоциклістів
            </h2>
          </div>

          <div className={styles.aboutText}>
            <p>
              Ми знаємо, наскільки важливо
              підібрати правильне екіпірування,
              надійні запчастини та якісні
              аксесуари для мотоцикла.
            </p>

            <p>
              Саме тому в MotoShop ми прагнемо
              зібрати товари, які поєднують
              якість, комфорт та практичність.
              Від першої покупки до наступної
              подорожі — ми хочемо бути поруч.
            </p>
          </div>
        </section>

        <section className={styles.stats}>
          <div className={styles.stat}>
            <strong>500+</strong>
            <span>товарів у каталозі</span>
          </div>

          <div className={styles.stat}>
            <strong>1000+</strong>
            <span>задоволених клієнтів</span>
          </div>

          <div className={styles.stat}>
            <strong>24/7</strong>
            <span>онлайн-замовлення</span>
          </div>

          <div className={styles.stat}>
            <strong>Україна</strong>
            <span>доставка по країні</span>
          </div>
        </section>

        <section className={styles.values}>
          <div className={styles.sectionHeader}>
            <span>Наші принципи</span>

            <h2>
              Чому обирають MotoShop
            </h2>
          </div>

          <div className={styles.valueGrid}>
            <article className={styles.valueCard}>
              <span className={styles.number}>
                01
              </span>

              <h3>Якість</h3>

              <p>
                Підбираємо товари, яким можна
                довіряти на дорозі та під час
                щоденного використання.
              </p>
            </article>

            <article className={styles.valueCard}>
              <span className={styles.number}>
                02
              </span>

              <h3>Зручність</h3>

              <p>
                Простий каталог, швидке
                оформлення замовлення та
                зрозумілий процес покупки.
              </p>
            </article>

            <article className={styles.valueCard}>
              <span className={styles.number}>
                03
              </span>

              <h3>Підтримка</h3>

              <p>
                Допомагаємо підібрати товар та
                відповідаємо на питання перед
                покупкою.
              </p>
            </article>
          </div>
        </section>

        <section className={styles.cta}>
          <div>
            <span>Готовий до поїздки?</span>

            <h2>
              Знайди все необхідне
              для свого мотоцикла
            </h2>
          </div>

          <Link
            href="/products"
            className={styles.ctaButton}
          >
            Дивитися товари →
          </Link>
        </section>
      </div>
    </main>
  );
}