import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-primary/20 bg-primary-soft/40 px-6 py-12 text-center">
      <AlertCircle className="mb-3 h-8 w-8 text-primary" />
      <p className="max-w-md text-sm font-medium text-ink">
        {message || 'Failed to load data'}
      </p>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          className="mt-4"
          onClick={onRetry}
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </Button>
      )}
    </div>
  );
}
