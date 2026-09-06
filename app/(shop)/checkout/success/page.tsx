import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <main
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <div>
        <div
          style={{
            fontSize: "60px",
            marginBottom: "20px",
          }}
        >
          ✓
        </div>

        <h1>
          Замовлення оформлено
        </h1>

        <p>
          Дякуємо за покупку!
          Ми зв&apos;яжемося з вами найближчим часом.
        </p>

        <Link href="/products">
          Продовжити покупки
        </Link>
      </div>
    </main>
  );
}