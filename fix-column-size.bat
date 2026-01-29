@echo off
echo ============================================
echo Fixing category column size
echo ============================================
echo.

cd /d "%~dp0BACKEND"

node -e "const {Pool} = require('pg'); require('dotenv').config(); const pool = new Pool({connectionString: process.env.DATABASE_URL, ssl: {rejectUnauthorized: false}}); async function migrate() { try { console.log('Current column info:'); const before = await pool.query(`SELECT column_name, data_type, character_maximum_length FROM information_schema.columns WHERE table_name='events' AND column_name='category'`); console.log(before.rows[0]); console.log('\nModifying column size to VARCHAR(50)...'); await pool.query(`ALTER TABLE events ALTER COLUMN category TYPE VARCHAR(50)`); console.log('✅ Column size updated successfully!'); console.log('\nUpdated column info:'); const after = await pool.query(`SELECT column_name, data_type, character_maximum_length FROM information_schema.columns WHERE table_name='events' AND column_name='category'`); console.log(after.rows[0]); console.log('\nSetting default value...'); await pool.query(`ALTER TABLE events ALTER COLUMN category SET DEFAULT 'other'`); console.log('✅ Default value set!'); console.log('\nUpdating NULL values...'); const result = await pool.query(`UPDATE events SET category = 'other' WHERE category IS NULL OR category = ''`); console.log(`✅ Updated ${result.rowCount} rows with default category`); await pool.end(); process.exit(0); } catch (error) { console.error('❌ Migration failed:', error.message); console.error(error); await pool.end(); process.exit(1); } } migrate();"

pause
