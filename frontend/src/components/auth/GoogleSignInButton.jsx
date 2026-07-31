import { GoogleLogin } from '@react-oauth/google';
import { cn } from '../../utils/cn';

export default function GoogleSignInButton({
  onSuccess,
  onError,
  disabled = false,
  className,
  text = 'continue_with',
}) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return null;
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
