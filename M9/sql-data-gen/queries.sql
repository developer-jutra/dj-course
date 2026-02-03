
-- PRZYKŁADOWE ZAPYTANIA

-- 1. Znajdź 10 najdroższych produktów z kategorii 'Electronics'
SELECT p.name, p.price, c.name AS category FROM products p
JOIN categories c ON p.category_id = c.category_id
WHERE c.name = 'Electronics'
ORDER BY p.price DESC LIMIT 10;

-- 2. Lista wszystkich zamówień z ich łączną wartością i statusem, które zostały 'Delivered' w ostatnim miesiącu
SELECT order_id, customer_name, total_amount, status FROM orders
WHERE status = 'Delivered' AND order_date >= NOW() - INTERVAL '30 days';

-- 3. Produkty, które nigdy nie zostały zamówione (jeśli Order_Items jest puste dla danego product_id)
SELECT p.product_id, p.name, p.price, p.description, c.name AS category FROM products p
LEFT JOIN order_items oi ON p.product_id = oi.product_id
LEFT JOIN categories c ON p.category_id = c.category_id
WHERE oi.item_id IS NULL;

-- 4. Całkowita wartość zamówień na klienta
SELECT customer_email, SUM(total_amount) AS total_spent FROM orders
GROUP BY customer_email
ORDER BY total_spent DESC LIMIT 50;

-- 5. Zamówienia dostarczone przez FedEx w ostatnim miesiącu, które zawierają produkty o cenie wyższej niż średnia cena wszystkich produktów

SELECT
    o.order_id,
    o.customer_name,
    o.total_amount,
    o.status,
    s.tracking_number,
    o.order_date
FROM
    orders o
JOIN
    shipments s ON o.order_id = s.order_id
WHERE
    o.status = 'Delivered'
    AND o.order_date >= NOW() - INTERVAL '30 days'
    AND s.shipping_carrier = 'FedEx'
    AND o.order_id IN (
        SELECT oi.order_id
        FROM order_items oi
        JOIN products p ON oi.product_id = p.product_id
        WHERE p.price > (SELECT AVG(price) FROM products)
    )
ORDER BY
    o.order_date DESC;
