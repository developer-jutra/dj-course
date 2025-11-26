# Plan Implementacji: Transportation Order

## 1. Analiza Obrazka

Na podstawie załączonego obrazka, Transportation Order składa się z następujących komponentów:

### Order Summary
- **Order ID**: Unikalny identyfikator (#00001)
- **Customer**: Powiązanie z klientem (Jan Kowalski)
- **Status**: Stan zamówienia (Processing, itd.)
- **Amount**: Całkowita kwota ($1,250)
- **Order Date**: Data utworzenia (2024-06-06)
- **Expected Delivery**: Planowana data dostawy (2024-06-10)

### Order Timeline (Historia Zdarzeń)
Chronologiczna lista wydarzeń z polami:
- **Event Type**: Typ zdarzenia (Order Created, Payment Confirmed, Order Approved, Preparing Shipment, Ready for Pickup)
- **Timestamp**: Data i czas zdarzenia
- **Title**: Krótki tytuł
- **Description**: Szczegółowy opis
- **Executed By**: Kto wykonał akcję (System, Payment System, Sarah Johnson, Mike Wilson, David Chen)

### Shipping Information
- **Shipping Address**: Pełny adres dostawy (123 Main Street, Boston, MA 02101)
- **Shipping Method**: Metoda dostawy (Standard Delivery)
- **Tracking Number**: Numer śledzenia przesyłki (SR001)

### Order Items (Pozycje Zamówienia)
Lista produktów z cenami:
- **Product Name**: Nazwa produktu
- **Price**: Cena jednostkowa
- Dodatkowo: Shipping cost, Tax
- **Total**: Suma wszystkich pozycji

---

## 2. Propozycja Struktury Danych

### 2.1 Główna Tabela: `transportation_orders`

Rozszerzenie/zastąpienie istniejącej tabeli `orders`:

```go
type TransportationOrder struct {
    ID                  int
    OrderNumber         string      // np. "#00001"
    CustomerID          int         // FK do customers
    Status              OrderStatus
    Amount              float64     // Całkowita kwota
    OrderDate           time.Time   // Data utworzenia
    ExpectedDelivery    time.Time   // Planowana dostawa
    ShippingAddress     string
    ShippingCity        string
    ShippingState       string
    ShippingZipCode     string
    ShippingMethod      string      // "Standard Delivery", "Express", etc.
    TrackingNumber      string      // np. "SR001"
}

type OrderStatus string

const (
    OrderPending     OrderStatus = "PENDING"
    OrderProcessing  OrderStatus = "PROCESSING"
    OrderInTransit   OrderStatus = "IN_TRANSIT"
    OrderDelivered   OrderStatus = "DELIVERED"
    OrderCancelled   OrderStatus = "CANCELLED"
)
```

### 2.2 Tabela: `order_timeline_events`

Historia zdarzeń dla zamówienia:

```go
type OrderTimelineEvent struct {
    ID              int
    OrderID         int         // FK do transportation_orders
    EventType       EventType
    EventTimestamp  time.Time
    Title           string
    Description     string
    ExecutedBy      string      // Kto wykonał (System, imię osoby)
}

type EventType string

const (
    EventOrderCreated       EventType = "ORDER_CREATED"
    EventPaymentConfirmed   EventType = "PAYMENT_CONFIRMED"
    EventOrderApproved      EventType = "ORDER_APPROVED"
    EventPreparingShipment  EventType = "PREPARING_SHIPMENT"
    EventReadyForPickup     EventType = "READY_FOR_PICKUP"
    EventInTransit          EventType = "IN_TRANSIT"
    EventOutForDelivery     EventType = "OUT_FOR_DELIVERY"
    EventDelivered          EventType = "DELIVERED"
)
```

### 2.3 Tabela: `order_items`

Pozycje zamówienia (produkty):

```go
type OrderItem struct {
    ID          int
    OrderID     int         // FK do transportation_orders
    ProductName string
    Quantity    int
    UnitPrice   float64
    TotalPrice  float64     // Quantity * UnitPrice
    ItemType    ItemType    // PRODUCT, SHIPPING, TAX
}

type ItemType string

const (
    ItemProduct  ItemType = "PRODUCT"
    ItemShipping ItemType = "SHIPPING"
    ItemTax      ItemType = "TAX"
)
```

---

## 3. Struktura Plików

Zgodnie z architekturą projektu, utworzenie nowego pakietu:

```
generator/transportation_orders/
├── model.go                        # Struktury i enumy
├── transportation_orders.go        # Funkcje generowania
└── timeline_events.go              # (opcjonalnie) Pomocnicze funkcje dla timeline
```

**Alternatywnie**, jeśli chcemy rozszerzyć istniejący pakiet `orders`:

```
generator/orders/
├── model.go                        # Rozszerzone struktury
├── orders.go                       # Główne zamówienia
├── timeline_events.go              # Generowanie timeline events
└── order_items.go                  # Generowanie order items
```

---

## 4. Schemat SQL

Dodanie do `schema/create-tms-schema.sql`:

```sql
-- Transportation Orders (rozszerzenie/zastąpienie orders)
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS order_timeline_events;
DROP TABLE IF EXISTS transportation_orders;

CREATE TABLE transportation_orders (
    id INT PRIMARY KEY,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    customer_id INT NOT NULL,
    status VARCHAR(20) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    order_date TIMESTAMP NOT NULL,
    expected_delivery DATE,
    shipping_address VARCHAR(255),
    shipping_city VARCHAR(100),
    shipping_state VARCHAR(50),
    shipping_zip_code VARCHAR(20),
    shipping_method VARCHAR(50),
    tracking_number VARCHAR(50),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE order_timeline_events (
    id INT PRIMARY KEY,
    order_id INT NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    event_timestamp TIMESTAMP NOT NULL,
    title VARCHAR(100),
    description TEXT,
    executed_by VARCHAR(100),
    FOREIGN KEY (order_id) REFERENCES transportation_orders(id)
);

CREATE TABLE order_items (
    id INT PRIMARY KEY,
    order_id INT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    item_type VARCHAR(20) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES transportation_orders(id)
);

-- Indeksy dla wydajności
CREATE INDEX idx_timeline_order ON order_timeline_events(order_id);
CREATE INDEX idx_items_order ON order_items(order_id);
```

---

## 5. Konfiguracja Liczby Rekordów

Dodanie do `generator/config/count.go`:

```go
const (
    VEHICLES              = 50
    DRIVERS               = 20
    CUSTOMERS             = 500
    ORDERS                = 1000
    TRANSPORTATION_ORDERS = 1000  // Lub reużycie ORDERS
    TIMELINE_EVENTS_PER_ORDER = 5 // Średnio 5 eventów na zamówienie
    ORDER_ITEMS_PER_ORDER     = 3 // Średnio 3 produkty na zamówienie
)
```

---

## 6. Plan Implementacji

### Krok 1: Utworzenie Struktury Pakietu
- [ ] Utworzyć folder `generator/transportation_orders/`
- [ ] Utworzyć `model.go` z wszystkimi strukturami i enumami

### Krok 2: Implementacja Generatorów
- [ ] `GenerateTransportationOrders()` - generowanie głównych zamówień
- [ ] `GenerateOrderTimelineEvents()` - generowanie historii zdarzeń
- [ ] `GenerateOrderItems()` - generowanie pozycji zamówienia
- [ ] Funkcje pomocnicze do generowania realistycznych danych:
  - Generowanie numerów zamówień (#00001, #00002, etc.)
  - Generowanie tracking numbers (SR001, SR002, etc.)
  - Losowe ale logiczne eventy timeline (np. Payment przed Approval)

### Krok 3: SQL Insert Statements
- [ ] `GenerateInsertStatements()` dla transportation_orders
- [ ] `GenerateTimelineEventsInsertStatements()` dla order_timeline_events
- [ ] `GenerateOrderItemsInsertStatements()` dla order_items

### Krok 4: Integracja z Generatorem
- [ ] Dodanie do `generator/generator.go`:
  - Wywołanie w goroutine (równoległe generowanie)
  - Przekazanie customers jako dependency
- [ ] Aktualizacja `schema/create-tms-schema.sql` z nowymi tabelami

### Krok 5: Logika Biznesowa
- [ ] Timeline events są w chronologicznej kolejności
- [ ] Suma order_items (produkty + shipping + tax) = transportation_orders.amount
- [ ] Status zamówienia odpowiada ostatniemu eventowi w timeline
- [ ] Expected delivery zawsze później niż order_date

### Krok 6: Testowanie
- [ ] Uruchomienie `task run` i weryfikacja wygenerowanego SQL
- [ ] Sprawdzenie poprawności relacji FK
- [ ] Weryfikacja sum kwot

---

## 7. Zależności Między Encjami

```
transportation_orders
├── customer_id → customers.id
├── order_timeline_events (1:N)
│   └── order_id → transportation_orders.id
└── order_items (1:N)
    └── order_id → transportation_orders.id
```

---

## 8. Przykładowe Dane

### Transportation Order:
```
ID: 1
OrderNumber: #00001
CustomerID: 42
Status: PROCESSING
Amount: 1250.00
OrderDate: 2024-06-06 10:00:00
ExpectedDelivery: 2024-06-10
ShippingAddress: 123 Main Street
ShippingCity: Boston
ShippingState: MA
ShippingZipCode: 02101
ShippingMethod: Standard Delivery
TrackingNumber: SR001
```

### Order Timeline Events (dla Order ID=1):
```
1. ORDER_CREATED - 2024-06-06 10:00:00 - "Order placed by customer" - System
2. PAYMENT_CONFIRMED - 2024-06-06 10:15:00 - "Payment successfully processed" - Payment System
3. ORDER_APPROVED - 2024-06-06 11:30:00 - "Order approved for processing" - Sarah Johnson
4. PREPARING_SHIPMENT - 2024-06-06 14:20:00 - "Shipment preparation started" - Mike Wilson
5. READY_FOR_PICKUP - 2024-06-06 16:45:00 - "Package ready for carrier pickup" - David Chen
```

### Order Items (dla Order ID=1):
```
1. Product A - Qty: 1 - Unit: $800.00 - Total: $800.00 - Type: PRODUCT
2. Product B - Qty: 1 - Unit: $350.00 - Total: $350.00 - Type: PRODUCT
3. Shipping - Qty: 1 - Unit: $50.00 - Total: $50.00 - Type: SHIPPING
4. Tax - Qty: 1 - Unit: $50.00 - Total: $50.00 - Type: TAX
```

---

## 9. Pytania i Decyzje do Podjęcia

1. **Czy zastąpić istniejącą tabelę `orders` czy dodać jako nową encję?**
   - Opcja A: Zastąpić (Transportation Order staje się głównym modelem zamówienia)
   - Opcja B: Dodać obok (2 typy zamówień w systemie)

2. **Czy potrzebujemy osobnej tabeli `products`?**
   - Obecnie order_items mają tylko product_name (string)
   - Można rozszerzyć o FK do tabeli products

3. **Jaki zakres dat dla generowania?**
   - Ostatni miesiąc? Ostatnie 3 miesiące? Rok?

4. **Ile eventów timeline na zamówienie?**
   - Minimum: 3-4 (Created, Payment, Approved, Delivered)
   - Maximum: 8-10 (z dodatkowymi statusami pośrednimi)

5. **Czy wszystkie zamówienia mają być "ukończone" czy też niektóre w trakcie?**
   - Różne statusy dla realizmu

---

## 10. Zalecenia

1. **Rozpocząć od podstawowej wersji** z 3 tabelami (transportation_orders, order_timeline_events, order_items)
2. **Reużyć istniejący kod** gdzie to możliwe (np. escaping SQL, string builder patterns)
3. **Dodać walidację** sum kwot (produkty + shipping + tax = total)
4. **Generować realistyczne timeline** - eventy w logicznej kolejności czasowej
5. **Użyć gofakeit** do generowania nazw produktów, adresów, itp.

---

## 11. Szacowany Zakres Zmian

- **Nowe pliki**: 3-4 (model.go, transportation_orders.go, timeline_events.go, order_items.go)
- **Modyfikowane pliki**: 2 (generator/generator.go, schema/create-tms-schema.sql)
- **Konfiguracja**: 1 (generator/config/count.go)
- **Linie kodu**: ~500-700 linii

---

## Status: ⏳ Oczekuje na Zatwierdzenie

Proszę o przejrzenie planu i potwierdzenie podejścia przed rozpoczęciem implementacji.

---

## ✅ Status: ZAIMPLEMENTOWANE

Data implementacji: 2025-11-20

Implementacja została ukończona pomyślnie. Wszystkie zadania zostały zrealizowane zgodnie z planem.

### Statystyki wygenerowanego SQL:
- Linie kodu: 13,332
- Rozmiar pliku: 1.5MB
- Tabele: 6 (vehicles, drivers, customers, transportation_orders, order_timeline_events, order_items)
- Rekordy zamówień: 1,000
- Średnio eventów timeline na zamówienie: 3-10
- Średnio pozycji na zamówienie: 2-5 (produkty + shipping + tax)

### Przykładowe dane:
Zobacz `output/tms-latest.sql` dla pełnego zestawu wygenerowanych danych.
