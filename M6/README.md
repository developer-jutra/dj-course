# M6: DevOps

## wielokontenerowy setup  deliveroo

### interfejsy "odmockowane"

Większość zakładek wykorzystuje MOKI, natomiast wskazane (dla odpowiednich aplikacji) wykorzystuje realną komunikację z odpowiednią bazą danych. Weryfikując poprawność działania samego set-upu, upewnij się, że komunikacja w tych właśnie miejscach działa poprawnie.

WMS:

- Reservations (tab #3): Go to Reservations – active reservations from the API should appear.
- Cargo Management (tab #4): Go to Cargo Management, enter a term (e.g. electronics, machinery, anything) in the search box – matching cargo records should load.

TMS:

- Fleet (sidebar): Go to Fleet – vehicles from the TMS API should appear.
- Drivers (sidebar): Go to Drivers – driver list from the API should appear.
- Notifications: Click the bell icon in the header – notifications from the API should load.

CP:

- Dashboard: Go to Dashboard – stats cards, Quick Actions, Your Requests, Metrics, Route Performance – data from MongoDB.
- Transportation Requests (Requests tab): Go to Requests → Transportation – transportation requests list from MongoDB.
