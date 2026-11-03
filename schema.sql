CREATE TABLE IF NOT EXISTS participants (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 token TEXT NOT NULL UNIQUE,
 name TEXT NOT NULL,
 gender TEXT NOT NULL CHECK(gender IN ('girl','boy')),
 city TEXT NOT NULL,
 twitter TEXT NOT NULL,
 created_at INTEGER NOT NULL,
 paired_with INTEGER UNIQUE,
 FOREIGN KEY(paired_with) REFERENCES participants(id)
);
CREATE INDEX IF NOT EXISTS idx_participants_city_gender ON participants(city,gender,paired_with);
