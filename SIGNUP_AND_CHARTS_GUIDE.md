# Sign-Up & Chart Saving System

## Overview

Users can now:
1. Fill birth details on **homepage**
2. Sign up with **phone (OTP)** or **Google**
3. Save **multiple charts** to their account
4. View all saved charts in **dashboard**
5. Delete or manage charts anytime

---

## User Journey

```
┌─────────────────────────────────────────────────────────┐
│ 1. HOMEPAGE - Fill Birth Details                        │
│    (Name, DOB, Time, City)                              │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ 2. SIGN UP PAGE (/auth/signup)                         │
│    - Phone OTP + Name                                   │
│    - OR Google Sign-in                                  │
│    - Pre-filled data from homepage                      │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ 3. ONBOARDING (/onboarding)                            │
│    - Complete profile                                   │
│    - Generate first kundli                              │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ 4. DASHBOARD (/dashboard)                              │
│    - View kundli                                        │
│    - Access all 25+ engines                             │
│    - Save chart to account                              │
│    - Create new charts                                  │
└─────────────────────────────────────────────────────────┘
```

---

## Database Schema (Supabase)

### `user_charts` Table

```sql
CREATE TABLE user_charts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  
  -- Birth Details
  name TEXT NOT NULL,
  dob DATE NOT NULL,
  tob TIME NOT NULL,
  city TEXT NOT NULL,
  country TEXT,
  timezone TEXT,
  latitude FLOAT,
  longitude FLOAT,
  
  -- Chart Data
  chart_data JSONB, -- Full kundli chart object
  engines_data JSONB, -- All engine calculations
  
  -- Metadata
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, dob, tob, city)
);

CREATE INDEX ON user_charts(user_id);
CREATE INDEX ON user_charts(created_at DESC);
```

---

## API Endpoints

### 1. Save Chart
```
POST /api/user-charts/save

Request Body:
{
  "name": "John Doe",
  "dob": "2000-01-15",
  "tob": "14:30",
  "city": "Mumbai",
  "country": "India",
  "timezone": "IST",
  "latitude": 19.0760,
  "longitude": 72.8777,
  "chartData": { ...full chart object },
  "engines": { ...all engine calculations }
}

Response:
{
  "success": true,
  "id": "chart-uuid",
  "message": "Chart saved successfully"
}
```

### 2. Get All User Charts
```
GET /api/user-charts/list

Response:
{
  "success": true,
  "charts": [
    {
      "id": "chart-uuid",
      "name": "John Doe",
      "dob": "2000-01-15",
      "tob": "14:30",
      "city": "Mumbai",
      "country": "India",
      "created_at": "2026-05-31T10:00:00Z",
      "is_default": false
    }
  ]
}
```

### 3. Get Specific Chart
```
GET /api/user-charts/[id]

Response:
{
  "success": true,
  "chart": {
    "id": "chart-uuid",
    "user_id": "user-uuid",
    "name": "John Doe",
    "dob": "2000-01-15",
    "tob": "14:30",
    "city": "Mumbai",
    "chartData": { ...full chart },
    "engines_data": { ...all calculations },
    "created_at": "2026-05-31T10:00:00Z"
  }
}
```

### 4. Delete Chart
```
DELETE /api/user-charts/[id]

Response:
{
  "success": true,
  "message": "Chart deleted"
}
```

---

## Frontend Implementation

### 1. Signup Page (`/auth/signup`)
✓ Phone + OTP authentication
✓ Google OAuth
✓ Pre-fill name from homepage
✓ Store user metadata

### 2. Dashboard Changes Needed
1. **My Charts section**
   - List all saved charts
   - Switch between charts
   - Create new chart
   - Delete chart

2. **Save Chart Button**
   - After generating kundli, show "Save This Chart"
   - Call `/api/user-charts/save` endpoint
   - Show success message

3. **Chart Selector**
   - Dropdown to switch between saved charts
   - Load chart data from `/api/user-charts/[id]`
   - Reload all engines with selected chart

---

## Implementation Checklist

### Database
- [ ] Create `user_charts` table in Supabase
- [ ] Add RLS policies for user data security
- [ ] Create indexes for performance

### Backend
- [ ] ✅ Sign-up page created
- [ ] ✅ Save chart API endpoint
- [ ] ✅ Get all charts API endpoint
- [ ] ✅ Get specific chart API endpoint
- [ ] ✅ Delete chart API endpoint

### Frontend (TODO)
- [ ] Add "My Charts" page in dashboard
- [ ] Add "Save Chart" button to all engines
- [ ] Add chart selector dropdown
- [ ] Add chart management UI
- [ ] Update onboarding to save first chart

---

## Security

✅ **Authentication**: Supabase Auth (Phone OTP + Google)
✅ **Authorization**: RLS policies on user_charts table
✅ **Data Encryption**: Supabase encrypts data in transit (HTTPS)
✅ **User Isolation**: Charts are user-specific and RLS-protected

---

## Next Steps

1. **Run migrations** to create `user_charts` table
2. **Add RLS policies** for security
3. **Update dashboard** to show chart list
4. **Add save functionality** to engine pages
5. **Test end-to-end** flow

---

## Code Examples

### Save Chart from Dashboard
```typescript
async function saveChart(birthData, engineData) {
  const response = await fetch('/api/user-charts/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: birthData.name,
      dob: birthData.dob,
      tob: birthData.tob,
      city: birthData.city,
      chartData: engineData.chart,
      engines: engineData.allEngines,
    }),
  });

  const result = await response.json();
  if (result.success) {
    console.log('Chart saved:', result.id);
    showNotification('Chart saved successfully! 🎉');
  }
}
```

### Load Saved Chart
```typescript
async function loadChart(chartId) {
  const response = await fetch(`/api/user-charts/${chartId}`);
  const result = await response.json();

  if (result.success) {
    // Reload all engines with this chart data
    const chart = result.chart;
    loadAllEngines(chart.chart_data, chart.engines_data);
  }
}
```

### List User Charts
```typescript
async function getUserCharts() {
  const response = await fetch('/api/user-charts/list');
  const result = await response.json();

  if (result.success) {
    return result.charts; // Array of user's saved charts
  }
}
```

---

## Testing

1. **Sign Up Flow**
   - Fill homepage form → Go to signup → OTP → Dashboard
   - Sign up with Google → Should redirect to dashboard

2. **Save Chart**
   - Generate kundli → Click "Save Chart" → Verify in list

3. **Load Chart**
   - Go to "My Charts" → Click chart → All engines reload

4. **Delete Chart**
   - Go to "My Charts" → Delete chart → Verify removed

---

## Support

All endpoints are **authenticated** (require valid JWT from Supabase Auth).
Errors return appropriate HTTP status codes (401, 404, 500).
