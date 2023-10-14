


## The tables will be:

1. `Users`
2. `Spots`
3. `Reviews`
4. `Bookings`
5. `SpotImages`
6. `ReviewImages`

## Tables:

1. **Users**

   | Column Name    | Data Type | Constraints      |
   | -------------- | --------- | ---------------- |
   | id             | INT       | Primary Key      |
   | username       | VARCHAR   | UNIQUE, NOT NULL |
   | hashedPassword | VARCHAR   | NOT NULL         |
   | firstName      | VARCHAR   | NOT NULL         |
   | lastName       | VARCHAR   | NOT NULL         |
   | email          | VARCHAR   | UNIQUE, NOT NULL |
   | createdAt      | TIMESTAMP | NOT NULL         |
   | updatedAt      | TIMESTAMP | NOT NULL         |

2. **Spots**

   | Column Name | Data Type | Constraints            |
   | ----------- | --------- | ---------------------- |
   | id          | INT       | Primary Key            |
   | ownerId     | INT       | Foreign Key (Users.id) |
   | address     | VARCHAR   | NOT NULL               |
   | city        | VARCHAR   | NOT NULL               |
   | state       | VARCHAR   | NOT NULL               |
   | country     | VARCHAR   | NOT NULL               |
   | lat         | FLOAT     | NOT NULL               |
   | lng         | FLOAT     | NOT NULL               |
   | name        | VARCHAR   | NOT NULL               |
   | description | VARCHAR   |                        |
   | price       | FLOAT     | NOT NULL               |
   | createdAt   | TIMESTAMP | NOT NULL               |
   | updatedAt   | TIMESTAMP | NOT NULL               |

3. **SpotImages**

   | Column Name | Data Type | Constraints            |
   | ----------- | --------- | ---------------------- |
   | id          | INT       | Primary Key            |
   | spotId      | INT       | Foreign Key (Spots.id) |
   | url         | VARCHAR   | NOT NULL               |
   | preview     | BOOLEAN   |                        |
   | createdAt   | TIMESTAMP | NOT NULL               |
   | updatedAt   | TIMESTAMP | NOT NULL               |

4. **Bookings**

   | Column Name | Data Type | Constraints            |
   | ----------- | --------- | ---------------------- |
   | id          | INT       | Primary Key            |
   | spotId      | INT       | Foreign Key (Spots.id) |
   | userId      | INT       | Foreign Key (Users.id) |
   | start_date  | DATE      | NOT NULL               |
   | end_date    | DATE      | NOT NULL               |
   | createdAt   | TIMESTAMP | NOT NULL               |
   | updatedAt   | TIMESTAMP | NOT NULL               |

5. **Reviews**

   | Column Name | Data Type | Constraints            |
   | ----------- | --------- | ---------------------- |
   | id          | INT       | Primary Key            |
   | spotId      | INT       | Foreign Key (Spots.id) |
   | userId      | INT       | Foreign Key (Users.id) |
   | review      | TEXT      | NOT NULL               |
   | stars       | INT       | NOT NULL               |
   | createdAt   | TIMESTAMP | NOT NULL               |
   | updatedAt   | TIMESTAMP | NOT NULL               |

6. **ReviewImages**

   | Column Name | Data Type | Constraints              |
   | ----------- | --------- | ------------------------ |
   | id          | INT       | Primary Key              |
   | reviewId    | INT       | Foreign Key (Reviews.id) |
   | url         | VARCHAR   | NOT NULL                 |
   | createdAt   | TIMESTAMP | NOT NULL                 |
   | updatedAt   | TIMESTAMP | NOT NULL                 |

### Relationships:

- **Users** to **Spots**: One-to-Many
- **Users** to **Bookings**: One-to-Many
- **Users** to **Reviews**: One-to-Many
- **Spots** to **Bookings**: One-to-Many
- **Spots** to **Reviews**: One-to-Many
- **Spots** to **SpotImages**: One-to-Many
- **Reviews** to **ReviewImages**: One-to-Many
