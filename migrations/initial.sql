CREATE TABLE "movimientos" (
	"id"	INTEGER PRIMARY KEY AUTOINCREMENT,
	"date"	TEXT NOT NULL,
	"moneda_from"	TEXT,
	"cantidad_from"	REAL NOT NULL,
	"moneda_to"	TEXT,
	"cantidad_to"	REAL NOT NULL,
    "time"  TEXT
)