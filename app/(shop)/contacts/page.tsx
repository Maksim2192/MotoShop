"use client";

import {
  FormEvent,
  useState,
} from "react";

import styles from "./page.module.css";

export default function ContactsPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setSuccess("");
      setError("");

      const response = await fetch(
        "/api/contacts",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name,
            phone,
            email,
            message,
          }),
        }
      );

      const text =
        await response.text();

      console.log(
        "CONTACT STATUS:",
        response.status
      );

      console.log(
        "CONTACT RESPONSE:",
        text
      );

      let result;

      try {
        result = text
          ? JSON.parse(text)
          : {};
      } catch {
        throw new Error(
          "Сервер повернув некоректну відповідь"
        );
      }

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Не вдалося надіслати повідомлення"
        );
      }

      setSuccess(
        "Повідомлення успішно надіслано!"
      );

      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error(
        "SEND CONTACT ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Не вдалося надіслати повідомлення"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.label}>
            MotoShop
          </span>

          <h1>Контакти</h1>

          <p>
            Маєте питання щодо товару,
            доставки або замовлення?
            Зв&apos;яжіться з нами
            зручним способом.
          </p>
        </header>

        <section
          className={styles.contactGrid}
        >
          <a
            href="tel:+380998638236"
            className={
              styles.contactCard
            }
          >
            <span
              className={styles.number}
            >
              01
            </span>

            <div>
              <span
                className={
                  styles.cardLabel
                }
              >
                Телефон
              </span>

              <h2>
                +380 99 863 82 36
              </h2>

              <p>
                Натисніть, щоб
                зателефонувати
              </p>
            </div>

            <span
              className={styles.arrow}
            >
              ↗
            </span>
          </a>

          <a
            href="mailto:motoshop@gmail.com"
            className={
              styles.contactCard
            }
          >
            <span
              className={styles.number}
            >
              02
            </span>

            <div>
              <span
                className={
                  styles.cardLabel
                }
              >
                Email
              </span>

              <h2>
                motoshop@gmail.com
              </h2>

              <p>
                Для запитань та
                пропозицій
              </p>
            </div>

            <span
              className={styles.arrow}
            >
              ↗
            </span>
          </a>

          <div
            className={
              styles.contactCard
            }
          >
            <span
              className={styles.number}
            >
              03
            </span>

            <div>
              <span
                className={
                  styles.cardLabel
                }
              >
                Графік роботи
              </span>

              <h2>
                Пн — Сб
              </h2>

              <p>
                09:00 — 19:00
              </p>
            </div>
          </div>
        </section>

        <section
          className={
            styles.contactSection
          }
        >
          <div
            className={
              styles.contactText
            }
          >
            <span>
              Зворотний зв&apos;язок
            </span>

            <h2>
              Напишіть нам
            </h2>

            <p>
              Залиште свої контактні
              дані та повідомлення.
              Ми зв&apos;яжемося з вами
              найближчим часом.
            </p>

            <div
              className={styles.info}
            >
              <div>
                <span>
                  Відповідь
                </span>

                <strong>
                  Протягом робочого
                  дня
                </strong>
              </div>

              <div>
                <span>
                  Підтримка
                </span>

                <strong>
                  Пн — Сб,
                  09:00 — 19:00
                </strong>
              </div>
            </div>
          </div>

          <form
            className={styles.form}
            onSubmit={handleSubmit}
          >
            <div
              className={styles.field}
            >
              <label htmlFor="name">
                Ім&apos;я
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Ваше ім'я"
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                required
              />
            </div>

            <div
              className={styles.field}
            >
              <label htmlFor="phone">
                Телефон
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+380 00 000 00 00"
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value
                  )
                }
                required
              />
            </div>

            <div
              className={styles.field}
            >
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                required
              />
            </div>

            <div
              className={styles.field}
            >
              <label htmlFor="message">
                Повідомлення
              </label>

              <textarea
                id="message"
                name="message"
                placeholder="Напишіть ваше повідомлення..."
                rows={6}
                value={message}
                onChange={(e) =>
                  setMessage(
                    e.target.value
                  )
                }
                required
              />
            </div>

            {success && (
              <p
                className={
                  styles.success
                }
              >
                {success}
              </p>
            )}

            {error && (
              <p
                className={
                  styles.error
                }
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className={
                styles.submit
              }
              disabled={submitting}
            >
              {submitting
                ? "Надсилання..."
                : "Надіслати повідомлення"}

              <span>
                →
              </span>
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}