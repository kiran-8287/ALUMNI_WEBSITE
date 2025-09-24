import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./NotFoundPage.css"; // for styles

const NotFoundPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect after 3 seconds
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="not-found-page">
      <h1>Page Not Found</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Redirecting to home page...</p>
      </div>
    </div>
  );
};

export default NotFoundPage;