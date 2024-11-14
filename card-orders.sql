\echo 'Delete and recreate card-orders db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS "card-orders";
CREATE DATABASE "card-orders";

\connect card-orders

\i card-orders-schema.sql
\i card-orders-seed.sql

\echo 'Delete and recreate card-orders_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS "card-orders_test";
CREATE DATABASE "card-orders_test";

\connect card-orders_test

\i card-orders-schema.sql
\i card-orders-seed.sql