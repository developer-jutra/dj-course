# M9: Monitoring & Observability

- `.http` - plik (format pliku) który wraz z narzędziami typu np. [httpYac](https://open-vsx.org/extension/anweber/vscode-httpyac) pozwala wyklikiwać żądania HTTP API. Robi +- to samo co [postman](https://www.postman.com/), ale jest znacznie lżejsze / mniej rozbudowane
- `o11y-metrics` - setup pod metryki: Postgres / Prometheus / AlertManager / Grafana
- `o11y-logs` - setup pod logi: Postgres / Loki / Grafana
- `o11y-tracing-jaeger` - setup pod tracing: Postgres / Jaeger / Grafana
- `o11y-tracing-tempo` - setup pod tracing: Postgres / Grafana-Tempo / Grafana
- `o11y-full` - setup uwzględniający metryki, logi oraz tracing
- `sequence-diagrams` - diagramy sekwencji ilustrujące przykładowe flow Z oraz BEZ OTel-Collector
- `sql-data-gen` - generator danych (sql) na potrzeby "karmienia" Postgresa w module, gotowy do dostosowywania i loklanych przeróbek.
