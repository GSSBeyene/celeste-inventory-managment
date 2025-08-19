-- COMPREHENSIVE SECURITY FIXES FOR HOTEL CELESTE INVENTORY SYSTEM
-- This migration addresses all critical security vulnerabilities

-- =====================================================
-- PHASE 1: REMOVE PUBLIC ACCESS TO ALL BUSINESS DATA
-- =====================================================

-- Drop all public read policies that expose sensitive business data
DROP POLICY IF EXISTS "Suppliers are publicly readable" ON public.suppliers;
DROP POLICY IF EXISTS "Sales orders are publicly readable" ON public.sales_orders;
DROP POLICY IF EXISTS "Sales order items are publicly readable" ON public.sales_order_items;
DROP POLICY IF EXISTS "Inventory items are publicly readable" ON public.inventory_items;
DROP POLICY IF EXISTS "Stock levels are publicly readable" ON public.stock_levels;
DROP POLICY IF EXISTS "Inventory transactions are publicly readable" ON public.inventory_transactions;
DROP POLICY IF EXISTS "Purchase orders are publicly readable" ON public.purchase_orders;
DROP POLICY IF EXISTS "Purchase order items are publicly readable" ON public.purchase_order_items;
DROP POLICY IF EXISTS "Credit transactions are publicly readable" ON public.credit_transactions;

-- =====================================================
-- PHASE 2: IMPLEMENT SECURE AUTHENTICATED ACCESS
-- =====================================================

-- Suppliers: Restrict to authenticated users only
CREATE POLICY "Authenticated users can read suppliers" 
ON public.suppliers 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can manage suppliers" 
ON public.suppliers 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Sales Orders: Restrict to authenticated users only
CREATE POLICY "Authenticated users can read sales orders" 
ON public.sales_orders 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can manage sales orders" 
ON public.sales_orders 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Sales Order Items: Restrict to authenticated users only
CREATE POLICY "Authenticated users can read sales order items" 
ON public.sales_order_items 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can manage sales order items" 
ON public.sales_order_items 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Inventory Items: Restrict to authenticated users only
CREATE POLICY "Authenticated users can read inventory items" 
ON public.inventory_items 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can manage inventory items" 
ON public.inventory_items 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Stock Levels: Restrict to authenticated users only
CREATE POLICY "Authenticated users can read stock levels" 
ON public.stock_levels 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can manage stock levels" 
ON public.stock_levels 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Inventory Transactions: Restrict to authenticated users only
CREATE POLICY "Authenticated users can read inventory transactions" 
ON public.inventory_transactions 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can manage inventory transactions" 
ON public.inventory_transactions 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Purchase Orders: Restrict to authenticated users only
CREATE POLICY "Authenticated users can read purchase orders" 
ON public.purchase_orders 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can manage purchase orders" 
ON public.purchase_orders 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Purchase Order Items: Restrict to authenticated users only
CREATE POLICY "Authenticated users can read purchase order items" 
ON public.purchase_order_items 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can manage purchase order items" 
ON public.purchase_order_items 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Credit Transactions: Restrict to authenticated users only
CREATE POLICY "Authenticated users can read credit transactions" 
ON public.credit_transactions 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can manage credit transactions" 
ON public.credit_transactions 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- =====================================================
-- PHASE 3: SECURE ORDER MANAGEMENT SYSTEM
-- =====================================================

-- Remove dangerous public write access from orders
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can update orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;
DROP POLICY IF EXISTS "Anyone can update order items" ON public.order_items;

-- Replace with secure authenticated access
CREATE POLICY "Authenticated users can read orders" 
ON public.orders 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can manage orders" 
ON public.orders 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Authenticated users can read order items" 
ON public.order_items 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can manage order items" 
ON public.order_items 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- =====================================================
-- PHASE 4: FIX DATABASE FUNCTION SECURITY
-- =====================================================

-- Fix function security by adding proper search_path settings
CREATE OR REPLACE FUNCTION public.update_customer_balance()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
BEGIN
  UPDATE public.customers 
  SET current_balance = NEW.balance_after,
      updated_at = now()
  WHERE id = NEW.customer_id;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_stock_level()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
BEGIN
  INSERT INTO public.stock_levels (item_id, current_quantity, last_updated)
  VALUES (NEW.item_id, NEW.balance_after, now())
  ON CONFLICT (item_id) 
  DO UPDATE SET 
    current_quantity = NEW.balance_after,
    last_updated = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name, display_name)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email)
  );
  RETURN NEW;
END;
$function$;