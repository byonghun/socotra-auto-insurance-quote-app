# Auto Insurance Quote Application — Take-Home Exercise

## Goal

Build a **production-minded** multi-step auto insurance quote flow using **React + TypeScript**.

This should feel like something you’d be comfortable shipping, not a demo.

## Timebox

- Target: **~2 hours**
- Max: **4 hours**
- Prioritize correctness, UX, and maintainability over extra features.

## Tools & Dependencies

- **Use any libraries or tools you normally would** (form libs, routers, validators, etc.).
- **AI tools are explicitly allowed and encouraged** (ChatGPT, Claude, Cursor, Copilot).

## Functional Requirements

Build a multi-step form with these steps:

1. Personal Info (first name, last name, email, phone, DOB)
2. Address (address, city, state, zip)
3. Vehicle (year, make, model, VIN)
4. Coverage (coverage type, limits, deductible)
5. Review & Quote
6. Success / Confirmation
7. Reset quote button

## Navigation & State

- Each step should have its **own route**
- Browser back/forward should work naturally
- Refreshing the page **should not lose progress**
- Include a reset button to clear the quote data at the end

## Validation & UX

- Validate inputs per step with clear user feedback
- Prevent progression with invalid data
- Show loading states for async actions
- Handle API errors gracefully (no crashes)

## Setup

### Frontend Setup

Install dependencies and start the development server:

```bash
# Using pnpm
pnpm install
pnpm dev

# Using npm
npm install
npm run dev

# Using yarn
yarn install
yarn dev
```

The frontend runs on `http://localhost:5173` (or the next available port).

### Backend Setup

Start the backend server:

```bash
# Using pnpm
pnpm run backend

# Using npm
npm run backend

# Using yarn
yarn backend
```

The backend runs on `http://localhost:3001` and provides the following API endpoints.

## Quote API

**PATCH `/quote`**

Update partial quote data as the user progresses through the form. Accepts any subset of `QuoteRequest` fields.

- **200 OK**: Quote updated successfully
- **422 Unprocessable Entity**: Validation errors (returns `{ errors: { field: ["message"] } }`)
- **500 Internal Server Error**: Server error

**GET `/quote`**

Retrieve the current saved quote data.

- **200 OK**: Returns `{ quote: QuoteRequest }`
- **404 Not Found**: No quote exists
- **500 Internal Server Error**: Server error

**POST `/quote`**

Submit the final complete quote. This endpoint validates all required fields and generates a quote ID.

- **200 OK**: Returns `QuoteResponse`
- **422 Unprocessable Entity**: Validation errors
- **500 Internal Server Error**: Server error

**DELETE `/quote`**

Reset/clear the stored quote data. Useful for testing.

- **200 OK**: Quote reset successfully
- **500 Internal Server Error**: Server error

### Types

```ts
type QuoteRequest = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dob: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  vehicleYear: number;
  vehicleMake: string;
  vehicleModel: string;
  vehicleVin: string;
  coverageType: "liability_only" | "standard_coverage" | "full_coverage";
  liabilityLimits: string;
  collisionDeductibleInCents: string;
};

type QuoteResponse = {
  quoteId: string;
  totalPremiumCents: number;
  term: "monthly" | "6_month";
};
```

### Postman Collection

A Postman collection is included at `backend/postman_collection.json` with example requests for all API endpoints. Import this collection into Postman to:

- Test all endpoints with example payloads
- See validation error examples
- Understand the expected request/response formats

The collection includes requests for:

- PATCH `/quote` - Update partial quote data
- GET `/quote` - Retrieve current quote
- POST `/quote` - Submit complete quote
- DELETE `/quote` - Reset quote data

### Notes

- The PATCH endpoint validates fields as they're submitted and returns realistic field-level validation errors
- The POST endpoint validates all required fields and calculates the total premium
- **Liability limits** must be one of: `100/300`, `250/500`, `500/1000`, `1000/2000`
- **Collision deductible** (in cents, as string) must be one of: `"25000"` ($250), `"50000"` ($500), `"100000"` ($1000), `"250000"` ($2500)
- **Date of birth** must be at least 16 years ago (age validation)
- All endpoints use standard HTTP status codes

## Submission

Send an email to your recruiter with a link to the GitHub repository or with a zip file of the project.