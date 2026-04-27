import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Layout } from "../components/Layout";
import { ProductCard } from "../components/ProductCard";
import {
  addToCart,
  setCandleNote,
  setCandleScented,
  setProduct,
  setSelectedColor,
} from "../features/order/orderSlice";
import {
  selectOrder,
  selectSelectedProduct,
} from "../features/order/selectors";
import {
  Product,
  ProductCategory,
  StickerSubCategory,
} from "../features/order/orderTypes";
import {
  selectDesignsError,
  selectDesignsStatus,
  selectStickerProducts,
} from "../features/designs/designsSlice";
import {
  selectProducts,
  selectProductsError,
  selectProductsStatus,
} from "../features/products/productsSlice";
import { formatRupee } from "../utils/currency";

type ProductCategoryTab = ProductCategory | "trending" | "steel-tumblers" | "glass-tumblers";

const CATEGORY_TABS: Array<{ key: ProductCategoryTab; label: string }> = [
  { key: "trending", label: "Trending" },
  { key: "steel-tumblers", label: "Steel Tumbler" },
  { key: "glass-tumblers", label: "Glass Tumbler" },
  { key: "mugs", label: "Mugs" },
  { key: "candles", label: "Candles" },
  { key: "accessories", label: "Accessories" },
  { key: "stickers", label: "Stickers" },
];

const STICKER_SUBCATEGORY_TABS: Array<{
  key: StickerSubCategory;
  label: string;
}> = [
  { key: "full_wrap", label: "Full Wrap" },
  { key: "single_sticker", label: "Single" },
];

const isStickerSubCategory = (value: unknown): value is StickerSubCategory =>
  value === "full_wrap" || value === "single_sticker";

const normalizeStickerSubCategory = (value: unknown): StickerSubCategory => {
  if (typeof value !== "string") {
    return "single_sticker";
  }
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-");
  if (
    normalized === "full-wrap" ||
    normalized === "fullwrap" ||
    (normalized.includes("full") && normalized.includes("wrap"))
  ) {
    return "full_wrap";
  }
  return "single_sticker";
};

export const ProductSelectionPage = () => {
  const INSTAGRAM_URL = "https://www.instagram.com/dreamycloudsbydaisy/";
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const order = useAppSelector(selectOrder);
  const selectedProduct = useAppSelector(selectSelectedProduct);
  const products = useAppSelector(selectProducts);
  const stickerProducts = useAppSelector(selectStickerProducts);
  const productsStatus = useAppSelector(selectProductsStatus);
  const productsError = useAppSelector(selectProductsError);
  const designsStatus = useAppSelector(selectDesignsStatus);
  const designsError = useAppSelector(selectDesignsError);
  const [activeCategory, setActiveCategory] = useState<ProductCategoryTab>(
    () => {
      if (selectedProduct?.category === "tumblers") {
        return selectedProduct.subCategory === "glass-tumbler"
          ? "glass-tumblers"
          : "steel-tumblers";
      }
      return (
        (selectedProduct?.category as ProductCategoryTab) ?? "steel-tumblers"
      );
    },
  );
  const [activeStickerSubCategory, setActiveStickerSubCategory] =
    useState<StickerSubCategory>(
      selectedProduct?.category === "stickers" &&
        isStickerSubCategory(selectedProduct.subCategory)
        ? normalizeStickerSubCategory(selectedProduct.subCategory)
        : "full_wrap",
    );
  const buttonAreaRef = useRef<HTMLDivElement | null>(null);
  const hasMountedProductScrollRef = useRef(false);
  const hasStickerSubCategoryInitializedRef = useRef(false);
  const isDaisyBouquetCandle =
    selectedProduct?.id === "candle-daisy-flower-bouquet";

  const filteredProducts = useMemo(
    () =>
      (activeCategory === "stickers" ? stickerProducts : products).filter(
        (item: any) => {
          if (activeCategory === "trending") {
            return item.isTrending === true;
          }

          if (activeCategory === "steel-tumblers") {
            return (
              item.category === "tumblers" &&
              item.subCategory === "steel-tumbler"
            );
          }

          if (activeCategory === "glass-tumblers") {
            return (
              item.category === "tumblers" &&
              item.subCategory === "glass-tumbler"
            );
          }

          if (item.category !== activeCategory) {
            return false;
          }

          if (activeCategory === "stickers") {
            return (
              normalizeStickerSubCategory(item.subCategory) ===
              activeStickerSubCategory
            );
          }

          return true;
        },
      ),
    [activeCategory, activeStickerSubCategory, products, stickerProducts],
  );

  useEffect(() => {
    if (activeCategory !== "stickers") {
      hasStickerSubCategoryInitializedRef.current = false;
    }
  }, [activeCategory]);

  useEffect(() => {
    if (activeCategory !== "stickers" || designsStatus !== "succeeded") {
      return;
    }
    if (hasStickerSubCategoryInitializedRef.current) {
      return;
    }

    const hasActiveItems = filteredProducts.length > 0;
    if (hasActiveItems) {
      hasStickerSubCategoryInitializedRef.current = true;
      return;
    }

    const hasFullWrap = stickerProducts.some(
      (item:any) => normalizeStickerSubCategory(item.subCategory) === "full_wrap",
    );
    const hasSingle = stickerProducts.some(
      (item:any) =>
        normalizeStickerSubCategory(item.subCategory) === "single_sticker",
    );

    if (hasFullWrap) {
      setActiveStickerSubCategory("full_wrap");
    } else if (hasSingle) {
      setActiveStickerSubCategory("single_sticker");
    }

    hasStickerSubCategoryInitializedRef.current = true;
  }, [activeCategory, designsStatus, filteredProducts.length, stickerProducts]);
  const selectedColorOptions = useMemo(() => {
    if (
      !selectedProduct ||
      selectedProduct.category !== "candles" ||
      !isDaisyBouquetCandle
    ) {
      return [];
    }

    return selectedProduct.colors ?? [];
  }, [isDaisyBouquetCandle, selectedProduct]);

  const candleScentedAddonLabel = useMemo(() => {
    if (!selectedProduct || selectedProduct.category !== "candles") {
      return "";
    }
    const rate =
      typeof selectedProduct.scentedAddonPrice === "number" &&
      Number.isFinite(selectedProduct.scentedAddonPrice)
        ? Math.max(0, selectedProduct.scentedAddonPrice)
        : 0;
    return rate > 0
      ? `Scented (+ ${formatRupee(rate)} per item)`
      : "Scented (no extra charge per item)";
  }, [selectedProduct]);

  useEffect(() => {
    if (!selectedProduct) {
      return;
    }

    if (selectedProduct.category !== "candles" || !isDaisyBouquetCandle) {
      if (order.selectedColor) {
        dispatch(setSelectedColor(""));
      }
      if (order.candleScented) {
        dispatch(setCandleScented(false));
      }
      return;
    }

    const nextColor = selectedColorOptions[0] ?? "";
    if (
      !order.selectedColor ||
      !selectedColorOptions.includes(order.selectedColor)
    ) {
      dispatch(setSelectedColor(nextColor));
    }
  }, [
    dispatch,
    order.candleScented,
    order.selectedColor,
    selectedColorOptions,
    selectedProduct,
    isDaisyBouquetCandle,
  ]);

  useEffect(() => {
    const preloadLimit =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 639px)").matches
        ? 6
        : 12;
    filteredProducts.slice(0, preloadLimit).forEach((product:any) => {
      if (product.imageAvailable === false) {
        return;
      }
      const images =
        product.images && product.images.length > 0
          ? product.images
          : [product.image];
      images.slice(0, 2).forEach((src:any) => {
        if (!src) {
          return;
        }
        const img = new Image();
        img.src = src;
      });
    });
  }, [filteredProducts]);

  useEffect(() => {
    if (!hasMountedProductScrollRef.current) {
      hasMountedProductScrollRef.current = true;
      return;
    }
    if (!order.productId || typeof window === "undefined") {
      return;
    }
    const isMobile = window.matchMedia("(max-width: 639px)").matches;
    if (!isMobile) {
      return;
    }
    window.requestAnimationFrame(() => {
      buttonAreaRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    });
  }, [order.productId]);

  const shouldUseDesignStep = (product: Product | null) => {
    if (!product) {
      return false;
    }
    return product.category === "tumblers" || product.category === "mugs";
  };

  const buildCartPayloadForProduct = (product: Product) => {
    const isDaisy = product.id === "candle-daisy-flower-bouquet";
    const colorList = product.colors?.filter((c) => c.trim().length > 0) ?? [];
    const useOrderCandleOptions = isDaisy && order.productId === product.id;
    const selectedColor = isDaisy
      ? (useOrderCandleOptions ? order.selectedColor : "") || colorList[0] || ""
      : "";
    return {
      productId: product.id,
      quantity: order.quantity,
      selectedColor,
      candleScented: isDaisy && useOrderCandleOptions ? order.candleScented : false,
      candleNote: isDaisy && useOrderCandleOptions ? order.candleNote : "",
      selectedStickerId: null as string | null,
      personalizedNote: "",
    };
  };

  const handleBuyNow = (product: Product) => {
    dispatch(setProduct(product.id));
    if (shouldUseDesignStep(product)) {
      navigate("/design");
      return;
    }
    dispatch(addToCart(buildCartPayloadForProduct(product)));
    navigate("/preview");
  };

  const handleNext = () => {
    if (!selectedProduct) {
      return;
    }

    if (shouldUseDesignStep(selectedProduct)) {
      navigate("/design");
      return;
    }

    dispatch(addToCart(buildCartPayloadForProduct(selectedProduct)));
    navigate("/preview");
  };

  return (
    <Layout currentStep={1}>
      <div className="space-y-8">
        <section className="rounded-2xl border border-lavender-200/80 bg-white/85 p-4 text-sm text-lavender-800">
          <p>
            Follow us on Instagram for latest designs:{" "}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-lavender-700 underline decoration-lavender-300 underline-offset-2 hover:text-lavender-900"
            >
              @dreamycloudsbydaisy
            </a>
          </p>
        </section>

        <section className="space-y-3.5">
          {activeCategory !== "stickers" && productsStatus === "loading" ? (
            <div className="rounded-2xl border border-lavender-200/80 bg-white/85 p-3 text-xs font-semibold text-lavender-700">
              Loading the latest products…
            </div>
          ) : null}
          {activeCategory !== "stickers" && productsStatus === "failed" ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-3 text-xs font-semibold text-rose-700">
              Could not load the latest product list.{" "}
              {productsError ? `(${productsError})` : ""}
            </div>
          ) : null}
          {activeCategory === "stickers" && designsStatus === "loading" ? (
            <div className="rounded-2xl border border-lavender-200/80 bg-white/85 p-3 text-xs font-semibold text-lavender-700">
              Loading the latest sticker designs…
            </div>
          ) : null}
          {activeCategory === "stickers" && designsStatus === "failed" ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-3 text-xs font-semibold text-rose-700">
              Could not load the latest sticker designs.{" "}
              {designsError ? `(${designsError})` : ""}
            </div>
          ) : null}
          <div className="flex flex-wrap gap-2">
            {CATEGORY_TABS.map((tab) => {
              const isActive = tab.key === activeCategory;
              const isTrendingTab = tab.key === "trending";
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setActiveCategory(tab.key);
                  }}
                  className={`${isTrendingTab ? "trending-tab-border" : ""} ${isTrendingTab && isActive ? "trending-tab-border-active" : ""} rounded-2xl border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
                    isTrendingTab
                      ? isActive
                        ? "border-fuchsia-500 bg-gradient-to-r from-fuchsia-600 via-violet-600 to-lavender-600 text-white shadow-lg shadow-fuchsia-300/40 focus-visible:ring-fuchsia-300"
                        : "border-fuchsia-200 bg-gradient-to-r from-fuchsia-50 via-violet-50 to-lavender-50 text-fuchsia-800 hover:border-fuchsia-400 hover:shadow-md hover:shadow-fuchsia-200/50 focus-visible:ring-fuchsia-200 motion-safe:animate-pulse"
                      : isActive
                        ? "border-lavender-600 bg-gradient-to-r from-lavender-700 to-lavender-500 text-white shadow-lg shadow-lavender-300/50 focus-visible:ring-lavender-300"
                        : "border-lavender-300 bg-white text-lavender-700 hover:border-lavender-500 hover:bg-lavender-50 focus-visible:ring-lavender-200"
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <span>{tab.label}</span>
                    {isTrendingTab ? (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide ${
                          isActive
                            ? "bg-white/20 text-white motion-safe:animate-bounce"
                            : "bg-fuchsia-100 text-fuchsia-700"
                        }`}
                      >
                        HOT
                      </span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>

          {activeCategory === "stickers" ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-lavender-600">
                SUB CATEGORY
              </p>
              <div className="flex flex-wrap gap-2">
                {STICKER_SUBCATEGORY_TABS.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveStickerSubCategory(tab.key)}
                    className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
                      tab.key === activeStickerSubCategory
                        ? "border-lavender-500 bg-lavender-100 text-lavender-800"
                        : "border-lavender-200 bg-white text-lavender-600 hover:border-lavender-400 hover:bg-lavender-50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex items-center justify-between">
            <h2 className="font-['Sora'] text-lg font-bold text-lavender-900">
              {activeCategory === "stickers"
                ? STICKER_SUBCATEGORY_TABS.find(
                    (tab) => tab.key === activeStickerSubCategory,
                  )?.label
                : CATEGORY_TABS.find((tab) => tab.key === activeCategory)
                    ?.label}
            </h2>
            <span className="rounded-full bg-lavender-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-lavender-700">
              {filteredProducts.length} options
            </span>
          </div>

          {activeCategory === "stickers" &&
          designsStatus === "succeeded" &&
          filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-lavender-200/80 bg-white/90 p-4 text-sm text-lavender-700">
              No sticker designs are available right now.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product:any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onShare={(item) => navigate(`/product/${item.id}`)}
                  onBuyNow={handleBuyNow}
                  onRequestCandleOptions={
                    product.id === "candle-daisy-flower-bouquet"
                      ? () => dispatch(setProduct("candle-daisy-flower-bouquet"))
                      : undefined
                  }
                />
              ))}
            </div>
          )}
        </section>

        {isDaisyBouquetCandle ? (
          <section className="space-y-4 rounded-3xl border border-lavender-200/80 bg-white/90 p-4 sm:p-5">
            <h3 className="font-['Sora'] text-sm font-bold uppercase tracking-wide text-lavender-800">
              Candle Options
            </h3>
            <label className="block space-y-1.5">
              <span className="text-sm font-semibold text-lavender-800">
                Color
              </span>
              <select
                className="input"
                disabled={selectedColorOptions.length === 0}
                value={order.selectedColor}
                onChange={(event) =>
                  dispatch(setSelectedColor(event.target.value))
                }
              >
                {selectedColorOptions.length === 0 ? (
                  <option value="">
                    No colors listed for this product yet
                  </option>
                ) : (
                  selectedColorOptions.map((color:any) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))
                )}
              </select>
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-lavender-200/80 bg-white p-4">
              <input
                type="checkbox"
                checked={order.candleScented}
                onChange={(event) =>
                  dispatch(setCandleScented(event.target.checked))
                }
                className="h-4 w-4 accent-lavender-600"
              />
              <span className="text-sm font-medium text-lavender-800">
                {candleScentedAddonLabel}
              </span>
            </label>

            {isDaisyBouquetCandle ? (
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-lavender-800">
                  Short Note (optional)
                </span>
                <textarea
                  className="input min-h-20 resize-y"
                  maxLength={80}
                  value={order.candleNote}
                  onChange={(event) =>
                    dispatch(setCandleNote(event.target.value))
                  }
                  placeholder="Add a short note for the candle"
                />
                <p className="text-xs text-lavender-600">
                  Adds INR 10 if you enter a note.
                </p>
              </label>
            ) : null}
          </section>
        ) : null}

        <div ref={buttonAreaRef} className="flex justify-end">
          <div className="flex flex-col items-end gap-1.5">
            <p className="text-right text-xs text-lavender-600">
              For Daisy bouquet: tap &quot;Customize candle options&quot; first, or use Buy now. Otherwise use Buy now on a card.
            </p>
            <button
              className="btn-primary"
              type="button"
              disabled={!selectedProduct}
              onClick={handleNext}
            >
              {selectedProduct && shouldUseDesignStep(selectedProduct)
                ? "Next: Select Design"
                : "Add to Cart"}
            </button>
          </div>
        </div>

        {selectedProduct ? (
          <div className="fixed inset-x-4 bottom-4 z-40 sm:hidden">
            <button
              className="btn-primary w-full"
              type="button"
              onClick={handleNext}
            >
              {shouldUseDesignStep(selectedProduct)
                ? "Next: Select Design"
                : "Add to Cart"}
            </button>
          </div>
        ) : null}
      </div>

    </Layout>
  );
};