import styles from "./Benefits.module.css";

export default function Benefits() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.item}>
          <div className={styles.icon}>
            🚚
          </div>

          <div>
            <h3>Швидка доставка</h3>
            <p>
              Відправляємо замовлення по всій Україні.
            </p>
          </div>
        </div>

        <div className={styles.item}>
          <div className={styles.icon}>
            ✓
          </div>

          <div>
            <h3>Перевірена якість</h3>
            <p>
              Якісні товари для твого велосипеда.
            </p>
          </div>
        </div>

        <div className={styles.item}>
          <div className={styles.icon}>
            ↩
          </div>

          <div>
            <h3>Зручне повернення</h3>
            <p>
              Простий процес обміну та повернення.
            </p>
          </div>
        </div>

        <div className={styles.item}>
          <div className={styles.icon}>
            🔒
          </div>

          <div>
            <h3>Безпечна покупка</h3>
            <p>
              Надійне оформлення кожного замовлення.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}