const modes = [
  {
    value: "protanopia",
    label: "Protanopia",
    icon: "R",
    description: "Red-blind, about 1% of men",
  },
  {
    value: "deuteranopia",
    label: "Deuteranopia",
    icon: "G",
    description: "Green-blind, the most common type",
  },
  {
    value: "tritanopia",
    label: "Tritanopia",
    icon: "B",
    description: "Blue-yellow perception shift",
  },
  {
    value: "achromatopsia",
    label: "Achromatopsia",
    icon: "A",
    description: "Little to no color perception",
  },
];

const compareModes = [
  { value: "slider", label: "Slider" },
  { value: "side-by-side", label: "Side-by-Side" },
  { value: "flip", label: "Toggle Flip" },
];

function ModeSelector({
  mode,
  setMode,
  severity,
  setSeverity,
  compareMode,
  setCompareMode,
}) {
  const handleKeyDown = (event) => {
    if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(event.key)) {
      return;
    }

    event.preventDefault();

    const currentIndex = modes.findIndex((item) => item.value === mode);
    const direction = ["ArrowDown", "ArrowRight"].includes(event.key) ? 1 : -1;
    const nextIndex = (currentIndex + direction + modes.length) % modes.length;

    setMode(modes[nextIndex].value);
  };

  return (
    <div className="surface rounded-2xl p-4">

      <div className="mb-4">
        <h2 className="text-base font-semibold text-app">
          Vision Type
        </h2>

        <p className="mt-1 text-sm leading-6 text-muted">
          Choose the lens used for the preview.
        </p>
      </div>

      <div
        className="grid gap-2"
        role="radiogroup"
        aria-label="Vision type"
        onKeyDown={handleKeyDown}
      >
        {modes.map(({ value, label, icon, description }) => {
          const isActive = mode === value;

          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => setMode(value)}
              className="focus-ring pressable grid min-h-16 grid-cols-[2.5rem_1fr] gap-3 rounded-xl border p-3 text-left transition"
              style={{
                borderColor: isActive ? "var(--color-accent)" : "var(--color-border)",
                borderLeftWidth: isActive ? "4px" : "1px",
                background: isActive
                  ? "color-mix(in srgb, var(--color-accent) 10%, var(--color-card))"
                  : "var(--color-card)",
                color: "var(--color-text)",
              }}
            >
              <span
                className="grid h-10 w-10 place-items-center rounded-lg text-sm font-bold"
                style={{
                  background: isActive
                    ? "var(--color-accent)"
                    : "color-mix(in srgb, var(--color-muted) 10%, transparent)",
                  color: isActive ? "#ffffff" : "var(--color-muted)",
                }}
                aria-hidden="true"
              >
                {icon}
              </span>

              <span className="min-w-0">
                <span className="block text-sm font-semibold text-app">
                  {label}
                </span>
                <span className="mt-0.5 block text-xs leading-5 text-muted">
                  {description}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 border-t pt-5" style={{ borderColor: "var(--color-border)" }}>
        <div className="mb-3 flex items-center justify-between">
          <label className="text-sm font-semibold text-app" htmlFor="severity">
            Severity
          </label>
          <span className="font-mono text-xs text-muted">
            {severity}%
          </span>
        </div>

          <input
            id="severity"
            type="range"
            min="0"
            max="100"
            value={severity}
            onChange={(event) => setSeverity(Number(event.target.value))}
            className="w-full"
            style={{ accentColor: "var(--color-accent)" }}
            aria-label="Simulation severity"
          />
      </div>

      <div className="mt-5 border-t pt-5" style={{ borderColor: "var(--color-border)" }}>
        <p className="mb-3 text-sm font-semibold text-app">
          Compare Mode
        </p>

        <div className="grid grid-cols-3 rounded-xl border p-1" style={{ borderColor: "var(--color-border)" }}>
          {compareModes.map(({ value, label }) => {
            const isActive = compareMode === value;

            return (
              <button
                key={value}
                type="button"
                onClick={() => setCompareMode(value)}
                className={`focus-ring pressable min-h-10 rounded-lg px-2 text-xs font-semibold transition ${
                  isActive ? "ui-button-accent" : "ui-button ui-button-soft"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        Simulation mode changed to {modes.find((item) => item.value === mode)?.label}.
      </p>

    </div>
  );
}

export default ModeSelector;
