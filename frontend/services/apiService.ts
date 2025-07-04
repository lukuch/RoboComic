import axios from 'axios';

const BACKEND_URL = process.env.PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function generateShow(params: {
  comedian1_style: string;
  comedian2_style: string;
  lang: string;
  mode: string;
  topic: string;
  num_rounds: number;
}) {
  const { data } = await axios.post(`${BACKEND_URL}/generate-show`, params);
  return data;
}

export async function tts(text: string, lang: string) {
  const res = await axios.post(`${BACKEND_URL}/tts`, { text, lang }, { responseType: 'blob' });
  return URL.createObjectURL(res.data);
}

export async function fetchPersonas() {
  const { data } = await axios.get(`${BACKEND_URL}/personas`);
  return data;
} 