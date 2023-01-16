-- Up Migration

CREATE TABLE pilots (
  id SERIAL PRIMARY KEY,
  pilot_id TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone_number TEXT,
  email TEXT,
  distance_to_nest REAL,
  last_update TIMESTAMPTZ NOT NULL
);

-- Down Migration
DROP TABLE pilots;