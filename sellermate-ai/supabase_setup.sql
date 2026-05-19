-- 1. Create Sellers table (linked to Supabase Auth users)
create table sellers (
  id uuid references auth.users on delete cascade primary key,
  store_name text not null,
  store_description text,
  whatsapp_number text,
  created_at timestamp with time zone default now()
);

-- 2. Create Products table
create table products (
  id uuid default gen_random_uuid() primary key,
  seller_id uuid references sellers(id) on delete cascade not null,
  name text not null,
  description text,
  price numeric(10,2) not null,
  stock integer not null default 0,
  image_url text,
  created_at timestamp with time zone default now()
);

-- 3. Create Orders table
create table orders (
  id uuid default gen_random_uuid() primary key,
  seller_id uuid references sellers(id) on delete cascade not null,
  customer_name text not null,
  whatsapp_number text not null,
  delivery_note text,
  items jsonb not null,  -- array of { product_id, name, price, quantity }
  total numeric(10,2) not null,
  status text default 'pending' check (status in ('pending', 'fulfilled', 'cancelled')),
  created_at timestamp with time zone default now()
);

-- 4. Enable Row Level Security (RLS)
alter table sellers enable row level security;
alter table products enable row level security;
alter table orders enable row level security;

-- 5. Define Security Policies

-- Sellers can only read/write their own profiles
create policy "Sellers own data" on sellers for all using (auth.uid() = id);

-- Public can read seller details (essential for loading the storefront)
create policy "Public read sellers" on sellers for select using (true);

-- Sellers can manage their own products
create policy "Sellers own products" on products for all using (auth.uid() = seller_id);

-- Public can read products (needed for customers to browse the store)
create policy "Public read products" on products for select using (true);

-- Sellers can view/update their own orders
create policy "Sellers own orders" on orders for all using (auth.uid() = seller_id);

-- Public can submit new orders during checkout
create policy "Public insert orders" on orders for insert with check (true);
