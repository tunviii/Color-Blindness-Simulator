function UploadBox({ onSelectImage, variant = "compact" }) {

  const handleFile = (file) => {
    if (!file) return;

    onSelectImage(URL.createObjectURL(file));
  };

  const handleUpload = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const isHero = variant === "hero";

  return (
    <div className={`surface rounded-2xl ${isHero ? "p-4 sm:p-5" : "p-4"}`}>

      {!isHero && (
        <div className="mb-4">
          <h2 className="text-base font-semibold text-app">
            Source Image
          </h2>

          <p className="mt-1 text-sm leading-6 text-muted">
            Replace the active image.
          </p>
        </div>
      )}

      <label
        className={`focus-ring group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-5 text-center transition duration-200 ${
          isHero ? "min-h-72 py-10" : "min-h-36 py-6"
        }`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        style={{
          borderColor: "color-mix(in srgb, var(--color-border) 72%, var(--color-muted))",
          background: "color-mix(in srgb, var(--color-card) 88%, var(--color-background))",
        }}
      >

        <span
          className="mb-4 grid h-14 w-14 place-items-center rounded-full border text-2xl shadow-sm transition duration-200 group-hover:-translate-y-1"
          style={{
            borderColor: "var(--color-border)",
            background: "var(--color-card)",
            color: "var(--color-accent)",
          }}
          aria-hidden="true"
        >
          <span className="leading-none">+</span>
        </span>

        <span className={`${isHero ? "text-lg" : "text-sm"} font-semibold text-app`}>
          {isHero ? "Drag & drop an image, or click to browse" : "Upload a different image"}
        </span>

        <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
          JPG, PNG, WebP, max 10MB
        </p>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />

      </label>

    </div>
  );
}

export default UploadBox;
