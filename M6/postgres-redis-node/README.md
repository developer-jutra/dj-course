# TL;DR; 😉

Start the containers in the background while ensuring they are built with the latest changes:

    docker compose up -d --build

Stop all running services and cleans up the environment by removing containers, networks, and volumes:

    docker compose down -v

---

# Node.js Express + PostgreSQL + Redis + PGAdmin Dockerized Stack

This project provides a ready-to-use development environment for a Node.js Express API with PostgreSQL, Redis cache, and PGAdmin database management, all orchestrated with Docker Compose.

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (v20+ recommended)
- [Docker Compose](https://docs.docker.com/compose/) (v2+ recommended)
- Bash or compatible shell

---

## Quick Start

**1. Clone the repository**

```
git clone 
cd 
```

**2. Create secrets**

```
mkdir -p secrets
echo "your_postgres_password" > secrets/postgres_password.txt
echo "your_pgadmin_password" > secrets/pgadmin_password.txt
echo "your_redis_password" > secrets/redis_password.txt
chmod 600 secrets/*
```

**3. Build and start all services**

```
docker compose up -d --build
```

**4. Check running containers**

```
docker compose ps
```

**5. View logs for a specific service (e.g., app)**

```
docker compose logs -f app
```

**6. Stop all services**

```
docker compose down
```

---

## Useful Commands

| Action                                    | Command                                  |
|-------------------------------------------|------------------------------------------|
| Build & start all services                | `docker compose up -d --build`           |
| Stop all services                         | `docker compose down`                    |
| Restart a specific service (e.g., app)    | `docker compose restart app`             |
| View logs for a service                   | `docker compose logs -f `                |
| Execute a shell in a running container    | `docker compose exec  sh`                |
| List all running containers               | `docker compose ps`                      |

---

## Accessing Services

- **API Endpoint:**  
  [http://localhost:3000/products](http://localhost:3000/products)

- **PGAdmin:**  
  [http://localhost:5050](http://localhost:5050)  
  - Login email: *(as in `secrets/pgadmin_password.txt`)*  
  - Password: *(as in `secrets/pgadmin_password.txt`)*

---

## Notes

- PostgreSQL, Redis, and PGAdmin credentials are managed via Docker secrets in the `secrets/` directory.
- PGAdmin is preconfigured with a connection to the PostgreSQL database.
- Make sure to **never commit your secrets** to version control.

---

## Cleaning Up

To remove all containers, networks, and volumes:

```
docker compose down -v
```

---

## Troubleshooting

- If you change any secret, restart the affected containers.
- For permission issues, ensure `secrets/` files are readable by Docker and have `chmod 600`.
