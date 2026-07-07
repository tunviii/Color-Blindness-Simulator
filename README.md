# ChromaLens

[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.x-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React%20Router-7.x-EF4444?logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![ESLint](https://img.shields.io/badge/ESLint-Configured-4B32C3?logo=eslint&logoColor=white)](https://eslint.org/)

ChromaLens is a color vision deficiency simulator for previewing how uploaded images may appear to people with different forms of color blindness. The app is built as a calm, focused workspace with a neutral UI, a landing page, routed navigation, preset demo images, and a draggable comparison slider.

## What the app does

- Upload an image from your device or drag and drop one into the drop zone.
- Try preset sample images from the landing page without uploading anything.
- Navigate between the landing page and the workspace with React Router.
- Pick a simulation mode for protanopia, deuteranopia, tritanopia, or achromatopsia.
- Adjust simulation severity with a slider.
- Switch compare modes between slider, side-by-side, and toggle flip.
- Drag a comparison handle across the image in slider mode.
- Toggle between light and dark themes.
- Jump back to the landing page from the workspace at any time.
- Read a short educational summary for the active deficiency type.

## Live experience

The app uses two main routes:

- `/` for the landing page with the hero, upload drop zone, and preset gallery.
- `/workspace` for the simulation workspace after an image is selected.

The workspace is protected by the current image state. If you open `/workspace` directly without selecting an image first, the app sends you back to `/`.

## How it is implemented

### Application shell

The top-level app is built in [src/App.jsx](src/App.jsx). It wraps the UI in `BrowserRouter`, keeps the current image and simulation settings in React state, and moves users between routes when they select a preset or upload a file.

### Landing page

The landing page introduces the product, presents the upload drop zone, and shows four clickable preset thumbnails. Selecting any preset stores the image and routes the user into the workspace.

### Workspace

The workspace pairs a control rail on the left with the preview area on the right.

- The rail contains the image upload control, simulation mode selector, severity slider, and compare mode toggle.
- The preview area shows the image comparison, contextual mode information, and toolbar actions.
- The back button in the header returns the user to the landing page so the preset flow is never a dead end.

### Comparison slider

The slider view uses one image viewport with two clipped layers:

- the original image layer is clipped from the right,
- the simulated image layer is clipped from the left,
- the divider handle is positioned from pointer movement and keyboard arrows.

That gives the usual compare-slider behavior where both visible portions resize together as the handle moves.

### Theme system

The app uses CSS custom properties in [src/index.css](src/index.css) for light and dark themes. A `data-theme` attribute on the root shell switches the variable set, which keeps the rest of the component styles simple and consistent.

### Upload flow

[src/components/UploadBox.jsx](src/components/UploadBox.jsx) supports both file input and drag-and-drop. It accepts the current image selection and passes a blob URL upward.

### Mode selector

[src/components/ModeSelector.jsx](src/components/ModeSelector.jsx) contains:

- deficiency mode cards,
- a severity range input,
- compare mode buttons,
- keyboard navigation for the mode list.

### Preview panel

[src/components/ImagePreview.jsx](src/components/ImagePreview.jsx) handles:

- the main comparison surface,
- the slider overlay and drag logic,
- side-by-side and flip compare modes,
- the mode explanation card,
- toolbar actions for download, fit, rotate, and reset.

### Header

[src/components/Header.jsx](src/components/Header.jsx) includes:

- the product name,
- a back-to-home link on the workspace route,
- the light/dark theme toggle.

## Technology stack

- React 19 for the component model and state management.
- Vite for fast development and production builds.
- React Router for page navigation.
- Tailwind CSS 4 for utility styling alongside custom CSS variables.
- Plain CSS for the theme tokens, surfaces, and slider utilities.
- ESLint for static code quality checks.

## Project structure

```text
src/
  App.jsx
  index.css
  main.jsx
  components/
    Header.jsx
    UploadBox.jsx
    ModeSelector.jsx
    ImagePreview.jsx
    utils/
      applySimulation.jsx
      colorMatrices.jsx
```

## Getting started

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Available scripts

- `npm run dev` starts the development server.
- `npm run build` creates a production build.
- `npm run lint` runs ESLint.
- `npm run preview` serves the built app locally.

## Notes

- The current UI focuses on the experience and navigation flow, with the comparison surface styled for the simulator workflow.
- The workspace is intentionally calm and neutral so the uploaded image remains the visual focus.
