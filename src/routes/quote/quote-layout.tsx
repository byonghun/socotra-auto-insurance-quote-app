import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Check } from "lucide-react";

import { cn } from "../../utils";
import { steps, getCompletionByStep } from "../../utils/quote";
import { useQuoteQuery } from "../../hooks";

const QuoteLayout = () => {
  const location = useLocation();
  const { data: quote, isLoading } = useQuoteQuery();

  const completion = getCompletionByStep(quote);

  const isStepAccessible = (index: number) => {
    // First step is always accessible
    if (index === 0) return true;

    // Check if previous step is completed
    const previousStep = steps[index - 1];
    return completion[previousStep.id as keyof typeof completion];
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-[100vh] p-6 gap-6">
      <aside className="w-80 h-full bg-slate-200 rounded-lg flex flex-col">
        <a href="/" className="block p-4 text-xl font-bold">
          <img
            src="https://www.socotra.com/wp-content/uploads/2024/10/Socotra-Logo-Black-2048x622.png"
            alt=""
            width="100"
          />
        </a>
        <nav className="flex flex-col">
          {steps.map((step, index) => {
            const isActive = location.pathname === step.path;
            const isAccessible = isStepAccessible(index);

            return (
              <NavLink
                key={step.id}
                to={step.path}
                className={cn(
                  "flex items-center gap-3 p-4",
                  !isAccessible
                    ? "pointer-events-none opacity-50"
                    : "hover:opacity-80",
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold mt-[3px]",
                    isAccessible
                      ? "bg-green-700 text-white"
                      : "bg-slate-400 text-slate-200",
                    isActive && "bg-brand text-white",
                  )}
                >
                  {isAccessible && !isActive ? <Check size={16} /> : index + 1}
                </div>
                <div className="flex flex-col">
                  <span
                    className={
                      location.pathname === step.path ? "font-semibold" : ""
                    }
                  >
                    {step.label}
                  </span>
                  <span className="text-xs text-slate-600">
                    {step.description}
                  </span>
                </div>
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default QuoteLayout;
