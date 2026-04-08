-- Users
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(50)  NOT NULL DEFAULT 'merchant',
  display_name  TEXT,
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Shops
CREATE TABLE IF NOT EXISTS shops (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  shop_name     VARCHAR(255) NOT NULL,
  shop_address  TEXT,
  description   TEXT,
  image_url     TEXT,
  opening_hours JSONB,
  latitude      DOUBLE PRECISION,
  longitude     DOUBLE PRECISION,
  rating        FLOAT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Vegetable Scans
CREATE TABLE IF NOT EXISTS vegetable_scans (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id         UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  image_url       TEXT NOT NULL,
  veg_type        VARCHAR(100),
  freshness_score FLOAT,
  ai_raw_output   JSONB,
  scanned_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Posts
CREATE TABLE IF NOT EXISTS posts (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id        UUID REFERENCES vegetable_scans(id) ON DELETE SET NULL,
  shop_id        UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  original_price DECIMAL(10,2),
  price          DECIMAL(10,2),
  status         VARCHAR(50) NOT NULL DEFAULT 'active',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  expired_at     TIMESTAMPTZ
);

-- Favorites
CREATE TABLE IF NOT EXISTS favorites (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  shop_id     UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, shop_id)
);

