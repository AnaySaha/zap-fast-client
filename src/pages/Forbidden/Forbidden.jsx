import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * Forbidden component (403)
 *
 * Props:
 * - title?: string  (default: "Access Denied")
 * - message?: string (default: "You don't have permission to view this page.")
 * - showContact?: boolean (default: true) -> shows "Contact Admin" button that opens mailto:
 * - contactEmail?: string (default: "admin@example.com")
 */
const Forbidden = ({
  title = "Access Denied",
  message = "You don't have permission to view this page.",
  showContact = true,
  contactEmail = "admin@example.com",
}) => {
  const navigate = useNavigate();

  const handleHome = () => navigate("/");
  const handleBack = () => navigate(-1);
  const handleContact = () => {
    window.location.href = `mailto:${contactEmail}?subject=Access%20Request%20-%20Parcel%20App`;
  };

  return (
    <main
      role="main"
      aria-labelledby="forbidden-title"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-200 to-base-300 p-6"
    >
      <section className="max-w-4xl w-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 dark:border-neutral-800 overflow-hidden">
        <div className="md:flex">
          {/* Left artwork / icon */}
          <div className="md:w-1/2 flex items-center justify-center p-10 bg-gradient-to-tr from-[#ffe8d6] to-[#fff1f3] dark:from-neutral-800 dark:to-neutral-900">
            <div className="text-center">
              {/* Lock illustration */}
              <div className="mx-auto mb-6 w-36 h-36 rounded-full flex items-center justify-center bg-white/70 dark:bg-white/5 shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-red-600 dark:text-red-400"
                  aria-hidden="true"
                >
                  <rect x="3" y="11" width="18" height="10" rx="2" />
                  <path d="M7 11V8a5 5 0 0 1 10 0v3" />
                </svg>
              </div>

              <h3 className="text-2xl md:text-3xl font-extrabold text-gray-800 dark:text-gray-100">
                403
              </h3>
              <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-300">
                {title}
              </p>
            </div>
          </div>

          {/* Right content */}
          <div className="md:w-1/2 p-8 md:p-10">
            <h1
              id="forbidden-title"
              className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white"
            >
              {title}
            </h1>

            <p className="mt-3 text-gray-600 dark:text-gray-300">
              {message}
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleHome}
                className="btn btn-primary min-w-[120px] flex items-center justify-center gap-2"
                aria-label="Go to homepage"
              >
                Home
              </button>

              <button
                onClick={handleBack}
                className="btn btn-outline min-w-[120px] flex items-center justify-center gap-2"
                aria-label="Go back"
              >
                Go Back
              </button>

              {showContact && (
                <button
                  onClick={handleContact}
                  className="btn btn-ghost min-w-[160px] flex items-center justify-center gap-2 text-sm"
                  aria-label="Contact admin"
                >
                  Contact Admin
                </button>
              )}
            </div>

            <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              <p>
                If you believe this is a mistake, please contact your administrator
                or request access. Include the page URL and your user email to speed up help.
              </p>

              <dl className="mt-4 grid grid-cols-1 gap-2 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-start gap-3">
                  <span className="font-medium w-28">Status</span>
                  <span>403 Forbidden</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-medium w-28">When</span>
                  <span>{new Date().toLocaleString()}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-medium w-28">User</span>
                  <span className="truncate">{/* optionally show user.email here */}</span>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Forbidden;
