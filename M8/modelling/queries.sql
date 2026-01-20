-- ============================================================
-- TMS - Przykładowe Zapytania SQL
-- ============================================================

-- ============================================================
-- 1. KATALOG POJAZDÓW - Lista pojazdów wraz ze szczegółami
-- ============================================================

SELECT 
    fv.id,
    fv.plates AS rejestracja,
    fv.vin,
    vc.name AS kategoria,
    vc.code AS kod_kategorii,
    fv.technical_specs AS specyfikacja_techniczna,
    fv.created_at AS data_dodania,
    fv.updated_at AS ostatnia_aktualizacja
FROM 
    FLEET_VEHICLE fv
    INNER JOIN VEHICLE_CATEGORY vc ON fv.category_id = vc.id
ORDER BY 
    fv.plates;


-- ============================================================
-- 2. KATALOG KIEROWCÓW - Lista kierowców wraz z dokumentami
-- ============================================================

SELECT 
    hd.id,
    hd.first_name AS imie,
    hd.last_name AS nazwisko,
    hd.employee_id AS id_pracownika,
    hd.contact_info AS kontakt,
    -- Agregacja dokumentów jako array JSON
    -- COALESCE(
    --     JSON_AGG(
    --         JSON_BUILD_OBJECT(
    --             'id', dd.id,
    --             'typ', dd.doc_type,
    --             'numer', dd.doc_number,
    --             'data_waznosci', dd.expiry_date,
    --             'metadata', dd.metadata
    --         ) ORDER BY dd.doc_type
    --     ) FILTER (WHERE dd.id IS NOT NULL),
    --     '[]'::json
    -- ) AS dokumenty,
    -- Alternatywnie: tylko nazwy typów dokumentów jako array
    ARRAY_AGG(dd.doc_type ORDER BY dd.doc_type) FILTER (WHERE dd.doc_type IS NOT NULL) AS typy_dokumentow,
    hd.created_at AS data_dodania,
    hd.updated_at AS ostatnia_aktualizacja
FROM 
    HR_DRIVER hd
    LEFT JOIN DRIVER_DOCUMENT dd ON hd.id = dd.driver_id
GROUP BY 
    hd.id, hd.first_name, hd.last_name, hd.employee_id, hd.contact_info, hd.created_at, hd.updated_at
ORDER BY 
    hd.last_name, hd.first_name;


-- ============================================================
-- 3. REZERWACJE POJAZDU - Availability dla konkretnego pojazdu
-- Przykład: Pojazd resource_id = 5 (WX 12345, TRUCK_12T)
-- ============================================================

-- Najpierw sprawdźmy, które pojazdy mają rezerwacje w RESOURCE_AVAILABILITY
-- Z przykładowych danych: resource_id=5 ma rezerwację MAINTENANCE

SELECT 
    r.id AS resource_id,
    r.resource_type AS typ_zasobu,
    r.metadata->>'plates' AS rejestracja,
    r.metadata->>'type' AS typ_pojazdu,
    ra.id AS availability_id,
    ra.busy_range AS okres_zajętości,
    LOWER(ra.busy_range) AS start_zajętości,
    UPPER(ra.busy_range) AS koniec_zajętości,
    ra.reason AS powód,
    ra.reference_transport_id AS powiązany_transport,
    ra.created_at AS data_utworzenia
FROM 
    RESOURCE r
    INNER JOIN RESOURCE_AVAILABILITY ra ON r.id = ra.resource_id
WHERE 
    r.resource_type = 'VEHICLE'
    AND r.id = 5  -- Przykładowy pojazd: WX 12345
ORDER BY 
    ra.busy_range;


-- ============================================================
-- 4. SZCZEGÓŁY ZAMÓWIENIA - Pełne informacje o zamówieniu
-- Przykład: zamówienie id = 1
-- ============================================================

SELECT 
    o.id AS order_id,
    o.customer_ref AS numer_referencyjny,
    -- Status zamówienia
    os.code AS status_kod,
    os.display_name AS status_nazwa,
    -- Kontrahent
    c.id AS contrahent_id,
    c.name AS kontrahent_nazwa,
    c.tax_id AS kontrahent_nip,
    c.internal_code AS kontrahent_kod,
    c.contact_details AS kontrahent_kontakt,
    -- Szczegóły zamówienia
    o.deadline AS termin_realizacji,
    o.total_agreed_price AS cena_calkowita,
    o.currency AS waluta,
    o.internal_notes AS notatki_wewnetrzne,
    o.created_at AS data_utworzenia,
    o.updated_at AS ostatnia_aktualizacja,
    -- Agregacja shipmentów jako JSON array
    COALESCE(
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'shipment_id', s.id,
                'pickup_address', s.pickup_address_snapshot,
                'delivery_address', s.delivery_address_snapshot,
                'weight_kg', s.weight,
                'pallets_count', s.pallets_count,
                'goods_description', s.goods_description,
                'requirements', s.requirements
            ) ORDER BY s.id
        ) FILTER (WHERE s.id IS NOT NULL),
        '[]'::json
    ) AS shipments
FROM 
    "ORDER" o
    INNER JOIN ORDER_STATUS os ON o.status_id = os.id
    INNER JOIN CONTRAHENT c ON o.contrahent_id = c.id
    LEFT JOIN SHIPMENT s ON o.id = s.order_id
WHERE 
    o.id = 1  -- Przykładowe zamówienie
GROUP BY 
    o.id, o.customer_ref, os.code, os.display_name, 
    c.id, c.name, c.tax_id, c.internal_code, c.contact_details,
    o.deadline, o.total_agreed_price, o.currency, o.internal_notes,
    o.created_at, o.updated_at;


-- ============================================================
-- BONUS: Szczegóły zamówienia z wszystkimi powiązaniami
-- (rozszerzona wersja query #4 - z dodatkowymi informacjami)
-- ============================================================

SELECT 
    o.id AS order_id,
    o.customer_ref AS numer_referencyjny,
    os.display_name AS status,
    c.name AS kontrahent,
    c.tax_id AS nip,
    o.total_agreed_price || ' ' || o.currency AS wartość_zamówienia,
    o.deadline AS termin,
    -- Liczba shipmentów
    COUNT(DISTINCT s.id) AS liczba_shipmentow,
    -- Łączna waga i palety
    SUM(s.weight) AS laczna_waga_kg,
    SUM(s.pallets_count) AS laczna_liczba_palet,
    -- Lista shipmentów (skrócona)
    STRING_AGG(DISTINCT 
        'Shipment #' || s.id || ': ' || 
        (s.pickup_address_snapshot->>'city') || ' → ' || 
        (s.delivery_address_snapshot->>'city'), 
        '; ' 
        ORDER BY 'Shipment #' || s.id || ': ' || 
        (s.pickup_address_snapshot->>'city') || ' → ' || 
        (s.delivery_address_snapshot->>'city')
    ) AS trasy_shipmentow
FROM 
    "ORDER" o
    INNER JOIN ORDER_STATUS os ON o.status_id = os.id
    INNER JOIN CONTRAHENT c ON o.contrahent_id = c.id
    LEFT JOIN SHIPMENT s ON o.id = s.order_id
WHERE 
    o.id = 1
GROUP BY 
    o.id, o.customer_ref, os.display_name, c.name, c.tax_id, 
    o.total_agreed_price, o.currency, o.deadline;

-- ============================================================
-- END OF QUERIES
-- ============================================================
