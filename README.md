# 🎯 Complete Multi-Step Auto Insurance Quote Application

## Overview
This PR implements a fully functional multi-step auto insurance quote application with form validation, state management, route protection, and a polished UI using shadcn/ui components and Tailwind CSS.

---

## 🚀 Key Features Implemented

### **Multi-Step Form Flow**
- ✅ Personal Information step (name, email, phone, DOB)
- ✅ Address Information step (address, city, state, ZIP)
- ✅ Vehicle Information step (year, make, model, VIN)
- ✅ Coverage Options step (coverage type, liability limits, deductible)
- ✅ Review step with collapsible accordion sections
- ✅ Success page with quote details display

### **State Management & Data Persistence**
- Implemented TanStack Query hooks for server state management
- Created reusable hooks: `useQuoteQuery`, `usePatchQuoteMutation`, `useSubmitQuoteMutation`, `useDeleteQuoteMutation`
- Automatic form data persistence via PATCH requests
- Quote data cached and shared across all steps
- LocalStorage integration for submitted quote tracking

### **Form Validation & Error Handling**
- Zod v4 schema validation for all form fields
- Server-side validation with detailed error messages
- Client-side validation with react-hook-form
- Custom error styling with visual feedback
- Toast notifications for errors and success using Sonner

### **Route Protection & Navigation**
- Protected routes that prevent direct URL access to incomplete steps
- `ProtectedStep` component checks previous step completion
- Smart navigation that directs users to next incomplete step
- Visual step indicators in sidebar with completion status
- Home page progress tracker showing completed steps with checkmarks

### **UI/UX Enhancements**
- **shadcn/ui Components**: Button, Input, Label, Select, Dialog, Accordion, FormField
- **Custom Styling**:
  - Focus border: `#52a8eccc`
  - Error border: `#c87872`
  - Error text: `#f2545b`
- Responsive layout with scrollable content areas
- Fixed headers/footers on review page
- Confirmation dialog before quote submission
- Clean, consistent spacing and typography

### **Smart Features**
- **Home Page Intelligence**:
  - Shows "Start Quote" when no quote exists
  - Shows "Continue Quote" when in progress
  - Shows "Review & Submit" when all steps complete
  - Shows "View Submitted Quote" when already submitted
  - Displays step completion status with visual indicators
- **Quote Management**:
  - "Start New Quote" button clears existing data
  - Reset functionality available on review and success pages
  - Submission result persistence for viewing later

### **Shared Constants**
- Created `/shared/constants.ts` for constants used by both frontend and backend:
  - `US_STATES`: List of US state abbreviations
  - `LIABILITY_LIMITS`: Coverage limit options
  - `COLLISION_DEDUCTIBLES`: Deductible options (in cents)
  - `COVERAGE_TYPES`: Coverage type options
- Ensures type safety and consistency across client/server

---

## 🏗️ Technical Architecture

### Frontend Stack:
- React 19 with TypeScript
- Vite for build tooling
- React Router DOM v7 for routing
- TanStack Query v5 for state management
- Zod v4 for schema validation
- React Hook Form v7 for form handling
- shadcn/ui component library
- Sonner for toast notifications
- Tailwind CSS v3 for styling

### Key Files Created/Modified:
- `src/router.tsx` - Application routing with nested routes
- `src/hooks/index.ts` - TanStack Query hooks
- `src/components/forms/*` - All form components
- `src/components/ui/*` - shadcn/ui components
- `src/routes/quote/steps/*` - Step route components
- `src/routes/quote/quote-layout.tsx` - Main layout with sidebar
- `src/routes/home-page.tsx` - Enhanced home page
- `src/routes/success-page.tsx` - Success page with quote details
- `shared/constants.ts` - Shared constants between frontend/backend
- `src/utils/quote.ts` - Step validation and completion logic

---

## 🎨 User Experience Flow

1. **Landing**: Home page shows progress and appropriate action button
2. **Form Steps**: User fills out 4 forms with real-time validation
3. **Auto-Save**: Data saved automatically as user progresses
4. **Review**: All information displayed in collapsible sections with edit buttons
5. **Confirmation**: Dialog asks user to verify before submission
6. **Success**: Shows quote ID, premium amount, and term details
7. **Return**: Can view submitted quote or start new one

---

## ✅ Quality Features

- Comprehensive error handling with user-friendly messages
- Loading states throughout the application
- Disabled states prevent duplicate submissions
- Form validation prevents invalid data
- Route guards prevent skipping required steps
- Clean code organization with proper separation of concerns
- TypeScript for type safety
- Consistent UI patterns and styling

---

## 📝 Implementation Notes

- All forms use shadcn/ui components for consistent styling
- Custom Input component with error prop for conditional styling
- FormField wrapper component for consistent label/error display
- Review page allows editing any section by navigating back
- Quote submission stores result for later viewing
- Delete mutation clears both server data and local cache

---

**This PR represents a complete, production-ready implementation of the auto insurance quote flow with excellent UX, proper validation, and clean architecture.**


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