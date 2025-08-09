# Automobile Data Insights - Enhanced Frontend

A modern, responsive React frontend for analyzing automobile datasets using natural language queries powered by Mistral AI.

## Features

### 🎨 Modern UI/UX
- **Dark/Light Mode**: Toggle between themes with persistent localStorage
- **Responsive Design**: Optimized for desktop and mobile devices
- **Smooth Animations**: Framer Motion animations and micro-interactions
- **Loading States**: Skeleton loaders for better user experience

### 📊 Advanced Analytics
- **Multiple Chart Types**: Support for bar, line, scatter, histogram, and pie charts
- **Interactive Charts**: Built with Chart.js and react-chartjs-2
- **Export Capabilities**: Download charts as PNG and data as CSV
- **Real-time Analysis**: Natural language query processing

### 🔄 Query Management
- **Query History**: Keep track of up to 10 recent queries
- **Quick Examples**: Pre-built example queries for easy testing
- **Tab-like Interface**: Switch between different analysis results
- **Auto-fill**: Click examples to populate the input field

### 🛠 Technical Features
- **TypeScript**: Full type safety throughout the application
- **Modern React**: Functional components with hooks
- **Modular Architecture**: Clean component separation
- **Error Handling**: Comprehensive error states and toast notifications
- **Environment Variables**: Configurable API endpoints

## Project Structure

```
src/
├── components/
│   ├── ChartDisplay.tsx          # Original chart display (Plotly)
│   ├── ModernChartDisplay.tsx    # Enhanced chart display (Chart.js)
│   ├── DatasetPreview.tsx        # Dataset preview table
│   ├── ExampleQueries.tsx        # Sidebar example queries
│   ├── LoadingSkeleton.tsx       # Loading state components
│   ├── ModernQueryInput.tsx      # Enhanced query input
│   ├── Navbar.tsx               # Top navigation bar
│   ├── QueryHistory.tsx         # Query history sidebar
│   └── QueryInput.tsx           # Original query input
├── hooks/
│   ├── useQueryHistory.ts       # Query history management
│   └── useTheme.ts             # Theme management
├── services/
│   ├── api.ts                  # Original API service
│   └── modernApi.ts            # Enhanced API service
└── types/
    └── react-plotly.d.ts       # Plotly type definitions
```

## Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## API Integration

The frontend is designed to work with your existing backend API. It maintains backward compatibility while adding enhanced features:

### Existing Endpoints (Maintained)
- `GET /api/health` - Health check
- `POST /api/initialize` - Initialize application
- `GET /api/dataset-info` - Get dataset information
- `POST /api/analyze` - Analyze natural language queries
- `POST /api/download-data` - Download processed data
- `GET /api/example-queries` - Get example queries

### Expected Response Format
```typescript
interface AnalysisResult {
  success: boolean;
  analysis: {
    chart: string;
    x: string;
    y?: string;
    agg?: string;
  };
  chart_data: any; // Plotly format or base64 image
  processed_data: any[];
  summary: string;
  data_points: number;
  error?: string;
}
```

## Usage

### Basic Query Flow
1. Enter a natural language query (e.g., "Show average price by brand")
2. Select chart library (Plotly or Matplotlib)
3. Click "Analyze" to process the query
4. View results with interactive charts and data tables
5. Export charts as PNG or data as CSV

### Advanced Features
- **Theme Toggle**: Click the moon/sun icon in the navbar
- **Query History**: Click "History" to view and switch between past queries
- **Quick Examples**: Use sidebar examples or click quick example buttons
- **Export Options**: Download charts and data using the export buttons

## Customization

### Theming
The application supports full dark/light mode theming. Customize colors in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      // Add custom colors here
    }
  }
}
```

### Chart Styling
Modify chart appearance in `ModernChartDisplay.tsx`:

```typescript
const chartOptions = {
  // Customize chart options
  plugins: {
    legend: {
      // Legend styling
    }
  }
}
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- **Bundle Size**: Optimized with tree shaking
- **Loading**: Skeleton loaders for perceived performance
- **Animations**: Hardware-accelerated CSS animations
- **Caching**: LocalStorage for theme and history persistence

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.