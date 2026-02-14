# Design: AI Local Event & Festival Content Maker

## 1. Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Web UI     │  │  Mobile Web  │  │  API Clients │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Rate Limiting │ Auth │ Request Validation │ CORS    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Content    │  │    Speech    │  │    Admin     │      │
│  │  Generator   │  │  Generator   │  │   Service    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Personalize  │  │   Safety     │  │  Analytics   │      │
│  │   Service    │  │   Filter     │  │   Service    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Festival   │  │  Templates   │  │    User      │      │
│  │     DB       │  │     DB       │  │  Requests    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │    Cache     │  │  Analytics   │                         │
│  │   (Redis)    │  │     DB       │                         │
│  └──────────────┘  └──────────────┘                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   AI/LLM     │  │  Translation │  │     PDF      │      │
│  │   Service    │  │   Service    │  │  Generator   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Technology Stack

**Frontend**:
- React/Next.js for web UI
- TailwindCSS for styling
- React Query for data fetching
- Zustand for state management

**Backend**:
- Node.js/TypeScript
- Express.js or Fastify for API
- Serverless deployment (AWS Lambda/Vercel Functions)

**Database**:
- PostgreSQL for structured data (festivals, templates, users)
- Redis for caching and rate limiting
- S3 for file storage (PDFs, exports)

**AI/ML**:
- OpenAI API or similar LLM service
- Custom prompt templates
- Fallback to template-based generation

**Infrastructure**:
- AWS Lambda or Vercel for serverless
- CloudFront/CDN for static assets
- CloudWatch/Datadog for monitoring

## 2. Component Design

### 2.1 Content Generator Service

**Responsibilities**:
- Orchestrate content generation workflow
- Select appropriate templates based on festival/tone/platform
- Call AI service with structured prompts
- Apply personalization
- Return formatted content

**Key Methods**:
```typescript
generateWishes(params: WishParams): Promise<WishResponse>
generateSocialPosts(params: SocialParams): Promise<SocialResponse>
generateBannerText(params: BannerParams): Promise<BannerResponse>
```

### 2.2 Speech Generator Service

**Responsibilities**:
- Generate speeches based on duration and role
- Structure speech with opening, body, closing
- Ensure word count matches duration
- Apply appropriate tone for role

**Key Methods**:
```typescript
generateSpeech(params: SpeechParams): Promise<SpeechResponse>
estimateDuration(text: string): number
```

### 2.3 Personalization Service

**Responsibilities**:
- Inject personalization fields into content
- Validate personalization inputs
- Handle missing/empty fields gracefully
- Maintain natural language flow

**Key Methods**:
```typescript
personalize(content: string, fields: PersonalizationFields): string
validateFields(fields: PersonalizationFields): ValidationResult
```

### 2.4 Safety Filter Service

**Responsibilities**:
- Check inputs for profanity and inappropriate content
- Apply religion-sensitive content rules
- Flag content for human review
- Maintain blocklists and moderation rules

**Key Methods**:
```typescript
filterInput(text: string): FilterResult
filterOutput(content: Content): FilterResult
flagForReview(content: Content, reason: string): void
```

### 2.5 Admin Service

**Responsibilities**:
- Manage festivals and templates
- Handle translations
- Invalidate caches on updates
- Provide preview functionality

**Key Methods**:
```typescript
addFestival(festival: Festival): Promise<Festival>
updateTemplates(festivalId: string, templates: Templates): Promise<void>
addTranslation(festivalId: string, language: string, translation: string): Promise<void>
```

### 2.6 Analytics Service

**Responsibilities**:
- Log requests and responses
- Track usage metrics
- Calculate latency percentiles
- Generate reports

**Key Methods**:
```typescript
logRequest(request: Request, response: Response, latency: number): void
getMetrics(timeRange: TimeRange): Metrics
```

### 2.7 Export Service

**Responsibilities**:
- Generate TXT files
- Generate formatted PDFs
- Handle file storage and retrieval
- Provide download URLs

**Key Methods**:
```typescript
exportToTxt(content: Content): string
exportToPdf(content: Content): Promise<Buffer>
generateDownloadUrl(fileId: string): string
```

## 3. Data Models

### 3.1 Festival Schema

```typescript
interface Festival {
  id: string;
  name: string;
  slug: string;
  date: string; // ISO date or "seasonal"
  region: string[];
  religion: string;
  translations: Record<Language, string>;
  templates: Record<Tone, string[]>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### 3.2 Request Schema

```typescript
interface ContentRequest {
  id: string;
  userId?: string;
  festival: string;
  language: Language;
  tones: Tone[];
  platforms: Platform[];
  personalization: PersonalizationFields;
  createdAt: Date;
  ipAddress: string;
  userAgent: string;
}

interface PersonalizationFields {
  name?: string;
  organization?: string;
  city?: string;
  audienceAge?: string;
}
```

### 3.3 Response Schema

```typescript
interface ContentResponse {
  requestId: string;
  festival: string;
  content: {
    wishes?: Record<Tone, string[]>;
    social?: {
      whatsapp?: string[];
      instagram?: InstagramContent;
      facebook?: FacebookContent;
    };
    banner?: BannerContent;
  };
  latency: number;
  cached: boolean;
}

interface InstagramContent {
  captions: string[];
  hashtags: {
    trending: string[];
    niche: string[];
  };
}

interface FacebookContent {
  short: string[];
  long: string[];
}

interface BannerContent {
  headline: string;
  subheadline: string;
}
```

### 3.4 Speech Schema

```typescript
interface SpeechRequest {
  id: string;
  event: string;
  duration: number; // seconds
  role: SpeechRole;
  language: Language;
  personalization: PersonalizationFields;
  createdAt: Date;
}

interface SpeechResponse {
  requestId: string;
  speech: {
    text: string;
    wordCount: number;
    estimatedDuration: number;
    sections: {
      opening: string;
      body: string;
      closing: string;
    };
  };
}

type SpeechRole = 'principal' | 'host' | 'student';
```

### 3.5 Template Schema

```typescript
interface Template {
  id: string;
  festivalId: string;
  tone: Tone;
  platform: Platform;
  language: Language;
  content: string; // Template with placeholders
  variables: string[]; // List of available variables
  examples: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### 3.6 User Schema

```typescript
interface User {
  id: string;
  email?: string;
  apiKey: string;
  preferences: {
    defaultLanguage: Language;
    defaultOrganization?: string;
    defaultCity?: string;
  };
  usage: {
    requestCount: number;
    lastRequestAt: Date;
  };
  createdAt: Date;
}
```

### 3.7 Analytics Schema

```typescript
interface AnalyticsEvent {
  id: string;
  eventType: 'content_generated' | 'speech_generated' | 'export' | 'error';
  requestId: string;
  festival: string;
  language: Language;
  tones: Tone[];
  platforms: Platform[];
  latency: number;
  cached: boolean;
  timestamp: Date;
}
```

## 4. API Endpoints

### 4.1 Content Generation

```
POST /api/v1/generate
Authorization: Bearer <api_key>
Content-Type: application/json

Request:
{
  "festival": "diwali",
  "language": "english",
  "tones": ["formal", "friendly"],
  "platforms": ["whatsapp", "instagram"],
  "personalization": {
    "name": "Priya",
    "organization": "ABC Corp"
  }
}

Response: 200 OK
{
  "requestId": "req_abc123",
  "festival": "diwali",
  "content": { ... },
  "latency": 1.2
}

Errors:
400 - Invalid request parameters
401 - Invalid API key
429 - Rate limit exceeded
500 - Internal server error
```

### 4.2 Speech Generation

```
POST /api/v1/generate-speech
Authorization: Bearer <api_key>

Request:
{
  "event": "annual-day",
  "duration": 60,
  "role": "principal",
  "language": "english",
  "personalization": { ... }
}

Response: 200 OK
{
  "requestId": "req_xyz789",
  "speech": { ... }
}
```

### 4.3 Export

```
POST /api/v1/export
Authorization: Bearer <api_key>

Request:
{
  "requestId": "req_abc123",
  "format": "pdf"
}

Response: 200 OK
{
  "downloadUrl": "https://...",
  "expiresAt": "2024-01-15T10:00:00Z"
}
```

### 4.4 Admin - List Festivals

```
GET /api/v1/admin/festivals
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "festivals": [
    {
      "id": "fest_001",
      "name": "Diwali",
      "slug": "diwali",
      ...
    }
  ]
}
```

### 4.5 Admin - Add Festival

```
POST /api/v1/admin/festivals
Authorization: Bearer <admin_token>

Request:
{
  "name": "Pongal",
  "date": "2024-01-15",
  "region": ["South India"],
  "religion": "Hindu",
  "translations": { ... },
  "templates": { ... }
}

Response: 201 Created
{
  "festival": { ... }
}
```

### 4.6 Admin - Update Templates

```
PUT /api/v1/admin/festivals/:festivalId/templates
Authorization: Bearer <admin_token>

Request:
{
  "tone": "formal",
  "platform": "whatsapp",
  "language": "english",
  "content": "...",
  "variables": ["name", "organization"]
}

Response: 200 OK
```

### 4.7 Analytics

```
GET /api/v1/admin/analytics
Authorization: Bearer <admin_token>
Query: ?startDate=2024-01-01&endDate=2024-01-31

Response: 200 OK
{
  "metrics": {
    "totalRequests": 5000,
    "festivalBreakdown": { ... },
    "languageBreakdown": { ... },
    "toneBreakdown": { ... },
    "latency": {
      "p50": 1.2,
      "p95": 2.8,
      "p99": 4.1
    }
  }
}
```

## 5. UI Wireframes (Textual)

### 5.1 Main Content Generation Page

```
┌─────────────────────────────────────────────────────────┐
│  Festival Content Maker                    [Login] [API] │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Step 1: Choose Festival                                 │
│  ┌─────────────────────────────────────────────────┐    │
│  │ [Diwali ▼]                                       │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
│  Step 2: Select Language                                 │
│  ┌─────────────────────────────────────────────────┐    │
│  │ [English ▼]                                      │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
│  Step 3: Choose Tones (select multiple)                  │
│  [ ] Formal  [✓] Friendly  [✓] Funny                    │
│  [ ] Inspirational  [ ] Spiritual                        │
│                                                           │
│  Step 4: Select Platforms                                │
│  [✓] WhatsApp  [✓] Instagram  [ ] Facebook  [ ] Banner  │
│                                                           │
│  Step 5: Personalize (optional)                          │
│  Name: [_____________]  Organization: [_____________]    │
│  City: [_____________]                                   │
│                                                           │
│  [Generate Content]                                      │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 5.2 Results Page

```
┌─────────────────────────────────────────────────────────┐
│  ← Back to Generator                [Copy All] [Export]  │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Diwali Content - English                                │
│                                                           │
│  ━━━ Friendly Wishes ━━━                                 │
│  1. May this Diwali bring joy...        [Copy]           │
│  2. Wishing you a bright and...         [Copy]           │
│  3. Happy Diwali! May your...           [Copy]           │
│  4. Celebrate this festival...          [Copy]           │
│  5. Sending warm wishes...              [Copy]           │
│                                                           │
│  ━━━ Funny Wishes ━━━                                    │
│  1. May your Diwali be as...            [Copy]           │
│  2. Hope your sweets are...             [Copy]           │
│  ...                                                      │
│                                                           │
│  ━━━ WhatsApp Posts ━━━                                  │
│  1. 🪔 Happy Diwali! ...                [Copy]           │
│  2. ✨ Wishing everyone...              [Copy]           │
│  3. 🎆 May the festival...              [Copy]           │
│                                                           │
│  ━━━ Instagram Content ━━━                               │
│  Caption 1: Celebrating the...          [Copy]           │
│  Hashtags: #Diwali2024 #FestivalOfLights...              │
│                                                           │
│  Caption 2: Light up your...            [Copy]           │
│  Hashtags: #DiwaliVibes #DiwaliDecor...                  │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 5.3 Speech Generator Page

```
┌─────────────────────────────────────────────────────────┐
│  Speech Generator                      [Back to Main]    │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Event Type                                              │
│  ┌─────────────────────────────────────────────────┐    │
│  │ [Annual Day ▼]                                   │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
│  Speech Duration                                         │
│  ( ) 30-45 seconds  (•) 60 seconds  ( ) 90 seconds      │
│                                                           │
│  Speaker Role                                            │
│  ( ) Principal  (•) Host  ( ) Student                    │
│                                                           │
│  Language                                                │
│  ┌─────────────────────────────────────────────────┐    │
│  │ [English ▼]                                      │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
│  Personalization                                         │
│  Organization: [ABC School_____________]                 │
│  City: [Mumbai_____________]                             │
│                                                           │
│  [Generate Speech]                                       │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 5.4 Admin Dashboard

```
┌─────────────────────────────────────────────────────────┐
│  Admin Dashboard                           [Logout]      │
├─────────────────────────────────────────────────────────┤
│  [Festivals] [Templates] [Analytics] [Moderation]        │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Festivals                              [+ Add Festival] │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Diwali                    [Edit] [Translations]  │    │
│  │ Date: Oct-Nov | Region: India | Active: ✓       │    │
│  ├─────────────────────────────────────────────────┤    │
│  │ Holi                      [Edit] [Translations]  │    │
│  │ Date: Mar | Region: India | Active: ✓           │    │
│  ├─────────────────────────────────────────────────┤    │
│  │ Christmas                 [Edit] [Translations]  │    │
│  │ Date: Dec 25 | Region: Global | Active: ✓       │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
│  Quick Stats                                             │
│  Total Requests Today: 1,234                             │
│  Avg Latency: 1.3s                                       │
│  Top Festival: Diwali (45%)                              │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

## 6. Sequence Diagrams

### 6.1 Content Generation Flow

```
User -> WebUI: Select festival, language, tones, platforms
WebUI -> API Gateway: POST /api/v1/generate
API Gateway -> Auth: Validate API key
Auth -> API Gateway: Valid
API Gateway -> Rate Limiter: Check rate limit
Rate Limiter -> API Gateway: OK
API Gateway -> Content Generator: Generate content
Content Generator -> Cache: Check cache
Cache -> Content Generator: Cache miss
Content Generator -> Safety Filter: Validate inputs
Safety Filter -> Content Generator: Inputs OK
Content Generator -> Template Service: Get templates
Template Service -> Content Generator: Templates
Content Generator -> AI Service: Generate with prompts
AI Service -> Content Generator: Generated content
Content Generator -> Personalization: Apply personalization
Personalization -> Content Generator: Personalized content
Content Generator -> Safety Filter: Validate outputs
Safety Filter -> Content Generator: Outputs OK
Content Generator -> Cache: Store in cache
Content Generator -> Analytics: Log request
Content Generator -> API Gateway: Return response
API Gateway -> WebUI: 200 OK with content
WebUI -> User: Display results
```

### 6.2 Admin Festival Addition Flow

```
Admin -> Admin UI: Add new festival form
Admin UI -> API Gateway: POST /api/v1/admin/festivals
API Gateway -> Auth: Validate admin token
Auth -> API Gateway: Valid admin
API Gateway -> Admin Service: Create festival
Admin Service -> Database: Insert festival
Database -> Admin Service: Festival created
Admin Service -> Template Service: Create default templates
Template Service -> Database: Insert templates
Admin Service -> Cache: Invalidate festival cache
Admin Service -> API Gateway: Success
API Gateway -> Admin UI: 201 Created
Admin UI -> Admin: Show success message
```

## 7. Caching Strategy

### 7.1 Cache Keys

```
content:{festival}:{language}:{tones}:{platforms}
speech:{event}:{duration}:{role}:{language}
festival:list
templates:{festivalId}:{tone}:{platform}:{language}
```

### 7.2 Cache TTL

- Content responses: 1 hour
- Speech responses: 30 minutes
- Festival list: 5 minutes (invalidated on admin updates)
- Templates: 10 minutes (invalidated on admin updates)

### 7.3 Cache Invalidation

- On admin festival/template updates: Invalidate related keys
- On content safety flag: Remove from cache
- Manual purge option in admin UI

## 8. Performance Optimization

### 8.1 Latency Targets

- API response time (p50): ≤ 1.5s
- API response time (p95): ≤ 3s
- UI first contentful paint: ≤ 1s
- Time to interactive: ≤ 2s

### 8.2 Optimization Strategies

**Backend**:
- Aggressive caching of common requests
- Parallel AI service calls for multiple tones
- Connection pooling for database
- Async processing for analytics logging
- CDN for static assets

**Frontend**:
- Code splitting and lazy loading
- Optimistic UI updates
- Debounced input validation
- Progressive enhancement
- Service worker for offline support

**AI Service**:
- Batch requests when possible
- Use streaming responses for long content
- Fallback to template-based generation on timeout
- Pre-generate common combinations

## 9. Security Considerations

### 9.1 Authentication & Authorization

- API key-based authentication for public API
- JWT tokens for admin users
- Role-based access control (user, admin, super-admin)
- API key rotation mechanism

### 9.2 Input Validation

- Sanitize all user inputs
- Validate festival/language/tone against allowed values
- Limit personalization field lengths
- Check for SQL injection, XSS attempts

### 9.3 Rate Limiting

- 100 requests per hour per API key (user tier)
- 1000 requests per hour for premium tier
- 10 requests per minute per IP (unauthenticated)
- Exponential backoff on repeated violations

### 9.4 Content Safety

- Profanity filter on inputs and outputs
- Religion-sensitive content checks
- Human review queue for flagged content
- Abuse reporting mechanism

### 9.5 Data Privacy

- Encrypt sensitive data at rest
- Use HTTPS for all communications
- Anonymize analytics data
- Provide data deletion on request
- GDPR compliance for EU users

## 10. Monitoring & Observability

### 10.1 Metrics

- Request rate (requests/second)
- Error rate (errors/total requests)
- Latency percentiles (p50, p95, p99)
- Cache hit rate
- AI service latency
- Database query time

### 10.2 Alerts

- Error rate > 5% for 5 minutes
- p95 latency > 3s for 5 minutes
- Cache hit rate < 50%
- AI service timeout rate > 10%
- Rate limit violations > 100/hour

### 10.3 Logging

- Structured JSON logs
- Request/response logging (with PII redaction)
- Error stack traces
- Performance traces
- Audit logs for admin actions

### 10.4 Dashboards

- Real-time request metrics
- Festival usage breakdown
- Language/tone popularity
- Geographic distribution
- Error trends

## 11. Deployment & CI/CD

### 11.1 Deployment Architecture

**Production**:
- Serverless functions (AWS Lambda/Vercel)
- PostgreSQL RDS (Multi-AZ)
- Redis ElastiCache
- S3 for file storage
- CloudFront CDN

**Staging**:
- Identical to production (smaller instances)
- Separate database and cache
- Test data seeded

**Development**:
- Local Docker containers
- SQLite for database
- In-memory cache

### 11.2 CI/CD Pipeline

```
Code Push -> GitHub
  ↓
GitHub Actions Triggered
  ↓
Run Tests (Unit, Integration, E2E)
  ↓
Build Docker Image / Serverless Package
  ↓
Deploy to Staging
  ↓
Run Smoke Tests
  ↓
Manual Approval (for production)
  ↓
Deploy to Production (Blue-Green)
  ↓
Health Checks
  ↓
Rollback if Failed
```

### 11.3 Environment Variables

```
NODE_ENV=production
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
AI_SERVICE_API_KEY=sk-...
JWT_SECRET=...
ADMIN_API_KEY=...
AWS_S3_BUCKET=...
RATE_LIMIT_MAX=100
CACHE_TTL=3600
```

## 12. Testing Strategy

### 12.1 Unit Tests

- Test individual functions and methods
- Mock external dependencies (AI service, database)
- Target: 80% code coverage

### 12.2 Integration Tests

- Test API endpoints end-to-end
- Use test database and cache
- Verify request/response formats
- Test error handling

### 12.3 Property-Based Tests

- Test content generation properties
- Test personalization injection
- Test safety filter effectiveness
- Test rate limiting behavior

### 12.4 E2E Tests

- Test complete user workflows
- Use Playwright or Cypress
- Test on multiple browsers
- Test mobile responsiveness

### 12.5 Load Tests

- Simulate 100 concurrent users
- Verify latency targets under load
- Test cache effectiveness
- Identify bottlenecks

### 12.6 Security Tests

- Penetration testing
- SQL injection attempts
- XSS attempts
- Rate limit bypass attempts

## 13. Correctness Properties

### 13.1 Content Generation Properties

**Property 1.1**: Generated content count matches request
- For each tone requested, system returns exactly 5 unique wishes
- For each platform requested, system returns at least 3 variants

**Property 1.2**: Content language consistency
- All generated content is in the requested language
- No mixing of languages within a single piece of content

**Property 1.3**: Personalization completeness
- If personalization fields are provided, they appear in generated content
- Personalization maintains grammatical correctness

**Property 1.4**: Content uniqueness
- No two generated wishes/posts are identical
- Minimum edit distance between variants > 30%

**Property 1.5**: Platform-specific formatting
- Instagram content includes hashtags
- WhatsApp content is ≤ 200 characters
- Banner text has headline + subheadline structure

### 13.2 Speech Generation Properties

**Property 2.1**: Word count matches duration
- 30-45s speech: 80-100 words
- 60s speech: 120-150 words
- 90s speech: 180-200 words

**Property 2.2**: Speech structure
- Every speech has opening, body, and closing sections
- Each section is non-empty

**Property 2.3**: Role-appropriate tone
- Principal speeches use formal language
- Student speeches use enthusiastic language
- Host speeches use welcoming language

### 13.3 Safety Properties

**Property 3.1**: Profanity filtering
- No profanity in generated content
- Inputs with profanity are rejected

**Property 3.2**: Religious sensitivity
- No offensive religious content
- Neutral language for multi-religious festivals

**Property 3.3**: Content appropriateness
- No political messaging
- No targeted persuasion
- No hate speech

### 13.4 Performance Properties

**Property 4.1**: Response latency
- p50 latency ≤ 1.5s
- p95 latency ≤ 3s
- No request takes > 10s

**Property 4.2**: Cache effectiveness
- Cache hit rate ≥ 40% for common requests
- Cached responses return in < 100ms

### 13.5 Data Integrity Properties

**Property 5.1**: Request logging
- Every request is logged with timestamp
- Logs include festival, language, tones, platforms

**Property 5.2**: Admin changes propagation
- Festival additions appear in API within 5 minutes
- Template updates reflect in generation within 5 minutes

**Property 5.3**: Rate limiting
- Users cannot exceed 100 requests/hour
- Rate limit resets after 1 hour

### 13.6 Export Properties

**Property 6.1**: Export completeness
- TXT export contains all generated content
- PDF export is valid and readable

**Property 6.2**: Export formatting
- Line breaks preserved in TXT
- PDF has proper sections and formatting

---

**Document Version**: 1.0  
**Last Updated**: 2026-02-14  
**Status**: Draft
