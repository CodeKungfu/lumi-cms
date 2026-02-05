import * as fs from 'fs';
import * as path from 'path';

const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
const outputPath = path.join(__dirname, '../prisma/schema.sqlite.prisma');

let schema = fs.readFileSync(schemaPath, 'utf-8');

// 1. Change provider
schema = schema.replace('provider = "mysql"', 'provider = "sqlite"');
schema = schema.replace('url      = env("DATABASE_URL")', 'url      = "file:./dev.db"');

// 1.1 Add wasm engineType and driverAdapters
if (!schema.includes('engineType')) {
  schema = schema.replace('provider        = "prisma-client-js"', 'provider        = "prisma-client-js"\n  engineType      = "wasm"');
}
if (!schema.includes('"driverAdapters"')) {
  schema = schema.replace('previewFeatures = ["relationJoins"]', 'previewFeatures = ["relationJoins", "driverAdapters"]');
}

// 2. Remove MySQL specific attributes
// Remove @db.VarChar(x), @db.Char(x), @db.DateTime(x)
schema = schema.replace(/@db\.VarChar\(\d+\)/g, '');
schema = schema.replace(/@db\.Char\(\d+\)/g, '');
schema = schema.replace(/@db\.DateTime\(\d+\)/g, '');
// Remove other potential MySQL types
schema = schema.replace(/@db\.Text/g, '');
schema = schema.replace(/@db\.LongText/g, '');
schema = schema.replace(/@db\.TinyText/g, '');
schema = schema.replace(/@db\.MediumText/g, '');
schema = schema.replace(/@db\.TinyInt/g, ''); // Boolean might be TinyInt
schema = schema.replace(/@db\.UnsignedInt/g, '');
schema = schema.replace(/@db\.UnsignedBigInt/g, '');

// 3. Change BigInt to Int
// This is a drastic change, but necessary for compatibility with the existing ID usage in code
// which treats IDs as numbers (mostly).
schema = schema.replace(/BigInt/g, 'Int');

console.log('Transforming schema for SQLite...');
fs.writeFileSync(outputPath, schema);
console.log(`Generated SQLite schema at ${outputPath}`);
