import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="max-w-3xl flex flex-col rounded-lg border border-slate-200 bg-white p-8 shadow-md gap-4">
        <h1 className="text-2xl font-bold text-slate-900">
          Auto Insurance Quote
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Get a quick quote by answering a few questions. Your progress will be
          saved as you go.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <Link
            to="/quote/personal"
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            Start quote
          </Link>

          <Link
            to="/quote/personal"
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
          >
            Continue
          </Link>
        </div>

        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          Steps: Personal Info → Address → Vehicle → Coverage → Review → Success
        </div>
      </div>
    </div>
  );
};

export default HomePage;