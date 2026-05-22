import "../../styles/PageLoader.css";

const PageLoader = () => {
  return (
    <div className="PageLoader">
      <div className="rm-loader">
        <div className="rm-spinner"></div>

        <h1 className="rm-name"></h1>

        <div className="rm-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;