import { Link } from "react-router-dom";

function Header({ theme, setTheme, showBackLink = false }) {
  const isDark = theme === "dark";

  return (
    <header className="surface border-x-0 border-t-0">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div
            className="grid h-10 w-10 place-items-center rounded-xl text-sm font-bold text-white shadow-sm"
            style={{ background: "var(--color-accent)" }}
          >
            CL
          </div>

          <div>
            <p className="font-display text-base font-bold leading-tight text-app">
              ChromaLens
            </p>

            <p className="hidden text-xs text-muted sm:block">
              See the world through every lens.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showBackLink ? (
            <Link
              to="/"
              className="ui-button focus-ring pressable inline-flex min-h-11 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold"
            >
              <span>Back to home</span>
            </Link>
          ) : null}

          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="ui-button focus-ring pressable inline-flex min-h-11 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold"
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
          >
            <span aria-hidden="true" className="font-semibold tracking-wide">
              {isDark ? "Light" : "Dark"}
            </span>
            <span
              className="grid h-6 w-6 place-items-center rounded-full text-xs text-white"
              style={{ background: "var(--color-accent)" }}
              aria-hidden="true"
            >
              {isDark ? "L" : "D"}
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
