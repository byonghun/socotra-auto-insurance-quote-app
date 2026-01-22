import { createBrowserRouter, Navigate } from "react-router-dom";

import ProtectedStep from "./components/protected-step";
import HomePage from "./routes/home-page";
import QuoteLayout from "./routes/quote/quote-layout";
import PersonalStep from "./routes/quote/steps/personal-step";
import AddressStep from "./routes/quote/steps/address-step";
import VehicleStep from "./routes/quote/steps/vehicle-step";
import CoverageStep from "./routes/quote/steps/coverage-step";
import ReviewStep from "./routes/quote/steps/review-step";
import SuccessStep from "./routes/success-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/success",
    element: <SuccessStep />,
  },
  {
    path: "/quote",
    element: <QuoteLayout />,
    children: [
      { index: true, element: <Navigate to="/quote/personal" replace /> },

      { path: "personal", element: <PersonalStep /> },
      {
        path: "address",
        element: (
          <ProtectedStep requiredStep="personal">
            <AddressStep />
          </ProtectedStep>
        ),
      },
      {
        path: "vehicle",
        element: (
          <ProtectedStep requiredStep="address">
            <VehicleStep />
          </ProtectedStep>
        ),
      },
      {
        path: "coverage",
        element: (
          <ProtectedStep requiredStep="vehicle">
            <CoverageStep />
          </ProtectedStep>
        ),
      },
      {
        path: "review",
        element: (
          <ProtectedStep requiredStep="coverage">
            <ReviewStep />
          </ProtectedStep>
        ),
      },
    ],
  },
]);
