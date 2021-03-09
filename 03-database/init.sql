-- create the schema
DROP SCHEMA IF EXISTS exbuilder;
CREATE SCHEMA exbuilder;

-- create the runs table
CREATE TABLE IF NOT EXISTS exbuilder.runs (
    id BIGSERIAL PRIMARY KEY,
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
