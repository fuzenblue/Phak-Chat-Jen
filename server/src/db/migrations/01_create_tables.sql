-- Agent Policies
CREATE TABLE IF NOT EXISTS agent_policies (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id       UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  active        BOOLEAN NOT NULL DEFAULT false,
  max_discount  INTEGER NOT NULL DEFAULT 30,
  auto_approve  BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(shop_id)
);

-- Agent Actions (memory + audit log)
CREATE TABLE IF NOT EXISTS agent_actions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id      UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  post_id      UUID REFERENCES posts(id) ON DELETE SET NULL,
  action_type  TEXT NOT NULL,
  old_value    JSONB,
  new_value    JSONB,
  reason       TEXT,
  status       TEXT NOT NULL DEFAULT 'pending',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);