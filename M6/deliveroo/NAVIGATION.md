# Deliveroo Services – How to Navigate

## WMS

**Warehouse Management System**

- **Frontend**: Navigate to [http://localhost:4200](http://localhost:4200) (or `http://localhost:${WMS_FRONTEND_PORT}`)
- **API**: [http://localhost:3001](http://localhost:3001) (or `http://localhost:${WMS_API_PORT}`)

Start with Docker Compose:
```bash
docker compose up wms-api wms-frontend
```

---

## TMS

**Transport Management System**

- **Frontend**: Navigate to [http://localhost:5173](http://localhost:5173) (or `http://localhost:${TMS_FRONTEND_PORT}`)
- **API**: [http://localhost:3030](http://localhost:3030) (or `http://localhost:${TMS_API_PORT}`)

Start with Docker Compose:
```bash
docker compose up tms-api tms-frontend
```

The TMS frontend consumes the TMS API for:
- **Vehicles** (Fleet page): list, details, maintenance, routes
- **Drivers** (Drivers page): list, details, calendar, routes
- **Notifications** (header): notification list
