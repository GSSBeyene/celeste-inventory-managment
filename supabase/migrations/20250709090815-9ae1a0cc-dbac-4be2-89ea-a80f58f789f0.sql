-- Create menu items table for restaurant management
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('appetizer', 'main', 'dessert', 'beverage', 'special')),
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  cost DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (cost >= 0),
  description TEXT,
  available BOOLEAN NOT NULL DEFAULT true,
  ingredients TEXT[] DEFAULT '{}',
  allergens TEXT[] DEFAULT '{}',
  preparation_time INTEGER NOT NULL DEFAULT 15 CHECK (preparation_time > 0),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  table_number TEXT NOT NULL,
  customer_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'served', 'cancelled')),
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order items table (junction table for orders and menu items)
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES public.menu_items(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price > 0),
  item_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for menu_items (readable by everyone, editable by authenticated users)
CREATE POLICY "Menu items are publicly readable" 
ON public.menu_items 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create menu items" 
ON public.menu_items 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update menu items" 
ON public.menu_items 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can delete menu items" 
ON public.menu_items 
FOR DELETE 
TO authenticated 
USING (true);

-- Create policies for orders (readable and writable by everyone for now)
CREATE POLICY "Orders are publicly readable" 
ON public.orders 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update orders" 
ON public.orders 
FOR UPDATE 
USING (true);

CREATE POLICY "Authenticated users can delete orders" 
ON public.orders 
FOR DELETE 
TO authenticated 
USING (true);

-- Create policies for order_items
CREATE POLICY "Order items are publicly readable" 
ON public.order_items 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create order items" 
ON public.order_items 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update order items" 
ON public.order_items 
FOR UPDATE 
USING (true);

CREATE POLICY "Authenticated users can delete order items" 
ON public.order_items 
FOR DELETE 
TO authenticated 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON public.menu_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_menu_items_category ON public.menu_items(category);
CREATE INDEX idx_menu_items_available ON public.menu_items(available);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_menu_item_id ON public.order_items(menu_item_id);

-- Insert sample menu items from your current data
INSERT INTO public.menu_items (name, category, price, cost, description, ingredients, allergens, preparation_time, available) VALUES
-- Soups
('Chicken Soup', 'appetizer', 350.00, 120.00, 'Chicken, butter, cream served with bread', ARRAY['chicken', 'butter', 'cream', 'bread'], ARRAY['dairy', 'gluten'], 20, true),
('Mushroom Soup', 'appetizer', 320.00, 110.00, 'Mushroom butter cream served with bread', ARRAY['mushroom', 'butter', 'cream', 'bread'], ARRAY['dairy', 'gluten'], 18, true),
('Tomato Soup', 'appetizer', 300.00, 100.00, 'Fresh tomato butter cream served with bread', ARRAY['tomato', 'butter', 'cream', 'bread'], ARRAY['dairy', 'gluten'], 15, true),
('Potato Soup', 'appetizer', 280.00, 95.00, 'Fresh potato, onion, butter cream served with bread', ARRAY['potato', 'onion', 'butter', 'cream', 'bread'], ARRAY['dairy', 'gluten'], 25, true),
('Vegetable Soup', 'appetizer', 320.00, 105.00, 'Fresh diced potato, carrots, green beans & corn simmered in tomato juice with bread', ARRAY['potato', 'carrots', 'green beans', 'corn', 'tomato', 'bread'], ARRAY['gluten'], 30, true),

-- Salads
('Special Salad', 'appetizer', 450.00, 180.00, 'Lettuce, chicken, onion, chili, tomato, cucumber, tuna, egg, mixed mayonnaise vinegar with bread', ARRAY['lettuce', 'chicken', 'onion', 'chili', 'tomato', 'cucumber', 'tuna', 'egg', 'mayonnaise', 'bread'], ARRAY['eggs', 'gluten'], 12, true),
('Chicken Salad', 'appetizer', 380.00, 150.00, 'Chicken, lettuce, onion, tomato, chili, cucumber with bread', ARRAY['chicken', 'lettuce', 'onion', 'tomato', 'chili', 'cucumber', 'bread'], ARRAY['gluten'], 10, true),
('Mixed Salad', 'appetizer', 320.00, 120.00, 'Lettuce, onion, tomato, cucumber, carrot, chili with bread', ARRAY['lettuce', 'onion', 'tomato', 'cucumber', 'carrot', 'chili', 'bread'], ARRAY['gluten'], 8, true),
('Tuna Salad', 'appetizer', 420.00, 160.00, 'Lettuce, tuna, onion, tomato, cucumber with bread', ARRAY['lettuce', 'tuna', 'onion', 'tomato', 'cucumber', 'bread'], ARRAY['fish', 'gluten'], 10, true),
('Fruit Salad', 'appetizer', 350.00, 140.00, 'Fresh strawberry, orange, apple, mango, papaya with syrup', ARRAY['strawberry', 'orange', 'apple', 'mango', 'papaya', 'syrup'], ARRAY[], 8, true),
('Tomato Salad', 'appetizer', 280.00, 110.00, 'Fresh tomato, onion, chili, black olive with bread', ARRAY['tomato', 'onion', 'chili', 'black olive', 'bread'], ARRAY['gluten'], 5, true),

-- Main Courses - Pasta/Spaghetti
('Spaghetti with Tomato Sauce', 'main', 450.00, 180.00, 'Spaghetti served with rich tomato sauce', ARRAY['spaghetti', 'tomato sauce'], ARRAY['gluten'], 20, true),
('Spaghetti with Vegetable Sauce', 'main', 480.00, 200.00, 'Spaghetti served with mixed vegetable sauce', ARRAY['spaghetti', 'mixed vegetables'], ARRAY['gluten'], 25, true),
('Spaghetti with Tuna Sauce', 'main', 520.00, 220.00, 'Spaghetti served with tuna sauce', ARRAY['spaghetti', 'tuna', 'sauce'], ARRAY['gluten', 'fish'], 22, true),
('Spaghetti with Meat Sauce', 'main', 580.00, 250.00, 'Spaghetti served with meat sauce', ARRAY['spaghetti', 'meat', 'sauce'], ARRAY['gluten'], 30, true),

-- Main Courses - Grilled/Fried
('Grilled Chicken', 'main', 650.00, 280.00, 'Well marinated chicken thigh grilled & served with rice', ARRAY['chicken', 'rice', 'marinade'], ARRAY[], 35, true),
('Stir Fried Chicken', 'main', 620.00, 260.00, 'Fried cubes of chicken & cooked vegetable served with rice & prime', ARRAY['chicken', 'vegetables', 'rice'], ARRAY[], 25, true),
('Roasted Chicken', 'main', 680.00, 300.00, 'Well marinated chicken & served with rice & prime', ARRAY['chicken', 'rice', 'marinade'], ARRAY[], 40, true),
('Fried Chicken', 'main', 600.00, 250.00, 'Warmed chicken & served rice with vegetable', ARRAY['chicken', 'rice', 'vegetables'], ARRAY[], 30, true),
('Roasted Lamb', 'main', 750.00, 350.00, 'Well marinated lamb served with brown sauce rice with vegetable', ARRAY['lamb', 'rice', 'vegetables', 'brown sauce'], ARRAY[], 45, true),
('Pan Flake', 'main', 720.00, 320.00, 'Well marinated beef fried', ARRAY['beef', 'marinade'], ARRAY[], 35, true),

-- Sandwiches
('Vegetable Sandwich', 'appetizer', 280.00, 100.00, 'Bread stuffed with sliced cucumber, tomato & carrot', ARRAY['bread', 'cucumber', 'tomato', 'carrot'], ARRAY['gluten'], 8, true),
('Tuna Sandwich', 'appetizer', 350.00, 140.00, 'Tuna sandwich with fresh vegetables', ARRAY['bread', 'tuna', 'vegetables'], ARRAY['gluten', 'fish'], 10, true),
('Chicken Sandwich', 'appetizer', 380.00, 160.00, 'Chicken sandwich with fresh vegetables', ARRAY['bread', 'chicken', 'vegetables'], ARRAY['gluten'], 12, true),

-- French Toast & Breakfast
('French Toast', 'special', 320.00, 120.00, 'French toast with honey, chocolate or strawberry syrup', ARRAY['bread', 'eggs', 'syrup'], ARRAY['gluten', 'eggs', 'dairy'], 15, true),

-- Juices
('Milk Shake Juice', 'beverage', 180.00, 60.00, 'Strawberry, honey, milk mix', ARRAY['strawberry', 'honey', 'milk'], ARRAY['dairy'], 5, true),
('Fresh Orange Juice', 'beverage', 150.00, 50.00, 'Fresh squeezed orange juice', ARRAY['orange'], ARRAY[], 3, true),
('Fresh Strawberry Juice', 'beverage', 160.00, 55.00, 'Fresh strawberry juice', ARRAY['strawberry'], ARRAY[], 5, true),
('Fresh Papaya Juice', 'beverage', 140.00, 45.00, 'Fresh papaya juice', ARRAY['papaya'], ARRAY[], 4, true),
('Fresh Mango Juice', 'beverage', 170.00, 60.00, 'Fresh mango juice', ARRAY['mango'], ARRAY[], 5, true),
('Fresh Watermelon Juice', 'beverage', 130.00, 40.00, 'Fresh watermelon juice', ARRAY['watermelon'], ARRAY[], 3, true),
('Fresh Avocado Juice', 'beverage', 180.00, 65.00, 'Fresh avocado juice', ARRAY['avocado'], ARRAY[], 5, true),
('Special Juice Mix', 'beverage', 200.00, 75.00, 'Fresh strawberry, avocado, mango and papaya mix', ARRAY['strawberry', 'avocado', 'mango', 'papaya'], ARRAY[], 8, true);