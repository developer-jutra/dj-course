Warehouse Management System (WMS)

Examples of WMS applications:
- Management of warehouse location and capacity
- Registration of goods receipt and issue
- Inventory management
- Monitoring of warehouse stock in real time
- Support for multiple warehouses and locations


### 1. Standard name for the entity describing the transport operation (execution of the order)

In the transport industry, the most commonly used name for the entity representing the preparation, execution, and settlement of a transport operation (not just the order/request, but the actual transport activity) is:

**Transport Order**  
Alternatively:  
**Shipment** (when focusing on the shipped goods, not the operation itself)  
**Dispatch** (sometimes used, but less common)

The most universal and recognizable term in TMS (Transport Management System) solutions is:  
**Transport Order** (sometimes also "Shipment" in the context of the goods, but "Transport Order" is more operational).

---

### 2. Other typical entities in a transport management system

- **Transport Request**  
  The initial request for transport made by the customer (process initiation).

- **Transport Order**  
  The specific transport operation linked to a request, containing execution details (vehicle, driver, route, dates).

- **Shipment**  
  The physical cargo or group of goods being transported as part of a transport order.

- **Vehicle**  
  A fleet unit used to carry out the transport.

- **Driver**  
  The person assigned to the transport operation.

- **Route**  
  The planned path for the transport between locations.

- **Waypoint**  
  A loading, unloading, or stopover location on the route.

- **Warehouse**  
  A location for intermediate storage of goods.

- **Invoice**  
  The document used to settle the transport operation.

- **Customer**  
  The party requesting the transport.

- **Consignee**  
  The party to whom the shipment is delivered.

- **Status**  
  The current stage of the transport operation (planned, in progress, completed, cancelled).


### (PL)

### 1. Standardowa nazwa encji opisującej fakt przewozu (realizację zlecenia)

W branży transportowej najczęściej stosowaną nazwą dla encji reprezentującej przygotowanie, realizację oraz rozliczenie przewozu (nie samo zlecenie, ale konkretną operację transportową) jest:

**Transport Order**  
lub w polskiej terminologii:  
**Dyspozycja Transportowa**  
alternatywnie:  
**Przewóz**  
**Przesyłka** (gdy skupiasz się na przesyłanym towarze, nie na operacji)

Najbardziej uniwersalna i rozpoznawalna w systemach TMS (Transport Management System) jest:  
**Transport Order** (czasem też "Shipment" w kontekście przesyłki, ale "Transport Order" jest bardziej operacyjne).

---

### 2. Inne typowe encje w systemie transportowym

- **Transport Request / Zlecenie Transportowe**  
  Zgłoszenie potrzeby przewozu przez klienta (inicjacja procesu).

- **Transport Order / Dyspozycja Transportowa**  
  Konkretny przewóz powiązany ze zleceniem, zawiera szczegóły realizacji (pojazd, kierowca, trasa, terminy).

- **Shipment / Przesyłka**  
  Fizyczny ładunek lub grupa ładunków przewożonych w ramach transport order.

- **Vehicle / Pojazd**  
  Jednostka floty wykorzystywana do realizacji przewozu.

- **Driver / Kierowca**  
  Osoba przypisana do przewozu.

- **Route / Trasa**  
  Zaplanowana droga przewozu między punktami.

- **Waypoint / Punkt Pośredni**  
  Miejsce załadunku, rozładunku lub postoju w trasie.

- **Warehouse / Magazyn**  
  Lokalizacja pośredniego składowania towaru.

- **Invoice / Faktura**  
  Dokument rozliczający przewóz.

- **Customer / Klient**  
  Zleceniodawca przewozu.

- **Consignee / Odbiorca**  
  Podmiot, do którego dociera przesyłka.

- **Status / Status Przewozu**  
  Aktualny etap realizacji przewozu (planowany, w realizacji, zakończony, anulowany).

----

Here are five fundamental **business operations** commonly found in warehouse management, reflecting standard industry practice:

- **Receiving**  
  The process of accepting incoming goods into the warehouse. This includes unloading shipments, checking goods against purchase orders for accuracy and quality, and recording their arrival in the warehouse management system.

- **Putaway**  
  Moving received goods from the receiving area to their designated storage locations within the warehouse. This step ensures items are stored efficiently and are easily retrievable for future operations.

- **Storage**  
  Keeping goods in their assigned locations until they are needed. This involves maintaining organization, monitoring inventory levels, and ensuring items are stored under appropriate conditions (e.g., temperature, security).

- **Order Picking**  
  Retrieving specific items from storage to fulfill customer or internal orders. This process is critical for accurate and timely order fulfillment and often involves following a picking list or using technology to guide the process.

- **Shipping**  
  Preparing picked orders for dispatch, packaging them securely, generating shipping labels, and handing them off to carriers for delivery to customers or other destinations.

----

## Typical Cargo Events

Here are common events in a warehouse cargo lifecycle:

- **RECEIVED**: Cargo is received at the warehouse.
- **MOVED**: Cargo is moved from one location (shelf) to another.
- **INSPECTED**: Cargo is inspected (optional, for quality control).
- **HELD**: Cargo is put on hold (e.g., for quality or customs reasons).
- **RELEASED**: Cargo is released from hold.
- **DISPATCHED / DEPARTED**: Cargo leaves the warehouse.
- **DAMAGED**: Cargo is reported as damaged.
- **ADJUSTED**: Manual adjustment (e.g., inventory correction).