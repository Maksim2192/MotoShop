"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SearchButton.module.css";

export default function SearchButton() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const value = search.trim();

    if (!value) {
      return;
    }

    router.push(
      `/products?search=${encodeURIComponent(value)}`
    );

    setOpen(false);
    setSearch("");
  };

  return (
    <>
      <button
        type="button"
        className={styles.searchButton}
        aria-label="Пошук"
        onClick={() => setOpen(true)}
      >
        <svg
          width="21"
          height="21"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="11"
            cy="11"
            r="7"
            stroke="currentColor"
            strokeWidth="2"
          />

          <path
            d="M16.5 16.5L21 21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open && (
        <div
          className={styles.overlay}
          onClick={() => setOpen(false)}
        >
          <div
            className={styles.modal}
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className={styles.header}>
              <div>
                <span>Пошук</span>

                <h2>Що шукаєте?</h2>
              </div>

              <button
                type="button"
                className={styles.close}
                onClick={() => setOpen(false)}
                aria-label="Закрити"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className={styles.form}
            >
              <div className={styles.inputWrapper}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                    stroke="currentColor"
                    strokeWidth="2"
                  />

                  <path
                    d="M16.5 16.5L21 21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>

                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Наприклад: педалі, гріпси..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                />
              </div>

              <button
                type="submit"
                className={styles.submit}
                disabled={!search.trim()}
              >
                Знайти
              </button>
            </form>

            <p className={styles.hint}>
              Натисніть Enter для пошуку або Esc,
              щоб закрити.
            </p>
          </div>
        </div>
      )}
    </>
  );
}