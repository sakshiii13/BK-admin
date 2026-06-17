import "../../styles/PageLoader.css";

const PageLoader = () => {
  return (
    <div className="PageLoader">
      <div className="rm-loader">
        {/* Animated Logo/Spinner */}
        <div className="rm-logo-wrapper">
          <div className="rm-ring-outer"></div>
          <div className="rm-ring-inner"></div>
          <div className="rm-center-dot"></div>
        </div>

        {/* Brand Name */}
        <h1 className="rm-name">BK-Grocery</h1>

        {/* Loading Dots */}
        <div className="rm-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Loading Text */}
        <div className="rm-loading-text">LOADING</div>
      </div>
    </div>
  );
};

export default PageLoader;