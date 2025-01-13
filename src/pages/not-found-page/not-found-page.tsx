import { useNavigate } from 'react-router-dom';
import './not-found-page.css';

function NotFoundPage() {
  const navigate = useNavigate();
  const redirectToMainPage = () => {
    navigate('/');
  };

  return (
    <div className="not-found-page">
      <div className="content-wrapper">
        <h1 className="error-code">404</h1>
        <h2 className="error-message">Oops! Page not found.</h2>
        <p className="description">
          It looks like you&apos;ve traveled too far.
        </p>
        <button className="go-back-button" onClick={redirectToMainPage}>
          Go back to homepage
        </button>
      </div>
    </div>
  );
}

export default NotFoundPage;
