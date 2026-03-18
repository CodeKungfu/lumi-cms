import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, '..');
const prismaDir = path.join(packageRoot, 'prisma');
const sqlDir = path.join(packageRoot, 'sql');
const schemaPath = path.join(prismaDir, 'schema.sqlite.prisma');
const dbPath = path.join(prismaDir, 'dev.db');
const seedPath = path.join(sqlDir, 'd1_seed.sql');
const requiredTables = ['sys_user', 'sys_menu', 'sys_role'];

function runPrisma(args) {
  execFileSync('pnpm', ['exec', 'prisma', ...args], {
    cwd: packageRoot,
    stdio: 'inherit',
  });
}

function tableExists(db, tableName) {
  const row = db
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?")
    .get(tableName);
  return Boolean(row?.name);
}

function adminExists(db) {
  if (!tableExists(db, 'sys_user')) {
    return false;
  }
  const row = db.prepare("SELECT user_id FROM sys_user WHERE user_name = 'admin' LIMIT 1").get();
  return Boolean(row?.user_id);
}

function ensureSqliteSchema() {
  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Missing SQLite schema: ${schemaPath}`);
  }
}

function pushSchema() {
  runPrisma(['db', 'push', '--schema=./prisma/schema.sqlite.prisma', '--skip-generate']);
  console.log('SQLite schema created');
}

function importSeed() {
  const db = new DatabaseSync(dbPath);
  try {
    const sql = fs.readFileSync(seedPath, 'utf8');
    db.exec(sql);
  } finally {
    db.close();
  }
  console.log('SQLite seed imported');
}

function openDb() {
  return new DatabaseSync(dbPath);
}

function isInitialized() {
  if (!fs.existsSync(dbPath)) {
    return false;
  }

  const db = openDb();
  try {
    const tablesReady = requiredTables.every((tableName) => tableExists(db, tableName));
    return tablesReady && adminExists(db);
  } finally {
    db.close();
  }
}

function initSqlite() {
  ensureSqliteSchema();

  if (!fs.existsSync(dbPath)) {
    pushSchema();
    importSeed();
    return;
  }

  let db = openDb();
  try {
    const missingTable = requiredTables.some((tableName) => !tableExists(db, tableName));
    if (missingTable) {
      db.close();
      db = null;
      pushSchema();
      importSeed();
      return;
    }

    const hasAdmin = adminExists(db);
    if (!hasAdmin) {
      db.close();
      db = null;
      importSeed();
      return;
    }
  } finally {
    if (db) {
      db.close();
    }
  }

  console.log('SQLite already initialized');
}

function checkSqlite() {
  ensureSqliteSchema();
  if (!isInitialized()) {
    console.log('SQLite not initialized');
    process.exitCode = 1;
    return;
  }
  console.log('SQLite ready');
}

function resetSqlite() {
  if (fs.existsSync(dbPath)) {
    fs.rmSync(dbPath);
  }
  initSqlite();
}

const command = process.argv[2] ?? 'init';

switch (command) {
  case 'check':
    checkSqlite();
    break;
  case 'seed':
    importSeed();
    break;
  case 'reset':
    resetSqlite();
    break;
  case 'init':
  default:
    initSqlite();
    break;
}
