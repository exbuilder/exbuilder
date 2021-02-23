-- create the schema
DROP SCHEMA IF EXISTS exbuilder;
CREATE SCHEMA exbuilder;

-- using the schema
\c exbuilder;

-- create the runs table
CREATE TABLE IF NOT EXISTS runs (
    id SERIAL PRIMARY KEY,
    daterun TIMESTAMP,
    randomid VARCHAR, 
    participant VARCHAR,
    experiment VARCHAR,
    condition VARCHAR,
    researcher VARCHAR,
    sourcedb VARCHAR,
    location VARCHAR,
    data JSONB,
    exclude BOOLEAN,
    notes TEXT
);

-- create the conditions_torun table
CREATE TABLE IF NOT EXISTS conditions_torun (
    id SERIAL PRIMARY KEY,
    experiment VARCHAR,
    condition VARCHAR
)