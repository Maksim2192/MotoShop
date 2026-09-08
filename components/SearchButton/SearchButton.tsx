"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import styles from "./SearchButton.module.css";

export default function SearchButton() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;

    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const closeSearch = () => {
    setOpen(false);
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const value = search.trim();

    if (!value) return;

    const params = new URLSearchParams();
    params.set("search", value);

    router.push(`/products?${params.toString()}`);

    setOpen(false);
    setSearch("");
  };

  return (
    <>
      <button
        type="button"
        className={styles.searchButton}
        aria-label="Відкрити пошук"
        title="Пошук"
        onClick={() => setOpen(true)}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="11"
            cy="11"
            r="7"
            stroke="currentColor"
            strokeWidth="1.8"
          />

          <path
            d="M16.5 16.5L21 21"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open && (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label="Пошук товарів"
          onMouseDown={closeSearch}
        >
          <div
            className={styles.modal}
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className={styles.header}>
              <div>
                <span className={styles.eyebrow}>
                  Каталог
                </span>

                <h2>Що шукаєте?</h2>
              </div>

              <button
                type="button"
                className={styles.close}
                onClick={closeSearch}
                aria-label="Закрити пошук"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 6L18 18M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className={styles.form}
            >
              <div className={styles.inputWrapper}>
                <svg
                  className={styles.inputIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />

                  <path
                    d="M16.5 16.5L21 21"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>

                <input
                  ref={inputRef}
                  type="search"
                  placeholder="Наприклад: педалі, гріпси..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  aria-label="Пошук товарів"
                />

                {search && (
                  <button
                    type="button"
                    className={styles.clear}
                    onClick={() => setSearch("")}
                    aria-label="Очистити пошук"
                  >
                    ×
                  </button>
                )}
              </div>

              <button
                type="submit"
                className={styles.submit}
                disabled={!search.trim()}
              >
                <span>Знайти</span>
                <span className={styles.arrow}>→</span>
              </button>
            </form>

            <p className={styles.hint}>
              <span>Enter</span> — пошук
              <span>Esc</span> — закрити
            </p>
          </div>
        </div>
      )}
    </>
  );
}