# Corgi Fraud Detection Frontend

A modern React-based frontend application for the Corgi Payment Fraud Detection System. This interface provides comprehensive access to all backend APIs with an intuitive, responsive design.

## 🚀 Features

### Core Functionality

- **ETL Pipeline Management**: Run data extraction, transformation, and loading processes
- **A/B Testing Framework**: Create and analyze fraud model performance tests
- **Data Ingestion**: Upload files, process webhooks, and trigger data polling
- **High-Frequency Fraud Detection**: Real-time and batch transaction analysis
- **System Dashboard**: Monitor performance metrics and system health

### Technical Features

- **Modern UI**: Built with React 19 + TypeScript
- **Responsive Design**: TailwindCSS for mobile-first styling
- **Real-time Feedback**: Toast notifications and loading states
- **API Integration**: Axios-based service layer with error handling
- **Component Architecture**: Modular, reusable components

## 🛠 Technology Stack

- **Framework**: React 19 with TypeScript
- **Styling**: TailwindCSS with custom component classes
- **Icons**: Heroicons for consistent iconography
- **HTTP Client**: Axios with interceptors
- **Notifications**: React Hot Toast
- **Build Tool**: Vite for fast development and building

## 📦 Installation

### Prerequisites

- Node.js 16+
- npm or yarn package manager
- Backend API running on `http://localhost:3000`

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Usage Guide

### API Configuration

The application is pre-configured to connect to:

- **Backend URL**: `http://localhost:3000/api`
- **API Key**: `demo-key-12345`

To modify these settings, edit `/src/services/api.ts`:

```typescript
const API_BASE_URL = "http://localhost:3000/api";
const API_KEY = "demo-key-12345";
```

### Main Features

#### 1. Dashboard

- System health monitoring
- Performance metrics overview
- Quick action buttons
- API documentation links

#### 2. ETL Pipeline

- **Data Source Selection**: Choose from Stripe, Square, PayPal, or Mock data
- **Record Limits**: Process 1-10,000 records per run
- **Real-time Progress**: Visual feedback during processing
- **Results Display**: Processing time, record counts, and status

#### 3. A/B Testing

- **Test Creation**: Configure model versions and traffic splits
- **Statistical Analysis**: View conversion rates and confidence levels
- **Results Tracking**: Monitor test performance over time
- **Holdout Groups**: Manage control groups for accurate testing

#### 4. Data Ingestion

- **File Upload**: Support for CSV, JSON, XML, TXT files (up to 10MB)
- **Webhook Processing**: Real-time webhook data handling
- **Data Polling**: Trigger manual data pulls from providers
- **Provider Management**: Support for multiple payment providers

#### 5. Fraud Detection

- **Fast Inference**: Sub-millisecond fraud scoring for single transactions
- **Batch Processing**: Efficient analysis of multiple transactions
- **Risk Assessment**: Comprehensive fraud scoring and decision making
- **Performance Statistics**: Real-time inference metrics

## 🎨 UI Components

### Custom Component Classes

```css
.btn-primary     /* Primary action buttons */
.btn-secondary   /* Secondary action buttons */
.btn-success     /* Success state buttons */
.btn-danger      /* Danger state buttons */
.card           /* Content containers */
.input-field    /* Form input styling */
.label          /* Form label styling */
```

### Color Scheme

- **Primary**: Blue (#3b82f6) for main actions and branding
- **Success**: Green (#22c55e) for positive feedback
- **Warning**: Yellow (#eab308) for cautionary states
- **Danger**: Red (#ef4444) for errors and critical actions

## 🔧 API Integration

### Service Layer (`/src/services/api.ts`)

Centralized API client with:

- Automatic error handling
- Request/response interceptors
- Type-safe interfaces
- Toast notification integration

### Example Usage

```typescript
import { apiService } from "../services/api";

// Run ETL Pipeline
const result = await apiService.runETLPipeline({
  source: "stripe",
  limit: 100,
});

// Perform fraud detection
const analysis = await apiService.performFastInference({
  transaction_id: "txn_123",
  amount: 150.0,
  currency: "USD",
  payment_method: "credit_card",
  country_code: "US",
  user_id: "user_123",
});
```

## 📱 Responsive Design

The application is fully responsive and optimized for:

- **Desktop**: Full-featured interface with sidebar navigation
- **Tablet**: Collapsible navigation with touch-friendly controls
- **Mobile**: Stacked layout with simplified navigation

## 🚨 Error Handling

### Client-Side Validation

- Form input validation with real-time feedback
- Transaction data validation before API calls
- File type and size validation for uploads

### API Error Handling

- Automatic error toast notifications
- Graceful fallback for failed requests
- Detailed error messages from backend

### User Feedback

- Loading states for all async operations
- Success/error notifications with context
- Progress indicators for long-running tasks

## 🔒 Security Features

- **API Key Authentication**: All requests include required API key
- **Input Sanitization**: Validation of all user inputs
- **CORS Configuration**: Proper cross-origin request handling
- **Error Information**: Limited error details in production

## 🚀 Performance Optimizations

- **Code Splitting**: Lazy loading for optimal bundle sizes
- **Memoization**: React hooks for expensive calculations
- **Debounced Inputs**: Reduced API calls during typing
- **Efficient Re-renders**: Optimized component updates

## 🧪 Testing

### Manual Testing Checklist

- [ ] Dashboard loads with system metrics
- [ ] ETL pipeline processes data successfully
- [ ] A/B test creation and results viewing
- [ ] File upload with various formats
- [ ] Webhook data processing
- [ ] Fast inference for single transactions
- [ ] Batch processing for multiple transactions
- [ ] Error handling for invalid inputs
- [ ] Responsive design on different screen sizes

### API Endpoints Tested

- `GET /api/fraud/health` - Health check
- `POST /api/fraud/etl/run` - ETL pipeline
- `POST /api/fraud/abtest/create` - A/B test creation
- `GET /api/fraud/abtest/:id/results` - A/B test results
- `POST /api/fraud/ingest/file` - File upload
- `POST /api/fraud/ingest/webhook/:id` - Webhook processing
- `POST /api/fraud/inference/fast` - Fast inference
- `POST /api/fraud/inference/batch` - Batch inference
- `GET /api/fraud/inference/stats` - Performance statistics

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Ensure backend server is running on port 3000
   - Check API key configuration
   - Verify CORS settings

2. **File Upload Failures**
   - Check file size (max 10MB)
   - Verify file format (CSV, JSON, XML, TXT)
   - Ensure proper internet connection

3. **Build Errors**
   - Run `npm install` to update dependencies
   - Clear node_modules and reinstall if needed
   - Check TypeScript configuration

## 📈 Future Enhancements

- Real-time dashboard updates with WebSocket
- Advanced charting for A/B test results
- Bulk transaction upload via drag-and-drop
- Export functionality for analysis results
- User authentication and role-based access
- Mobile app version using React Native

## 🤝 Contributing

1. Follow the existing code structure and naming conventions
2. Add TypeScript types for all new interfaces
3. Include proper error handling for API calls
4. Write responsive CSS using TailwindCSS classes
5. Test all new features manually before submission

## 📄 License

This project is part of the Corgi Payment Fraud Detection System. See the main project README for licensing information.
