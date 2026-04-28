import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { ScrollToTop } from './components/ScrollToTop';
import faviconDd from './data/Logos/favicon_dd.png';
import { fetchDesigns, selectDesignsStatus } from './features/designs/designsSlice';
import { fetchProducts, selectProductsStatus } from './features/products/productsSlice';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminDesignsPage } from './pages/AdminDesignsPage';
import { AdminProductsPage } from './pages/AdminProductsPage';
import { ContactUsPage } from './pages/ContactUsPage';
import { DesignSelectionPage } from './pages/DesignSelectionPage';
import { PreviewPage } from './pages/PreviewPage';
import { ProductPreviewPage } from './pages/ProductPreviewPage';
import { ProductSelectionPage } from './pages/ProductSelectionPage';

const App = () => {
  const [showIntro, setShowIntro] = useState(true);
  const dispatch = useAppDispatch();
  const designsStatus = useAppSelector(selectDesignsStatus);
  const productsStatus = useAppSelector(selectProductsStatus);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setShowIntro(false);
    }, 4000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, []);

  useEffect(() => {
    if (productsStatus === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, productsStatus]);

  useEffect(() => {
    if (designsStatus === 'idle') {
      dispatch(fetchDesigns());
    }
  }, [dispatch, designsStatus]);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {showIntro ? (
        <div className="intro-splash" aria-hidden="true">
          <div className="intro-cloud intro-cloud-left" />
          <div className="intro-cloud intro-cloud-right" />
          <div className="intro-brand">
            <div className="intro-rain" aria-hidden="true">
              {Array.from({ length: 18 }).map((_, index) => (
                <span
                  key={index}
                  className="intro-drop"
                  style={{
                    left: `${(index * 17) % 100}%`,
                    height: `${12 + (index % 6) * 5}px`,
                    animationDelay: `${(index % 7) * 0.15}s`,
                    animationDuration: `${0.8 + (index % 5) * 0.18}s`
                  }}
                />
              ))}
            </div>
            <img src={faviconDd} alt="Dreamy Clouds By Daisy" className="intro-logo" />
            <p className="intro-brand-title">Dreamy Clouds By Daisy</p>
          </div>
        </div>
      ) : null}

      <div className="clouds-layer" aria-hidden="true">
        <span className="cloud cloud-sm cloud-a" />
        <span className="cloud cloud-md cloud-b" />
        <span className="cloud cloud-lg cloud-c" />
        <span className="cloud cloud-sm cloud-d" />
        <span className="cloud cloud-md cloud-e" />
        <span className="cloud cloud-lg cloud-f" />
        <span className="cloud cloud-sm cloud-g" />
        <span className="cloud cloud-md cloud-h" />
        <span className="cloud cloud-lg cloud-i" />
      </div>

      <div className="relative z-10">
        <ScrollToTop />
        <Routes>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/designs" element={<AdminDesignsPage />} />
          <Route path="/" element={<ProductSelectionPage />} />
          <Route path="/product/:productId" element={<ProductPreviewPage />} />
          <Route path="/design" element={<DesignSelectionPage />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/contact-us" element={<ContactUsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
