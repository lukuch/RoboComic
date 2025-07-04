// Get backend URL from environment or default to localhost
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function generateShow(params: {
  comedian1_style: string;
  comedian2_style: string;
  lang: string;
  mode: string;
  topic: string;
  num_rounds: number;
}) {
  const res = await fetch(`${BACKEND_URL}/generate-show`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Failed to generate show');
  return res.json();
}

export async function tts(text: string, lang: string) {
  const res = await fetch(`${BACKEND_URL}/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, lang }),
  });
  if (!res.ok) throw new Error('Failed to generate TTS');
  const blob = await res.blob();
  return URL.createObjectURL(blob);
} 