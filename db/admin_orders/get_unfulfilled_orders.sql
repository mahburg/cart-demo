SELECT * FROM orders o
JOIN users u ON u.id = o.user_id
WHERE fulfilled ISNULL;