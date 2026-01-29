@echo off
echo ============================================
echo Adding category column to Events table
echo ============================================
echo.

cd /d "%~dp0BACKEND"

node -e "const {Pool} = require('pg'); require('dotenv').config(); const pool = new Pool({connectionString: process.env.DATABASE_URL, ssl: {rejectUnauthorized: false}}); async function migrate() { try { console.log('Checking for category column...'); const check = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name IN ('Events', 'events') AND column_name='category'`); if (check.rows.length > 0) { console.log('✅ Category column already exists!'); } else { console.log('Adding category column...'); try { await pool.query(`ALTER TABLE \"Events\" ADD COLUMN category VARCHAR(50) DEFAULT 'other'`); } catch (e) { await pool.query(`ALTER TABLE events ADD COLUMN category VARCHAR(50) DEFAULT 'other'`); } console.log('✅ Category column added successfully!'); try { await pool.query(`UPDATE \"Events\" SET category = 'other' WHERE category IS NULL`); } catch (e) { await pool.query(`UPDATE events SET category = 'other' WHERE category IS NULL`); } console.log('✅ Existing events updated with default category'); } const verify = await pool.query(`SELECT column_name, data_type, character_maximum_length FROM information_schema.columns WHERE table_name IN ('Events', 'events') AND column_name='category'`); console.log('Verification:', verify.rows[0] || 'Column not found'); const tables = await pool.query(`SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name`); console.log('Available tables:', tables.rows.map(r => r.table_name).join(', ')); await pool.end(); process.exit(0); } catch (error) { console.error('❌ Migration failed:', error.message); await pool.end(); process.exit(1); } } migrate();"

pause
