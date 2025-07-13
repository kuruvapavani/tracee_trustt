// QRCodeRedirectHandler.jsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function QRCodeRedirectHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      navigate(`/consumer?code=${code}`);
    } else {
      navigate("/"); // fallback to home
    }
  }, [navigate, searchParams]);

  return null; // or loading spinner
}
