SELECT * FROM order_items i
JOIN orders o ON o.id = i.order_id
JOIN products p ON i.prod_id = p.id
WHERE order_id = $1;