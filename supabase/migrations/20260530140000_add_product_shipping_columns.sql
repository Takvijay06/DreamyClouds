-- Adds product-level shipping fields used by the admin panel and checkout.
-- Run in Supabase Dashboard → SQL Editor if product save fails with:
-- "Could not find the 'shipping_quantity_mode' column of 'products' in the schema cache"

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS shipping_quantity_mode text NOT NULL DEFAULT 'per_item',
  ADD COLUMN IF NOT EXISTS candle_jar_packaged boolean NOT NULL DEFAULT true;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'products_shipping_quantity_mode_check'
  ) THEN
    ALTER TABLE public.products
      ADD CONSTRAINT products_shipping_quantity_mode_check
      CHECK (shipping_quantity_mode IN ('per_item', 'per_line'));
  END IF;
END $$;

NOTIFY pgrst, 'reload schema';
