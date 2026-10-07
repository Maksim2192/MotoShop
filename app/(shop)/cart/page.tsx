"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
  try {
    const saved = localStorage.getItem("cart");

    if (!saved) {
      setCart([]);
      return;
    }

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      setCart([]);
      localStorage.removeItem("cart");
      return;
    }

    const normalized: CartItem[] = parsed
      .filter((item): item is CartItem => {
        return (
          item &&
          Number.isInteger(item.id) &&
          item.id > 0 &&
          typeof item.name === "string" &&
          Number.isFinite(Number(item.price)) &&
          Number.isFinite(Number(item.quantity)) &&
          Number.isFinite(Number(item.stock))
        );
      })
      .map((item) => {
        const stock = Math.max(
          0,
          Math.floor(Number(item.stock))
        );

        const quantity = Math.min(
          Math.max(1, Math.floor(Number(item.quantity))),
          Math.max(stock, 1)
        );

        return {
          id: Number(item.id),
          name: item.name,
          price: Number(item.price),
          image:
            typeof item.image === "string"
              ? item.image
              : "",
          quantity,
          stock,
        };
      })
      .filter((item) => item.stock > 0);

    setCart(normalized);

    localStorage.setItem(
      "cart",
      JSON.stringify(normalized)
    );
  } catch {
    localStorage.removeItem("cart");
    setCart([]);
  } finally {
    setLoaded(true);
  }
}, []);

  const saveCart = (items: CartItem[]) => {
  const normalized = items
    .filter(
      (item) =>
        Number.isInteger(item.id) &&
        item.id > 0 &&
        item.stock > 0
    )
    .map((item) => ({
      ...item,
      price: Number(item.price),
      stock: Math.max(
        0,
        Math.floor(Number(item.stock))
      ),
      quantity: Math.min(
        Math.max(
          1,
          Math.floor(Number(item.quantity))
        ),
        Math.max(
          1,
          Math.floor(Number(item.stock))
        )
      ),
    }));

  setCart(normalized);

  localStorage.setItem(
    "cart",
    JSON.stringify(normalized)
  );

  window.dispatchEvent(
    new Event("cart-updated")
  );
};

  const increaseQuantity = (id: number) => {
    const updatedCart = cart.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: Math.min(
              item.stock,
              item.quantity + 1
            ),
          }
        : item
    );

    saveCart(updatedCart);
  };

  const decreaseQuantity = (id: number) => {
    const updatedCart = cart.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: Math.max(
              1,
              item.quantity - 1
            ),
          }
        : item
    );

    saveCart(updatedCart);
  };

  const removeProduct = (id: number) => {
    const updatedCart = cart.filter(
      (item) => item.id !== id
    );

    saveCart(updatedCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const totalQuantity = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  }, [cart]);

  const totalPrice = useMemo(() => {
    return cart.reduce(
      (sum, item) =>
        sum + item.price * item.quantity,
      0
    );
  }, [cart]);

  if (!loaded) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.loading}>
            Завантаження кошика...
          </div>
        </div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              🛒
            </div>

            <h1>
              Кошик порожній
            </h1>

            <p>
              Додай товари з каталогу, і вони
              з&apos;являться тут.
            </p>

            <Link
              href="/products"
              className={styles.catalogButton}
            >
              Перейти до каталогу
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <span className={styles.label}>
              Покупки
            </span>

            <h1>
              Кошик
            </h1>

            <p>
              Перевір товари перед оформленням
              замовлення.
            </p>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className={styles.clearButton}
          >
            Очистити кошик
          </button>
        </div>

        <div className={styles.layout}>
          <section className={styles.items}>
            {cart.map((item) => (
              <article
                key={item.id}
                className={styles.item}
              >
                <div className={styles.imageWrapper}>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                    />
                  ) : (
                    <span>
                      Немає фото
                    </span>
                  )}
                </div>

                <div className={styles.itemInfo}>
                  <h2>
                    {item.name}
                  </h2>

                  <span className={styles.unitPrice}>
                    {item.price} грн / шт.
                  </span>

                  <div className={styles.quantity}>
                    <button
                      type="button"
                      onClick={() =>
                        decreaseQuantity(item.id)
                      }
                      disabled={
                        item.quantity <= 1
                      }
                    >
                      −
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        increaseQuantity(item.id)
                      }
                      disabled={
                        item.quantity >= item.stock
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className={styles.itemRight}>
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() =>
                      removeProduct(item.id)
                    }
                    aria-label={`Видалити ${item.name}`}
                  >
                    ×
                  </button>

                  <strong>
                    {item.price * item.quantity} грн
                  </strong>
                </div>
              </article>
            ))}
          </section>

          <aside className={styles.summary}>
            <h2>
              Ваше замовлення
            </h2>

            <div className={styles.summaryRow}>
              <span>
                Кількість товарів
              </span>

              <strong>
                {totalQuantity}
              </strong>
            </div>

            <div className={styles.summaryRow}>
              <span>
                Доставка
              </span>

              <strong>
                За тарифами перевізника
              </strong>
            </div>

            <div className={styles.divider} />

            <div className={styles.total}>
              <span>
                Разом
              </span>

              <strong>
                {totalPrice} грн
              </strong>
            </div>

            <Link
              href="/checkout"
              className={styles.checkoutButton}
            >
              Оформити замовлення
            </Link>

            <Link
              href="/products"
              className={styles.continueShopping}
            >
              ← Продовжити покупки
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}