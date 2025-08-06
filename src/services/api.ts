import axios from "axios";

// API Configuration
const API_BASE_URL = "https://corgi-api.zeabur.app/api";
const API_KEY = "demo-key-12345"; // Demo API key from backend

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
  },
  timeout: 10000,
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log("API Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// API Service Functions
export const fraudAPI = {
  // Health Check
  healthCheck: () => api.get("/fraud/health"),

  // ETL Pipeline
  runETLPipeline: (data: any) => api.post("/fraud/etl/run", data),

  // A/B Testing
  createABTest: (testData: {
    testName: string;
    controlModelVersion: string;
    treatmentModelVersion: string;
    holdoutPercentage: number;
  }) => api.post("/fraud/abtest/create", testData),

  getABTestResults: (testId: string) =>
    api.get(`/fraud/abtest/${testId}/results`),

  processPaymentWithABTest: (paymentData: any) =>
    api.post("/fraud/process", paymentData),

  // Data Ingestion
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append("dataFile", file);
    formData.append("providerId", "test_provider");
    return api.post("/fraud/ingest/file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  processWebhook: (providerId: string, webhookData: any) =>
    api.post(`/fraud/ingest/webhook/${providerId}`, webhookData),

  triggerDataPolling: (providerId: string) =>
    api.post(`/fraud/ingest/poll/${providerId}`),

  // High-Frequency Inference
  performFastInference: (transactionData: {
    transaction_id: string;
    amount: number;
    currency: string;
    payment_method: string;
    country_code: string;
    user_id: string;
  }) => api.post("/fraud/inference/fast", transactionData),

  performBatchInference: (batchData: any[]) =>
    api.post("/fraud/inference/batch", { transactions: batchData }),

  getInferenceStats: () => api.get("/fraud/inference/stats"),

  // Documentation
  getAPIDocs: () => axios.get("http://localhost:3000/api/docs"),
};

export default api;
