import { CSSProperties, ImgHTMLAttributes, useState } from 'react';

interface LazyImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'loading'> {
  wrapperClassName?: string;
  imgClassName?: string;
  imgStyle?: CSSProperties;
  showShimmer?: boolean;
}

export const LazyImage = ({
  wrapperClassName = '',
  imgClassName = '',
  imgStyle,
  onLoad,
  showShimmer = false,
  ...props
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      {showShimmer && !isLoaded ? <div className="shimmer-skeleton absolute inset-0" aria-hidden="true" /> : null}
      <img
        {...props}
        loading="lazy"
        decoding="async"
        onLoad={(event) => {
          setIsLoaded(true);
          onLoad?.(event);
        }}
        className={`${imgClassName} ${showShimmer ? `transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}` : 'opacity-100'}`}
        style={imgStyle}
      />
    </div>
  );
};
