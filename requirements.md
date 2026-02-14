# Requirements: AI Local Event & Festival Content Maker

## 1. Overview

The AI Local Event & Festival Content Maker is a web application and API service that generates culturally-appropriate, localized content for festivals and events. It produces wishes, social media posts, banner copy, and short speeches in multiple languages, tones, and formats to help small businesses, schools, social media managers, and event organizers create engaging content quickly.

### 1.1 Project Goals

- Produce high-quality, culturally-appropriate festival & event copy in multiple tones and formats
- Allow users to pick a festival, locale, language, tone(s), target platform(s), and optional personalization details
- Provide exportable assets (text blocks, image captions/hashtags, short speech text)
- Achieve fast responses (<2s server latency target per request)
- Enable easy deployment (serverless friendly)

### 1.2 Success Metrics

- **Quality**: 90% of generated items evaluated as "useful" by 20 pilot users
- **Coverage**: Support 10+ festivals and 8+ languages in MVP
- **Latency**: Median response ≤1.5s in demo environment
- **Uptime**: 99% SLA for contest demo

## 2. User Personas

### 2.1 Small Business Owner (Priya)
- Runs a local shop or restaurant
- Needs quick, professional festival greetings for WhatsApp broadcasts
- Limited time and design skills
- Wants content in local language (Gujarati/Hindi)

### 2.2 School Administrator (Rajesh)
- Organizes school events and functions
- Needs short speeches for principals, hosts, students
- Requires formal, appropriate language
- Often needs content in English and regional language

### 2.3 Social Media Manager (Aisha)
- Manages social accounts for small brands or influencers
- Needs platform-specific content (Instagram captions, Facebook posts)
- Wants trending hashtags and engaging copy
- Requires multiple tone options (friendly, funny, inspirational)

### 2.4 Event Organizer (Vikram)
- Plans local community events and college fests
- Needs banner text, announcements, promotional copy
- Requires personalization (event name, organization, location)
- Wants quick turnaround

## 3. User Stories

### 3.1 Core Content Generation

**US-1**: As a user, I can choose a festival/event and language to get 5 wish messages in formal, friendly, and funny tones.

**US-2**: As a user, I can request social post copy tailored to WhatsApp, Instagram (caption + suggested hashtags), and Facebook.

**US-3**: As a user, I can request a short 60–90 second speech for a school/college function.

**US-4**: As a user, I can input recipient name, organisation name, or locality for personalization.

**US-5**: As a user, I can download results as TXT and PDF.

### 3.2 Admin & Management

**US-6**: As an admin, I can add new festivals and translations via an admin UI.

**US-7**: As an admin, I can view analytics on festival usage, tone preferences, and language distribution.

**US-8**: As an admin, I can moderate and flag inappropriate content.

### 3.3 Advanced Features

**US-9**: As a user, I can save my preferences (language, organization name) for future sessions.

**US-10**: As a user, I can copy generated content to clipboard with one click.

## 4. Functional Requirements

### 4.1 Festival & Event Selection

**FR-1.1**: System shall provide a built-in list of festivals including:
- Diwali, Navratri/Garba, Uttarayan, Holi, Eid, Christmas
- Local fairs, college fest, custom event option

**FR-1.2**: System shall allow users to select custom events with name input.

**FR-1.3**: System shall categorize festivals by region and religion for better discovery.

### 4.2 Tone & Style Selection

**FR-2.1**: System shall support the following tones:
- Formal
- Friendly
- Funny
- Inspirational
- Spiritual

**FR-2.2**: System shall allow selection of multiple tones simultaneously.

**FR-2.3**: System shall generate at least 5 unique variations per tone.

### 4.3 Platform Templates

**FR-3.1**: System shall provide WhatsApp-optimized messages (short, emoji-friendly).

**FR-3.2**: System shall provide Instagram content including:
- Caption (150-200 characters)
- 2 sets of hashtags (trending + niche)

**FR-3.3**: System shall provide Facebook posts in two formats:
- Short post (100-150 words)
- Long post (200-300 words)

**FR-3.4**: System shall provide banner text including:
- Short headline (5-10 words)
- Subheadline (10-20 words)

### 4.4 Speech Generation

**FR-4.1**: System shall generate speeches with duration options:
- Short (30-45 seconds, ~80-100 words)
- Medium (60 seconds, ~120-150 words)
- Long (90 seconds, ~180-200 words)

**FR-4.2**: System shall support role-based speech styles:
- Principal (formal, authoritative)
- Host (engaging, welcoming)
- Student (enthusiastic, relatable)

**FR-4.3**: System shall include opening, body, and closing sections in speeches.

### 4.5 Personalization

**FR-5.1**: System shall accept optional personalization fields:
- Recipient name(s)
- Organization name
- City/locality
- Audience age group

**FR-5.2**: System shall intelligently insert personalization without breaking flow.

**FR-5.3**: System shall validate personalization inputs for inappropriate content.

### 4.6 Language Support

**FR-6.1**: System shall support the following languages:
- English, Hindi, Gujarati, Marathi, Kannada, Tamil, Telugu, Bengali, Punjabi

**FR-6.2**: System shall provide transliteration support for Indic languages.

**FR-6.3**: System shall detect unsupported languages and fall back to English with a warning message.

**FR-6.4**: System shall maintain cultural context and idioms appropriate to each language.

### 4.7 Export & Sharing

**FR-7.1**: System shall allow export in TXT format.

**FR-7.2**: System shall allow export in PDF format with basic formatting.

**FR-7.3**: System shall provide "Copy to Clipboard" functionality.

**FR-7.4**: System shall preserve formatting (line breaks, emojis) in exports.

### 4.8 Content Safety & Moderation

**FR-8.1**: System shall implement profanity blocklist filtering.

**FR-8.2**: System shall apply religion-sensitive content checks.

**FR-8.3**: System shall use regionally-aware moderation rules.

**FR-8.4**: System shall flag potentially sensitive content for human review.

**FR-8.5**: System shall not generate political messaging or targeted persuasion.

### 4.9 Admin Interface

**FR-9.1**: Admin UI shall allow adding new festivals with:
- Festival name
- Date/season
- Region/religion tags
- Default templates

**FR-9.2**: Admin UI shall allow adding translations for existing festivals.

**FR-9.3**: Admin UI shall show preview of generated content before publishing.

**FR-9.4**: Changes made in admin UI shall be live within 5 minutes.

### 4.10 Analytics & Logging

**FR-10.1**: System shall log:
- Requests per festival
- Top tones used
- Language usage distribution
- Platform preferences

**FR-10.2**: System shall provide dashboard with usage metrics.

**FR-10.3**: System shall track response latency (p50, p95, p99).

## 5. Non-Functional Requirements

### 5.1 Performance

**NFR-1.1**: Median API response latency shall be ≤ 1.5 seconds.

**NFR-1.2**: 95th percentile (p95) response latency shall be ≤ 3 seconds.

**NFR-1.3**: System shall handle at least 100 concurrent requests.

**NFR-1.4**: Content generation shall not block UI interactions.

### 5.2 Scalability

**NFR-2.1**: System shall be deployable on serverless platforms (AWS Lambda, Vercel, etc.).

**NFR-2.2**: System shall support horizontal scaling.

**NFR-2.3**: System shall use caching for frequently requested festival/language combinations.

### 5.3 Reliability

**NFR-3.1**: System shall maintain 99% uptime during contest demo period.

**NFR-3.2**: System shall gracefully degrade if AI service is unavailable.

**NFR-3.3**: System shall provide meaningful error messages to users.

### 5.4 Security

**NFR-4.1**: API shall require authentication via API keys.

**NFR-4.2**: All communications shall use HTTPS.

**NFR-4.3**: System shall implement rate limiting (100 requests per hour per user).

**NFR-4.4**: System shall sanitize all user inputs.

### 5.5 Privacy & Data Retention

**NFR-5.1**: User prompts shall be stored for 30 days maximum.

**NFR-5.2**: Users shall have option to opt-out of data retention.

**NFR-5.3**: No personally identifiable information shall be logged without consent.

**NFR-5.4**: System shall not generate or transform user-submitted images.

### 5.6 Usability

**NFR-6.1**: UI shall be responsive and work on mobile devices.

**NFR-6.2**: Content generation workflow shall require ≤ 3 clicks.

**NFR-6.3**: System shall provide loading indicators during generation.

**NFR-6.4**: Error messages shall be user-friendly and actionable.

## 6. Acceptance Criteria

### AC-1: Festival Content Generation
**Given**: User selects festival=Diwali, tone=friendly, language=English  
**When**: User clicks "Generate"  
**Then**: System returns at least 5 unique wish messages and 3 social post variants for each platform (WhatsApp, Instagram, Facebook)

### AC-2: Speech Generation
**Given**: User selects speech duration=60 seconds, role=principal  
**When**: User generates speech  
**Then**: System produces text between 120-150 words with appropriate formal tone

### AC-3: Admin Festival Addition
**Given**: Admin adds new festival "Pongal" with Tamil translations  
**When**: Admin saves changes  
**Then**: Festival appears in user-facing selector within 5 minutes

### AC-4: Language Fallback
**Given**: User selects unsupported language "Spanish"  
**When**: User attempts to generate content  
**Then**: System returns English content with message: "Spanish not yet supported. Showing English content."

### AC-5: Personalization
**Given**: User inputs name="Priya", organization="ABC School", city="Mumbai"  
**When**: User generates content  
**Then**: Generated content includes all three personalization elements naturally

### AC-6: Export Functionality
**Given**: User has generated content  
**When**: User clicks "Download PDF"  
**Then**: System downloads properly formatted PDF with all generated content

### AC-7: Content Safety
**Given**: User inputs profanity in personalization field  
**When**: User attempts to generate  
**Then**: System blocks generation and shows error: "Please use appropriate language"

### AC-8: Performance
**Given**: User submits content generation request  
**When**: System processes request  
**Then**: Response is received within 1.5 seconds (median case)

### AC-9: Multi-tone Generation
**Given**: User selects tones=[formal, friendly, funny]  
**When**: User generates wishes  
**Then**: System returns 5 messages for each tone (15 total)

### AC-10: Instagram Hashtags
**Given**: User generates Instagram content for Diwali  
**When**: Content is generated  
**Then**: System provides 2 hashtag sets: trending (#Diwali2024, #FestivalOfLights) and niche (#DiwaliDecor, #DiwaliVibes)

## 7. Edge Cases & Error Handling

### 7.1 Unsupported Language
- **Scenario**: User requests content in unsupported language
- **Handling**: Return best-effort English content + message offering alternatives

### 7.2 Religious Sensitivity
- **Scenario**: Generated content contains potentially sensitive religious phrases
- **Handling**: Fall back to neutral celebratory language, flag for review

### 7.3 Empty Personalization
- **Scenario**: User leaves all personalization fields empty
- **Handling**: Generate generic content without personalization placeholders

### 7.4 Very Long Organization Names
- **Scenario**: User inputs organization name > 50 characters
- **Handling**: Truncate gracefully or use shortened version in content

### 7.5 API Timeout
- **Scenario**: AI service takes > 5 seconds to respond
- **Handling**: Return cached template-based content with notice

### 7.6 Concurrent Admin Changes
- **Scenario**: Multiple admins edit same festival simultaneously
- **Handling**: Last-write-wins with notification to other admins

### 7.7 Invalid Festival Date
- **Scenario**: Admin sets festival date in past
- **Handling**: Show warning but allow (for historical content)

### 7.8 Rate Limit Exceeded
- **Scenario**: User exceeds 100 requests per hour
- **Handling**: Return 429 status with retry-after header

## 8. Data & Training Sources

### 8.1 Training Data
- Synthetic prompt-response pairs (5,000+ pairs) created in-house for each festival in each tone
- Publicly available festival greetings and captions (used for style inspiration only, not verbatim)
- Human-reviewed moderation rules for religious content

### 8.2 Data Quality
- All training data reviewed by native speakers for cultural appropriateness
- Regular updates to reflect current language trends and hashtags
- A/B testing of generated content with pilot users

## 9. Privacy & Safety

### 9.1 Privacy Principles
- Do not generate or transform user-submitted images
- No political messaging or targeted persuasion
- Minimal data collection (only what's needed for functionality)
- Clear opt-out mechanisms for data retention

### 9.2 Safety Measures
- Profanity and hate-speech filters on all inputs and outputs
- Human review queue for flagged outputs
- Regular audits of generated content for bias
- Incident response plan for inappropriate content

### 9.3 Compliance
- GDPR-compliant data handling (for international users)
- Clear terms of service and privacy policy
- User consent for analytics and logging

## 10. API Specification

### 10.1 Generate Content Endpoint

```
POST /api/generate
```

**Request Body**:
```json
{
  "festival": "diwali",
  "language": "english",
  "tones": ["formal", "friendly"],
  "platforms": ["whatsapp", "instagram"],
  "personalization": {
    "name": "Priya",
    "organization": "ABC Corp",
    "city": "Mumbai"
  }
}
```

**Response**:
```json
{
  "requestId": "req_123",
  "festival": "diwali",
  "content": {
    "wishes": {
      "formal": ["...", "...", "...", "...", "..."],
      "friendly": ["...", "...", "...", "...", "..."]
    },
    "social": {
      "whatsapp": ["...", "...", "..."],
      "instagram": {
        "captions": ["...", "...", "..."],
        "hashtags": {
          "trending": ["#Diwali2024", "#FestivalOfLights"],
          "niche": ["#DiwaliDecor", "#DiwaliVibes"]
        }
      }
    }
  },
  "latency": 1.2
}
```

### 10.2 Generate Speech Endpoint

```
POST /api/generate-speech
```

**Request Body**:
```json
{
  "event": "annual-day",
  "duration": 60,
  "role": "principal",
  "language": "english",
  "personalization": {
    "organization": "ABC School",
    "city": "Mumbai"
  }
}
```

**Response**:
```json
{
  "requestId": "req_124",
  "speech": {
    "text": "...",
    "wordCount": 145,
    "estimatedDuration": 58
  }
}
```

### 10.3 Admin - Add Festival Endpoint

```
POST /api/admin/festivals
Authorization: Bearer <admin_token>
```

**Request Body**:
```json
{
  "name": "Pongal",
  "date": "2024-01-15",
  "region": "South India",
  "religion": "Hindu",
  "translations": {
    "tamil": "பொங்கல்",
    "english": "Pongal"
  },
  "templates": {
    "formal": ["..."],
    "friendly": ["..."]
  }
}
```

## 11. Deliverables & Milestones

### Phase 1: MVP (Weeks 1-3)
- Core content generation (wishes, social posts)
- 5 festivals, 3 languages (English, Hindi, Gujarati)
- Basic web UI
- TXT export

### Phase 2: Enhanced Features (Weeks 4-5)
- Speech generation
- PDF export
- 10+ festivals, 8+ languages
- Admin UI (basic)

### Phase 3: Polish & Scale (Week 6)
- Performance optimization
- Analytics dashboard
- Content safety enhancements
- Deployment & monitoring

### Phase 4: Launch (Week 7)
- User testing with 20 pilot users
- Bug fixes and refinements
- Documentation
- Public launch

## 12. Test Cases

### TC-1: Basic Content Generation
- **Input**: Festival=Diwali, Language=English, Tone=Friendly
- **Expected**: 5 unique friendly wishes returned in < 2s

### TC-2: Multi-Platform Generation
- **Input**: Platforms=[WhatsApp, Instagram, Facebook]
- **Expected**: 3 variants per platform, properly formatted

### TC-3: Speech Word Count
- **Input**: Duration=60s, Role=Principal
- **Expected**: Speech text between 120-150 words

### TC-4: Personalization Injection
- **Input**: Name="Raj", Organization="XYZ School"
- **Expected**: Both values appear naturally in generated content

### TC-5: Language Fallback
- **Input**: Language=Spanish (unsupported)
- **Expected**: English content + warning message

### TC-6: Profanity Filter
- **Input**: Personalization contains profanity
- **Expected**: Request blocked with error message

### TC-7: Rate Limiting
- **Input**: 101 requests in 1 hour from same user
- **Expected**: 101st request returns 429 status

### TC-8: Admin Festival Addition
- **Input**: Admin adds "Pongal" festival
- **Expected**: Festival available in UI within 5 minutes

### TC-9: PDF Export
- **Input**: User clicks "Download PDF" after generation
- **Expected**: Valid PDF file downloads with all content

### TC-10: Concurrent Requests
- **Input**: 50 simultaneous requests
- **Expected**: All requests complete successfully, p95 < 3s

### TC-11: Empty Personalization
- **Input**: All personalization fields left blank
- **Expected**: Generic content generated without placeholders

### TC-12: Instagram Hashtags
- **Input**: Platform=Instagram, Festival=Holi
- **Expected**: 2 hashtag sets (trending + niche) provided

---

**Document Version**: 1.0  
**Last Updated**: 2026-02-14  
**Status**: Draft
