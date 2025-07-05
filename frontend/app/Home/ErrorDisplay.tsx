interface ErrorDisplayProps {
  error: string | null;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  if (!error) return null;

  return (
    <div className="text-red-600 text-center mt-4 font-semibold">{error}</div>
  );
} 