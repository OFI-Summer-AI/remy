-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Create custom types
CREATE TYPE reservation_status AS ENUM ('pending', 'confirmed', 'seated', 'completed', 'no_show', 'cancelled');
CREATE TYPE service_type AS ENUM ('Breakfast', 'Lunch', 'Dinner', 'Brunch');
CREATE TYPE user_role AS ENUM ('Admin', 'Manager', 'Staff');
CREATE TYPE alert_type AS ENUM ('low_stock', 'overbook_risk', 'understaffed', 'no_show_spike');
CREATE TYPE alert_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE pos_provider AS ENUM ('lightspeed', 'waiterpro');
CREATE TYPE job_status AS ENUM ('queued', 'running', 'succeeded', 'failed', 'cancelled');

-- User profiles (linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email CITEXT NOT NULL,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'Manager',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Dining tables (renamed from tables)
CREATE TABLE IF NOT EXISTS dining_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  area TEXT,
  shape TEXT DEFAULT 'rect',
  x_position NUMERIC DEFAULT 0,
  y_position NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Service windows
CREATE TABLE IF NOT EXISTS service_windows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  label service_type NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (start_time < end_time),
  UNIQUE (date, label)
);

-- Reservations with overlap prevention
CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name TEXT NOT NULL,
  guest_phone TEXT,
  guest_email TEXT,
  party_size INTEGER NOT NULL CHECK (party_size > 0),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  table_id UUID REFERENCES dining_tables(id),
  service_id UUID REFERENCES service_windows(id),
  status reservation_status DEFAULT 'pending',
  notes TEXT,
  source TEXT DEFAULT 'manual',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (start_time < end_time),
  EXCLUDE USING gist (
    table_id WITH =,
    tstzrange(start_time, end_time + interval '15 minutes') WITH &&
  ) WHERE (status NOT IN ('cancelled', 'no_show'))
);

-- Employees
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id),
  employee_id TEXT UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT,
  hourly_rate NUMERIC(10,2),
  hire_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Shifts
CREATE TABLE IF NOT EXISTS shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  role TEXT NOT NULL,
  is_published BOOLEAN DEFAULT false,
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (start_time < end_time)
);

-- Shift requirements
CREATE TABLE IF NOT EXISTS shift_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  service service_type NOT NULL,
  role TEXT NOT NULL,
  required_count INTEGER NOT NULL CHECK (required_count >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (date, service, role)
);

-- Suppliers
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  payment_terms TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Inventory items
CREATE TABLE IF NOT EXISTS items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT UNIQUE,
  name TEXT NOT NULL,
  category TEXT,
  unit TEXT NOT NULL,
  par_level NUMERIC(10,3) DEFAULT 0,
  cost_per_unit NUMERIC(10,2),
  supplier_id UUID REFERENCES suppliers(id),
  lead_time_days INTEGER DEFAULT 3,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Stock movements
CREATE TABLE IF NOT EXISTS stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES items(id),
  movement_type TEXT NOT NULL, -- 'receive', 'adjust', 'consume'
  quantity NUMERIC(10,3) NOT NULL,
  unit_cost NUMERIC(10,2),
  reference TEXT, -- PO number, adjustment reason, etc.
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Purchase orders
CREATE TABLE IF NOT EXISTS purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number TEXT UNIQUE NOT NULL,
  supplier_id UUID NOT NULL REFERENCES suppliers(id),
  status TEXT DEFAULT 'draft',
  order_date DATE,
  expected_date DATE,
  total_amount NUMERIC(10,2),
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- PO line items
CREATE TABLE IF NOT EXISTS po_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES items(id),
  quantity NUMERIC(10,3) NOT NULL,
  unit_cost NUMERIC(10,2),
  line_total NUMERIC(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Forecasts
CREATE TABLE IF NOT EXISTS forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  service service_type NOT NULL,
  predicted_covers INTEGER NOT NULL DEFAULT 0,
  actual_covers INTEGER,
  confidence_score NUMERIC(3,2) DEFAULT 0.7,
  method TEXT DEFAULT 'moving_average',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (date, service)
);

-- Alerts
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type alert_type NOT NULL,
  severity alert_severity NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  entity_ref TEXT, -- reference to related entity
  is_resolved BOOLEAN DEFAULT false,
  resolved_by UUID REFERENCES profiles(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Social media accounts
CREATE TABLE IF NOT EXISTS social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL, -- 'instagram', 'facebook', 'x'
  account_name TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  connected_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (platform, account_name)
);

-- Posts
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  short_description TEXT,
  generated_caption TEXT,
  final_caption TEXT,
  platforms TEXT[] DEFAULT '{}',
  media_urls TEXT[] DEFAULT '{}',
  alt_text TEXT,
  hashtags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft', -- 'draft', 'scheduled', 'published', 'failed'
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Comments on posts
CREATE TABLE IF NOT EXISTS post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  external_id TEXT NOT NULL,
  author_name TEXT,
  comment_text TEXT,
  replied BOOLEAN DEFAULT false,
  reply_text TEXT,
  replied_by UUID REFERENCES profiles(id),
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (platform, external_id)
);

-- Review accounts
CREATE TABLE IF NOT EXISTS review_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL, -- 'google', 'tripadvisor', 'yelp'
  business_id TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  is_active BOOLEAN DEFAULT true,
  connected_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (platform, business_id)
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  external_id TEXT NOT NULL,
  reviewer_name TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  has_photo BOOLEAN DEFAULT false,
  review_date TIMESTAMPTZ,
  replied BOOLEAN DEFAULT false,
  reply_text TEXT,
  replied_by UUID REFERENCES profiles(id),
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (platform, external_id)
);

-- POS accounts
CREATE TABLE IF NOT EXISTS pos_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider pos_provider NOT NULL,
  account_name TEXT NOT NULL,
  credentials JSONB NOT NULL DEFAULT '{}',
  status TEXT DEFAULT 'disconnected',
  last_sync_at TIMESTAMPTZ,
  connected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- POS sales cache
CREATE TABLE IF NOT EXISTS pos_sales_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pos_account_id UUID NOT NULL REFERENCES pos_accounts(id),
  date DATE NOT NULL,
  service service_type,
  total_sales NUMERIC(10,2),
  covers INTEGER,
  avg_check NUMERIC(10,2),
  payment_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (pos_account_id, date, service)
);

-- Job schedules for automation
CREATE TABLE IF NOT EXISTS job_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  cron TEXT NOT NULL,
  tz TEXT NOT NULL DEFAULT 'Europe/Amsterdam',
  payload JSONB NOT NULL DEFAULT '{}',
  enabled BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Jobs log
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  status job_status NOT NULL DEFAULT 'queued',
  idempotency_key TEXT,
  payload JSONB NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  queued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_jobs_idem ON jobs(idempotency_key) WHERE idempotency_key IS NOT NULL;

-- Automation rules
CREATE TABLE IF NOT EXISTS automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  trigger_event TEXT NOT NULL,
  conditions JSONB NOT NULL DEFAULT '[]',
  actions JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Webhook endpoints
CREATE TABLE IF NOT EXISTS webhook_endpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  secret TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Outbox for reliable delivery
CREATE TABLE IF NOT EXISTS outbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  attempt INTEGER NOT NULL DEFAULT 0,
  next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_outbox_status ON outbox(status, next_attempt_at);

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL, -- 'insert', 'update', 'delete'
  old_values JSONB,
  new_values JSONB,
  performed_by UUID REFERENCES profiles(id),
  performed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE dining_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_windows ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE po_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_sales_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role::text FROM profiles WHERE id = user_id;
$$;

-- RLS Policies
-- Profiles: users can view their own and admins can view all
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (get_user_role(auth.uid()) = 'Admin');

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles" ON profiles
  FOR ALL USING (get_user_role(auth.uid()) = 'Admin');

-- Most operational tables: Admin sees all, Manager/Staff see based on role access
CREATE POLICY "Admins can manage dining_tables" ON dining_tables
  FOR ALL USING (get_user_role(auth.uid()) = 'Admin');

CREATE POLICY "Managers can view dining_tables" ON dining_tables
  FOR SELECT USING (get_user_role(auth.uid()) IN ('Admin', 'Manager'));

CREATE POLICY "Staff can view dining_tables" ON dining_tables
  FOR SELECT USING (get_user_role(auth.uid()) IN ('Admin', 'Manager', 'Staff'));

-- Reservations: Admin/Manager full access, Staff can view/update status
CREATE POLICY "Admins can manage reservations" ON reservations
  FOR ALL USING (get_user_role(auth.uid()) = 'Admin');

CREATE POLICY "Managers can manage reservations" ON reservations
  FOR ALL USING (get_user_role(auth.uid()) IN ('Admin', 'Manager'));

CREATE POLICY "Staff can view and seat reservations" ON reservations
  FOR SELECT USING (get_user_role(auth.uid()) IN ('Admin', 'Manager', 'Staff'));

CREATE POLICY "Staff can update reservation status" ON reservations
  FOR UPDATE USING (get_user_role(auth.uid()) IN ('Admin', 'Manager', 'Staff'));

-- Service windows: Admin/Manager can manage
CREATE POLICY "Admins and Managers can manage service_windows" ON service_windows
  FOR ALL USING (get_user_role(auth.uid()) IN ('Admin', 'Manager'));

-- Employees and shifts: Admin/Manager can manage, Staff can view own
CREATE POLICY "Admins and Managers can manage employees" ON employees
  FOR ALL USING (get_user_role(auth.uid()) IN ('Admin', 'Manager'));

CREATE POLICY "Staff can view own employee record" ON employees
  FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY "Admins and Managers can manage shifts" ON shifts
  FOR ALL USING (get_user_role(auth.uid()) IN ('Admin', 'Manager'));

CREATE POLICY "Staff can view own shifts" ON shifts
  FOR SELECT USING (
    employee_id IN (SELECT id FROM employees WHERE profile_id = auth.uid())
  );

-- Inventory: Admin/Manager access
CREATE POLICY "Admins and Managers can manage suppliers" ON suppliers
  FOR ALL USING (get_user_role(auth.uid()) IN ('Admin', 'Manager'));

CREATE POLICY "Admins and Managers can manage items" ON items
  FOR ALL USING (get_user_role(auth.uid()) IN ('Admin', 'Manager'));

CREATE POLICY "Admins and Managers can manage stock_movements" ON stock_movements
  FOR ALL USING (get_user_role(auth.uid()) IN ('Admin', 'Manager'));

-- Marketing: Admin/Manager access
CREATE POLICY "Admins and Managers can manage social_accounts" ON social_accounts
  FOR ALL USING (get_user_role(auth.uid()) IN ('Admin', 'Manager'));

CREATE POLICY "Admins and Managers can manage posts" ON posts
  FOR ALL USING (get_user_role(auth.uid()) IN ('Admin', 'Manager'));

CREATE POLICY "Admins and Managers can manage reviews" ON reviews
  FOR ALL USING (get_user_role(auth.uid()) IN ('Admin', 'Manager'));

-- System tables: Admin only
CREATE POLICY "Admins can manage automation" ON job_schedules
  FOR ALL USING (get_user_role(auth.uid()) = 'Admin');

CREATE POLICY "Admins can view jobs" ON jobs
  FOR SELECT USING (get_user_role(auth.uid()) = 'Admin');

-- Insert sample data
INSERT INTO dining_tables (name, capacity, area, shape, x_position, y_position) VALUES
  ('T01', 2, 'Front', 'rect', 100, 100),
  ('T02', 4, 'Front', 'rect', 200, 100),
  ('T03', 6, 'Main', 'rect', 300, 100),
  ('T04', 2, 'Main', 'circle', 100, 200),
  ('T05', 4, 'Main', 'rect', 200, 200),
  ('T06', 8, 'Back', 'rect', 300, 200),
  ('B01', 4, 'Bar', 'rect', 50, 300),
  ('B02', 2, 'Bar', 'rect', 150, 300);

INSERT INTO service_windows (date, label, start_time, end_time) VALUES
  (CURRENT_DATE, 'Lunch', '11:30', '15:00'),
  (CURRENT_DATE, 'Dinner', '17:30', '22:00'),
  (CURRENT_DATE + 1, 'Lunch', '11:30', '15:00'),
  (CURRENT_DATE + 1, 'Dinner', '17:30', '22:00');

INSERT INTO suppliers (name, contact_name, email, phone) VALUES
  ('Fresh Foods Co', 'John Smith', 'john@freshfoods.com', '+31 20 123 4567'),
  ('Premium Meats', 'Sarah Johnson', 'sarah@premiummeats.nl', '+31 20 234 5678'),
  ('Local Brewery', 'Mike Brown', 'mike@localbrewery.nl', '+31 20 345 6789');

INSERT INTO items (sku, name, category, unit, par_level, cost_per_unit) VALUES
  ('BEEF001', 'Ribeye Steak 300g', 'Meat', 'piece', 50, 12.50),
  ('VEG001', 'Fresh Asparagus', 'Vegetables', 'kg', 10, 8.00),
  ('WINE001', 'House Red Wine', 'Beverages', 'bottle', 24, 15.00),
  ('BREAD001', 'Sourdough Bread', 'Bakery', 'loaf', 12, 4.50);

-- Insert default job schedules
INSERT INTO job_schedules (key, cron, description, payload) VALUES
  ('forecast.refresh', '30 2 * * *', 'Daily forecast refresh', '{"services":["Lunch","Dinner"]}'),
  ('pos.sync_daily_sales', '15 3 * * *', 'Sync POS daily sales', '{"date":"today"}'),
  ('alerts.scan', '*/15 * * * *', 'Scan for alerts every 15 minutes', '{}'),
  ('reviews.pull', '*/15 * * * *', 'Pull reviews every 15 minutes', '{"platforms":["google","tripadvisor","yelp"]}'),
  ('social.fetch_comments', '*/10 * * * *', 'Fetch social media comments', '{}'),
  ('reservations.auto_release_no_show', '*/10 * * * *', 'Auto-release no-show reservations', '{"grace_minutes":15}'),
  ('reservations.reminder_sms', '0 * * * *', 'Send reservation reminders', '{"window_hours":24}'),
  ('inventory.low_stock_reorder_sheet', '0 7 * * *', 'Generate reorder sheet for low stock', '{}'),
  ('pos.sync_menu_items', '0 4 * * 1', 'Sync POS menu items weekly', '{}'),
  ('reports.compile_daily', '0 6 * * *', 'Compile daily reports', '{}');

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers where needed
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_schedules_updated_at BEFORE UPDATE ON job_schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();