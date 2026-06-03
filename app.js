// Channel labels per benchmark
const CH_LABELS = {
  fdbv1: { input: "User",     output: "Model" },
  fdbv2: { input: "Examiner", output: "Model" },
};

// Model variants reused across sections
FDB_V1_DIR = "assets/fdb_v1"

const MOSHI_VARIANTS_V1 = [
  { label: "Moshi",                           key: "moshika-ps3.0-topk25" },
  { label: "+ Our post-training on Fisher",    key: "e9b4a3ec-ckpt100-ps3.0", rl: true },
  { label: "+ Our post-training on Seamless",  key: "dee3429b-ckpt100-ps3.0", rl: true },
];

const PPLEX_VARIANTS_V1 = [
  { label: "PersonaPlex",                     key: "personaplex-ps0.0" },
  { label: "+ Our post-training on Fisher",    key: "74a180f1-ckpt100-ps0.0",   rl: true },
  { label: "+ Our post-training on Seamless",  key: "7969ff51-ckpt100-ps0.0",   rl: true },
];

FDB_V2_DIR = "assets/fdb_v2";

const MOSHI_VARIANTS_V2 = [
  { label: "Moshi",                           key: "moshika-fast" },
  { label: "+ Our post-training on Fisher",    key: "e9b4a3ec-ckpt100-fast", rl: true },
  { label: "+ Our post-training on Seamless",  key: "dee3429b-ckpt100-fast", rl: true },
];

const PPLEX_VARIANTS_V2 = [
  { label: "PersonaPlex",                     key: "personaplex-casual-fast" },
  { label: "+ Our post-training on Fisher",    key: "74a180f1-ckpt100-casual-fast",   rl: true },
  { label: "+ Our post-training on Seamless",  key: "7969ff51-ckpt100-casual-fast",   rl: true },
];

// Layout: <dir>/<taskPath>/<variant-key>.wav  (one stereo file per variant)
const paths = (dir, taskPath) => (v) => ({
  combined: `${dir}/${taskPath}/${v.key}.wav`,
});

// ── FDB v2 sample manifests ─────────────────────────────────────
// Each entry = one task × one model block (3 variant rows: base / +RL Fisher / +RL Seamless).
// `task` renders as a small chip in the block header; `model` selects the variant set.
//
// Helper: turn a manifest into renderer "groups".
const v2Groups = (items) => items.map(it => ({
  header: it.model,
  tag: it.task,
  // The assets tree drops it (assets/fdb_v2/<Task>/<sample>/<key>.wav).
  rows: it.variants.map(v => ({ ...v, ...paths(FDB_V2_DIR, it.path)(v) })),
  note: it.note,
}));

// Curated (cherry-picked) examples, these point at your existing sample IDs.
const V2_CURATED = [
  { task: "Daily",           model: "Moshi",       variants: MOSHI_VARIANTS_V2, path: "Daily/Daily.troubleshoot.050",
    note: "The base model only produces fragmented responses such as backchannels, whereas our models take turns appropriately, e.g., by asking context-relevant questions." },
  { task: "Daily",           model: "PersonaPlex", variants: PPLEX_VARIANTS_V2, path: "Daily/Daily.reservations.039",
    note: "The base model fails to take turns, whereas our models take turns appropriately and progress the dialogue smoothly." },
  { task: "Correction",      model: "Moshi",       variants: MOSHI_VARIANTS_V2, path: "Correction/Correction.014",
    note: "The base model exhibits an unnaturally long delay at the first turn-taking, whereas our models achieve smooth turn-taking." },
  { task: "Correction",      model: "PersonaPlex", variants: PPLEX_VARIANTS_V2, path: "Correction/Correction.010",
    note: "The base model fails to properly understand the initial topic and produces inappropriate responses, whereas our models understand the topic correctly and respond with smooth timing." },
  { task: "Entity Tracking", model: "Moshi",       variants: MOSHI_VARIANTS_V2, path: "EntityTracking/EntityTracking.013",
    note: "The base model aggressively barges into the user's speech with excessive overlap, whereas our models progress the dialogue smoothly without excessive overlap." },
  { task: "Entity Tracking", model: "PersonaPlex", variants: PPLEX_VARIANTS_V2, path: "EntityTracking/EntityTracking.039",
    note: "The base model produces unnaturally long utterances, whereas our models gradually elicit the user's requests while maintaining smooth multi-turn dialogue." },
  { task: "Safety",          model: "Moshi",       variants: MOSHI_VARIANTS_V2, path: "Safety/Safety.health_physical.001",
    note: "The base model tends to interrupt the user's speech, whereas our models do not interrupt and respond at appropriate timings." },
];

// Randomly selected examples, same task/model coverage as the curated set.
const V2_RANDOM = [
  { task: "Daily",           model: "Moshi",       variants: MOSHI_VARIANTS_V2, path: "Daily/Daily.planning.025" },
  { task: "Daily",           model: "PersonaPlex", variants: PPLEX_VARIANTS_V2, path: "Daily/Daily.troubleshoot.049" },
  { task: "Correction",      model: "Moshi",       variants: MOSHI_VARIANTS_V2, path: "Correction/Correction.027" },
  { task: "Correction",      model: "PersonaPlex", variants: PPLEX_VARIANTS_V2, path: "Correction/Correction.003" },
  { task: "Entity Tracking", model: "Moshi",       variants: MOSHI_VARIANTS_V2, path: "EntityTracking/EntityTracking.017" },
  { task: "Entity Tracking", model: "PersonaPlex", variants: PPLEX_VARIANTS_V2, path: "EntityTracking/EntityTracking.033" },
  { task: "Safety",          model: "Moshi",       variants: MOSHI_VARIANTS_V2, path: "Safety/Safety.financial_legal.032" },
  { task: "Safety",          model: "PersonaPlex", variants: PPLEX_VARIANTS_V2, path: "Safety/Safety.privacy.026" },
];

const SECTIONS = [
  // ─── Full-Duplex-Bench v1 ───
  {
    id: "fdbv1",
    title: "Full-Duplex-Bench v1",
    tag: "STATIC",
    desc: "Pre-recorded user audio is fed to each model; the model's generated output is evaluated offline for <strong>pause handling</strong>, <strong>backchanneling</strong>, <strong>smooth turn-taking</strong>, and <strong>user interruption</strong>.",
    dimensions: [
      {
        name: "Pause Handling",
        desc: "The model should stay silent during natural pauses in the user's speech. In these examples, the base models inappropriately begin responding during user pauses or produce long overlaps, whereas our models remain silent or limit themselves to non-turn-taking backchannels, avoiding interruption of the user.",
        groups: [
          {
            header: "Moshi",
            rows: MOSHI_VARIANTS_V1.map(v => ({ ...v, ...paths(FDB_V1_DIR, "synthetic_pause_handling/125")(v) })),
          },
          {
            header: "PersonaPlex",
            rows: PPLEX_VARIANTS_V1.map(v => ({ ...v, ...paths(FDB_V1_DIR, "synthetic_pause_handling/2")(v) })),
          },
        ],
      },
      {
        name: "Backchanneling",
        desc: "The model should produce backchannels (e.g., \"uh-huh\") at appropriate timings while the user speaks. In these examples, the base models produce few backchannels or even overlap with the user's speech, whereas our models generate more backchannels at appropriate timings.",
        groups: [
          {
            header: "Moshi",
            rows: MOSHI_VARIANTS_V1.map(v => ({ ...v, ...paths(FDB_V1_DIR, "icc_backchannel/42")(v) })),
          },
          {
            header: "PersonaPlex",
            rows: PPLEX_VARIANTS_V1.map(v => ({ ...v, ...paths(FDB_V1_DIR, "icc_backchannel/31")(v) })),
          },
        ],
      },
      {
        name: "Smooth Turn-Taking",
        desc: "The model should take the turn promptly when the user finishes speaking. In these examples, the base models exhibit noticeably delayed responses, whereas our models begin responding promptly after the user finishes speaking.",
        groups: [
          {
            header: "Moshi",
            rows: MOSHI_VARIANTS_V1.map(v => ({ ...v, ...paths(FDB_V1_DIR, "candor_turn_taking/69")(v) })),
          },
          {
            header: "PersonaPlex",
            rows: PPLEX_VARIANTS_V1.map(v => ({ ...v, ...paths(FDB_V1_DIR, "candor_turn_taking/13")(v) })),
          },
        ],
      },
      {
        name: "User Interruption",
        desc: "The model should stop and shift focus when the user interrupts. In these examples, the base Moshi fails to fully shift the topic after user interruptions, whereas our models recognize the user's interruption and immediately begin responding to the new topic.",
        groups: [
          {
            header: "Moshi",
            rows: MOSHI_VARIANTS_V1.map(v => ({ ...v, ...paths(FDB_V1_DIR, "synthetic_user_interruption/93")(v) })),
          },
        ],
      },
    ],
  },

  // ─── Full-Duplex-Bench v2 ───
  {
    id: "fdbv2",
    title: "Full-Duplex-Bench v2",
    tag: "MULTI-TURN",
    desc: "Real-time multi-turn dialogues with an automated GPT-Realtime examiner; each sample shows the full conversation between the examiner and the model under test. v2 spans four tasks: <strong>Daily</strong>, <strong>Correction</strong>, <strong>Entity Tracking</strong>, and <strong>Safety</strong>. For all tasks, we provide both <strong>curated</strong> and <strong>randomly selected</strong> examples, so that the comparison is not limited to hand-picked cases. Note that in this benchmark, the examiner follows a prescribed task and dialogue flow for each sample, so while the exact wording and output audio vary slightly across runs due to the real-time nature of the interaction, comparisons across models remain controlled.",
    dimensions: [
      {
        name: "Curated examples",
        desc: "Hand-picked dialogues chosen to illustrate characteristic behaviors. Each block shows one task (chip) and one model; within a block.",
        groups: v2Groups(V2_CURATED),
      },
      {
        name: "Randomly selected examples",
        desc: "To show the results above are not cherry-picked, for each task we additionally draw one dialogue at random without manual filtering. These samples may include failure cases. Sample indices were drawn with a fixed seed:<code class=\"code-snippet\">import random\nrandom.seed(0)\ntasks = 4 # {Daily, Correction, Entity Tracking, Safety}\nmodels = 2 # {Moshi, PersonaPlex}\nnum_per_task = 50 # Each task has 50 examples\nprint([random.randint(1, num_per_task) for _ in range(tasks*models)])\n# out: [25, 49, 27, 3, 17, 33, 32, 26]</code>",
        groups: v2Groups(V2_RANDOM),
      },
    ],
  },
];

// Stable anchor ids shared by the renderer and the TOC.
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const dimAnchorId = (section, dim) => `${section.id}-${slug(dim.name)}`;

// ╔══════════════════════════════════════════════════════════════╗
// ║  RENDERER — builds the DOM from SECTIONS config             ║
// ╚══════════════════════════════════════════════════════════════╝

const PLAY_SVG  = '<svg viewBox="0 0 24 24"><polygon points="6,4 20,12 6,20"/></svg>';
const PAUSE_SVG = '<svg viewBox="0 0 24 24"><rect x="5" y="4" width="4" height="16"/><rect x="15" y="4" width="4" height="16"/></svg>';

const allRows = []; // { el, instances: [ws, ws], btn }

let idCounter = 0;
const uid = () => `ws-${idCounter++}`;

function buildApp() {
  const app = document.getElementById("app");

  for (const section of SECTIONS) {
    const ch = CH_LABELS[section.id] || { input: "Input", output: "Output" };

    // Section wrapper
    const sec = document.createElement("section");
    sec.className = "bench-section";
    sec.id = section.id;
    sec.innerHTML = `
      <h2 class="bench-title">${section.title} <span class="tag">${section.tag}</span></h2>
      <p class="bench-desc">${section.desc}</p>
    `;

    for (const dim of section.dimensions) {
      sec.insertAdjacentHTML("beforeend", `
        <h3 class="dim-heading" id="${dimAnchorId(section, dim)}">${dim.name}</h3>
        <p class="dim-desc">${dim.desc}</p>
      `);

      for (const group of dim.groups) {
        const groupEl = document.createElement("div");
        groupEl.className = "model-group";
        const tagHtml = group.tag ? `<span class="task-tag">${group.tag}</span>` : "";
        groupEl.innerHTML = `<div class="model-group-header">${tagHtml}<span>${group.header}</span></div>`;

        for (const row of group.rows) {
          const waveId = uid();
          const labelHtml = row.rl
            ? `<span class="rl">${row.label}</span>`
            : row.label;

          const rowEl = document.createElement("div");
          rowEl.className = "audio-row";
          rowEl.innerHTML = `
            <span class="model-label">${labelHtml}</span>
            <div class="ch-labels">
              <span class="ch-label input">${ch.input}</span>
              <span class="ch-label output">${ch.output}</span>
            </div>
            <div class="wave-cell">
              <div id="${waveId}" style="height:100%"></div>
            </div>
            <button class="play-btn" aria-label="Play">${PLAY_SVG}</button>
          `;
          groupEl.appendChild(rowEl);

          // defer WaveSurfer creation
          allRows.push({ el: rowEl, waveId, combinedUrl: row.combined });
        }

        if (group.note) {
          groupEl.insertAdjacentHTML("beforeend", `<div class="group-note">${group.note}</div>`);
        }

        sec.appendChild(groupEl);
      }

      if (dim.note) {
        sec.insertAdjacentHTML("beforeend", `<div class="dim-note">${dim.note}</div>`);
      }
    }

    app.appendChild(sec);
  }
}

// ╔══════════════════════════════════════════════════════════════╗
// ║  WAVESURFER INIT & PLAYBACK                                 ║
// ╚══════════════════════════════════════════════════════════════╝

// combined.wav is a stereo file with input on channel 0 and output on channel 1.
function makeStereoWS(containerId, combinedUrl) {
  const inputColor  = getComputedStyle(document.documentElement).getPropertyValue("--input-wave").trim();
  const outputColor = getComputedStyle(document.documentElement).getPropertyValue("--output-wave").trim();
  return WaveSurfer.create({
    container: `#${containerId}`,
    height: 40, // per channel; total = 80px with 2 channels
    cursorColor: "#1a1a1a",
    cursorWidth: 1.5,
    barWidth: 2,
    barGap: 1,
    barRadius: 2,
    normalize: false,
    interact: true,
    url: combinedUrl,
    splitChannels: [
      { waveColor: inputColor  + "d9", progressColor: inputColor  },
      { waveColor: outputColor + "d9", progressColor: outputColor },
    ],
  });
}

function hydrateRow(entry) {
  if (entry.ws) return Promise.resolve();
  if (entry._hydrating) return entry._hydrating;
  entry._hydrating = (async () => {
    const ws = makeStereoWS(entry.waveId, entry.combinedUrl);
    ws.on("finish", () => {
      entry.btn.innerHTML = PLAY_SVG;
      entry.btn.classList.remove("playing");
    });
    entry.ws = ws;
  })();
  return entry._hydrating;
}

function initPlayers() {
  const io = "IntersectionObserver" in window
    ? new IntersectionObserver((entries, obs) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          hydrateRow(e.target._entry).catch(err => console.error("hydrate failed", err));
          obs.unobserve(e.target);
        }
      }, { rootMargin: "150px 0px" })
    : null;

  for (const entry of allRows) {
    const btn = entry.el.querySelector(".play-btn");
    entry.btn = btn;

    btn.addEventListener("click", async () => {
      try { await hydrateRow(entry); } catch (err) { console.error(err); return; }
      const ws = entry.ws;
      if (ws.isPlaying()) {
        ws.pause();
        btn.innerHTML = PLAY_SVG;
        btn.classList.remove("playing");
      } else {
        for (const other of allRows) {
          if (other === entry || !other.ws) continue;
          other.ws.pause();
          if (other.btn) { other.btn.innerHTML = PLAY_SVG; other.btn.classList.remove("playing"); }
        }
        ws.play();
        btn.innerHTML = PAUSE_SVG;
        btn.classList.add("playing");
      }
    });

    if (io) {
      entry.el._entry = entry;
      io.observe(entry.el);
    } else {
      hydrateRow(entry).catch(err => console.error(err));
    }
  }
}

// ╔══════════════════════════════════════════════════════════════╗
// ║  TABLE OF CONTENTS + NAVIGATION                             ║
// ╚══════════════════════════════════════════════════════════════╝

function buildTOC() {
  const items = SECTIONS.map(section => {
    const subs = section.dimensions.map(dim =>
      `<li><a href="#${dimAnchorId(section, dim)}" data-section="${section.id}">${dim.name}</a></li>`
    ).join("");
    const tag = section.tag ? ` <span class="toc-tag">${section.tag}</span>` : "";
    return `
      <li>
        <a href="#${section.id}">${section.title}${tag}</a>
        <ul>${subs}</ul>
      </li>`;
  }).join("");

  const nav = document.createElement("nav");
  nav.id = "toc";
  nav.setAttribute("aria-label", "Table of contents");
  nav.innerHTML = `<div class="toc-title">Contents</div><ul>${items}</ul>`;

  // Sits between the header and the samples; CSS docks it to the gutter on wide screens.
  document.querySelector("header").insertAdjacentElement("afterend", nav);
}

function initScrollSpy() {
  const links = Array.from(document.querySelectorAll('#toc a'));

  // Highlight based on the dimension headings (the leaf entries), in document order.
  const targets = SECTIONS.flatMap(section =>
    section.dimensions.map(dim => ({
      id: dimAnchorId(section, dim),
      sectionId: section.id,
      el: document.getElementById(dimAnchorId(section, dim)),
    }))
  ).filter(t => t.el);

  const setActive = (id, sectionId) => {
    links.forEach(a => {
      const href = a.getAttribute("href").slice(1);
      a.classList.toggle("active", href === id || href === sectionId);
    });
  };

  // Position-based detection: the active heading is the last one whose top edge
  // has crossed a reference line near the top of the viewport. This stays correct
  // even when a clicked heading is pinned at the very top (above any IO band),
  // which is what previously left the highlight one entry behind.
  const LINE = 120; // px from the top of the viewport
  let ticking = false;

  const update = () => {
    ticking = false;
    let current = targets[0];
    for (const t of targets) {
      if (t.el.getBoundingClientRect().top - LINE <= 0) current = t;
      else break;
    }
    // At the very bottom of the page, force the final heading active.
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
      current = targets[targets.length - 1];
    }
    if (current) setActive(current.id, current.sectionId);
  };

  const onScroll = () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();
}

function initBackToTop() {
  const btn = document.createElement("button");
  btn.id = "to-top";
  btn.setAttribute("aria-label", "Back to top");
  btn.innerHTML = '<svg viewBox="0 0 24 24"><polygon points="12,5 20,15 4,15"/></svg>';
  document.body.appendChild(btn);

  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  const onScroll = () => btn.classList.toggle("show", window.scrollY > 500);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// Boot
buildApp();
buildTOC();
initScrollSpy();
initBackToTop();
initPlayers();
