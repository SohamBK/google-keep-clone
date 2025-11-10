import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <main>
      <h1>404 - Not Found</h1>
      <p>The page you were looking for doesn't exist.</p>
      <Link to="/">Go back to home</Link>
    </main>
  );
};

export default NotFound;
