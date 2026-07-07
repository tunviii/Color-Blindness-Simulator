import { useEffect, useRef, useState } from "react";

import { applySimulation } from "./utils/applySimulation";

const modeDetails = {
  protanopia: {
    label: "Protanopia",
    summary: "Reduced or absent red cone response can make reds, greens, and browns harder to distinguish.",
    cones: "L-cones",
  },
  deuteranopia: {
    label: "Deuteranopia",
    summary: "Reduced green cone response often compresses red-green contrast while preserving brightness cues.",
    cones: "M-cones",
  },
  tritanopia: {
    label: "Tritanopia",
    summary: "Blue-yellow perception shifts can make blues and greens, or yellows and violet tones, appear closer.",
    cones: "S-cones",
  },
  achromatopsia: {
    label: "Achromatopsia",
    summary: "Color information is strongly reduced, so luminance, shape, and texture carry the comparison.",
    cones: "Cone function",
  },
};

function SimulationCanvas({ image, mode, severity, className, style, ariaLabel }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    let disposed = false;
    let resizeObserver;

    const render = async () => {
      const canvas = canvasRef.current;
      if (!canvas || !image || disposed) return;

      try {
        await applySimulation(canvas, image, mode, severity);
      } catch {
        // The preview should fail softly if the image cannot be decoded.
      }
    };

    render();

    const canvas = canvasRef.current;
    if (canvas && typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        render();
      });
      resizeObserver.observe(canvas);
    }

    return () => {
      disposed = true;
      resizeObserver?.disconnect();
    };
  }, [image, mode, severity]);

  return <canvas ref={canvasRef} className={className} style={style} aria-label={ariaLabel} />;
}

function ImagePreview({ image, mode, severity, compareMode, onReset }) {
  const detail = modeDetails[mode] ?? modeDetails.protanopia;
  const sliderRef = useRef(null);
  const [sliderPosition, setSliderPosition] = useState(50);

  const updateSliderFromClientX = (clientX) => {
    const container = sliderRef.current;
    if (!container) return;

    const { left, width } = container.getBoundingClientRect();
    const nextPosition = ((clientX - left) / width) * 100;
    setSliderPosition(Math.min(100, Math.max(0, nextPosition)));
  };

  const handlePointerDown = (event) => {
    if (compareMode !== "slider") return;

    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    updateSliderFromClientX(event.clientX);

    const handleMove = (moveEvent) => updateSliderFromClientX(moveEvent.clientX);
    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  const handleHandleKeyDown = (event) => {
    if (compareMode !== "slider") return;

    const step = event.shiftKey ? 10 : 5;

    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      setSliderPosition((value) => Math.max(0, value - step));
    }

    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      setSliderPosition((value) => Math.min(100, value + step));
    }
  };

  return (
    <section className="grid min-w-0 gap-5">
      <div className="surface flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight text-app sm:text-2xl">
            Comparison Canvas
          </h1>

          <p className="mt-1 text-sm leading-6 text-muted">
            {compareMode === "slider"
              ? "Drag-ready before and after preview, centered on the image."
              : "Alternative comparison layout for quick review."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border px-3 py-1.5 text-xs font-semibold text-muted" style={{ borderColor: "var(--color-border)" }}>
            {detail.label}
          </span>
          <span className="rounded-full px-3 py-1.5 text-xs font-semibold text-white" style={{ background: "var(--color-accent)" }}>
            {severity}% severity
          </span>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_17rem]">
        <article className="surface overflow-hidden rounded-2xl">
          <div className="checkerboard grid min-h-112 place-items-center p-3 sm:p-6">
            {compareMode === "side-by-side" ? (
              <div className="grid w-full gap-3 md:grid-cols-2">
                <figure className="relative min-h-[24rem] overflow-hidden rounded-xl border" style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
                  <span className="absolute left-3 top-3 z-10 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
                    Original
                  </span>
                  <img
                    src={image}
                    alt="Uploaded original"
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                </figure>

                <figure className="relative min-h-[24rem] overflow-hidden rounded-xl border" style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
                  <span className="absolute right-3 top-3 z-10 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
                    {detail.label}
                  </span>
                  <SimulationCanvas
                    image={image}
                    mode={mode}
                    severity={severity}
                    className="absolute inset-0 block h-full w-full"
                    ariaLabel={`${detail.label} simulated preview`}
                  />
                </figure>
              </div>
            ) : (
              <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl border shadow-sm" style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
                <div
                  ref={sliderRef}
                  className="relative min-h-[28rem] w-full overflow-hidden cursor-col-resize touch-none"
                  onPointerDown={handlePointerDown}
                >
                  <img
                    src={image}
                    alt="Uploaded original"
                    className="absolute inset-0 h-full w-full object-contain"
                  />

                  <SimulationCanvas
                    image={image}
                    mode={mode}
                    severity={severity}
                    className="absolute inset-0 block h-full w-full"
                    style={{
                      clipPath: `inset(0 0 0 ${Math.max(0, sliderPosition)}%)`,
                    }}
                    ariaLabel={`${detail.label} simulated preview`}
                  />

                  <span className="absolute left-3 top-3 z-10 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
                    Original
                  </span>
                  <span className="absolute right-3 top-3 z-10 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
                    {detail.label}
                  </span>

                  <div
                    className="absolute inset-y-0 w-px bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.18)]"
                    style={{ left: `${sliderPosition}%` }}
                  />

                  <button
                    type="button"
                    className="focus-ring absolute top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-sm font-bold text-white shadow-lg pressable"
                    style={{
                      left: `${sliderPosition}%`,
                      background: "var(--color-accent)",
                    }}
                    aria-label="Adjust comparison slider"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(sliderPosition)}
                    onKeyDown={handleHandleKeyDown}
                  >
                    ||
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 border-t px-4 py-3" style={{ borderColor: "var(--color-border)" }}>
            {["100%", "Fit", "Rotate"].map((tool) => (
              <button
                key={tool}
                type="button"
                className="ui-button ui-button-soft focus-ring pressable min-h-10 rounded-lg px-3 text-xs font-semibold"
              >
                {tool}
              </button>
            ))}

            <button
              type="button"
              className="ui-button focus-ring pressable inline-flex min-h-10 items-center justify-center rounded-lg px-3"
              aria-label="Download simulation"
              title="Download simulation"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 3v10" />
                <path d="m8 11 4 4 4-4" />
                <path d="M5 17v3h14v-3" />
              </svg>
            </button>

            <button
              type="button"
              onClick={onReset}
              className="ui-button ui-button-soft focus-ring pressable min-h-10 rounded-lg px-3 text-xs font-semibold"
            >
              Reset
            </button>
          </div>
        </article>

        <aside id="about" className="surface rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            About
          </p>

          <h2 className="mt-3 font-display text-xl font-bold text-app">
            {detail.label}
          </h2>

          <p className="mt-3 text-sm leading-6 text-muted">
            {detail.summary}
          </p>

          <div className="mt-5 rounded-xl border p-4" style={{ borderColor: "var(--color-border)" }}>
            <p className="text-sm font-semibold text-app">
              Affected area
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {["L", "M", "S"].map((cone) => {
                const isAffected = detail.cones.startsWith(cone);

                return (
                  <div
                    key={cone}
                    className="grid h-16 place-items-center rounded-lg border text-sm font-bold"
                    style={{
                      borderColor: isAffected ? "var(--color-accent)" : "var(--color-border)",
                      background: isAffected
                        ? "color-mix(in srgb, var(--color-accent) 12%, var(--color-card))"
                        : "var(--color-card)",
                      color: isAffected ? "var(--color-accent)" : "var(--color-muted)",
                    }}
                  >
                    {cone}
                  </div>
                );
              })}
            </div>

            <p className="mt-3 text-xs leading-5 text-muted">
              Cone markers are simplified for education and will update with the selected mode.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default ImagePreview;
