```
CREATE TABLE event_chain (
  event_chain_id INT AUTO_INCREMENT PRIMARY KEY,
  event_precedent INT,
  event_resulting INT,
  FOREIGN KEY (event_precedent) REFERENCES event(event_id),
  FOREIGN KEY (event_resulting) REFERENCES event(event_id)
);
```

```
CREATE TABLE factions_concerned_by_event (
  factions_concerned_by_event_id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  function_id INT NOT NULL,
  FOREIGN KEY (event_id) REFERENCES event(event_id),
  FOREIGN KEY (function_id) REFERENCES function(function_id)
);
```

```
CREATE TABLE event (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    event_title VARCHAR(32) NOT NULL UNIQUE,
    event_text TEXT,
    faction_initiator INT,
    faction_target INT,
    date_start DATE NOT NULL,
    date_end DATE,
    FOREIGN KEY (faction_initiator) REFERENCES faction(faction_id),
    FOREIGN KEY (faction_target) REFERENCES faction(faction_id)
);
```

```
CREATE TABLE event_location (
    event_id INT NOT NULL,
    location_id INT NOT NULL,
    FOREIGN KEY (event_id) REFERENCES event(event_id),
    FOREIGN KEY (location_id) REFERENCES location(location_id),
    PRIMARY KEY (event_id, location_id)
);
```

```
CREATE TABLE item (
  item_id INT AUTO_INCREMENT PRIMARY KEY,
  item_name VARCHAR(64) NOT NULL,
  item_description TEXT,
  item_owner INT,
  item_state ENUM ('on person', 'missing', 'in place'),
  item_location INT,
  FOREIGN KEY (item_owner) REFERENCES sentient(sentient_id),
  FOREIGN KEY (item_location) REFERENCES location(location_id)
);
```

```
CREATE TABLE event_item (
    event_id INT NOT NULL,
    item_id INT NOT NULL,
    FOREIGN KEY (event_id) REFERENCES event(event_id),
    FOREIGN KEY (item_id) REFERENCES item(item_id),
    PRIMARY KEY (event_id, item_id)
);
```

```
CREATE TABLE event_faction (
    event_id INT NOT NULL,
    faction_id INT NOT NULL,
    FOREIGN KEY (event_id) REFERENCES event(event_id),
    FOREIGN KEY (faction_id) REFERENCES faction(faction_id),
    PRIMARY KEY (event_id, faction_id)
);
```

CREATE TABLE heroes (
party_id INT PRIMARY KEY AUTO_INCREMENT,
party_name TINYTEXT,
sentient_id INT,
)

alter table heroes
add
heroes_team_id int references heroes_team

DELIMITER //

CREATE TRIGGER before_insert_faction_membership
BEFORE INSERT ON faction_membership
FOR EACH ROW
BEGIN
IF NEW.faction_id IS NULL THEN
SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Faction ID must be provided';
END IF;

IF NEW.user_id IS NULL AND NEW.sentient_id IS NULL THEN
SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Either user ID or sentient ID must be provided';
END IF;
END//

DELIMITER ;
