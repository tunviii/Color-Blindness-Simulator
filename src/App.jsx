import { useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Header from "./components/Header";
import UploadBox from "./components/UploadBox";
import ImagePreview from "./components/ImagePreview";
import ModeSelector from "./components/ModeSelector";

const presetImages = [
  {
    name: "Spectrum",
    detail: "Rainbow gradient",
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 900 620'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1'%3E%3Cstop stop-color='%23ef4444'/%3E%3Cstop offset='.2' stop-color='%23f59e0b'/%3E%3Cstop offset='.4' stop-color='%23eab308'/%3E%3Cstop offset='.6' stop-color='%2322c55e'/%3E%3Cstop offset='.8' stop-color='%230ea5e9'/%3E%3Cstop offset='1' stop-color='%238b5cf6'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='900' height='620' fill='url(%23g)'/%3E%3Ccircle cx='710' cy='160' r='90' fill='white' opacity='.24'/%3E%3Ccircle cx='220' cy='440' r='140' fill='white' opacity='.18'/%3E%3C/svg%3E",
  },
  {
    name: "Fruit",
    detail: "Warm objects",
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 900 620'%3E%3Crect width='900' height='620' fill='%23f8fafc'/%3E%3Cellipse cx='450' cy='470' rx='310' ry='70' fill='%23d4d4d8'/%3E%3Ccircle cx='330' cy='350' r='118' fill='%23ef4444'/%3E%3Ccircle cx='475' cy='315' r='128' fill='%23f97316'/%3E%3Ccircle cx='595' cy='365' r='105' fill='%23facc15'/%3E%3Cpath d='M445 190c50-42 100-43 147-5-53 12-93 29-125 63z' fill='%2322c55e'/%3E%3C/svg%3E",
  },
  {
    name: "Signal",
    detail: "Traffic light",
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 900 620'%3E%3Crect width='900' height='620' fill='%23e5e7eb'/%3E%3Crect x='360' y='70' width='180' height='480' rx='52' fill='%2318171b'/%3E%3Ccircle cx='450' cy='178' r='58' fill='%23ef4444'/%3E%3Ccircle cx='450' cy='310' r='58' fill='%23f59e0b'/%3E%3Ccircle cx='450' cy='442' r='58' fill='%2322c55e'/%3E%3C/svg%3E",
  },
  {
    name: "Plate",
    detail: "Dot pattern",
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 900 620'%3E%3Crect width='900' height='620' fill='%23fafafa'/%3E%3Cg transform='translate(450 310)'%3E%3Ccircle r='220' fill='%23f3f4f6'/%3E%3Ccircle cx='-90' cy='-72' r='38' fill='%23ef4444'/%3E%3Ccircle cx='-10' cy='-82' r='28' fill='%23f59e0b'/%3E%3Ccircle cx='75' cy='-58' r='42' fill='%2322c55e'/%3E%3Ccircle cx='-120' cy='20' r='44' fill='%2384cc16'/%3E%3Ccircle cx='-20' cy='20' r='36' fill='%235b5bf0'/%3E%3Ccircle cx='95' cy='30' r='52' fill='%23fb7185'/%3E%3Ccircle cx='-50' cy='112' r='46' fill='%230ea5e9'/%3E%3Ccircle cx='65' cy='120' r='34' fill='%23eab308'/%3E%3C/g%3E%3C/svg%3E",
  },
];

function LandingPage({ onSelectImage }) {
  return (
    <main className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:py-14">
      <section className="mx-auto grid w-full max-w-3xl gap-7 text-center">
        <div>
          <p className="eyebrow mx-auto mb-4 w-fit">
            ChromaLens
          </p>

          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-app sm:text-5xl">
            See color the way everyone does.
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            Preview how images may appear across common color vision deficiencies in a focused, neutral workspace.
          </p>
        </div>

        <UploadBox
          onSelectImage={onSelectImage}
          variant="hero"
        />

        <section className="grid gap-3 text-left">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">
              Try a preset
            </h2>
            <span className="text-xs text-muted">
              No upload needed
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {presetImages.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => onSelectImage(preset.image)}
                className="focus-ring preset-card group"
              >
                <img
                  src={preset.image}
                  alt=""
                  className="h-24 w-full rounded-lg object-cover"
                />
                <span className="mt-3 block text-sm font-semibold text-app">
                  {preset.name}
                </span>
                <span className="text-xs text-muted">
                  {preset.detail}
                </span>
              </button>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function WorkspacePage({
  image,
  mode,
  severity,
  compareMode,
  onSelectImage,
  onReset,
  setMode,
  setSeverity,
  setCompareMode,
}) {
  return (
    <main className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[17rem_1fr] lg:gap-6 lg:py-6">
      <aside className="control-rail grid gap-5 self-start">
        <UploadBox onSelectImage={onSelectImage} />

        <ModeSelector
          mode={mode}
          setMode={setMode}
          severity={severity}
          setSeverity={setSeverity}
          compareMode={compareMode}
          setCompareMode={setCompareMode}
        />
      </aside>

      <ImagePreview
        key={`${compareMode}-${image ?? "empty"}`}
        image={image}
        mode={mode}
        severity={severity}
        compareMode={compareMode}
        onReset={onReset}
      />
    </main>
  );
}

function AppShell() {
  const [image, setImage] = useState(null);
  const [mode, setMode] = useState("protanopia");
  const [severity, setSeverity] = useState(100);
  const [compareMode, setCompareMode] = useState("slider");
  const [theme, setTheme] = useState("light");

  const navigate = useNavigate();
  const location = useLocation();
  const isWorkspace = location.pathname === "/workspace";

  const handleSelectImage = (nextImage) => {
    setImage(nextImage);
    navigate("/workspace");
  };

  const handleReset = () => {
    setImage(null);
    setMode("protanopia");
    setSeverity(100);
    setCompareMode("slider");
    navigate("/");
  };

  return (
    <div className="app-shell" data-theme={theme}>
      <Header
        theme={theme}
        setTheme={setTheme}
        showBackLink={isWorkspace}
      />

      <Routes>
        <Route
          path="/"
          element={<LandingPage onSelectImage={handleSelectImage} />}
        />
        <Route
          path="/workspace"
          element={
            image ? (
              <WorkspacePage
                image={image}
                mode={mode}
                severity={severity}
                compareMode={compareMode}
                onSelectImage={handleSelectImage}
                onReset={handleReset}
                setMode={setMode}
                setSeverity={setSeverity}
                setCompareMode={setCompareMode}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
