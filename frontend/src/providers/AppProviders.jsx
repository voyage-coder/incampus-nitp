import { GoogleOAuthProvider } from '@react-oauth/google';
import App from '../App';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export default function AppProviders() {
  if (!googleClientId) {
    return <App />;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <App />
    </GoogleOAuthProvider>
  );
}
