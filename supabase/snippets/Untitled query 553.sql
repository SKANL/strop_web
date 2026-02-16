-- Migration 14: WhatsApp Bot Integration
-- Description: Adds tables, columns, triggers and RLS policies for WhatsApp Bot (Strop AI)
-- Created: 2026-02-15

-- =====================================================
-- 1. NEW TABLES
-- =====================================================

-- Table: whatsapp_interactions
-- Purpose: Log all interactions with the WhatsApp bot for auditing and cost tracking
CREATE TABLE whatsapp_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  message_type TEXT CHECK (message_type IN ('command', 'query', 'approval', 'photo_upload', 'voice_note', 'report_request')),
  message_content TEXT,
  incident_id UUID REFERENCES incidents(id) ON DELETE SET NULL,
  ai_provider TEXT, -- 'openai', 'anthropic', 'google', 'groq', 'cerebras', 'openrouter'
  ai_model TEXT,
  ai_response TEXT,
  tokens_used INTEGER,
  cost_usd DECIMAL(10, 6),
  latency_ms INTEGER,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE whatsapp_interactions IS 'Logs all WhatsApp bot interactions for auditing and analytics';
COMMENT ON COLUMN whatsapp_interactions.message_type IS 'Type of message: command, query, approval, photo_upload, voice_note, report_request';
COMMENT ON COLUMN whatsapp_interactions.ai_provider IS 'AI provider used: openai, anthropic, google, groq, cerebras, openrouter';
COMMENT ON COLUMN whatsapp_interactions.cost_usd IS 'Cost in USD for this AI request';

-- Indexes for whatsapp_interactions
CREATE INDEX idx_whatsapp_interactions_user_date ON whatsapp_interactions(user_id, created_at DESC);
CREATE INDEX idx_whatsapp_interactions_provider_date ON whatsapp_interactions(ai_provider, created_at DESC);
CREATE INDEX idx_whatsapp_interactions_type_date ON whatsapp_interactions(message_type, created_at DESC);
CREATE INDEX idx_whatsapp_interactions_incident ON whatsapp_interactions(incident_id) WHERE incident_id IS NOT NULL;

-- =====================================================

-- Table: whatsapp_preferences
-- Purpose: Store user preferences for WhatsApp bot notifications and settings
CREATE TABLE whatsapp_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  daily_briefing_enabled BOOLEAN DEFAULT true,
  briefing_time TIME DEFAULT '08:00:00',
  critical_alerts_enabled BOOLEAN DEFAULT true,
  approval_notifications_enabled BOOLEAN DEFAULT true,
  predictive_alerts_enabled BOOLEAN DEFAULT true,
  language TEXT DEFAULT 'es',
  timezone TEXT DEFAULT 'America/Mexico_City',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE whatsapp_preferences IS 'User preferences for WhatsApp bot notifications and behavior';
COMMENT ON COLUMN whatsapp_preferences.briefing_time IS 'Time of day to send daily briefing (in user timezone)';
COMMENT ON COLUMN whatsapp_preferences.timezone IS 'IANA timezone identifier for the user';

-- Trigger to update timestamp on preferences change
CREATE TRIGGER update_whatsapp_preferences_timestamp
BEFORE UPDATE ON whatsapp_preferences
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =====================================================

-- Table: ai_usage_logs
-- Purpose: Detailed tracking of AI usage for cost optimization and analytics
CREATE TABLE ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  task_type TEXT NOT NULL, -- 'image_analysis', 'chat', 'transcription', 'ocr', 'prediction', 'report_generation', 'classification'
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  tokens_used INTEGER,
  cost_usd DECIMAL(10, 6),
  latency_ms INTEGER,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  metadata JSONB, -- Additional task-specific data
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE ai_usage_logs IS 'Detailed logs of AI usage for cost tracking and optimization';
COMMENT ON COLUMN ai_usage_logs.task_type IS 'Type of AI task: image_analysis, chat, transcription, ocr, prediction, report_generation, classification';
COMMENT ON COLUMN ai_usage_logs.metadata IS 'Additional task-specific data in JSON format';

-- Indexes for ai_usage_logs
CREATE INDEX idx_ai_usage_user_date ON ai_usage_logs(user_id, created_at DESC);
CREATE INDEX idx_ai_usage_provider_date ON ai_usage_logs(provider, created_at DESC);
CREATE INDEX idx_ai_usage_task_date ON ai_usage_logs(task_type, created_at DESC);
CREATE INDEX idx_ai_usage_cost ON ai_usage_logs(cost_usd DESC) WHERE cost_usd IS NOT NULL;

-- =====================================================
-- 2. MODIFY EXISTING TABLES
-- =====================================================

-- Add WhatsApp phone to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS whatsapp_phone TEXT UNIQUE;

COMMENT ON COLUMN users.whatsapp_phone IS 'WhatsApp phone number in E.164 format (e.g., +5215512345678)';

-- Index for fast lookup by WhatsApp phone
CREATE INDEX IF NOT EXISTS idx_users_whatsapp_phone ON users(whatsapp_phone) WHERE whatsapp_phone IS NOT NULL;

-- =====================================================

-- Add WhatsApp approval tracking to incidents table
ALTER TABLE incidents
ADD COLUMN IF NOT EXISTS approved_via_whatsapp BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS whatsapp_approval_timestamp TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS ai_audit_result JSONB;

COMMENT ON COLUMN incidents.approved_via_whatsapp IS 'True if incident was approved via WhatsApp bot instead of mobile app';
COMMENT ON COLUMN incidents.whatsapp_approval_timestamp IS 'Timestamp when incident was approved via WhatsApp';
COMMENT ON COLUMN incidents.ai_audit_result IS 'Result of AI visual audit (Auditor Eye) in JSON format';

-- Index for WhatsApp approval analytics
CREATE INDEX IF NOT EXISTS idx_incidents_whatsapp_approval ON incidents(approved_via_whatsapp, whatsapp_approval_timestamp) 
WHERE approved_via_whatsapp = true;

-- Index for AI audit results
CREATE INDEX IF NOT EXISTS idx_incidents_ai_audit ON incidents USING GIN (ai_audit_result) 
WHERE ai_audit_result IS NOT NULL;

-- =====================================================
-- 3. TRIGGERS
-- =====================================================

-- Trigger: Automatically set whatsapp_approval_timestamp when approved via WhatsApp
CREATE OR REPLACE FUNCTION record_whatsapp_approval()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.approved_via_whatsapp = true AND (OLD.approved_via_whatsapp = false OR OLD.approved_via_whatsapp IS NULL) THEN
    NEW.whatsapp_approval_timestamp := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_record_whatsapp_approval
BEFORE UPDATE ON incidents
FOR EACH ROW
EXECUTE FUNCTION record_whatsapp_approval();

COMMENT ON FUNCTION record_whatsapp_approval() IS 'Automatically sets whatsapp_approval_timestamp when incident is approved via WhatsApp';

-- =====================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on new tables
ALTER TABLE whatsapp_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own WhatsApp interactions
CREATE POLICY "Users can view own WhatsApp interactions"
ON whatsapp_interactions
FOR SELECT
USING (
  auth.uid() = user_id
  OR
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Policy: System can insert WhatsApp interactions (via service role)
CREATE POLICY "System can insert WhatsApp interactions"
ON whatsapp_interactions
FOR INSERT
WITH CHECK (true); -- Service role will handle this

COMMENT ON POLICY "Users can view own WhatsApp interactions" ON whatsapp_interactions IS 'Users can only see their own interactions, admins can see all';

-- =====================================================

-- Policy: Users can manage their own WhatsApp preferences
CREATE POLICY "Users can manage own WhatsApp preferences"
ON whatsapp_preferences
FOR ALL
USING (auth.uid() = user_id);

-- Policy: Auto-insert default preferences for new users
CREATE POLICY "System can insert default WhatsApp preferences"
ON whatsapp_preferences
FOR INSERT
WITH CHECK (true); -- Service role will handle this

COMMENT ON POLICY "Users can manage own WhatsApp preferences" ON whatsapp_preferences IS 'Users can view and update their own WhatsApp preferences';

-- =====================================================

-- Policy: Only admins can view AI usage logs (for cost tracking)
CREATE POLICY "Admins can view AI usage logs"
ON ai_usage_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Policy: System can insert AI usage logs (via service role)
CREATE POLICY "System can insert AI usage logs"
ON ai_usage_logs
FOR INSERT
WITH CHECK (true); -- Service role will handle this

COMMENT ON POLICY "Admins can view AI usage logs" ON ai_usage_logs IS 'Only admins can view AI usage logs for cost tracking and optimization';

-- =====================================================
-- 5. HELPER FUNCTIONS FOR ANALYTICS
-- =====================================================

-- Function: Get AI cost summary by user for a date range
CREATE OR REPLACE FUNCTION get_ai_cost_by_user(
  start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
  end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE (
  user_id UUID,
  user_name TEXT,
  user_email TEXT,
  total_requests BIGINT,
  total_tokens BIGINT,
  total_cost_usd NUMERIC,
  avg_latency_ms NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.name,
    u.email,
    COUNT(*)::BIGINT as total_requests,
    COALESCE(SUM(ail.tokens_used), 0)::BIGINT as total_tokens,
    COALESCE(SUM(ail.cost_usd), 0) as total_cost_usd,
    COALESCE(AVG(ail.latency_ms), 0) as avg_latency_ms
  FROM ai_usage_logs ail
  JOIN users u ON u.id = ail.user_id
  WHERE ail.created_at >= start_date
    AND ail.created_at <= end_date
  GROUP BY u.id, u.name, u.email
  ORDER BY total_cost_usd DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_ai_cost_by_user IS 'Returns AI usage and cost summary by user for a given date range';

-- =====================================================

-- Function: Get WhatsApp approval rate
CREATE OR REPLACE FUNCTION get_whatsapp_approval_rate(
  project_id_param UUID DEFAULT NULL,
  start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
  end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE (
  whatsapp_approvals BIGINT,
  app_approvals BIGINT,
  total_approvals BIGINT,
  whatsapp_percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(CASE WHEN i.approved_via_whatsapp = true THEN 1 END)::BIGINT as whatsapp_approvals,
    COUNT(CASE WHEN i.approved_via_whatsapp = false OR i.approved_via_whatsapp IS NULL THEN 1 END)::BIGINT as app_approvals,
    COUNT(*)::BIGINT as total_approvals,
    ROUND(
      100.0 * COUNT(CASE WHEN i.approved_via_whatsapp = true THEN 1 END) / NULLIF(COUNT(*), 0),
      2
    ) as whatsapp_percentage
  FROM incidents i
  WHERE i.status = 'CLOSED'
    AND i.updated_at >= start_date
    AND i.updated_at <= end_date
    AND (project_id_param IS NULL OR i.project_id = project_id_param);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_whatsapp_approval_rate IS 'Returns the percentage of incidents approved via WhatsApp vs mobile app';

-- =====================================================

-- Function: Get AI provider usage statistics
CREATE OR REPLACE FUNCTION get_ai_provider_stats(
  start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '7 days',
  end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE (
  task_type TEXT,
  provider TEXT,
  model TEXT,
  requests BIGINT,
  avg_latency_ms NUMERIC,
  total_cost_usd NUMERIC,
  success_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ail.task_type,
    ail.provider,
    ail.model,
    COUNT(*)::BIGINT as requests,
    COALESCE(AVG(ail.latency_ms), 0) as avg_latency_ms,
    COALESCE(SUM(ail.cost_usd), 0) as total_cost_usd,
    ROUND(100.0 * COUNT(CASE WHEN ail.success = true THEN 1 END) / NULLIF(COUNT(*), 0), 2) as success_rate
  FROM ai_usage_logs ail
  WHERE ail.created_at >= start_date
    AND ail.created_at <= end_date
  GROUP BY ail.task_type, ail.provider, ail.model
  ORDER BY ail.task_type, requests DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_ai_provider_stats IS 'Returns usage statistics by AI provider and task type';

-- =====================================================
-- 6. INITIAL DATA
-- =====================================================

-- Create default WhatsApp preferences for existing users
INSERT INTO whatsapp_preferences (user_id)
SELECT id FROM users
ON CONFLICT (user_id) DO NOTHING;

-- =====================================================
-- 7. GRANTS (for service role and authenticated users)
-- =====================================================

-- Grant usage on tables to authenticated users
GRANT SELECT ON whatsapp_interactions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON whatsapp_preferences TO authenticated;
GRANT SELECT ON ai_usage_logs TO authenticated;

-- Grant all privileges to service role (for Edge Functions)
GRANT ALL ON whatsapp_interactions TO service_role;
GRANT ALL ON whatsapp_preferences TO service_role;
GRANT ALL ON ai_usage_logs TO service_role;

-- =====================================================
-- END OF MIGRATION
-- =====================================================
