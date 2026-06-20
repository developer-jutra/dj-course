-- =====================================================================
-- ADVANCED EXAMPLE QUERIES (WMS)
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) Warehouse capacity utilization
--    Walks the full storage hierarchy (warehouse -> zone -> aisle ->
--    rack -> shelf) to get total physical capacity, then compares it
--    against currently active reservations. Ranks warehouses by load.
-- ---------------------------------------------------------------------
WITH shelf_capacity AS (
    SELECT
        w.warehouse_id,
        w.name AS warehouse_name,
        SUM(s.max_weight) AS total_weight_capacity,
        SUM(s.max_volume) AS total_volume_capacity
    FROM warehouse w
    JOIN zone  z  ON z.warehouse_id = w.warehouse_id
    JOIN aisle a  ON a.zone_id      = z.zone_id
    JOIN rack  r  ON r.aisle_id     = a.aisle_id
    JOIN shelf s  ON s.rack_id      = r.rack_id
    GROUP BY w.warehouse_id, w.name
),
active_load AS (
    SELECT
        r.rack_id,
        res.shelf_id,
        SUM(res.reserved_weight) AS used_weight,
        SUM(res.reserved_volume) AS used_volume
    FROM storage_reservation res
    JOIN shelf sh ON sh.shelf_id = res.shelf_id
    JOIN rack  r  ON r.rack_id   = sh.rack_id
    WHERE res.status = 'active'
    GROUP BY r.rack_id, res.shelf_id
),
warehouse_load AS (
    SELECT
        w.warehouse_id,
        SUM(al.used_weight) AS used_weight,
        SUM(al.used_volume) AS used_volume
    FROM warehouse w
    JOIN zone  z  ON z.warehouse_id = w.warehouse_id
    JOIN aisle a  ON a.zone_id      = z.zone_id
    JOIN rack  r  ON r.aisle_id     = a.aisle_id
    JOIN active_load al ON al.rack_id = r.rack_id
    GROUP BY w.warehouse_id
)
SELECT
    sc.warehouse_name,
    sc.total_weight_capacity,
    COALESCE(wl.used_weight, 0) AS used_weight,
    ROUND(
        100.0 * COALESCE(wl.used_weight, 0) / NULLIF(sc.total_weight_capacity, 0),
        1
    ) AS weight_utilization_pct,
    ROUND(
        100.0 * COALESCE(wl.used_volume, 0) / NULLIF(sc.total_volume_capacity, 0),
        1
    ) AS volume_utilization_pct,
    RANK() OVER (
        ORDER BY COALESCE(wl.used_weight, 0) / NULLIF(sc.total_weight_capacity, 0) DESC
    ) AS load_rank
FROM shelf_capacity sc
LEFT JOIN warehouse_load wl ON wl.warehouse_id = sc.warehouse_id
ORDER BY weight_utilization_pct DESC NULLS LAST;


-- ---------------------------------------------------------------------
-- 2) Customer revenue ranking with share + running total
--    Aggregates paid payments per customer, then uses window functions
--    to show each customer's share of total revenue and a cumulative
--    running total (Pareto / "top customers" analysis).
-- ---------------------------------------------------------------------
WITH customer_revenue AS (
    SELECT
        c.customer_id,
        c.name,
        COUNT(p.payment_id)        AS paid_invoices,
        SUM(p.amount)              AS total_revenue
    FROM customer c
    JOIN payment p ON p.customer_id = c.customer_id
    WHERE p.status = 'paid'
      AND c.is_deleted = false
    GROUP BY c.customer_id, c.name
)
SELECT
    name,
    paid_invoices,
    total_revenue,
    ROUND(
        100.0 * total_revenue / SUM(total_revenue) OVER (),
        2
    ) AS revenue_share_pct,
    SUM(total_revenue) OVER (
        ORDER BY total_revenue DESC
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS cumulative_revenue,
    ROUND(
        100.0 * SUM(total_revenue) OVER (
            ORDER BY total_revenue DESC
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) / SUM(total_revenue) OVER (),
        2
    ) AS cumulative_share_pct
FROM customer_revenue
ORDER BY total_revenue DESC;


-- ---------------------------------------------------------------------
-- 3) Overdue storage records + dwell time and last logged event
--    Finds cargo still in the warehouse (or that exited late) past the
--    requested exit date, computes dwell time, and uses a LATERAL join
--    to pull the most recent event for each record from the history.
-- ---------------------------------------------------------------------
SELECT
    sr.storage_record_id,
    c.name AS customer_name,
    w.name AS warehouse_name,
    sr.cargo_description,
    req.requested_exit_date,
    sr.actual_exit_date,
    -- days the cargo has spent / spent in storage
    EXTRACT(DAY FROM
        COALESCE(sr.actual_exit_date, CURRENT_TIMESTAMP) - sr.actual_entry_date
    ) AS dwell_days,
    -- how late vs. the requested exit date
    EXTRACT(DAY FROM
        COALESCE(sr.actual_exit_date, CURRENT_TIMESTAMP) - req.requested_exit_date
    ) AS days_overdue,
    last_event.event_name,
    last_event.event_time
FROM storage_record sr
JOIN storage_request req ON req.request_id = sr.request_id
JOIN customer c          ON c.customer_id  = sr.customer_id
JOIN shelf sh            ON sh.shelf_id    = sr.shelf_id
JOIN rack  r             ON r.rack_id      = sh.rack_id
JOIN aisle a             ON a.aisle_id     = r.aisle_id
JOIN zone  z             ON z.zone_id      = a.zone_id
JOIN warehouse w         ON w.warehouse_id = z.warehouse_id
LEFT JOIN LATERAL (
    SELECT et.name AS event_name, seh.event_time
    FROM storage_event_history seh
    JOIN storage_event_type et ON et.event_type_id = seh.event_type_id
    WHERE seh.storage_record_id = sr.storage_record_id
    ORDER BY seh.event_time DESC
    LIMIT 1
) last_event ON true
WHERE COALESCE(sr.actual_exit_date, CURRENT_TIMESTAMP) > req.requested_exit_date
ORDER BY days_overdue DESC;
