-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own profile read" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Own profile write" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Own profile insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, phone, display_name)
  VALUES (NEW.id, NEW.phone, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.phone))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated-at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- SERVICE PROVIDERS (public)
CREATE TABLE public.service_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_slug TEXT NOT NULL,
  name TEXT NOT NULL,
  area TEXT NOT NULL,
  rating NUMERIC(2,1) NOT NULL DEFAULT 4.5,
  price_per_acre INTEGER NOT NULL,
  price_unit TEXT NOT NULL DEFAULT 'acre',
  available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.service_providers TO anon, authenticated;
GRANT ALL ON public.service_providers TO service_role;
ALTER TABLE public.service_providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Providers are public" ON public.service_providers FOR SELECT USING (true);

INSERT INTO public.service_providers (service_slug, name, area, rating, price_per_acre, price_unit) VALUES
('drone','SkyAgri Services','Warangal, Karimnagar',4.8,350,'acre'),
('drone','AgriFly Pilots','Nizamabad, Adilabad',4.7,380,'acre'),
('drone','GreenWings Drone Co','Nalgonda, Suryapet',4.6,320,'acre'),
('harvester','Balaji Harvesters','Warangal',4.7,1800,'acre'),
('harvester','Sri Agri Combines','Karimnagar',4.6,1750,'acre'),
('harvester','Farmers Combines','Nalgonda',4.5,1900,'acre'),
('tractor','Ravi Tractors','Warangal',4.6,650,'hour'),
('tractor','Kisan Tractor Rentals','Karimnagar',4.7,700,'hour'),
('tractor','AgriPower Rentals','Nizamabad',4.5,620,'hour'),
('workforce','Village Workforce Co.','Warangal',4.7,450,'worker-day'),
('workforce','AgriHands','Karimnagar',4.6,430,'worker-day'),
('workforce','Krushi Workers','Nizamabad',4.5,470,'worker-day');

-- ORDERS
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'placed',
  payment_method TEXT NOT NULL DEFAULT 'cod',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  subtotal INTEGER NOT NULL,
  shipping INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL,
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  address_line TEXT NOT NULL,
  village TEXT NOT NULL,
  district TEXT,
  pincode TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own orders read" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Own orders insert" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own orders update" ON public.orders FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ORDER ITEMS
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  name TEXT NOT NULL,
  unit_price INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  seller TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own order items read" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
);
CREATE POLICY "Own order items insert" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
);

-- BOOKINGS
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_slug TEXT NOT NULL,
  provider_id UUID REFERENCES public.service_providers(id),
  provider_name TEXT NOT NULL,
  acres INTEGER NOT NULL,
  scheduled_date DATE NOT NULL,
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  village TEXT NOT NULL,
  price_per_acre INTEGER NOT NULL,
  total INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own bookings read" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Own bookings insert" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own bookings update" ON public.bookings FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- STATUS EVENTS (order or booking tracking timeline)
CREATE TABLE public.status_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL, -- 'order' | 'booking'
  entity_id UUID NOT NULL,
  status TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.status_events TO authenticated;
GRANT ALL ON public.status_events TO service_role;
ALTER TABLE public.status_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own status events read" ON public.status_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Own status events insert" ON public.status_events FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Auto seed a "placed" status event on order/booking insert
CREATE OR REPLACE FUNCTION public.seed_order_status()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.status_events(user_id, entity_type, entity_id, status, note)
  VALUES (NEW.user_id, 'order', NEW.id, 'placed', 'Order placed successfully');
  RETURN NEW;
END; $$;
CREATE TRIGGER orders_seed_status AFTER INSERT ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.seed_order_status();

CREATE OR REPLACE FUNCTION public.seed_booking_status()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.status_events(user_id, entity_type, entity_id, status, note)
  VALUES (NEW.user_id, 'booking', NEW.id, 'pending', 'Awaiting provider confirmation');
  RETURN NEW;
END; $$;
CREATE TRIGGER bookings_seed_status AFTER INSERT ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.seed_booking_status();