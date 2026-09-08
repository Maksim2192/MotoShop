import styles from "./Benefits.module.css";

const benefits = [
  {
    icon: "🚚",
    title: "Швидка доставка",
    text: "Відправляємо замовлення по всій Україні.",
  },
  {
    icon: "✓",
    title: "Перевірена якість",
    text: "Підбираємо товари, які підходять для щоденного використання.",
  },
  {
    icon: "↩",
    title: "Зручне повернення",
    text: "Простий процес обміну та повернення товарів.",
  },
  {
    icon: "🔒",
    title: "Безпечна покупка",
    text: "Надійне оформлення та супровід кожного замовлення.",
  },
];

export default function Benefits() {
  return (
    <section
      className={styles.section}
      aria-labelledby="benefits-title"
    >
      <div className={styles.container}>
        <div className={styles.heading}>
          <span>Переваги MotoShop</span>

          <h2 id="benefits-title">
            Чому обирають нас
          </h2>
        </div>

        <div className={styles.grid}>
          {benefits.map((benefit) => (
            <article
              key={benefit.title}
              className={styles.item}
            >
              <div
                className={styles.icon}
                aria-hidden="true"
              >
                {benefit.icon}
              </div>

              <div>
                <h3>{benefit.title}</h3>

                <p>{benefit.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}