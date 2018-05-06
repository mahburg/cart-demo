SELECT * FROM orders o
JOIN order_items i on o.id = i.order_id
WHERE user_id = $1
ORDER BY o.order_ts;