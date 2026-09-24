/* =========================================================
   Stages of Decomposition — script.js

   HOW THE "DATA-TO-DOM" CONNECTION WORKS
   --------------------------------------
   1. loadData() fetches data.json (our tiny "database").
   2. We keep two numbers in `state`: which animal and which stage
      is selected. That is the ONLY thing that changes when a user clicks.
   3. Every click just updates `state` and then calls render().
   4. render() reads `state`, looks up the matching entry in the data,
      and writes it into the page (image, heading, description).

   Because render() always redraws from `state`, the page can never get
   "out of sync" — there is one source of truth.
   ========================================================= */

// ---------- 1. State ----------
const state = {
  data: null,        // the parsed contents of data.json
  animalIndex: 0,    // which animal is selected (position in data.animals)
  stageIndex: 0      // which stage is selected (position in animal.stages)
};

// ---------- 2. Grab the page elements we will update ----------
// (Looked up once here so the rest of the code can just use them.)
const els = {
  siteTitle:     document.getElementById("site-title"),
  animalButtons: document.getElementById("animal-buttons"),
  stageButtons:  document.getElementById("stage-buttons"),
  image:         document.getElementById("stage-image"),
  animalName:    document.getElementById("animal-name"),
  stageName:     document.getElementById("stage-name"),
  description:   document.getElementById("stage-description"),
  note:          document.getElementById("animal-note"),
  counter:       document.getElementById("stage-counter"),
  prev:          document.getElementById("prev-btn"),
  next:          document.getElementById("next-btn")
};

// Small helpers so the rest of the code reads clearly
const currentAnimal = () => state.data.animals[state.animalIndex];
const currentStage  = () => currentAnimal().stages[state.stageIndex];

// ---------- 3. Load the data ----------
async function loadData() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    state.data = await response.json();

    if (state.data.site_title) {
      els.siteTitle.textContent = state.data.site_title;
      document.title = state.data.site_title;
    }

    buildAnimalButtons();
    buildStageButtons();
    render();
  } catch (err) {
    showLoadError(err);
  }
}

// ---------- 4. Build buttons from the data ----------
// One <button> per animal. Clicking one resets to the first stage.
function buildAnimalButtons() {
  els.animalButtons.innerHTML = "";
  state.data.animals.forEach((animal, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = animal.name;
    btn.addEventListener("click", () => {
      state.animalIndex = index;
      state.stageIndex = 0;
      buildStageButtons();   // a different animal may have different stages
      render();
    });
    els.animalButtons.appendChild(btn);
  });
}

// One <button> per stage of the CURRENT animal.
function buildStageButtons() {
  els.stageButtons.innerHTML = "";
  currentAnimal().stages.forEach((stage, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = `${index + 1}. ${stage.stage_name}`;
    btn.addEventListener("click", () => goToStage(index));
    els.stageButtons.appendChild(btn);
  });
}

// ---------- 5. Change stage (used by buttons, prev/next, and arrow keys) ----------
function goToStage(index) {
  const total = currentAnimal().stages.length;
  if (index < 0 || index >= total) return;   // ignore out-of-range requests
  state.stageIndex = index;
  render();
}

// ---------- 6. Render: copy the selected data into the page ----------
function render() {
  const animal = currentAnimal();
  const stage = currentStage();
  const total = animal.stages.length;

  // Sidebar text
  els.animalName.textContent  = animal.name;
  els.stageName.textContent   = stage.stage_name;
  els.description.textContent = stage.description;
  els.note.textContent        = animal.note || "";

  // Image — fade out, swap the source, fade back in once it has loaded
  if (els.image.getAttribute("src") !== stage.image) {
    els.image.classList.add("is-loading");
    els.image.src = stage.image;
  }
  els.image.alt = stage.image_alt || `${animal.name}: ${stage.stage_name}`;

  // Counter + prev/next buttons
  els.counter.textContent = `Stage ${state.stageIndex + 1} of ${total}`;
  els.prev.disabled = state.stageIndex === 0;
  els.next.disabled = state.stageIndex === total - 1;

  // Highlight the selected buttons (CSS styles [aria-pressed="true"])
  markSelected(els.animalButtons, state.animalIndex);
  markSelected(els.stageButtons, state.stageIndex);
}

function markSelected(container, selectedIndex) {
  [...container.children].forEach((btn, i) => {
    btn.setAttribute("aria-pressed", i === selectedIndex ? "true" : "false");
  });
}

// ---------- 7. Event listeners that don't depend on the data ----------
els.prev.addEventListener("click", () => goToStage(state.stageIndex - 1));
els.next.addEventListener("click", () => goToStage(state.stageIndex + 1));

// Left/right arrow keys step through stages
document.addEventListener("keydown", (event) => {
  if (!state.data) return;
  if (event.key === "ArrowLeft")  goToStage(state.stageIndex - 1);
  if (event.key === "ArrowRight") goToStage(state.stageIndex + 1);
});

// Fade the image back in once the new file has loaded
els.image.addEventListener("load", () => els.image.classList.remove("is-loading"));

// If an image file is missing (e.g. a typo in data.json), say so instead
// of showing a broken-image icon.
els.image.addEventListener("error", () => {
  els.image.classList.remove("is-loading");
  console.warn(`Image not found: ${els.image.getAttribute("src")} — check the "image" path in data.json`);
});

// ---------- 8. Friendly error if data.json can't load ----------
// The most common cause: opening index.html by double-clicking it.
// Browsers block fetch() on file:// pages, so you need a local server.
function showLoadError(err) {
  console.error(err);
  els.stageName.textContent = "Couldn't load data.json";
  const openedAsFile = location.protocol === "file:";
  els.description.innerHTML = openedAsFile
    ? 'You opened this page directly from your computer (<code>file://</code>), and browsers block loading <code>data.json</code> that way. Run a local server instead — see the README.'
    : "Check that <code>data.json</code> exists next to <code>index.html</code> and is valid JSON (a missing comma or extra trailing comma will break it).";
  els.description.classList.add("error");
}

// ---------- Go! ----------
loadData();
