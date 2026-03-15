# Notifications – implementacja bazy danych

## Cel

Zastąpić mockowane dane w `notifications.routes.ts` prawdziwymi danymi z bazy PostgreSQL. Notyfikacje są przypisane do pracownika (nie kierowcy), identyfikowanego przez `user_id`.

---

## Schemat bazy danych

### Nowa tabela: `notifications`

```sql
CREATE TABLE notifications (
    id          INT PRIMARY KEY,
    user_id     INT NOT NULL,
    type        VARCHAR(20)  NOT NULL,  -- success | info | message | warning
    message     TEXT         NOT NULL,
    created_at  TIMESTAMP    NOT NULL,
    is_read     BOOLEAN      NOT NULL DEFAULT false
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

**Uzasadnienie pól:**
- `user_id` – ID pracownika (nie kierowcy); **bez FK** – tabela `users` nie istnieje jeszcze w schemacie, zostanie dodana w przyszłości
- `type` – odzwierciedla obecne typy z mocka: `success`, `info`, `message`, `warning`
- `created_at` – timestamp, z którego warstwa HTTP może wyliczyć względny czas („2h", „5h") albo zwrócić ISO-string
- `is_read` – przydatne do filtrowania nieprzeczytanych

---

## Krok 1 – Generator danych (Go)

### 1a. `generator/notifications/model.go`

```go
package notifications

type NotificationType string

const (
    Success NotificationType = "success"
    Info    NotificationType = "info"
    Message NotificationType = "message"
    Warning NotificationType = "warning"
)

type Notification struct {
    ID        int
    UserID    int
    Type      NotificationType
    Message   string
    CreatedAt time.Time
    IsRead    bool
}
```

### 1b. `generator/notifications/notifications.go`

- `GenerateNotifications(count int) []Notification`
  - losuje typ i treść wiadomości z predefiniowanych pul (jak w mocku)
  - `UserID` – losowa liczba całkowita (np. z zakresu 1–50); brak FK, więc nie zależymy od żadnej innej encji
  - `CreatedAt` – losowy timestamp z ostatnich 7 dni
  - `IsRead` – losowa wartość (większość `false`)
- `GenerateInsertStatements(notifications []Notification) string`
  - single bulk INSERT (wzorzec jak w innych domenach)

### 1c. `generator/config/count.go`

Dodać stałą:

```go
NOTIFICATIONS = 200
```

### 1d. `generator/generator.go`

- Zaimportować pakiet `notifications`
- Notyfikacje generowane niezależnie (brak zależności od innych encji) – dodać jako dodatkową goroutine w fazie 1
- Dopisać `notificationsStatements` do `sb.WriteString(…)`

---

## Krok 2 – Schema SQL

### `schema/create-tms-schema.sql`

Dopisać na górze (w bloku DROP):

```sql
DROP TABLE IF EXISTS notifications;
```

Dopisać definicję tabeli i indeksy (jak w sekcji „Schemat bazy danych" powyżej) – można umieścić po ostatniej istniejącej tabeli, brak FK do innych tabel.

---

## Krok 3 – Uruchomienie generatora

```bash
task run       # z katalogu tms-data-generator
```

Weryfikacja: nowy plik `output/tms-latest.sql` powinien zawierać `INSERT INTO notifications`.

---

## Krok 4 – Warstwa API (`tms-api`)

### 4a. `src/notifications/notifications.queries.ts`

Typy i zapytania DB:

```typescript
type Notification = {
  id: number;
  user_id: number;
  type: string;
  message: string;
  created_at: Date;
  is_read: boolean;
};

type GetNotificationsParams = {
  userId: number;
  limit: number;
  offset: number;
};

export const getNotificationsByUserId = async (
  params: GetNotificationsParams
): Promise<{ rows: Notification[]; total: number }>
```

Zapytanie SQL:

```sql
SELECT id, user_id, type, message, created_at, is_read
FROM notifications
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT $2 OFFSET $3
```

### 4b. `src/notifications/notifications.routes.ts`

- Usunąć `mockNotifications`
- `GET /notifications` – wymagany query param `userId` (int), opcjonalne `limit`, `offset`
- Parsowanie i walidacja w warstwie route (jak w `customers.routes.ts`)
- Odpowiedź: `{ data: Notification[], total: number, page: number, limit: number }`

---

## Kolejność wykonania

| # | Krok | Plik(i) |
|---|------|---------|
| 1 | Dodać tabelę do schematu SQL | `schema/create-tms-schema.sql` |
| 2 | Stworzyć model Go | `generator/notifications/model.go` |
| 3 | Stworzyć generator + INSERT | `generator/notifications/notifications.go` |
| 4 | Dodać stałą liczby rekordów | `generator/config/count.go` |
| 5 | Wpiąć do głównego generatora | `generator/generator.go` |
| 6 | Uruchomić generator | `task run` |
| 7 | Zweryfikować output SQL | `output/tms-latest.sql` |
| 8 | Napisać queries DB | `src/notifications/notifications.queries.ts` |
| 9 | Przebudować routes | `src/notifications/notifications.routes.ts` |
| 10 | Przebudować Docker i przetestować | `curl http://localhost:3000/notifications?userId=1` |

---

## Otwarte pytania / decyzje do podjęcia

1. **Czy zwracać `time` jako relative string** (np. `"2h"`, `"1d"`) z serwera, czy zostawić to frontendowi i zwracać ISO timestamp?
   - Rekomendacja: zwracać `created_at` jako ISO timestamp – logika prezentacji nie należy do API.

2. **`unreadOnly` filtr** – czy endpoint ma obsługiwać filtrowanie po `is_read = false`?
