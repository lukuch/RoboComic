import axios, { AxiosError } from 'axios';
import { 
  GenerateShowParams, 
  GenerateShowResponse, 
  Personas, 
  ApiError 
} from '../types';
import { API_CONFIG, ERROR_MESSAGES } from '../constants';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handler
function handleApiError(error: AxiosError): ApiError {
  if (error.response) {
    // Server responded with error status
    const responseData = error.response.data as any;
    return {
      message: responseData?.message || `HTTP ${error.response.status}: ${error.response.statusText}`,
      status: error.response.status,
    };
  } else if (error.request) {
    // Network error
    return {
      message: ERROR_MESSAGES.NETWORK_ERROR,
    };
  } else {
    // Other error
    return {
      message: error.message || ERROR_MESSAGES.UNEXPECTED_ERROR,
    };
  }
}

export async function generateShow(params: GenerateShowParams): Promise<GenerateShowResponse> {
  try {
    const { data } = await api.post<GenerateShowResponse>('/generate-show', params);
  return data;
  } catch (error) {
    throw handleApiError(error as AxiosError);
  }
}

export async function tts(text: string, lang: string): Promise<string> {
  try {
    const response = await api.post('/tts', { text, lang }, { 
      responseType: 'blob',
      timeout: API_CONFIG.TTS_TIMEOUT,
    });
    return URL.createObjectURL(response.data);
  } catch (error) {
    throw handleApiError(error as AxiosError);
  }
}

export async function fetchPersonas(): Promise<Personas> {
  try {
    const { data } = await api.get<Personas>('/personas');
  return data;
  } catch (error) {
    throw handleApiError(error as AxiosError);
  }
}

// Health check function
export async function healthCheck(): Promise<boolean> {
  try {
    await api.get('/health');
    return true;
  } catch (error) {
    return false;
  }
} 