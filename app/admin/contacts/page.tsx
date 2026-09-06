"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import styles from "./page.module.css";

interface ContactMessage {
  id: number;
  name: string;
  phone: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;

  reply: string | null;
  repliedAt: string | null;
}

export default function AdminContactsPage() {
  const [messages, setMessages] = useState<
    ContactMessage[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [actionId, setActionId] =
    useState<number | null>(null);

  const [replyId, setReplyId] =
    useState<number | null>(null);

  const [replyText, setReplyText] =
    useState("");

  const [replyError, setReplyError] =
    useState("");

  const loadMessages =
    useCallback(async () => {
      try {
        setError("");

        const response = await fetch(
          "/api/admin/contacts",
          {
            cache: "no-store",
          }
        );

        const text =
          await response.text();

        const result = text
          ? JSON.parse(text)
          : {};

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Не вдалося завантажити повідомлення"
          );
        }

        setMessages(result.data ?? []);
      } catch (error) {
        console.error(
          "LOAD CONTACTS ERROR:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Не вдалося завантажити повідомлення"
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleRead = async (
    id: number
  ) => {
    try {
      setActionId(id);
      setError("");

      const response = await fetch(
        `/api/admin/contacts/${id}/read`,
        {
          method: "PATCH",
        }
      );

      const text =
        await response.text();

      const result = text
        ? JSON.parse(text)
        : {};

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Не вдалося оновити повідомлення"
        );
      }

      setMessages((current) =>
        current.map((message) =>
          message.id === id
            ? {
                ...message,
                isRead: true,
              }
            : message
        )
      );
    } catch (error) {
      console.error(
        "READ CONTACT ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Не вдалося оновити повідомлення"
      );
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (
    id: number
  ) => {
    const confirmed =
      window.confirm(
        "Видалити це повідомлення?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionId(id);
      setError("");

      const response = await fetch(
        `/api/admin/contacts/${id}`,
        {
          method: "DELETE",
        }
      );

      const text =
        await response.text();

      const result = text
        ? JSON.parse(text)
        : {};

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Не вдалося видалити повідомлення"
        );
      }

      setMessages((current) =>
        current.filter(
          (message) =>
            message.id !== id
        )
      );

      if (replyId === id) {
        setReplyId(null);
        setReplyText("");
      }
    } catch (error) {
      console.error(
        "DELETE CONTACT ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Не вдалося видалити повідомлення"
      );
    } finally {
      setActionId(null);
    }
  };

  const openReply = (
    item: ContactMessage
  ) => {
    setReplyError("");
    setReplyId(item.id);
    setReplyText("");
  };

  const closeReply = () => {
    setReplyId(null);
    setReplyText("");
    setReplyError("");
  };

  const handleReply = async (
    id: number
  ) => {
    const reply =
      replyText.trim();

    if (reply.length < 2) {
      setReplyError(
        "Напиши відповідь перед відправленням."
      );
      return;
    }

    try {
      setActionId(id);
      setReplyError("");
      setError("");

      const response = await fetch(
        `/api/admin/contacts/${id}/reply`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            reply,
          }),
        }
      );

      const text =
        await response.text();

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
            "Не вдалося відправити відповідь"
        );
      }

      setMessages((current) =>
        current.map((message) =>
          message.id === id
            ? {
                ...message,

                reply:
                  result.data
                    ?.reply ?? reply,

                repliedAt:
                  result.data
                    ?.repliedAt ??
                  new Date().toISOString(),

                isRead: true,
              }
            : message
        )
      );

      setReplyId(null);
      setReplyText("");
    } catch (error) {
      console.error(
        "REPLY CONTACT ERROR:",
        error
      );

      setReplyError(
        error instanceof Error
          ? error.message
          : "Не вдалося відправити відповідь"
      );
    } finally {
      setActionId(null);
    }
  };

  const unreadCount =
    messages.filter(
      (message) =>
        !message.isRead
    ).length;

  if (loading) {
    return (
      <section
        className={styles.page}
      >
        <p
          className={
            styles.loading
          }
        >
          Завантаження
          повідомлень...
        </p>
      </section>
    );
  }

  return (
    <section
      className={styles.page}
    >
      <div
        className={styles.header}
      >
        <div>
          <span
            className={
              styles.label
            }
          >
            MotoShop Admin
          </span>

          <h1>
            Повідомлення
          </h1>

          <p>
            Звернення користувачів
            через форму зворотного
            зв&apos;язку.
          </p>
        </div>

        <div
          className={
            styles.counter
          }
        >
          <span>
            Непрочитані
          </span>

          <strong>
            {unreadCount}
          </strong>
        </div>
      </div>

      {error && (
        <div
          className={
            styles.error
          }
        >
          {error}
        </div>
      )}

      {messages.length === 0 ? (
        <div
          className={
            styles.empty
          }
        >
          <span>✉</span>

          <h2>
            Повідомлень поки
            немає
          </h2>

          <p>
            Нові звернення з
            контактної форми
            з&apos;являться тут.
          </p>
        </div>
      ) : (
        <div
          className={
            styles.messages
          }
        >
          {messages.map(
            (item) => (
              <article
                key={item.id}
                className={`${
                  styles.message
                } ${
                  !item.isRead
                    ? styles.unread
                    : ""
                }`}
              >
                <div
                  className={
                    styles.messageTop
                  }
                >
                  <div
                    className={
                      styles.user
                    }
                  >
                    <div
                      className={
                        styles.avatar
                      }
                    >
                      {item.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <div
                        className={
                          styles.nameRow
                        }
                      >
                        <h2>
                          {item.name}
                        </h2>

                        {!item.isRead && (
                          <span
                            className={
                              styles.newBadge
                            }
                          >
                            Нове
                          </span>
                        )}
                      </div>

                      <span
                        className={
                          styles.date
                        }
                      >
                        {new Date(
                          item.createdAt
                        ).toLocaleString(
                          "uk-UA",
                          {
                            day: "2-digit",
                            month:
                              "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute:
                              "2-digit",
                          }
                        )}
                      </span>
                    </div>
                  </div>

                  <span
                    className={
                      styles.id
                    }
                  >
                    #{item.id}
                  </span>
                </div>

                <div
                  className={
                    styles.contacts
                  }
                >
                  <a
                    href={`tel:${item.phone}`}
                  >
                    <span>
                      Телефон
                    </span>

                    <strong>
                      {item.phone}
                    </strong>
                  </a>

                  <a
                    href={`mailto:${item.email}`}
                  >
                    <span>
                      Email
                    </span>

                    <strong>
                      {item.email}
                    </strong>
                  </a>
                </div>

                <div
                  className={
                    styles.messageText
                  }
                >
                  <span>
                    Повідомлення
                  </span>

                  <p>
                    {item.message}
                  </p>
                </div>

                {item.reply && (
                  <div
                    className={
                      styles.replySent
                    }
                  >
                    <div
                      className={
                        styles.replySentTop
                      }
                    >
                      <span>
                        ✓ Відповідь
                        відправлена
                      </span>

                      {item.repliedAt && (
                        <time>
                          {new Date(
                            item.repliedAt
                          ).toLocaleString(
                            "uk-UA",
                            {
                              day: "2-digit",
                              month:
                                "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute:
                                "2-digit",
                            }
                          )}
                        </time>
                      )}
                    </div>

                    <p>
                      {item.reply}
                    </p>

                    <small>
                      Відправлено на{" "}
                      {item.email}
                    </small>
                  </div>
                )}

                {replyId ===
                  item.id &&
                  !item.reply && (
                    <div
                      className={
                        styles.replyForm
                      }
                    >
                      <label
                        htmlFor={`reply-${item.id}`}
                      >
                        Відповідь
                        клієнту
                      </label>

                      <textarea
                        id={`reply-${item.id}`}
                        value={
                          replyText
                        }
                        onChange={(
                          event
                        ) =>
                          setReplyText(
                            event
                              .target
                              .value
                          )
                        }
                        placeholder="Напишіть відповідь клієнту..."
                        rows={5}
                        disabled={
                          actionId ===
                          item.id
                        }
                      />

                      {replyError && (
                        <p
                          className={
                            styles.replyError
                          }
                        >
                          {
                            replyError
                          }
                        </p>
                      )}

                      <div
                        className={
                          styles.replyActions
                        }
                      >
                        <button
                          type="button"
                          className={
                            styles.sendReplyButton
                          }
                          disabled={
                            actionId ===
                              item.id ||
                            !replyText.trim()
                          }
                          onClick={() =>
                            handleReply(
                              item.id
                            )
                          }
                        >
                          {actionId ===
                          item.id
                            ? "Відправлення..."
                            : "Відправити на email →"}
                        </button>

                        <button
                          type="button"
                          className={
                            styles.cancelReplyButton
                          }
                          disabled={
                            actionId ===
                            item.id
                          }
                          onClick={
                            closeReply
                          }
                        >
                          Скасувати
                        </button>
                      </div>
                    </div>
                  )}

                <div
                  className={
                    styles.actions
                  }
                >
                  {!item.reply &&
                    replyId !==
                      item.id && (
                      <button
                        type="button"
                        className={
                          styles.replyButton
                        }
                        disabled={
                          actionId ===
                          item.id
                        }
                        onClick={() =>
                          openReply(
                            item
                          )
                        }
                      >
                        Відповісти
                        на email
                      </button>
                    )}

                  {!item.isRead && (
                    <button
                      type="button"
                      className={
                        styles.readButton
                      }
                      disabled={
                        actionId ===
                        item.id
                      }
                      onClick={() =>
                        handleRead(
                          item.id
                        )
                      }
                    >
                      {actionId ===
                      item.id
                        ? "Збереження..."
                        : "✓ Позначити прочитаним"}
                    </button>
                  )}

                  {item.isRead && (
                    <span
                      className={
                        styles.readStatus
                      }
                    >
                      ✓ Прочитано
                    </span>
                  )}

                  <button
                    type="button"
                    className={
                      styles.deleteButton
                    }
                    disabled={
                      actionId ===
                      item.id
                    }
                    onClick={() =>
                      handleDelete(
                        item.id
                      )
                    }
                  >
                    Видалити
                  </button>
                </div>
              </article>
            )
          )}
        </div>
      )}
    </section>
  );
}