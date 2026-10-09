"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import styles from "./page.module.css";

export default function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  return (
    <main className={styles.main}>
      <section className={styles.card}>
        <div className={styles.icon}>✓</div>

        <span className={styles.eyebrow}>
          Замовлення успішно оформлено
        </span>

        <h1>Дякуємо за покупку!</h1>

        <p className={styles.description}>
          Ваше замовлення прийнято. Ми зв&apos;яжемося
          з вами найближчим часом для підтвердження
          деталей.
        </p>

        {orderId && (
          <div className={styles.orderNumber}>
            <span>Номер замовлення</span>
            <strong>#{orderId}</strong>
          </div>
        )}

        <div className={styles.actions}>
          <Link
            href="/products"
            className={styles.primaryButton}
          >
            Продовжити покупки
          </Link>

          <Link
            href="/orders"
            className={styles.secondaryButton}
          >
            Мої замовлення
          </Link>
        </div>
      </section>
    </main>
  );
}