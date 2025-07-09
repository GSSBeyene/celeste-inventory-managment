-- Create customers table for credit management and sales
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_number TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  credit_limit DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (credit_limit >= 0),
  current_balance DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create credit transactions table
CREATE TABLE public.credit_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('credit', 'debit', 'payment', 'adjustment')),
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  reference_number TEXT,
  description TEXT,
  balance_after DECIMAL(10,2) NOT NULL,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create suppliers table for inventory management
CREATE TABLE public.suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  payment_terms INTEGER DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create inventory items table
CREATE TABLE public.inventory_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('ingredients', 'beverages', 'supplies', 'equipment', 'packaging')),
  unit_of_measure TEXT NOT NULL,
  unit_cost DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (unit_cost >= 0),
  reorder_level INTEGER NOT NULL DEFAULT 0 CHECK (reorder_level >= 0),
  max_stock_level INTEGER DEFAULT NULL,
  supplier_id UUID REFERENCES public.suppliers(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discontinued')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create inventory transactions table for stock movements
CREATE TABLE public.inventory_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID NOT NULL REFERENCES public.inventory_items(id) ON DELETE RESTRICT,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('purchase', 'sale', 'adjustment', 'waste', 'transfer')),
  quantity INTEGER NOT NULL,
  unit_cost DECIMAL(10,2),
  total_cost DECIMAL(10,2),
  reference_number TEXT,
  notes TEXT,
  balance_after INTEGER NOT NULL,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create current stock levels table
CREATE TABLE public.stock_levels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
  current_quantity INTEGER NOT NULL DEFAULT 0 CHECK (current_quantity >= 0),
  reserved_quantity INTEGER NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
  available_quantity INTEGER GENERATED ALWAYS AS (current_quantity - reserved_quantity) STORED,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(item_id)
);

-- Create sales orders table
CREATE TABLE public.sales_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES public.customers(id),
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  delivery_date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'overdue')),
  payment_method TEXT CHECK (payment_method IN ('cash', 'credit', 'card', 'bank_transfer')),
  notes TEXT,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sales order items table
CREATE TABLE public.sales_order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sales_order_id UUID NOT NULL REFERENCES public.sales_orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE RESTRICT,
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price > 0),
  line_total DECIMAL(10,2) NOT NULL CHECK (line_total >= 0),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create purchase orders table for inventory management
CREATE TABLE public.purchase_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  po_number TEXT NOT NULL UNIQUE,
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE RESTRICT,
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expected_delivery_date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'confirmed', 'partial_received', 'received', 'cancelled')),
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
  notes TEXT,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create purchase order items table
CREATE TABLE public.purchase_order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  purchase_order_id UUID NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
  inventory_item_id UUID NOT NULL REFERENCES public.inventory_items(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_cost DECIMAL(10,2) NOT NULL CHECK (unit_cost > 0),
  line_total DECIMAL(10,2) NOT NULL CHECK (line_total >= 0),
  received_quantity INTEGER NOT NULL DEFAULT 0 CHECK (received_quantity >= 0),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for customers
CREATE POLICY "Customers are publicly readable" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage customers" ON public.customers FOR ALL TO authenticated USING (true);

-- Create RLS policies for credit transactions
CREATE POLICY "Credit transactions are publicly readable" ON public.credit_transactions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage credit transactions" ON public.credit_transactions FOR ALL TO authenticated USING (true);

-- Create RLS policies for suppliers
CREATE POLICY "Suppliers are publicly readable" ON public.suppliers FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage suppliers" ON public.suppliers FOR ALL TO authenticated USING (true);

-- Create RLS policies for inventory items
CREATE POLICY "Inventory items are publicly readable" ON public.inventory_items FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage inventory items" ON public.inventory_items FOR ALL TO authenticated USING (true);

-- Create RLS policies for inventory transactions
CREATE POLICY "Inventory transactions are publicly readable" ON public.inventory_transactions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage inventory transactions" ON public.inventory_transactions FOR ALL TO authenticated USING (true);

-- Create RLS policies for stock levels
CREATE POLICY "Stock levels are publicly readable" ON public.stock_levels FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage stock levels" ON public.stock_levels FOR ALL TO authenticated USING (true);

-- Create RLS policies for sales orders
CREATE POLICY "Sales orders are publicly readable" ON public.sales_orders FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage sales orders" ON public.sales_orders FOR ALL TO authenticated USING (true);

-- Create RLS policies for sales order items
CREATE POLICY "Sales order items are publicly readable" ON public.sales_order_items FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage sales order items" ON public.sales_order_items FOR ALL TO authenticated USING (true);

-- Create RLS policies for purchase orders
CREATE POLICY "Purchase orders are publicly readable" ON public.purchase_orders FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage purchase orders" ON public.purchase_orders FOR ALL TO authenticated USING (true);

-- Create RLS policies for purchase order items
CREATE POLICY "Purchase order items are publicly readable" ON public.purchase_order_items FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage purchase order items" ON public.purchase_order_items FOR ALL TO authenticated USING (true);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at
  BEFORE UPDATE ON public.suppliers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_inventory_items_updated_at
  BEFORE UPDATE ON public.inventory_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sales_orders_updated_at
  BEFORE UPDATE ON public.sales_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_purchase_orders_updated_at
  BEFORE UPDATE ON public.purchase_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_customers_customer_number ON public.customers(customer_number);
CREATE INDEX idx_customers_status ON public.customers(status);
CREATE INDEX idx_credit_transactions_customer_id ON public.credit_transactions(customer_id);
CREATE INDEX idx_credit_transactions_created_at ON public.credit_transactions(created_at);
CREATE INDEX idx_suppliers_supplier_code ON public.suppliers(supplier_code);
CREATE INDEX idx_inventory_items_item_code ON public.inventory_items(item_code);
CREATE INDEX idx_inventory_items_category ON public.inventory_items(category);
CREATE INDEX idx_inventory_transactions_item_id ON public.inventory_transactions(item_id);
CREATE INDEX idx_inventory_transactions_created_at ON public.inventory_transactions(created_at);
CREATE INDEX idx_stock_levels_item_id ON public.stock_levels(item_id);
CREATE INDEX idx_sales_orders_order_number ON public.sales_orders(order_number);
CREATE INDEX idx_sales_orders_customer_id ON public.sales_orders(customer_id);
CREATE INDEX idx_sales_orders_status ON public.sales_orders(status);
CREATE INDEX idx_sales_orders_order_date ON public.sales_orders(order_date);
CREATE INDEX idx_sales_order_items_sales_order_id ON public.sales_order_items(sales_order_id);
CREATE INDEX idx_purchase_orders_po_number ON public.purchase_orders(po_number);
CREATE INDEX idx_purchase_orders_supplier_id ON public.purchase_orders(supplier_id);
CREATE INDEX idx_purchase_orders_status ON public.purchase_orders(status);

-- Insert sample customers
INSERT INTO public.customers (customer_number, name, email, phone, address, credit_limit) VALUES
('CUST001', 'Hotel Grand Palace', 'orders@grandpalace.com', '+251911234567', 'Bole, Addis Ababa', 50000.00),
('CUST002', 'Skylight Hotel', 'purchasing@skylight.com', '+251922345678', 'Kazanchis, Addis Ababa', 30000.00),
('CUST003', 'Blue Nile Restaurant', 'manager@bluenile.com', '+251933456789', 'Piassa, Addis Ababa', 20000.00);

-- Insert sample suppliers
INSERT INTO public.suppliers (supplier_code, name, contact_person, email, phone, address, payment_terms) VALUES
('SUP001', 'Fresh Foods Ethiopia', 'Ahmed Hassan', 'ahmed@freshfoods.et', '+251911111111', 'Merkato, Addis Ababa', 30),
('SUP002', 'Beverage Distributors Ltd', 'Sara Tesfaye', 'sara@bevdist.com', '+251922222222', 'Industrial Area, Addis Ababa', 15),
('SUP003', 'Kitchen Supplies Co', 'Michael Bekele', 'michael@kitchensupplies.et', '+251933333333', 'Bole, Addis Ababa', 45);

-- Insert sample inventory items
INSERT INTO public.inventory_items (item_code, name, description, category, unit_of_measure, unit_cost, reorder_level, supplier_id) VALUES
('ING001', 'Chicken Breast', 'Fresh chicken breast meat', 'ingredients', 'kg', 250.00, 50, (SELECT id FROM public.suppliers WHERE supplier_code = 'SUP001')),
('ING002', 'Tomatoes', 'Fresh tomatoes', 'ingredients', 'kg', 15.00, 100, (SELECT id FROM public.suppliers WHERE supplier_code = 'SUP001')),
('ING003', 'Onions', 'Fresh onions', 'ingredients', 'kg', 12.00, 80, (SELECT id FROM public.suppliers WHERE supplier_code = 'SUP001')),
('BEV001', 'Orange Juice', 'Fresh orange juice concentrate', 'beverages', 'liter', 45.00, 30, (SELECT id FROM public.suppliers WHERE supplier_code = 'SUP002')),
('SUP001', 'Cooking Oil', 'Vegetable cooking oil', 'supplies', 'liter', 85.00, 20, (SELECT id FROM public.suppliers WHERE supplier_code = 'SUP001')),
('PAK001', 'Take Away Containers', 'Biodegradable food containers', 'packaging', 'piece', 2.50, 500, (SELECT id FROM public.suppliers WHERE supplier_code = 'SUP003'));

-- Insert initial stock levels for inventory items
INSERT INTO public.stock_levels (item_id, current_quantity)
SELECT id, 0 FROM public.inventory_items;

-- Insert sample sales orders
INSERT INTO public.sales_orders (order_number, customer_id, order_date, status, subtotal, tax_amount, total_amount, payment_status, payment_method, created_by) VALUES
('SO001', (SELECT id FROM public.customers WHERE customer_number = 'CUST001'), CURRENT_DATE, 'confirmed', 2500.00, 375.00, 2875.00, 'pending', 'credit', 'admin'),
('SO002', (SELECT id FROM public.customers WHERE customer_number = 'CUST002'), CURRENT_DATE - 1, 'delivered', 1800.00, 270.00, 2070.00, 'paid', 'bank_transfer', 'admin');

-- Function to update customer balance after credit transaction
CREATE OR REPLACE FUNCTION public.update_customer_balance()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.customers 
  SET current_balance = NEW.balance_after,
      updated_at = now()
  WHERE id = NEW.customer_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update customer balance after credit transaction
CREATE TRIGGER update_customer_balance_trigger
  AFTER INSERT ON public.credit_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_customer_balance();

-- Function to update stock levels after inventory transaction
CREATE OR REPLACE FUNCTION public.update_stock_level()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.stock_levels (item_id, current_quantity, last_updated)
  VALUES (NEW.item_id, NEW.balance_after, now())
  ON CONFLICT (item_id) 
  DO UPDATE SET 
    current_quantity = NEW.balance_after,
    last_updated = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update stock levels after inventory transaction
CREATE TRIGGER update_stock_level_trigger
  AFTER INSERT ON public.inventory_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_stock_level();