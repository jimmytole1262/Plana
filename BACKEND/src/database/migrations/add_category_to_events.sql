-- Add category column to Events table
ALTER TABLE Events ADD COLUMN category VARCHAR(50);

-- Update existing events with default categories based on title/type
UPDATE Events SET category = 'corporate' WHERE LOWER(title) LIKE '%corporate%' OR LOWER(title) LIKE '%conference%';
UPDATE Events SET category = 'weddings' WHERE LOWER(title) LIKE '%wedding%' OR LOWER(title) LIKE '%marriage%';
UPDATE Events SET category = 'concerts' WHERE LOWER(title) LIKE '%concert%' OR LOWER(title) LIKE '%music%' OR LOWER(title) LIKE '%festival%';
UPDATE Events SET category = 'parties' WHERE LOWER(title) LIKE '%party%' OR LOWER(title) LIKE '%celebration%';
UPDATE Events SET category = 'social' WHERE LOWER(title) LIKE '%social%' OR LOWER(title) LIKE '%charity%' OR LOWER(title) LIKE '%networking%';

-- Set 'other' for any remaining uncategorized events
UPDATE Events SET category = 'other' WHERE category IS NULL;
