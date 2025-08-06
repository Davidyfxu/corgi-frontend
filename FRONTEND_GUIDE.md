# Corgi Frontend - Fraud Detection Dashboard

A modern React frontend for the Corgi Node fraud detection API, built with React, TypeScript, Ant Design, and Tailwind CSS.

## 🚀 Features

### 1. **Dashboard** 📊

- Real-time system health monitoring
- Key performance metrics (requests, latency, throughput, error rate)
- Model performance visualization (accuracy, precision, recall, F1 score)
- System status and activity timeline

### 2. **Fraud Tester** 🔍

- **Single Transaction Testing**: Test individual transactions for fraud detection
- **Batch Processing**: Process multiple transactions simultaneously
- **Random Data Generation**: Generate realistic test data
- **Real-time Results**: Instant fraud scoring and risk assessment

### 3. **A/B Testing** 🧪

- Create and manage A/B tests for model comparison
- Compare control vs treatment model performance
- Statistical significance analysis
- Detailed performance metrics and recommendations

### 4. **Data Management** 📊

- **File Upload**: Drag-and-drop CSV/JSON/XML/TXT file processing
- **ETL Pipeline Control**: Trigger Extract, Transform, Load operations
- **Webhook Integration**: Test webhook processing with external providers
- **Data Polling**: Manually trigger data polling from sources

## 🛠️ Technology Stack

- **React 19** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Ant Design 5** - Professional UI component library
- **Tailwind CSS 4** - Utility-first CSS framework
- **Axios** - HTTP client for API communication
- **React Router** - Client-side routing
- **React Hot Toast** - Elegant notifications
- **Heroicons** - Beautiful SVG icons
- **Vite** - Fast build tool and dev server

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- The Corgi Node API running on `http://localhost:3000`

### Installation & Setup

1. **Install dependencies**:

   ```bash
   cd corgi_frontend
   pnpm install
   ```

2. **Start the development server**:

   ```bash
   pnpm dev
   ```

3. **Access the application**:
   Open [http://localhost:5173](http://localhost:5173) in your browser

### API Configuration

The frontend is configured to connect to the Corgi Node API at `http://localhost:3000/api` with demo API key `demo-key-12345`.

To modify the API configuration, edit `/src/services/api.ts`:

```typescript
const API_BASE_URL = "http://localhost:3000/api";
const API_KEY = "demo-key-12345";
```

## 📱 Usage Guide

### Dashboard

- View real-time system metrics and health status
- Monitor fraud detection model performance
- Check system activity and recent events

### Testing Fraud Detection

1. Navigate to **Fraud Tester**
2. Fill in transaction details or use "Generate Random" for test data
3. Click "Run Fraud Check" to get instant fraud scoring
4. Use "Run Batch Fraud Check" to test multiple transactions

### A/B Testing

1. Go to **A/B Testing**
2. Create a new test with control and treatment model versions
3. Set holdout percentage for traffic allocation
4. View results to compare model performance

### Data Management

1. Visit **Data Management**
2. Upload files via drag-and-drop interface
3. Trigger ETL pipelines for data processing
4. Test webhook integrations and data polling

## 🎨 UI Components

### Layout

- **Collapsible Sidebar**: Navigation with icons and labels
- **Header**: System branding and navigation controls
- **Content Area**: Main application content with proper spacing

### Key Components

- **Cards**: Information containers with consistent styling
- **Forms**: Validated input forms with proper error handling
- **Tables**: Data presentation with sorting and pagination
- **Modals**: Detailed information overlays
- **Progress Bars**: Visual progress indicators
- **Notifications**: Toast messages for user feedback

## 🔧 Development

### Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.tsx    # Main dashboard
│   ├── FraudTester.tsx  # Fraud testing interface
│   ├── ABTesting.tsx    # A/B testing management
│   └── DataManagement.tsx # Data operations
├── services/
│   └── api.ts          # API client and endpoints
├── types/
│   └── index.ts        # TypeScript type definitions
├── App.tsx             # Main app component with routing
└── main.tsx            # Application entry point
```

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

### API Integration

All API calls are centralized in `/src/services/api.ts` with:

- Axios interceptors for request/response logging
- Error handling and timeout configuration
- Type-safe API functions for all endpoints

## 🎯 API Endpoints Used

| Endpoint                                 | Purpose                            |
| ---------------------------------------- | ---------------------------------- |
| `GET /fraud/health`                      | System health check                |
| `POST /fraud/inference/fast`             | Single transaction fraud detection |
| `POST /fraud/inference/batch`            | Batch fraud detection              |
| `GET /fraud/inference/stats`             | Performance statistics             |
| `POST /fraud/abtest/create`              | Create A/B test                    |
| `GET /fraud/abtest/:id/results`          | Get A/B test results               |
| `POST /fraud/etl/run`                    | Run ETL pipeline                   |
| `POST /fraud/ingest/file`                | Upload and process files           |
| `POST /fraud/ingest/webhook/:providerId` | Process webhooks                   |
| `POST /fraud/ingest/poll/:providerId`    | Trigger data polling               |

## 🎨 Styling

The application uses a combination of:

- **Ant Design components** for UI consistency
- **Tailwind CSS** for custom styling and layout
- **Responsive design** that works on desktop and mobile
- **Dark/light theme support** via Ant Design's theme system

## 🔒 Security Features

- API key authentication
- Request/response logging
- Error boundary handling
- Input validation on all forms
- Secure file upload restrictions

## 🚀 Production Deployment

1. **Build the application**:

   ```bash
   pnpm build
   ```

2. **Deploy the `dist` folder** to your web server

3. **Configure API endpoints** for your production environment

## 📞 Support

For issues or questions about the frontend:

1. Check the browser console for error messages
2. Verify API connectivity to `http://localhost:3000`
3. Ensure all required dependencies are installed
4. Check the Corgi Node API documentation for endpoint details
