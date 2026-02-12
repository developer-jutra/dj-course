# M9: Monitoring & Observability

- (w razie potrzeby wszędzie `npm i`/`npm install` aby zainstalować zależności)
- `.http` - plik (format pliku) który wraz z narzędziami typu np. [httpYac](https://open-vsx.org/extension/anweber/vscode-httpyac) pozwala wyklikiwać żądania HTTP API. Robi +- to samo co [postman](https://www.postman.com/), ale jest znacznie lżejsze / mniej rozbudowane
- `load-testing-artillery` - stress testing w oparciu o `artillery`
- `load-testing-taurus` - stress testing w oparciu o `taurus`/`jmeter`
  - `npm run test:load` / `npm run test:load:report`
- `o11y-metrics` - metryki
  - komponenty: Postgres, Prometheus, AlertManager, Grafana
  - instrumentacja: `prom-client`, `express-prom-bundle` (`npm run dev`)
  - instrumentacja: OTEL SDK (`npm run dev-otlp`)
  - bez kolektora
- `o11y-logs` - logi
  - komponenty: Postgres, Loki, Grafana
  - instrumentacja: `winston` (`npm run dev`)
  - instrumentacja: OTEL SDK (`npm run dev-otlp`)
  - bez kolektora
- `o11y-tracing-jaeger` - tracing
  - komponenty: Postgres, Jaeger, Grafana
  - bez kolektora
- `o11y-tracing-tempo` - tracing
  - komponenty: Postgres, Grafana-Tempo, Grafana
  - bez kolektora
- `o11y-full` - all in one: metryki, logi oraz tracing
  - komponenty: Postgres, Prometheus, AlertManager, Loki, Tempo, OtelCollector, Grafana
  - instrumentacja: OTEL SDK
  - z kolektorem
  - powiązanie traces/logs
- `sequence-diagrams` - diagramy sekwencji ilustrujące przykładowe flow Z oraz BEZ OTel-Collector

## Skrypty + dodatkowe

- `restart-grafana.sh` - zrestartuj grafanę (szczególnie przydatne po modyfikacji plików JSON z dashbaordami) - nawet przelogowywać się nie trzeba tylko refresh w przeglądarce :)
- `list-all-metrics.sh` / `METRICS-SUMMARY.md` - zestawienie wszystkich metryk (pogrupowane, opisane, rozpisane co priorytetowe)
- `check-trace-logs.sh` - weryfikuje korelację **trace–logi**. Sprawdza, czy logi z danym `TRACE_ID` są w kontenerze i w loki, wyświetla powiązane span IDs, status OTel Collector i podaje gotowe zapytanie do grafany
- `test-manual-*`:
  - `test-manual-metrics.sh` - syntetyczny ruch + weryfikacja metryk
  - `test-manual-logs.sh` - syntetyczny ruch + weryfikacja logów
  - `test-manual-tracing.sh` - syntetyczny ruch + weryfikacja tracingu
- `TRAGIC-REPORT-*` - zestaw plików dokumentujących raport w sytuacji gdzie najpierw spowodowano wybiórczo regresję w systemie i potem uruchomiono stress testy - aby dać modelowi/agentowi pole do popisu - i zobaczyć jak sobie poradzi
  - `TRAGIC-REPORT-*-report.json` - report/JSON
  - `TRAGIC-REPORT-*.txt` - output (report) z wyniku stress testu
  - `TRAGIC-REPORT-*.md` - co na to (report) powiedziało gemini (https://gemini.google.com/share/2a22ba08902d)
  - `TRAGIC-REPORT-*plan.md` - interpretacja Claude Sonnet 4.5 + działanie mające na celu usunięcie regresji
- `sql-data-gen` - generator danych (sql) na potrzeby "karmienia" Postgresa w module, gotowy do dostosowywania i loklanych przeróbek.

## Zestawienie

|               | metrics | logs | traces | collector | instrumentation |
|---------------|---------|------|--------|-----------|-----------------|
| o11y-metrics  | +       | -    | -      | -         | native + OTEL   |
| o11y-logs     | -       | +    | -      | -         | native + OTEL   |
| o11y-T-jaeger | -       | -    | +      | -         | OTEL            |
| o11y-T-tempo  | -       | -    | +      | -         | OTEL            |
| o11y-full     | +       | +    | +      | +         | OTEL            |
