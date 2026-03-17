CREATE EXTENSION IF NOT EXISTS postgis;

-- add geometry column to shops
ALTER TABLE shops
  ADD COLUMN IF NOT EXISTS location GEOMETRY(Point, 4326);

-- sync location from lat/lng
UPDATE shops
  SET location = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- index สำหรับ nearby query
CREATE INDEX IF NOT EXISTS shops_location_idx ON shops USING GIST(location);