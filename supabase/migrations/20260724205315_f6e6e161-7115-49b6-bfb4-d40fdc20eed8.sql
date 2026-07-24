REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.seed_order_status() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.seed_booking_status() FROM PUBLIC, anon, authenticated;