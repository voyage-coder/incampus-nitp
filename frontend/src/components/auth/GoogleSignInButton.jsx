import { GoogleLogin } from '@react-oauth/google';
import Button from '../ui/Button';
import { cn } from '../../utils/cn';

export default function GoogleSignInButton({
  onSuccess,
  onError,
  disabled = false,
  loading = false,
  className,
  text = 'continue_with',
}) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return null;
  }

  if (loading) {
    return (
      <Button variant="secondary" className="w-full" loading disabled>
        Signing in with Google…
      </Button>
    );
  }

  return (
    <div
      className={cn(
        'flex justify-center [&>div]:w-full [&_iframe]:!mx-auto',
        disabled && 'pointer-events-none opacity-60',
        className
      )}
    >
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
        theme="outline"
        size="large"
        text={text}
        shape="pill"
      />
    </div>
  );
}
