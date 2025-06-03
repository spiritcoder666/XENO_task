# PulseCRM - Mini CRM Platform

A modern CRM platform enabling customer segmentation, personalized campaign delivery, and intelligent insights.

## Features

- **Customer Segmentation**: Create flexible audience segments using a dynamic rule builder
- **Campaign Management**: Create, manage, and track campaign performance
- **AI-Powered Insights**: Generate segment rules from natural language, get message suggestions, and campaign analytics
- **Data Ingestion**: REST APIs for importing customer and order data
- **Authentication**: Secure access with Google OAuth 2.0

## Tech Stack

- **Frontend**: React.js with TypeScript
- **UI Framework**: Tailwind CSS for styling
- **State Management**: Zustand for global state
- **Animation**: Framer Motion for smooth transitions
- **Authentication**: Google OAuth integration
- **Charts**: Chart.js for data visualization
- **Icons**: Lucide React for icons
- **Date Handling**: date-fns for date formatting
- **AI Integration**: OpenAI API for natural language processing and insights

## Architecture

The application follows a modern React architecture with:

```
src/
├── components/        # Reusable UI components
│   ├── auth/          # Authentication components
│   ├── layout/        # Layout components (Header, Sidebar)
│   └── segments/      # Segment-specific components
├── layouts/           # Page layouts (Main, Auth)
├── pages/             # Application pages/routes
├── services/          # API services
├── stores/            # Zustand state stores
└── utils/             # Utility functions
```

### Data Flow

1. **Data Ingestion**: REST APIs handle validation and publish events to a message queue
2. **Data Processing**: Consumer services process events and persist data to the database
3. **Campaign Delivery**: Segments trigger campaigns through a vendor API
4. **Delivery Receipts**: Asynchronous updates via consumer-driven processes

## AI Features

The platform integrates AI in several ways:

1. **Natural Language to Segment Rules**: Convert plain English descriptions into logical rules
   - Implementation: OpenAI API to parse natural language and convert to structured rules

2. **AI-Driven Message Suggestions**: Generate message variants based on campaign objectives
   - Implementation: OpenAI API to create personalized message suggestions with image recommendations

3. **Campaign Performance Insights**: Generate human-readable summaries of campaign performance
   - Implementation: OpenAI API to analyze metrics and provide actionable insights

4. **Smart Scheduling Suggestions**: Recommend optimal send times based on customer activity
   - Implementation: Simulated activity pattern analysis with AI-enhanced recommendations

## Local Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/pulse-crm.git
   cd pulse-crm
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   VITE_API_URL=http://localhost:3000/api
   VITE_OPENAI_API_KEY=your_openai_api_key
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## API Documentation

The API documentation is available via Swagger UI at `/api-docs` when running the server.

### Main Endpoints:

- `POST /api/customers`: Create a new customer
- `POST /api/orders`: Create a new order
- `GET /api/segments`: Get all segments
- `POST /api/segments`: Create a new segment
- `POST /api/campaigns`: Create a new campaign
- `GET /api/campaigns/{id}/stats`: Get campaign statistics

## Limitations and Future Improvements

- **Message Queue**: Currently simulated; would use Kafka or RabbitMQ in production
- **Data Volume**: Demo handles limited data; would need optimization for large datasets
- **AI Rate Limits**: OpenAI API has rate limits; would need caching in production
- **Security**: Additional security measures would be needed for production
- **Testing**: More comprehensive test coverage would be implemented

## Deployment

The application is deployed at [Pulse_CRM_AT_NETLIFY](https://minicrmplatform.netlify.app/)

## License

MIT
