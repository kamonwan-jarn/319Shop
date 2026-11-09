-- Legacy, non-authoritative schema draft. Do not apply this file.
-- The connected application uses prisma/schema.prisma and Prisma migrations.
-- Product prices are sourced in USD. The UI converts them to THB at a demo rate.

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(80) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  -- Store a server-side password hash only; never store plaintext passwords.
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE auth_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX auth_sessions_user_id_idx ON auth_sessions(user_id);
CREATE INDEX auth_sessions_expires_at_idx ON auth_sessions(expires_at);

-- Local collection data currently lives in browser localStorage and is not
-- linked to the login state. This owner record supports either an account or
-- a guest browser key once the frontend/backend collection API is integrated.
CREATE TABLE collection_owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  guest_key UUID UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT collection_owner_has_one_identity CHECK (
    (user_id IS NOT NULL AND guest_key IS NULL)
    OR (user_id IS NULL AND guest_key IS NOT NULL)
  )
);

CREATE UNIQUE INDEX collection_owners_user_id_idx
  ON collection_owners(user_id)
  WHERE user_id IS NOT NULL;

-- API Product.id is a number; keep it as PostgreSQL INTEGER.
-- Map API/frontend title -> name and image -> image_url at the API boundary.
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  rating_rate NUMERIC(4, 2) NOT NULL DEFAULT 0 CHECK (rating_rate >= 0),
  rating_count INTEGER NOT NULL DEFAULT 0 CHECK (rating_count >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE wishlist_items (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES collection_owners(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (owner_id, product_id)
);

CREATE INDEX wishlist_items_owner_id_idx ON wishlist_items(owner_id);

CREATE TABLE cart_items (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES collection_owners(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (owner_id, product_id)
);

CREATE INDEX cart_items_owner_id_idx ON cart_items(owner_id);

-- Guest checkout is allowed by the current UI, so user_id is optional.
-- created_at replaces the UI's locale-formatted date string; format it in UI.
-- status matches the current store's single Thai status string, not a payment
-- gateway verification result. PromptPay QR in the current UI is a placeholder.
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_code VARCHAR(16) NOT NULL UNIQUE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  display_exchange_rate NUMERIC(10, 4) NOT NULL DEFAULT 35 CHECK (display_exchange_rate > 0),
  shipping_full_name VARCHAR(160) NOT NULL,
  shipping_phone VARCHAR(40) NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_subdistrict VARCHAR(120),
  shipping_district VARCHAR(120),
  shipping_province VARCHAR(120) NOT NULL,
  shipping_postal_code VARCHAR(20) NOT NULL,
  payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('promptpay', 'cod')),
  status VARCHAR(60) NOT NULL DEFAULT 'ชำระเงินสำเร็จ'
);

CREATE INDEX orders_user_id_created_at_idx ON orders(user_id, created_at DESC);

-- Snapshot name/image/price so order history remains readable if the source
-- product changes or disappears. product_id can be null for historical rows.
CREATE TABLE order_items (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_image_url TEXT NOT NULL,
  unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  quantity INTEGER NOT NULL CHECK (quantity > 0)
);

CREATE INDEX order_items_order_id_idx ON order_items(order_id);
