-- Private schema: never added to Supabase's exposed REST schemas.
CREATE SCHEMA IF NOT EXISTS sce;
REVOKE ALL ON SCHEMA sce FROM PUBLIC, anon, authenticated;
CREATE TABLE IF NOT EXISTS sce.users (id text PRIMARY KEY, email text UNIQUE NOT NULL, name text NOT NULL, role text NOT NULL CHECK(role IN ('owner','editor','reviewer','viewer')), password_hash text NOT NULL);
CREATE TABLE IF NOT EXISTS sce.sessions (token_hash text PRIMARY KEY, user_id text NOT NULL REFERENCES sce.users(id) ON DELETE CASCADE, expires bigint NOT NULL);
CREATE TABLE IF NOT EXISTS sce.records (id text PRIMARY KEY, kind text NOT NULL, dataset text NOT NULL CHECK(dataset IN ('sce','demo')), revision integer NOT NULL, payload text NOT NULL CHECK(jsonb_typeof(payload::jsonb)='object'), updated_at text NOT NULL, deleted integer NOT NULL DEFAULT 0);
CREATE INDEX IF NOT EXISTS sce_records_kind ON sce.records(kind,dataset,deleted);
CREATE TABLE IF NOT EXISTS sce.revisions (record_id text NOT NULL REFERENCES sce.records(id), revision integer NOT NULL, payload text NOT NULL, actor text NOT NULL, reason text NOT NULL, created_at text NOT NULL, PRIMARY KEY(record_id,revision));
CREATE TABLE IF NOT EXISTS sce.attachments (id text PRIMARY KEY, report_id text NOT NULL REFERENCES sce.records(id), name text NOT NULL, mime text NOT NULL, storage_key text NOT NULL UNIQUE, size integer NOT NULL, extracted_text text NOT NULL DEFAULT '', indexing_status text NOT NULL, created_at text NOT NULL);
-- Storage objects stay private; no anon/authenticated Storage policies are added.
INSERT INTO storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
VALUES ('sce-private-reports','sce-private-reports',false,20971520,ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;
REVOKE ALL ON ALL TABLES IN SCHEMA sce FROM PUBLIC, anon, authenticated;
