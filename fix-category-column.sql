-- Migration Script: Add category column to Events table
-- This script is safe to run multiple times (idempotent)

-- Step 1: Check if column exists
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name='Events' 
            AND column_name='category'
        ) 
        THEN 'Category column already exists'
        ELSE 'Category column does NOT exist - will be added'
    END AS status;

-- Step 2: Add category column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name='Events' 
        AND column_name='category'
    ) THEN
        ALTER TABLE "Events" 
        ADD COLUMN category VARCHAR(50) DEFAULT 'other';
        
        RAISE NOTICE 'Category column added successfully';
    ELSE
        RAISE NOTICE 'Category column already exists, skipping';
    END IF;
END $$;

-- Step 3: Update existing events with default category if needed
UPDATE "Events" 
SET category = 'other' 
WHERE category IS NULL;

-- Step 4: Verify the migration
SELECT 
    column_name, 
    data_type, 
    character_maximum_length,
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name='Events' 
AND column_name='category';

-- Step 5: Display count of events by category
SELECT 
    COALESCE(category, 'NULL') as category,
    COUNT(*) as count
FROM "Events"
GROUP BY category
ORDER BY count DESC;
