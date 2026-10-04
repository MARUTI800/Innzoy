import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { bookingTestDatabaseUrl } from './booking-local-database.mjs';

const raw = bookingTestDatabaseUrl();
const roles = `DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN CREATE ROLE anon NOLOGIN; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN CREATE ROLE authenticated NOLOGIN; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN CREATE ROLE service_role NOLOGIN BYPASSRLS; END IF;
END $$;`;
const result = spawnSync('psql', [
  '-X', '--set', 'ON_ERROR_STOP=1', '--dbname', raw,
  '--command', roles,
  ...readdirSync(resolve('supabase/migrations')).filter((name) => name.endsWith('.sql')).sort()
    .flatMap((name) => ['--file', resolve('supabase/migrations', name)]),
  '--file', resolve('tests/booking-database.sql'),
], { stdio: 'inherit', shell: false });
if (result.error) throw new Error('PostgreSQL psql is required for the local database integration tests.');
process.exitCode = result.status ?? 1;
