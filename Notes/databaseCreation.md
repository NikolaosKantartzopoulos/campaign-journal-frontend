```
CREATE TABLE sentients (
  sentient_id INT PRIMARY KEY AUTO_INCREMENT,
  first_name TINYTEXT NOT NULL,
  last_name TINYTEXT,
  birth_date TINYTEXT,
)
```

```
CREATE TABLE `descriptions` (
  description_id INT PRIMARY KEY AUTO_INCREMENT,
  value VARCHAR(255) DEFAULT NULL,
)
```

```
CREATE TABLE heroes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sentient_id INT,

  CONSTRAINT fk_party_member FOREIGN KEY (sentient_id) REFERENCES sentients(sentient_id)
)
```

CREATE TABLE heroes (
party_id INT PRIMARY KEY AUTO_INCREMENT,
party_name TINYTEXT,
sentient_id INT,
)

alter table heroes
add 
heroes_team_id int references heroes_team