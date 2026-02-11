# Podsumowanie Metryk w Prometheus

| Komponent             | Status  | Opis                         |
|-----------------------|---------|------------------------------|
| **products-api**      | ❌ BRAK | Metryki aplikacji            |
| **node-exporter**     | ❌ BRAK | Metryki hosta                |
| **postgres-exporter** | ✅ OK   | PostgreSQL metryki + info    |
| **Go Runtime**        | ✅ OK   | Z postgres-exporter procesu  |
| **Process Metrics**   | ✅ OK   | Metryki OS procesu           |
| **Prometheus**        | ✅ OK   | Wszystkie wewnętrzne metryki |
| **Promhttp**          | ✅ OK   | Handler /metrics             |
| **Scraping**          | ✅ OK   | Per-target metrics           |
| **Network Tracking**  | ✅ OK   | Conntrack                    |

---

**Źródło:** Prometheus API (`http://localhost:9090`)  
**Config:** `docker-compose.yml`, `otel-collector-config.yaml`, `prometheus.yml`
---

## 1. Metryki Własne Aplikacji (products-api)

**Źródło:** Node.js aplikacja → OTLP → OTel Collector → Prometheus  

**Oczekiwane metryki custom (zdefiniowane w kodzie):**

### 1.1 Metryki Biznesowe
- **`health_status`** ⭐ - Status zdrowia aplikacji (1=healthy, 0=unhealthy), gauge
- **`process_uptime_seconds`** - Uptime aplikacji w sekundach, gauge
- **`http_requests_total`** ⭐ - Całkowita liczba HTTP requestów (labels: method, path, status), counter - **KLUCZOWA do monitorowania trafficu**

### 1.2 Web Vitals (Real User Monitoring)
Metryki wydajności z perspektywy użytkownika, zbierane przez `/client_metrics` endpoint:
- **`web_vitals_lcp`** ⭐ - Largest Contentful Paint w ms, histogram - **Google Core Web Vital**
- **`web_vitals_inp`** ⭐ - Interaction to Next Paint w ms, histogram - **Google Core Web Vital**
- **`web_vitals_cls`** ⭐ - Cumulative Layout Shift score, histogram - **Google Core Web Vital**

Labels: `page_path`, `device_type`, `connection_type`

---

## 2. Metryki Hosta (node-exporter)

**Źródło:** node-exporter → OTel Collector (prometheus receiver) → Prometheus  
**Status:** Metryki nie są obecnie dostępne

**Oczekiwane grupy metryk:**

### 2.1 CPU (`node_cpu_*`)
Wykorzystanie CPU per core i mode (user, system, idle, iowait, etc.)
- `node_cpu_seconds_total` ⭐ - Podstawowa metryka CPU

### 2.2 Pamięć (`node_memory_*`)
- `node_memory_MemTotal_bytes`, `node_memory_MemFree_bytes`, `node_memory_MemAvailable_bytes`
- `node_memory_Cached_bytes`, `node_memory_Buffers_bytes`
- `node_memory_SwapTotal_bytes`, `node_memory_SwapFree_bytes`

### 2.3 Dysk (`node_disk_*`, `node_filesystem_*`)
- `node_disk_read_bytes_total`, `node_disk_written_bytes_total` ⭐
- `node_disk_io_time_seconds_total`
- `node_filesystem_size_bytes`, `node_filesystem_avail_bytes`, `node_filesystem_free_bytes` ⭐

### 2.4 Sieć (`node_network_*`)
- `node_network_receive_bytes_total`, `node_network_transmit_bytes_total` ⭐
- `node_network_receive_errs_total`, `node_network_transmit_errs_total`

### 2.5 Load Average i Kontekst
- `node_load1`, `node_load5`, `node_load15` ⭐
- `node_context_switches_total`

### 2.6 Inne
- `node_boot_time_seconds`, `node_time_seconds`
- `node_procs_running`, `node_procs_blocked`

---

## 3. Metryki PostgreSQL (postgres-exporter)

**Źródło:** postgres-exporter → OTel Collector → Prometheus

### 3.1 Status Exportera
- **`pg_up`** ⭐ - Czy baza danych jest dostępna (1=up, 0=down) - **KLUCZOWE**
- `pg_exporter_last_scrape_duration_seconds` - Czas trwania ostatniego scrapowania
- `pg_exporter_last_scrape_error` - Czy wystąpił błąd podczas scrapowania
- `pg_exporter_scrapes_total` - Całkowita liczba scrapowań

### 3.2 Informacje o Exporter
- `postgres_exporter_build_info` - Informacje o wersji
- `postgres_exporter_config_last_reload_success_timestamp_seconds`
- `postgres_exporter_config_last_reload_successful`

---

## 4. Metryki Go Runtime (postgres-exporter)

**Źródło:** Wbudowane metryki Go z postgres-exporter

### 4.1 Garbage Collection (`go_gc_*`)
Stan i wydajność garbage collectora:
- `go_gc_duration_seconds` - Czas trwania GC, histogram
- `go_gc_cycles_*` - Liczba cykli GC (automatic, forced, total)
- `go_gc_heap_*` - Statystyki heap (allocs, frees, goal, live)
- `go_gc_pauses_seconds` - Pauzy GC, histogram
- `go_gc_gogc_percent`, `go_gc_gomemlimit_bytes` - Konfiguracja GC

### 4.2 Pamięć (`go_memstats_*`)
Szczegółowe statystyki pamięci Go runtime:
- **`go_memstats_heap_alloc_bytes`** - Obecnie alokowana pamięć heap
- **`go_memstats_heap_inuse_bytes`** - Pamięć heap w użyciu
- **`go_memstats_heap_idle_bytes`** - Bezczynna pamięć heap
- `go_memstats_heap_objects` - Liczba obiektów na heap
- `go_memstats_alloc_bytes_total` - Całkowita alokowana pamięć
- `go_memstats_mallocs_total`, `go_memstats_frees_total`
- `go_memstats_gc_sys_bytes`, `go_memstats_stack_sys_bytes`
- `go_memstats_sys_bytes` ⭐ - Całkowita pamięć systemowa

### 4.3 Scheduler i Goroutines (`go_sched_*`, `go_goroutines`)
- **`go_goroutines`** ⭐ - Liczba aktywnych goroutines - **Ważne dla wykrywania goroutine leaks**
- `go_sched_gomaxprocs_threads` - Liczba wątków OS
- `go_sched_goroutines_goroutines`
- `go_sched_latencies_seconds` - Latencje schedulera, histogram
- `go_sched_pauses_*` - Pauzy schedulera

### 4.4 Podstawowe
- `go_threads` - Liczba wątków OS
- `go_info` - Informacje o wersji Go

---

## 5. Metryki Procesów (postgres-exporter)

**Źródło:** Wbudowane metryki procesu z postgres-exporter

Ogólne metryki procesu OS:
- **`process_cpu_seconds_total`** - Całkowity czas CPU zużyty przez proces
- **`process_resident_memory_bytes`** ⭐ - RSS - faktyczna pamięć fizyczna
- `process_virtual_memory_bytes` - Wirtualna pamięć procesu
- `process_virtual_memory_max_bytes` - Max wirtualna pamięć
- **`process_open_fds`** - Liczba otwartych deskryptorów plików (ważne dla wykrywania fd leaks)
- `process_max_fds` - Maksymalna liczba FD
- `process_start_time_seconds` - Timestamp startu procesu
- `process_network_receive_bytes_total`, `process_network_transmit_bytes_total`

---

## 6. Metryki Prometheus (wewnętrzne)

**Źródło:** Sam Prometheus

### 6.1 Konfiguracja i Stan
- **`prometheus_ready`** - Czy Prometheus jest gotowy (1=ready)
- `prometheus_build_info` - Informacje o wersji
- `prometheus_config_last_reload_successful` - Status ostatniego przeładowania config
- `prometheus_config_last_reload_success_timestamp_seconds`

### 6.2 Query Engine (`prometheus_engine_*`)
- `prometheus_engine_queries` - Aktywne zapytania
- `prometheus_engine_queries_concurrent_max` - Max współbieżnych zapytań
- `prometheus_engine_query_duration_seconds` ⭐ - Czas wykonania zapytań, histogram
- `prometheus_engine_query_samples_total` - Liczba próbek przetworzonych
- `prometheus_engine_query_log_*` - Logi zapytań

### 6.3 HTTP API (`prometheus_http_*`)
- `prometheus_http_requests_total` - Całkowita liczba HTTP requestów do API
- `prometheus_http_request_duration_seconds` - Czas trwania requestów, histogram
- `prometheus_http_response_size_bytes` - Rozmiar odpowiedzi, histogram

### 6.4 Storage/TSDB (`prometheus_tsdb_*`)
Time Series Database - przechowywanie danych:
- **`prometheus_tsdb_head_series`** - Liczba aktywnych serii w pamięci
- **`prometheus_tsdb_head_chunks`** - Liczba chunków w pamięci
- `prometheus_tsdb_blocks_loaded` - Załadowane bloki danych
- `prometheus_tsdb_compactions_*` - Statystyki kompakcji
- `prometheus_tsdb_wal_*` - Write-Ahead Log
- `prometheus_tsdb_storage_blocks_bytes` - Rozmiar storage
- `prometheus_tsdb_retention_limit_*` - Limity retencji

### 6.5 Service Discovery (`prometheus_sd_*`)
Mechanizmy odkrywania targetów:
- `prometheus_sd_discovered_targets` ⭐ - Liczba odkrytych targetów
- `prometheus_sd_*_failures_total` - Błędy w różnych mechanizmach SD
- `prometheus_sd_updates_*` - Aktualizacje konfiguracji

### 6.6 Scraping (`prometheus_target_*`)
Zbieranie metryk z targetów:
- `prometheus_target_scrapes_*` - Statystyki scrapowania
- `prometheus_target_interval_length_seconds` - Długość interwału scrapowania
- `prometheus_target_scrape_pool_*` - Statystyki pool targetów
- `prometheus_target_sync_*` - Synchronizacja targetów

### 6.7 Rules (`prometheus_rule_*`)
Ewaluacja reguł alertowych i recording rules:
- `prometheus_rule_evaluations_total` - Całkowita liczba ewaluacji
- `prometheus_rule_evaluation_duration_seconds` - Czas ewaluacji
- `prometheus_rule_evaluation_failures_total` - Nieudane ewaluacje
- `prometheus_rule_group_*` - Statystyki grup reguł

### 6.8 Alerting (`prometheus_notifications_*`)
Wysyłanie alertów do Alertmanager:
- `prometheus_notifications_alertmanagers_discovered` - Odkryte Alertmanagery
- `prometheus_notifications_sent_total`, `prometheus_notifications_dropped_total`
- `prometheus_notifications_errors_total`, `prometheus_notifications_queue_length`

### 6.9 Remote Storage (`prometheus_remote_storage_*`)
Remote read/write:
- `prometheus_remote_storage_samples_in_total`
- `prometheus_remote_storage_histograms_in_total`
- `prometheus_remote_storage_highest_timestamp_in_seconds`

---

## 7. Metryki HTTP Handler (promhttp)

**Źródło:** prometheus/client_golang promhttp handler

Metryki endpointu `/metrics`:
- `promhttp_metric_handler_requests_in_flight` - Aktywne requesty do /metrics
- `promhttp_metric_handler_requests_total` - Całkowita liczba requestów

---

## 8. Metryki Scrapingu (per-target)

**Źródło:** Prometheus - generowane automatycznie dla każdego targeta

Metryki generowane dla każdego scrapowanego targeta:
- **`up`** ⭐⭐⭐ - Czy target jest dostępny (1=up, 0=down) - **NAJWAŻNIEJSZA METRYKA MONITORINGU**
- `scrape_duration_seconds` - Czas trwania ostatniego scrape
- `scrape_samples_scraped` - Liczba próbek zebranych
- `scrape_samples_post_metric_relabeling` - Próbki po relabelingu
- `scrape_series_added` - Dodane serie czasowe

---

## 9. Metryki Network Tracking (`net_conntrack_*`)

**Źródło:** Wbudowane w Go (prometheus/client_golang)

Śledzenie połączeń sieciowych:
- `net_conntrack_dialer_conn_*` - Połączenia wychodzące (attempted, established, failed, closed)
- `net_conntrack_listener_conn_*` - Połączenia przychodzące (accepted, closed)

---

## 10. Metryki Target Info

**Źródło:** Prometheus

- `target_info` - Metadata o targetach (labels: job, instance, etc.)

