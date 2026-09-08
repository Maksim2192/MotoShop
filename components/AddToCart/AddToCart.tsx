"use client";

import { useState } from "react";

import styles from "./AddToCart.module.css";

interface AddToCartProps {
  productId: number;
  name: string;
  price: number;
  image: string;
  stock: number;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

export default function AddToCart({
  productId,
  name,
  price,
  image,
  stock,
}: AddToCartProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const isAvailable = stock > 0;

  const decrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
    setAdded(false);
  };

  const increase = () => {
    setQuantity((prev) => Math.min(stock, prev + 1));
    setAdded(false);
  };

  const handleAddToCart = () => {
    if (!isAvailable || isAdding) {
      return;
    }

    setIsAdding(true);

    try {
      const storedCart = localStorage.getItem("cart");

      let currentCart: CartItem[] = [];

      try {
        currentCart = storedCart
          ? JSON.parse(storedCart)
          : [];
      } catch {
        currentCart = [];
      }

      const existingProduct = currentCart.find(
        (item) => item.id === productId
      );

      let updatedCart: CartItem[];

      if (existingProduct) {
        updatedCart = currentCart.map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: Math.min(
                  stock,
                  item.quantity + quantity
                ),
              }
            : item
        );
      } else {
        updatedCart = [
          ...currentCart,
          {
            id: productId,
            name,
            price,
            image,
            quantity,
            stock,
          },
        ];
      }

      localStorage.setItem(
        "cart",
        JSON.stringify(updatedCart)
      );

      window.dispatchEvent(
        new Event("cart-updated")
      );

      setAdded(true);

      window.setTimeout(() => {
        setAdded(false);
      }, 2000);
    } finally {
      window.setTimeout(() => {
        setIsAdding(false);
      }, 350);
    }
  };

  return (
    <div className={styles.buyBlock}>
      <div className={styles.quantityWrapper}>
        <span className={styles.quantityLabel}>
          Кількість
        </span>

        <div className={styles.quantity}>
          <button
            type="button"
            onClick={decrease}
            disabled={
              quantity <= 1 ||
              isAdding ||
              !isAvailable
            }
            aria-label="Зменшити кількість"
          >
            −
          </button>

          <span aria-live="polite">
            {quantity}
          </span>

          <button
            type="button"
            onClick={increase}
            disabled={
              quantity >= stock ||
              isAdding ||
              !isAvailable
            }
            aria-label="Збільшити кількість"
          >
            +
          </button>
        </div>
      </div>

      <button
        type="button"
        className={`${styles.cartButton} ${
          added ? styles.added : ""
        }`}
        onClick={handleAddToCart}
        disabled={!isAvailable || isAdding}
      >
        {!isAvailable ? (
          <>
            <span className={styles.buttonIcon}>
              ×
            </span>

            Немає в наявності
          </>
        ) : isAdding ? (
          <>
            <span className={styles.spinner} />

            Додаємо...
          </>
        ) : added ? (
          <>
            <span className={styles.buttonIcon}>
              ✓
            </span>

            Додано в кошик
          </>
        ) : (
          <>
            <span className={styles.buttonIcon}>
              +
            </span>

            Додати в кошик
          </>
        )}
      </button>
    </div>
  );
}