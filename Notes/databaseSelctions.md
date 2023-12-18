# Select all party members

```
SELECT * FROM heroes
LEFT JOIN sentients USING(sentient_id);
```

# Select organization leader

```
SELECT first_name, last_name, short_title, organization_name
FROM sentients s
LEFT JOIN organizations o ON
s.sentient_id  = o.leader
WHERE first_name = 'Ecuron';

```
