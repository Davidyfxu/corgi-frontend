// Common API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Transaction Types
export interface Transaction {
  transaction_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  country_code: string;
  user_id: string;
  timestamp?: string;
  fraud_score?: number;
  is_fraud?: boolean;
}

// A/B Test Types
export interface ABTest {
  testId: string;
  testName: string;
  controlModelVersion: string;
  treatmentModelVersion: string;
  holdoutPercentage: number;
  status: "active" | "paused" | "completed";
  createdAt: string;
  results?: ABTestResults;
}

export interface ABTestResults {
  totalTransactions: number;
  controlGroup: {
    transactions: number;
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
  };
  treatmentGroup: {
    transactions: number;
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
  };
  statisticalSignificance: boolean;
  winner?: "control" | "treatment" | "inconclusive";
}

// Inference Stats Types
// Inference Stats Types
export interface InferenceStats {
  total_inferences: number;
  avg_latency_ms: number;
  max_latency_ms: number;
  min_latency_ms: number;
  p95_latency_ms: number;
  p99_latency_ms: number;
  cache_hit_rate: number;
  sub_millisecond_rate: number;
  last24Hours?: {
    requests: number;
    avgLatency: number;
  };
  modelPerformance?: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
  };
}

// ETL Pipeline Types
export interface ETLJob {
  jobId: string;
  status: "pending" | "running" | "completed" | "failed";
  progress: number;
  startedAt?: string;
  completedAt?: string;
  recordsProcessed?: number;
  errors?: string[];
}

// File Upload Types
export interface FileUploadResult {
  filename: string;
  size: number;
  recordsProcessed: number;
  errors: string[];
  processingTime: number;
}

// Provider Types
export interface DataProvider {
  providerId: string;
  name: string;
  type: "webhook" | "polling" | "file";
  status: "active" | "inactive";
  lastSync?: string;
  config?: any;
}
