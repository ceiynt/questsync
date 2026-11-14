const DEFAULT_API_BASE = "https://questsync-arnx.onrender.com";

const urlApiParam = new URLSearchParams(window.location.search).get("api");
if (urlApiParam) {
  localStorage.setItem("questsync_api_base", urlApiParam.replace(/\/+$/, ""));
  window.history.replaceState({}, "", window.location.pathname);
}

let apiBase = localStorage.getItem("questsync_api_base") || DEFAULT_API_BASE;

const REGION_LABELS = {
  missions: "Storyline Missions",
  custom: "CatsEyeXI Custom",
  sandoria: "San d'Oria",
  bastok: "Bastok",
  windurst: "Windurst",
  jeuno: "Jeuno",
  other: "Other Areas",
  outlands: "Outlands",
  toau: "Aht Urhgan",
  wotg: "Wings of the Goddess",
  abyssea: "Abyssea",
  soa: "Seekers of Adoulin",
  coalition: "Coalitions",
};

const MISSION_DEFINITIONS = [
  { key: "nation_current", name: "Current Nation Mission", wiki: "Category:Missions", completeMin: 65535, hub: "auto_nation", zone: "Home Nation / Embassy" },
  { key: "zilart", name: "Rise of the Zilart", wiki: "Category:Rise_of_the_Zilart_Missions", completeMin: 31, hub: "outlands", zone: "Norg / Kazham" },
  { key: "cop", name: "Chains of Promathia", wiki: "Category:Chains_of_Promathia_Missions", completeMin: 850, hub: "jeuno", zone: "Lower Jeuno / Tavnazia" },
  { key: "toau", name: "Treasures of Aht Urhgan", wiki: "Category:Treasures_of_Aht_Urhgan_Missions", completeMin: 48, hub: "toau", zone: "Aht Urhgan Whitegate" },
  { key: "wotg", name: "Wings of the Goddess", wiki: "Category:Wings_of_the_Goddess_Missions", completeMin: 54, hub: "wotg", zone: "Shadowreign [S] Cities" },
  { key: "acp", name: "A Crystalline Prophecy", wiki: "Category:A_Crystalline_Prophecy_Missions", completeMin: 14, hub: "jeuno", zone: "Lower Jeuno" },
  { key: "mkd", name: "A Moogle Kupo d'Etat", wiki: "Category:A_Moogle_Kupo_d'Etat_Missions", completeMin: 14, hub: "jeuno", zone: "Upper Jeuno" },
  { key: "asa", name: "A Shantotto Ascension", wiki: "Category:A_Shantotto_Ascension_Missions", completeMin: 14, hub: "windurst", zone: "Windurst Walls" },
  { key: "soa", name: "Seekers of Adoulin", wiki: "Category:Seekers_of_Adoulin_Missions", completeMin: 100, hub: "soa", zone: "Western / Eastern Adoulin" },
  { key: "rov", name: "Rhapsodies of Vana'diel", wiki: "Category:Rhapsodies_of_Vana'diel_Missions", completeMin: 210, hub: "outlands", zone: "Norg / Selbina / Mhaura" },
  { key: "tvr", name: "The Voracious Resurgence", wiki: "Category:The_Voracious_Resurgence_Missions", completeMin: 50, hub: "jeuno", zone: "Jeuno / Bastok / San d'Oria" },
];

const ROUTE_HUBS = {
  sandoria:        { label: "San d'Oria & Ronfaure",    defaultZone: "Southern San d'Oria", x: 20, y: 20 },
  bastok:          { label: "Bastok & Gustaberg",       defaultZone: "Bastok Mines",        x: 20, y: 75 },
  windurst:        { label: "Windurst & Sarutabaruta",  defaultZone: "Windurst Waters",     x: 80, y: 80 },
  jeuno:           { label: "Jeuno & Qufim",            defaultZone: "Lower Jeuno",         x: 50, y: 45 },
  selbina_valkurm: { label: "Selbina & Valkurm",        defaultZone: "Selbina",             x: 35, y: 45 },
  mhaura_buburimu: { label: "Mhaura & Buburimu",        defaultZone: "Mhaura",              x: 68, y: 68 },
  outlands:        { label: "Norg, Kazham & Outlands",  defaultZone: "Norg",                x: 88, y: 55 },
  toau:            { label: "Aht Urhgan",               defaultZone: "Aht Urhgan Whitegate",x: 92, y: 30 },
  wotg:            { label: "Shadowreign [S]",          defaultZone: "Southern San d'Oria [S]", x: 45, y: 25 },
  abyssea:         { label: "Abyssea",                  defaultZone: "Port Jeuno",          x: 52, y: 42 },
  soa:             { label: "Adoulin",                  defaultZone: "Western Adoulin",     x: 10, y: 45 },
};

const ALL_JOBS = [
  "WAR", "MNK", "WHM", "BLM", "RDM", "THF",
  "PLD", "DRK", "BST", "BRD", "RNG", "SAM",
  "NIN", "DRG", "SMN", "BLU", "COR", "PUP",
  "DNC", "SCH", "GEO", "RUN"
];

const FAME_LABELS = {
  sandoria: "San d'Oria",
  bastok: "Bastok",
  windurst: "Windurst",
  jeuno: "Jeuno",
  selbina_rabao: "Selbina / Rabao",
  norg: "Norg",
  kazham: "Kazham",
  adoulin: "Adoulin",
};

const ALL_BAGS = [
  "inventory", "wardrobe", "wardrobe2", "wardrobe3", "wardrobe4",
  "wardrobe5", "wardrobe6", "wardrobe7", "wardrobe8",
  "safe", "safe2", "storage", "locker", "satchel", "sack", "case"
];
const STORAGE_BAGS = ALL_BAGS.filter((b) => b !== "inventory");

const JOB_MASKS = {
  WAR: 1 << 1,  MNK: 1 << 2,  WHM: 1 << 3,  BLM: 1 << 4,
  RDM: 1 << 5,  THF: 1 << 6,  PLD: 1 << 7,  DRK: 1 << 8,
  BST: 1 << 9,  BRD: 1 << 10, RNG: 1 << 11, SAM: 1 << 12,
  NIN: 1 << 13, DRG: 1 << 14, SMN: 1 << 15, BLU: 1 << 16,
  COR: 1 << 17, PUP: 1 << 18, DNC: 1 << 19, SCH: 1 << 20,
  GEO: 1 << 21, RUN: 1 << 22,
};

const SLOT_MASKS = {
  Main: 1, Sub: 2, Range: 4, Ammo: 8,
  Head: 16, Body: 32, Hands: 64, Legs: 128, Feet: 256,
  Neck: 512, Waist: 1024, Ear: 6144, Ring: 24576, Back: 32768,
};

function loadDefaultFilters() {
  try {
    const saved = JSON.parse(localStorage.getItem("questsync_default_filters"));
    if (saved && typeof saved === "object") {
      return {
        not_collected: saved.not_collected !== false,
        collected: saved.collected !== false,
        complete: saved.complete !== false,
      };
    }
  } catch (_) {}
  return { not_collected: true, collected: true, complete: true };
}

function loadRouteCheckedSteps() {
  try {
    return new Set(JSON.parse(localStorage.getItem("questsync_route_checked")) || []);
  } catch (_) {
    return new Set();
  }
}

function loadCraftingQueue() {
  try {
    const arr = JSON.parse(localStorage.getItem("questsync_crafting_queue"));
    return Array.isArray(arr) ? arr : [];
  } catch (_) {
    return [];
  }
}

function loadSubcraftBuySet() {
  try {
    return new Set((JSON.parse(localStorage.getItem("questsync_subcraft_buy_ids")) || []).map(Number));
  } catch (_) {
    return new Set();
  }
}

function loadShoppingCheckedSet() {
  try {
    return new Set(JSON.parse(localStorage.getItem("questsync_shopping_checked")) || []);
  } catch (_) {
    return new Set();
  }
}

let activeFilters = loadDefaultFilters();
let routeCheckedSteps = loadRouteCheckedSteps();
let craftingQueue = loadCraftingQueue();
let subcraftBuySet = loadSubcraftBuySet();
let shoppingCheckedSet = loadShoppingCheckedSet();

let currentPayload = null;
let selectedRegion = "all";
let searchQuery = "";
let prereqEligibilityFilter = "all";
let prereqTypeFilter = "all";

let equipQuery = "";
let equipMaxLvl = 0;
let equipJob = "all";
let equipSlot = "all";
let equipOwnedFilter = "all";
let equipCraftableFilter = "all";
let equipCraftSkillFilter = "all";

let recipeQuery = "bronze harness";
let synthMultiplier = 1;
let selectedRecipeId = null;

const RECIPES_BY_ITEM_ID = new Map();
const PRIMARY_RECIPE_BY_RESULT_ID = new Map();
const RECIPE_BY_ID = new Map();

(window.CRAFT_RECIPES || []).forEach((recipe) => {
  RECIPE_BY_ID.set(recipe.id, recipe);

  if (!RECIPES_BY_ITEM_ID.has(recipe.result_id)) {
    RECIPES_BY_ITEM_ID.set(recipe.result_id, []);
  }
  RECIPES_BY_ITEM_ID.get(recipe.result_id).push({ recipe, isHq: false });

  if (!recipe.desynth && !PRIMARY_RECIPE_BY_RESULT_ID.has(recipe.result_id)) {
    PRIMARY_RECIPE_BY_RESULT_ID.set(recipe.result_id, recipe);
  }

  (recipe.hq_ids || []).forEach((hqId) => {
    if (!RECIPES_BY_ITEM_ID.has(hqId)) {
      RECIPES_BY_ITEM_ID.set(hqId, []);
    }
    RECIPES_BY_ITEM_ID.get(hqId).push({ recipe, isHq: true });
  });
});

const el = {
  characterSelect: document.getElementById("characterSelect"),
  syncStatus: document.getElementById("syncStatus"),
  refreshBtn: document.getElementById("refreshBtn"),
  settingsBtn: document.getElementById("settingsBtn"),
  settingsPanel: document.getElementById("settingsPanel"),
  apiBaseInput: document.getElementById("apiBaseInput"),
  saveApiBtn: document.getElementById("saveApiBtn"),
  defaultNotCollected: document.getElementById("defaultNotCollected"),
  defaultCollected: document.getElementById("defaultCollected"),
  defaultComplete: document.getElementById("defaultComplete"),
  toggleAllFiltersBtn: document.getElementById("toggleAllFiltersBtn"),
  tabQuestsBtn: document.getElementById("tabQuestsBtn"),
  tabRouteBtn: document.getElementById("tabRouteBtn"),
  tabEquipmentBtn: document.getElementById("tabEquipmentBtn"),
  tabCraftingBtn: document.getElementById("tabCraftingBtn"),
  queueNavBadge: document.getElementById("queueNavBadge"),
  questsView: document.getElementById("questsView"),
  routeView: document.getElementById("routeView"),
  equipmentView: document.getElementById("equipmentView"),
  craftingView: document.getElementById("craftingView"),
  progressLabel: document.getElementById("progressLabel"),
  progressCount: document.getElementById("progressCount"),
  progressBar: document.getElementById("progressBar"),
  searchInput: document.getElementById("searchInput"),
  regionSelect: document.getElementById("regionSelect"),
  prereqEligibilitySelect: document.getElementById("prereqEligibilitySelect"),
  prereqTypeSelect: document.getElementById("prereqTypeSelect"),
  questList: document.getElementById("questList"),
  syncedStatsBanner: document.getElementById("syncedStatsBanner"),
  routeStartHubSelect: document.getElementById("routeStartHubSelect"),
  routeScopeSelect: document.getElementById("routeScopeSelect"),
  routeIncMissions: document.getElementById("routeIncMissions"),
  routeIncCollected: document.getElementById("routeIncCollected"),
  routeIncEligible: document.getElementById("routeIncEligible"),
  routeBatchSizeSelect: document.getElementById("routeBatchSizeSelect"),
  clearRouteChecksBtn: document.getElementById("clearRouteChecksBtn"),
  routeSummaryBar: document.getElementById("routeSummaryBar"),
  routeStepsList: document.getElementById("routeStepsList"),
  equipSearchInput: document.getElementById("equipSearchInput"),
  equipMaxLvlInput: document.getElementById("equipMaxLvlInput"),
  equipJobSelect: document.getElementById("equipJobSelect"),
  equipSlotSelect: document.getElementById("equipSlotSelect"),
  equipOwnedSelect: document.getElementById("equipOwnedSelect"),
  equipCraftableSelect: document.getElementById("equipCraftableSelect"),
  equipCraftSkillSelect: document.getElementById("equipCraftSkillSelect"),
  equipSummaryBar: document.getElementById("equipSummaryBar"),
  equipmentList: document.getElementById("equipmentList"),
  craftingQueueCard: document.getElementById("craftingQueueCard"),
  recipeSearchInput: document.getElementById("recipeSearchInput"),
  synthCountInput: document.getElementById("synthCountInput"),
  recipeDetailCard: document.getElementById("recipeDetailCard"),
  recipeList: document.getElementById("recipeList"),
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildWikiUrl(name, mode = "standard") {
  if (mode === "mission") {
    return `https://www.bg-wiki.com/ffxi/${name}`;
  }
  const slug = encodeURIComponent(name.trim().replace(/\s+/g, "_"));
  if (mode === "custom") {
    return `https://www.bg-wiki.com/ffxi/CatsEyeXI_Systems/Quests#${slug}`;
  }
  return `https://www.bg-wiki.com/ffxi/${slug}`;
}

function buildCatsEyeAhUrl(itemName) {
  return `https://catseyexi.com/items?search=${encodeURIComponent(itemName)}`;
}

function formatGil(amount) {
  return `${Math.round(Number(amount) || 0).toLocaleString()}g`;
}

function formatRelativeTime(isoString) {
  if (!isoString) return "Never synced";
  const diffSec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diffSec < 60) return "Synced just now";
  if (diffSec < 3600) return `Synced ${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `Synced ${Math.floor(diffSec / 3600)}h ago`;
  return `Synced ${Math.floor(diffSec / 86400)}d ago`;
}

function formatJobsMask(mask) {
  if (!mask) return "";
  if ((mask & 8388606) === 8388606) return "All Jobs";
  const matched = [];
  for (const [abbr, bit] of Object.entries(JOB_MASKS)) {
    if ((mask & bit) !== 0) matched.push(abbr);
  }
  return matched.join("/");
}

function formatSlotsMask(mask) {
  const matched = [];
  for (const [name, bit] of Object.entries(SLOT_MASKS)) {
    if ((mask & bit) !== 0) matched.push(name);
  }
  return matched.join("/");
}

function saveCraftingQueue() {
  localStorage.setItem("questsync_crafting_queue", JSON.stringify(craftingQueue));
  updateQueueNavBadge();
}

function saveSubcraftBuySet() {
  localStorage.setItem("questsync_subcraft_buy_ids", JSON.stringify(Array.from(subcraftBuySet)));
}

function saveShoppingCheckedSet() {
  localStorage.setItem("questsync_shopping_checked", JSON.stringify(Array.from(shoppingCheckedSet)));
}

function updateQueueNavBadge() {
  const totalQueued = craftingQueue.reduce((sum, entry) => sum + (Number(entry.synths) || 1), 0);
  if (totalQueued > 0) {
    el.queueNavBadge.textContent = String(totalQueued);
    el.queueNavBadge.classList.remove("hidden");
  } else {
    el.queueNavBadge.classList.add("hidden");
  }
}

function addToCraftingQueue(recipeId, synthsToAdd = 1) {
  const rId = Number(recipeId);
  const qty = Math.max(1, Number(synthsToAdd) || 1);
  const existing = craftingQueue.find((item) => item.recipeId === rId);
  if (existing) {
    existing.synths += qty;
  } else {
    craftingQueue.push({ recipeId: rId, synths: qty });
  }
  saveCraftingQueue();
}

function getSyncedJobLevels() {
  return (currentPayload && currentPayload.data && currentPayload.data.job_levels) || {};
}

function getSyncedUnlockedJobs() {
  return (currentPayload && currentPayload.data && currentPayload.data.unlocked_jobs) || {};
}

function getSyncedCraftSkills() {
  return (currentPayload && currentPayload.data && currentPayload.data.craft_skills) || {};
}

function getHighestSyncedJobLevel() {
  const levels = getSyncedJobLevels();
  let highest = Number((currentPayload && currentPayload.data && currentPayload.data.main_job_level) || 0);
  for (const j of ALL_JOBS) {
    const lvl = Number(levels[j] || 0);
    if (lvl > highest) highest = lvl;
  }
  return highest;
}

function getCurrentZoneName() {
  const zid = currentPayload && currentPayload.data && currentPayload.data.current_zone_id;
  if (!zid) return "";
  return (window.ZONE_NAMES && window.ZONE_NAMES[String(zid)]) || `Zone #${zid}`;
}

function classifyZoneToHub(zoneName, fallbackRegion = "jeuno") {
  const z = (zoneName || "").toLowerCase();
  if (!z) return ROUTE_HUBS[fallbackRegion] ? fallbackRegion : "jeuno";

  if (z.includes("[s]") || z.includes("grauberg") || z.includes("vunkerl") || z.includes("fort karugo")) return "wotg";
  if (z.includes("abyssea")) return "abyssea";
  if (z.includes("adoulin") || z.includes("ceizak") || z.includes("yahse") || z.includes("foret") || z.includes("morimar") || z.includes("marjami") || z.includes("yorcia") || z.includes("kamihr") || z.includes("rala") || z.includes("cirdas")) return "soa";
  if (z.includes("aht urhgan") || z.includes("al zahbi") || z.includes("nashmau") || z.includes("bhaflau") || z.includes("wajaom") || z.includes("aydeewa") || z.includes("arrapago") || z.includes("halvung") || z.includes("caedarva")) return "toau";
  if (z.includes("selbina") || z.includes("valkurm") || z.includes("la theine") || z.includes("ordelle")) return "selbina_valkurm";
  if (z.includes("mhaura") || z.includes("buburimu") || z.includes("tahrongi") || z.includes("maze of shakhrami")) return "mhaura_buburimu";
  if (z.includes("san d'oria") || z.includes("oraguille") || z.includes("ronfaure") || z.includes("ghelsba") || z.includes("ranperre") || z.includes("jugner") || z.includes("davoi") || z.includes("bostaunieux")) return "sandoria";
  if (z.includes("bastok") || z.includes("metalworks") || z.includes("gustaberg") || z.includes("zeruhn") || z.includes("dangruf") || z.includes("palborough") || z.includes("konschtat") || z.includes("pashhow") || z.includes("beadeaux") || z.includes("korroloka")) return "bastok";
  if (z.includes("windurst") || z.includes("heavens tower") || z.includes("sarutabaruta") || z.includes("horutoto") || z.includes("giddeus") || z.includes("meriphataud") || z.includes("sauromugue") || z.includes("ozoztroja") || z.includes("toraimarai")) return "windurst";
  if (z.includes("norg") || z.includes("kazham") || z.includes("rabao") || z.includes("yuhtunga") || z.includes("yhoator") || z.includes("altepa") || z.includes("zi'tah") || z.includes("sea serpent") || z.includes("iftit") || z.includes("quicksand")) return "outlands";
  if (z.includes("jeuno") || z.includes("ru'lude") || z.includes("qufim") || z.includes("batallia") || z.includes("rolanberry") || z.includes("delkfutt") || z.includes("eldime") || z.includes("crawlers") || z.includes("garlaige")) return "jeuno";

  return ROUTE_HUBS[fallbackRegion] ? fallbackRegion : "jeuno";
}

function getEstimatedFameRanks() {
  const syncedRegions = (currentPayload && currentPayload.data && currentPayload.data.quests) || {};
  const countDone = (area) => (syncedRegions[area]?.completed || []).length;

  const sanRank = Math.min(9, 1 + Math.floor(countDone("sandoria") / 4));
  const basRank = Math.min(9, 1 + Math.floor(countDone("bastok") / 4));
  const winRank = Math.min(9, 1 + Math.floor(countDone("windurst") / 4));
  const outRank = Math.min(9, 1 + Math.floor(countDone("outlands") / 3));
  const otherRank = Math.min(9, 1 + Math.floor(countDone("other") / 3));
  const soaRank = Math.min(9, 1 + Math.floor((countDone("soa") + countDone("coalition")) / 4));

  return {
    sandoria: sanRank,
    bastok: basRank,
    windurst: winRank,
    jeuno: Math.max(sanRank, basRank, winRank, Math.min(9, 1 + Math.floor(countDone("jeuno") / 4))),
    selbina_rabao: Math.max(otherRank, Math.floor((sanRank + basRank) / 2)),
    norg: outRank,
    kazham: outRank,
    adoulin: soaRank,
  };
}

function getItemCounts(itemId) {
  const invData = (currentPayload && currentPayload.data && currentPayload.data.inventory) || {};
  const key = String(itemId);

  const inBag = Number((invData.inventory && invData.inventory[key]) || 0);
  let inStorage = 0;
  const bagLocations = [];

  if (inBag > 0) bagLocations.push(`Bag: ${inBag}`);

  for (const bag of STORAGE_BAGS) {
    const count = Number((invData[bag] && invData[bag][key]) || 0);
    if (count > 0) {
      inStorage += count;
      const label = bag.startsWith("wardrobe")
        ? bag.replace("wardrobe", "Wardrobe ")
        : bag.charAt(0).toUpperCase() + bag.slice(1);
      bagLocations.push(`${label.trim()}: ${count}`);
    }
  }

  return {
    inBag,
    inStorage,
    total: inBag + inStorage,
    locationsText: bagLocations.join(", "),
  };
}

function switchTab(tabName) {
  const tabs = [
    { name: "quests", btn: el.tabQuestsBtn, view: el.questsView },
    { name: "route", btn: el.tabRouteBtn, view: el.routeView },
    { name: "equipment", btn: el.tabEquipmentBtn, view: el.equipmentView },
    { name: "crafting", btn: el.tabCraftingBtn, view: el.craftingView },
  ];

  tabs.forEach((t) => {
    const active = t.name === tabName;
    t.view.classList.toggle("hidden", !active);
    t.btn.classList.toggle("bg-indigo-600", active);
    t.btn.classList.toggle("text-white", active);
    t.btn.classList.toggle("text-slate-400", !active);
  });

  if (tabName === "quests") renderQuests();
  if (tabName === "route") renderRouteOptimizer();
  if (tabName === "equipment") renderEquipment();
  if (tabName === "crafting") renderCrafting();
}

function evaluateQuestPrerequisites(region, questId, completedByRegion, missionsData) {
  const key = `${region}:${questId}`;
  const rules = (window.QUEST_PREREQS && window.QUEST_PREREQS[key]) || null;
  if (!rules) {
    return {
      hasPrereqs: false,
      eligible: true,
      types: [],
      badges: [],
      startZone: "",
      npc: "",
      targetZones: [],
    };
  }

  const jobLevels = getSyncedJobLevels();
  const unlockedJobs = getSyncedUnlockedJobs();
  const craftSkills = getSyncedCraftSkills();
  const estFame = getEstimatedFameRanks();
  const highestLvl = getHighestSyncedJobLevel();

  const badges = [];
  const types = new Set();
  let allMet = true;

  const reqJobs = rules.jobs || [];
  const minLvl = Number(rules.min_level || 0);

  if (reqJobs.length > 0 || minLvl > 0) {
    types.add("job_level");
    if (reqJobs.length > 0) {
      const metJob = reqJobs.some((j) => {
        const lvl = Number(jobLevels[j] || 0);
        const isUnlocked = Boolean(unlockedJobs[j]) || lvl > 0;
        return isUnlocked && lvl >= Math.max(1, minLvl);
      });
      if (!metJob) allMet = false;
      const lvlSuffix = minLvl > 0 ? ` Lv.${minLvl}+` : " Unlocked";
      badges.push({ met: metJob, text: `${reqJobs.join("/")}${lvlSuffix}` });
    } else {
      const metLvl = highestLvl >= minLvl;
      if (!metLvl) allMet = false;
      badges.push({ met: metLvl, text: `Any Job Lv.${minLvl}+` });
    }
  }

  for (const fReq of (rules.fame || [])) {
    types.add("fame");
    const currentRank = Number(estFame[fReq.area] || 1);
    const metFame = currentRank >= fReq.rank;
    if (!metFame) allMet = false;
    const label = FAME_LABELS[fReq.area] || fReq.area;
    badges.push({ met: metFame, text: `${label} Fame ${fReq.rank}+ (Est. ${currentRank})` });
  }

  for (const sReq of (rules.skills || [])) {
    types.add("skill");
    const mySkill = Number(craftSkills[sReq.skill] || 0);
    const metSkill = mySkill >= sReq.level;
    if (!metSkill) allMet = false;
    badges.push({ met: metSkill, text: `${sReq.skill} ${sReq.level}+ (You: ${mySkill})` });
  }

  for (const mReq of (rules.missions || [])) {
    types.add("mission");
    const mVal = Number((missionsData && missionsData[mReq.log]) || 0);
    const metMission = mVal > 0;
    if (!metMission) allMet = false;
    badges.push({ met: metMission, text: mReq.label });
  }

  for (const qReq of (rules.quests || [])) {
    types.add("chain");
    const doneSet = completedByRegion[qReq.area];
    const metChain = Boolean(doneSet && doneSet.has(Number(qReq.id)));
    if (!metChain) allMet = false;
    const prevName = (window.QUEST_CATALOG && window.QUEST_CATALOG[qReq.area] && window.QUEST_CATALOG[qReq.area][qReq.id])
      || `${REGION_LABELS[qReq.area] || qReq.area} #${qReq.id}`;
    badges.push({ met: metChain, text: `Prereq: ${prevName}` });
  }

  for (const flagText of (rules.flags || [])) {
    types.add("flagged");
    let metFlag = true;
    if (flagText === "Subjob Unlocked") {
      const doneOther = completedByRegion.other;
      const hasSjQuest = Boolean(doneOther && (doneOther.has(0) || doneOther.has(1)));
      const hasSubJob = Boolean(currentPayload && currentPayload.data && currentPayload.data.sub_job);
      metFlag = hasSjQuest || hasSubJob || highestLvl >= 18;
    }
    if (!metFlag) allMet = false;
    badges.push({ met: metFlag, text: flagText });
  }

  return {
    hasPrereqs: badges.length > 0,
    eligible: allMet,
    types: Array.from(types),
    badges,
    startZone: rules.start_zone || "",
    npc: rules.npc || "",
    turninZone: rules.turnin_zone || rules.start_zone || "",
    turninNpc: rules.turnin_npc || rules.npc || "",
    objectiveSummary: rules.objective_summary || "",
    repeatable: Boolean(rules.repeatable),
    targetZones: rules.target_zones || [],
  };
}

function syncToggleButtonsUI() {
  const toggleStyles = {
    not_collected: {
      on: ["bg-slate-800", "border-slate-500", "text-slate-100"],
      off: ["bg-slate-950/60", "border-slate-800", "text-slate-500"],
      dotOn: "bg-slate-300",
      dotOff: "bg-slate-700",
    },
    collected: {
      on: ["bg-amber-500/15", "border-amber-500/50", "text-amber-300"],
      off: ["bg-slate-950/60", "border-slate-800", "text-slate-500"],
      dotOn: "bg-amber-400",
      dotOff: "bg-slate-700",
    },
    complete: {
      on: ["bg-emerald-500/15", "border-emerald-500/50", "text-emerald-300"],
      off: ["bg-slate-950/60", "border-slate-800", "text-slate-500"],
      dotOn: "bg-emerald-400",
      dotOff: "bg-slate-700",
    },
  };

  document.querySelectorAll(".status-toggle").forEach((btn) => {
    const key = btn.dataset.filter;
    const isOn = Boolean(activeFilters[key]);
    const style = toggleStyles[key];
    const dot = btn.querySelector(".toggle-dot");

    btn.setAttribute("aria-pressed", String(isOn));
    btn.classList.remove(...style.on, ...style.off);
    btn.classList.add(...(isOn ? style.on : style.off));

    if (dot) {
      dot.classList.remove(style.dotOn, style.dotOff);
      dot.classList.add(isOn ? style.dotOn : style.dotOff);
    }
  });
}

function saveDefaultFilterSettings() {
  const defaults = {
    not_collected: el.defaultNotCollected.checked,
    collected: el.defaultCollected.checked,
    complete: el.defaultComplete.checked,
  };
  localStorage.setItem("questsync_default_filters", JSON.stringify(defaults));
  activeFilters = { ...defaults };
  syncToggleButtonsUI();
  renderQuests();
}

function normalizeItems() {
  const items = [];
  const syncedRegions = (currentPayload && currentPayload.data && currentPayload.data.quests) || {};
  const customQuests = (currentPayload && currentPayload.data && currentPayload.data.custom_quests) || {};
  const missionsData = (currentPayload && currentPayload.data && currentPayload.data.missions) || {};

  const completedByRegion = {};
  for (const region of Object.keys(REGION_LABELS)) {
    completedByRegion[region] = new Set((syncedRegions[region]?.completed || []).map(Number));
  }

  for (const m of MISSION_DEFINITIONS) {
    const rawVal = Number(missionsData[m.key] || 0);
    let status = "not_collected";
    let detail = null;

    if (m.key === "nation_current") {
      if (rawVal === 65535) {
        status = "not_collected";
        detail = "No active nation mission";
      } else if (rawVal > 0) {
        status = "collected";
        detail = `Active Mission ID #${rawVal}`;
      }
    } else if (rawVal >= m.completeMin) {
      status = "complete";
      detail = "Storyline Complete";
    } else if (rawVal > 0) {
      status = "collected";
      detail = `Current Step Value: ${rawVal}`;
    }

    items.push({
      id: `mission-${m.key}`,
      missionDef: m,
      name: m.name,
      region: "missions",
      regionLabel: REGION_LABELS.missions,
      status,
      detail,
      wikiUrl: buildWikiUrl(m.wiki, "mission"),
      prereq: { hasPrereqs: false, eligible: true, types: ["mission"], badges: [], startZone: m.zone, npc: "", targetZones: [] },
    });
  }

  for (const [region, label] of Object.entries(REGION_LABELS)) {
    if (region === "custom" || region === "missions") continue;

    const catalog = (window.QUEST_CATALOG && window.QUEST_CATALOG[region]) || {};
    const collectedSet = new Set((syncedRegions[region]?.current || []).map(Number));
    const completeSet = completedByRegion[region];

    const allIds = new Set([
      ...Object.keys(catalog).map(Number),
      ...collectedSet,
      ...completeSet,
    ]);

    for (const id of Array.from(allIds).sort((a, b) => a - b)) {
      const name = catalog[id] || `${label} Quest #${id}`;
      let status = "not_collected";
      if (completeSet.has(id)) status = "complete";
      else if (collectedSet.has(id)) status = "collected";

      const prereq = evaluateQuestPrerequisites(region, id, completedByRegion, missionsData);

      items.push({
        id: `${region}-${id}`,
        questNumId: id,
        name,
        region,
        regionLabel: label,
        status,
        detail: prereq.startZone ? `${prereq.startZone}${prereq.npc ? ` (${prereq.npc})` : ""}` : null,
        wikiUrl: buildWikiUrl(name, "standard"),
        prereq,
      });
    }
  }

  for (const [name, meta] of Object.entries(customQuests)) {
    items.push({
      id: `custom-${name}`,
      name,
      region: "custom",
      regionLabel: REGION_LABELS.custom,
      status: meta.status === "completed" ? "complete" : "collected",
      detail: meta.detail || null,
      wikiUrl: buildWikiUrl(name, "custom"),
      prereq: { hasPrereqs: false, eligible: true, types: ["flagged"], badges: [], startZone: "CatsEyeXI Custom", npc: "", targetZones: [] },
    });
  }

  return items;
}

function renderQuests() {
  const allItems = normalizeItems();

  const regionScoped = selectedRegion === "all"
    ? allItems
    : allItems.filter((q) => q.region === selectedRegion);

  const completeCount = regionScoped.filter((q) => q.status === "complete").length;
  const totalCount = regionScoped.length;
  const pct = totalCount > 0 ? Math.round((completeCount / totalCount) * 100) : 0;

  el.progressLabel.textContent = selectedRegion === "all"
    ? "Overall Quest & Mission Progress"
    : `${REGION_LABELS[selectedRegion]} Progress`;
  el.progressCount.textContent = `${completeCount} / ${totalCount} (${pct}%)`;
  el.progressBar.style.width = `${pct}%`;

  const anyFilterEnabled = activeFilters.not_collected || activeFilters.collected || activeFilters.complete;

  const filtered = regionScoped.filter((q) => {
    if (!activeFilters[q.status]) return false;
    if (prereqEligibilityFilter === "eligible" && !q.prereq.eligible) return false;
    if (prereqEligibilityFilter === "blocked" && q.prereq.eligible) return false;
    if (prereqTypeFilter !== "all" && !q.prereq.types.includes(prereqTypeFilter)) return false;
    if (searchQuery && !q.name.toLowerCase().includes(searchQuery)) return false;
    return true;
  });

  if (!anyFilterEnabled) {
    el.questList.innerHTML = `
      <div class="text-center py-10 px-4 text-sm text-slate-400 bg-slate-900/50 rounded-xl border border-slate-800/80 space-y-3">
        <p>All status filter toggles are currently turned off.</p>
        <button type="button" id="emptyResetFiltersBtn"
          class="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium">
          Turn All Toggles Back On
        </button>
      </div>`;
    const resetBtn = document.getElementById("emptyResetFiltersBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        activeFilters = { not_collected: true, collected: true, complete: true };
        syncToggleButtonsUI();
        renderQuests();
      });
    }
    return;
  }

  if (filtered.length === 0) {
    el.questList.innerHTML = `
      <div class="text-center py-10 text-sm text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800/80">
        No quests or missions match your current filters.
      </div>`;
    return;
  }

  const badgeStyles = {
    complete: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    collected: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    not_collected: "bg-slate-800 text-slate-400 border-slate-700",
  };
  const badgeText = {
    complete: "Complete",
    collected: "Collected",
    not_collected: "Not Collected",
  };

  el.questList.innerHTML = filtered.slice(0, 120).map((q) => {
    const prereqBadgesHtml = q.prereq.badges.length > 0
      ? `<div class="flex flex-wrap gap-1 mt-1.5">
          ${q.prereq.badges.map((b) => `
            <span class="text-[10px] px-1.5 py-0.5 rounded border ${
              b.met
                ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                : "bg-rose-500/10 text-rose-300 border-rose-500/30"
            }">
              ${b.met ? "✓" : "✗"} ${escapeHtml(b.text)}
            </span>
          `).join("")}
        </div>`
      : "";

    return `
      <a href="${q.wikiUrl}" target="_blank" rel="noopener noreferrer"
         class="flex items-start justify-between gap-3 bg-slate-900 hover:bg-slate-800/90 active:scale-[0.99] border border-slate-800 rounded-xl p-3.5 transition">
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-1.5 mb-1">
            <span class="text-[11px] font-medium px-2 py-0.5 rounded-full border ${badgeStyles[q.status]}">
              ${badgeText[q.status]}
            </span>
            <span class="text-xs text-slate-400 truncate">${escapeHtml(q.regionLabel)}</span>
          </div>
          <h2 class="text-sm font-medium text-slate-100 truncate">${escapeHtml(q.name)}</h2>
          ${q.detail ? `<p class="text-xs text-indigo-300 mt-0.5 truncate">${escapeHtml(q.detail)}</p>` : ""}
          ${prereqBadgesHtml}
        </div>
        <span class="text-xs font-medium text-indigo-400 shrink-0 pt-0.5">Wiki ↗</span>
      </a>
    `;
  }).join("");
}

function renderSyncedStatsBanner() {
  const data = (currentPayload && currentPayload.data) || {};
  const mj = data.main_job || "—";
  const mjl = data.main_job_level || 0;
  const sj = data.sub_job || "";
  const sjl = data.sub_job_level || 0;
  const highestLvl = getHighestSyncedJobLevel();
  const zoneName = getCurrentZoneName() || "Not synced yet";

  const craftSkills = getSyncedCraftSkills();
  const activeCrafts = Object.entries(craftSkills)
    .filter(([, lvl]) => Number(lvl) > 0)
    .map(([name, lvl]) => `${name} ${lvl}`);

  const jobSummary = mj !== "—"
    ? `${mj}${mjl}${sj ? `/${sj}${sjl}` : ""} (Max Job: Lv.${highestLvl})`
    : `Max Job: Lv.${highestLvl}`;

  el.syncedStatsBanner.innerHTML = `
    <div class="flex items-center justify-between gap-2 text-xs">
      <span class="font-semibold text-indigo-300">Auto-Synced Game State</span>
      <span class="text-slate-400 truncate">📍 ${escapeHtml(zoneName)}</span>
    </div>
    <div class="text-xs text-slate-200 font-mono">
      ⚔ ${escapeHtml(jobSummary)}
    </div>
    <div class="text-[11px] text-slate-400 truncate">
      ⚒ ${activeCrafts.length > 0 ? escapeHtml(activeCrafts.join(" · ")) : "No craft levels synced yet (run /questsync in-game)"}
    </div>
  `;
}

function hubDistance(hubKeyA, hubKeyB) {
  const a = ROUTE_HUBS[hubKeyA] || ROUTE_HUBS.jeuno;
  const b = ROUTE_HUBS[hubKeyB] || ROUTE_HUBS.jeuno;
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function orderHubsNearestNeighbor(startHubKey, candidateHubKeys) {
  const remaining = new Set(candidateHubKeys);
  const ordered = [];
  let current = startHubKey;

  if (remaining.has(current)) {
    ordered.push(current);
    remaining.delete(current);
  }

  while (remaining.size > 0) {
    let bestHub = null;
    let bestDist = Infinity;
    for (const candidate of remaining) {
      const d = hubDistance(current, candidate);
      if (d < bestDist) {
        bestDist = d;
        bestHub = candidate;
      }
    }
    ordered.push(bestHub);
    remaining.delete(bestHub);
    current = bestHub;
  }

  return ordered;
}

function buildOptimizedRoute() {
  const allItems = normalizeItems();
  const incMissions = el.routeIncMissions.checked;
  const incCollected = el.routeIncCollected.checked;
  const incEligible = el.routeIncEligible.checked;
  const batchLimit = Number(el.routeBatchSizeSelect.value) || 20;
  const scope = el.routeScopeSelect.value;

  const liveZone = getCurrentZoneName();
  const autoStartHub = classifyZoneToHub(liveZone, "sandoria");
  const startHub = el.routeStartHubSelect.value === "auto"
    ? autoStartHub
    : el.routeStartHubSelect.value;

  const itemsByHub = {};
  Object.keys(ROUTE_HUBS).forEach((k) => { itemsByHub[k] = []; });

  for (const item of allItems) {
    if (item.status === "complete") continue;

    if (item.region === "missions") {
      if (!incMissions || item.status !== "collected") continue;
      const mHub = item.missionDef.hub === "auto_nation" ? startHub : item.missionDef.hub;
      if (itemsByHub[mHub]) {
        itemsByHub[mHub].push({ ...item, routeHub: mHub });
      }
      continue;
    }

    if (item.region === "custom") continue;

    if (item.status === "collected" && !incCollected) continue;
    if (item.status === "not_collected" && (!incEligible || !item.prereq.eligible)) continue;

    const startZone = item.prereq.startZone || REGION_LABELS[item.region] || "";
    const hub = classifyZoneToHub(startZone, item.region);
    if (itemsByHub[hub]) {
      itemsByHub[hub].push({ ...item, routeHub: hub });
    }
  }

  const populatedHubs = Object.keys(itemsByHub).filter((k) => itemsByHub[k].length > 0);
  let orderedHubs = orderHubsNearestNeighbor(startHub, populatedHubs);

  if (scope === "local_hub") {
    orderedHubs = orderedHubs.filter((h) => h === startHub);
  } else if (scope === "nearby_2") {
    orderedHubs = orderedHubs.slice(0, 2);
  }

  const hubPlans = [];
  let totalQuestsIncluded = 0;
  let totalStepsCount = 0;

  for (const hubKey of orderedHubs) {
    if (totalQuestsIncluded >= batchLimit) break;

    const hubInfo = ROUTE_HUBS[hubKey];
    const pool = itemsByHub[hubKey];

    pool.sort((a, b) => {
      const rank = (x) => (x.region === "missions" ? 0 : x.status === "collected" ? 1 : 2);
      if (rank(a) !== rank(b)) return rank(a) - rank(b);
      const aInLiveZone = liveZone && (a.prereq.startZone || "").toLowerCase() === liveZone.toLowerCase() ? 0 : 1;
      const bInLiveZone = liveZone && (b.prereq.startZone || "").toLowerCase() === liveZone.toLowerCase() ? 0 : 1;
      if (aInLiveZone !== bInLiveZone) return aInLiveZone - bInLiveZone;
      return (a.prereq.startZone || "").localeCompare(b.prereq.startZone || "");
    });

    const selected = pool.slice(0, batchLimit - totalQuestsIncluded);
    totalQuestsIncluded += selected.length;

    const steps = [];

    const toCollect = selected.filter((i) => i.region !== "missions" && i.status === "not_collected");
    toCollect.sort((a, b) => (a.prereq.startZone || "").localeCompare(b.prereq.startZone || ""));

    for (const q of toCollect) {
      const zName = q.prereq.startZone || hubInfo.defaultZone;
      const npcStr = q.prereq.npc ? `Speak with ${q.prereq.npc} in ${zName}` : `Accept quest in ${zName}`;
      const goal = q.prereq.objectiveSummary ? ` · Goal: ${q.prereq.objectiveSummary}` : "";
      steps.push({ stepId: `collect:${q.id}`, phase: "Collect", zone: zName, title: q.name, subtitle: `${npcStr}${goal}`, repeatable: q.prereq.repeatable, wikiUrl: q.wikiUrl });
    }
    const fieldTasks = [];
    for (const item of selected) {
      if (item.region === "missions") {
        fieldTasks.push({ stepId: `mission:${item.id}`, phase: "Mission Step", zone: item.prereq.startZone || hubInfo.defaultZone, title: item.name, subtitle: item.detail || "Advance active storyline mission step", repeatable: false, wikiUrl: item.wikiUrl });
      } else {
        const targets = item.prereq.targetZones || [];
        const obj = item.prereq.objectiveSummary || (targets.length ? `Complete objective in ${targets.join(" / ")}` : "");
        if (targets.length || obj) {
          fieldTasks.push({ stepId: `do:${item.id}`, phase: "Objective", zone: targets[0] || item.prereq.startZone || hubInfo.defaultZone, title: item.name, subtitle: targets.length ? `${obj} (${targets.join(" / ")})` : obj, repeatable: item.prereq.repeatable, wikiUrl: item.wikiUrl });
        }
      }
    }
    fieldTasks.sort((a, b) => a.zone.localeCompare(b.zone));
    steps.push(...fieldTasks);
    const toTurnIn = selected.filter((i) => i.region !== "missions").sort((a, b) => (a.prereq.turninZone || a.prereq.startZone || "").localeCompare(b.prereq.turninZone || b.prereq.startZone || ""));
    for (const q of toTurnIn) {
      const zName = q.prereq.turninZone || q.prereq.startZone || hubInfo.defaultZone;
      const tNpc = q.prereq.turninNpc || q.prereq.npc;
      const npcStr = tNpc ? `Turn in to ${tNpc} in ${zName}` : `Turn in at ${zName}`;
      const hint = q.prereq.objectiveSummary ? ` (${q.prereq.objectiveSummary})` : "";
      steps.push({ stepId: `turnin:${q.id}`, phase: "Turn In", zone: zName, title: q.name, subtitle: `${npcStr}${hint}`, repeatable: q.prereq.repeatable, wikiUrl: q.wikiUrl });
    }
    totalStepsCount += steps.length;
    hubPlans.push({
      hubKey,
      hubLabel: hubInfo.label,
      questCount: selected.length,
      steps,
    });
  }

  return { startHub, hubPlans, totalQuestsIncluded, totalStepsCount };
}

function renderRouteOptimizer() {
  renderSyncedStatsBanner();
  const plan = buildOptimizedRoute();

  el.routeSummaryBar.innerHTML = `
    <span>${plan.totalQuestsIncluded} quests/missions batched · ${plan.totalStepsCount} route steps</span>
    <span>Start: ${escapeHtml(ROUTE_HUBS[plan.startHub]?.label || plan.startHub)}</span>
  `;

  if (plan.hubPlans.length === 0) {
    el.routeStepsList.innerHTML = `
      <div class="text-center py-10 px-4 text-sm text-slate-400 bg-slate-900/50 rounded-xl border border-slate-800/80 space-y-2">
        <p>No eligible quests or active missions found in this route scope.</p>
        <p class="text-xs text-slate-500">Try changing Route Scope to "Full Vana'diel Tour" or run /questsync in-game.</p>
      </div>`;
    return;
  }

  const phaseBadge = {
    "Collect": "bg-sky-500/15 text-sky-300 border-sky-500/30",
    "Mission Step": "bg-purple-500/15 text-purple-300 border-purple-500/30",
    "Objective": "bg-amber-500/15 text-amber-300 border-amber-500/30",
    "Turn In": "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  };

  el.routeStepsList.innerHTML = plan.hubPlans.map((hub, idx) => `
    <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div class="bg-slate-800/70 px-3.5 py-2.5 flex items-center justify-between border-b border-slate-800">
        <div>
          <span class="text-[11px] font-mono uppercase text-indigo-400">Stop ${idx + 1}</span>
          <h2 class="text-sm font-bold text-slate-100">${escapeHtml(hub.hubLabel)}</h2>
        </div>
        <span class="text-xs text-slate-400">${hub.questCount} batched</span>
      </div>

      <div class="divide-y divide-slate-800/70">
        ${hub.steps.map((step) => {
          const isDone = routeCheckedSteps.has(step.stepId);
          return `
            <div class="flex items-start gap-3 p-3 ${isDone ? "opacity-50" : ""}">
              <input type="checkbox" data-step-id="${escapeHtml(step.stepId)}" ${isDone ? "checked" : ""}
                class="route-step-cb mt-1 h-4 w-4 rounded accent-indigo-500 shrink-0 cursor-pointer" />
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-1.5 mb-0.5">
                  <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full border ${phaseBadge[step.phase] || ""}">
                    ${escapeHtml(step.phase)}
                  </span>
                  <span class="text-[11px] font-medium text-slate-300 truncate">${escapeHtml(step.zone)}</span>${step.repeatable ? `<span class="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">Repeatable</span>` : ""}
                </div>
                <div class="text-sm font-medium text-slate-100 ${isDone ? "line-through" : ""} truncate">
                  ${escapeHtml(step.title)}
                </div>
                <p class="text-xs text-slate-400 mt-0.5">${escapeHtml(step.subtitle)}</p>
              </div>
              <a href="${step.wikiUrl}" target="_blank" rel="noopener noreferrer"
                 class="text-xs font-medium text-indigo-400 shrink-0 pt-0.5">
                Wiki ↗
              </a>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `).join("");

  document.querySelectorAll(".route-step-cb").forEach((cb) => {
    cb.addEventListener("change", (e) => {
      const id = e.target.dataset.stepId;
      if (e.target.checked) routeCheckedSteps.add(id);
      else routeCheckedSteps.delete(id);
      localStorage.setItem("questsync_route_checked", JSON.stringify(Array.from(routeCheckedSteps)));
      renderRouteOptimizer();
    });
  });
}

function evaluateRecipeSkillMatch(recipeEntries) {
  if (!recipeEntries || recipeEntries.length === 0) {
    return { isCraftable: false, meetsSkill: false, bestEntry: null, statusLabel: "" };
  }

  const craftSkills = getSyncedCraftSkills();
  let bestEntry = recipeEntries[0];
  let bestMeets = false;

  for (const entry of recipeEntries) {
    const reqs = entry.recipe.skill_reqs || [];
    const meetsAll = reqs.every((req) => Number(craftSkills[req.skill] || 0) >= req.level);
    if (meetsAll && !bestMeets) {
      bestMeets = true;
      bestEntry = entry;
    }
  }

  const reqs = bestEntry.recipe.skill_reqs || [];
  let statusLabel = "";

  if (reqs.length === 0) {
    statusLabel = "No skill required";
  } else if (bestMeets) {
    statusLabel = `Skill OK (${reqs.map((r) => `${r.skill} ${r.level}`).join(", ")})`;
  } else {
    const gaps = reqs.map((r) => {
      const mine = Number(craftSkills[r.skill] || 0);
      return `${r.skill} ${r.level} (Synced: ${mine})`;
    });
    statusLabel = `Need ${gaps.join(", ")}`;
  }

  return {
    isCraftable: true,
    meetsSkill: bestMeets,
    bestEntry,
    statusLabel,
  };
}

function getAllEquipmentCatalog() {
  const retailRows = window.EQUIPMENT_DB || [];
  const customGear = (currentPayload && currentPayload.data && currentPayload.data.custom_equipment) || {};
  const seenIds = new Set();
  const list = [];

  for (const [id, name, catCode, lvl, jobs, slots, desc] of retailRows) {
    seenIds.add(id);
    list.push({
      id,
      name,
      category: catCode === 0 ? "Weapon" : "Armor",
      lvl,
      jobs,
      slots,
      desc,
      isCustom: false,
    });
  }

  for (const [idStr, meta] of Object.entries(customGear)) {
    const id = Number(idStr);
    if (!seenIds.has(id)) {
      list.push({
        id,
        name: meta.name || `Custom Gear #${id}`,
        category: "Custom",
        lvl: Number(meta.lvl) || 1,
        jobs: Number(meta.jobs) || 0,
        slots: Number(meta.slots) || 0,
        desc: meta.desc || "",
        isCustom: true,
      });
    }
  }

  return list;
}

function renderEquipment() {
  const catalog = getAllEquipmentCatalog();
  const q = equipQuery.trim().toLowerCase();
  const jobMask = equipJob === "all" ? 0 : (JOB_MASKS[equipJob] || 0);
  const slotMask = equipSlot === "all" ? 0 : (SLOT_MASKS[equipSlot] || 0);

  const matched = [];

  for (const item of catalog) {
    if (equipMaxLvl > 0 && item.lvl > equipMaxLvl) continue;
    if (jobMask && (item.jobs & jobMask) === 0) continue;
    if (slotMask && (item.slots & slotMask) === 0) continue;

    const counts = getItemCounts(item.id);
    const isOwned = counts.total > 0;
    if (equipOwnedFilter === "owned" && !isOwned) continue;
    if (equipOwnedFilter === "unowned" && isOwned) continue;

    const recipeEntries = RECIPES_BY_ITEM_ID.get(item.id) || [];
    const craftEval = evaluateRecipeSkillMatch(recipeEntries);

    if (equipCraftableFilter === "craftable" && !craftEval.isCraftable) continue;
    if (equipCraftableFilter === "within_skill" && (!craftEval.isCraftable || !craftEval.meetsSkill)) continue;

    if (equipCraftSkillFilter !== "all") {
      if (!craftEval.isCraftable) continue;
      const matchesSkill = recipeEntries.some((entry) =>
        (entry.recipe.skill_reqs || []).some((r) => r.skill === equipCraftSkillFilter)
      );
      if (!matchesSkill) continue;
    }

    if (q) {
      const hay = `${item.name} ${item.desc}`.toLowerCase();
      if (!hay.includes(q)) continue;
    }

    matched.push({ item, counts, isOwned, craftEval });
    if (matched.length >= 60) break;
  }

  el.equipSummaryBar.innerHTML = `
    <span>Showing ${matched.length}${matched.length === 60 ? "+" : ""} items</span>
    <span>Catalog: ${catalog.length.toLocaleString()} pieces</span>
  `;

  if (matched.length === 0) {
    el.equipmentList.innerHTML = `
      <div class="text-center py-10 text-sm text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800/80">
        No equipment matches your current filters.
      </div>`;
    return;
  }

  el.equipmentList.innerHTML = matched.map(({ item, counts, isOwned, craftEval }) => {
    const ownedBadge = isOwned
      ? `<span class="text-[11px] font-medium px-2 py-0.5 rounded-full border bg-emerald-500/15 text-emerald-400 border-emerald-500/30">Owned (${counts.total})</span>`
      : `<span class="text-[11px] font-medium px-2 py-0.5 rounded-full border bg-slate-800 text-slate-400 border-slate-700">Unowned</span>`;

    let craftBadge = "";
    let actionBtns = "";
    if (craftEval.isCraftable) {
      const rId = craftEval.bestEntry.recipe.id;
      const queuedItem = craftingQueue.find((qEntry) => qEntry.recipeId === rId);
      const badgeColor = craftEval.meetsSkill
        ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/40"
        : "bg-amber-500/15 text-amber-300 border-amber-500/30";
      craftBadge = `
        <span class="text-[11px] font-medium px-2 py-0.5 rounded-full border ${badgeColor}">
          ⚒ ${escapeHtml(craftEval.statusLabel)}
        </span>`;
      actionBtns = `
        <button type="button" data-queue-recipe-id="${rId}"
          class="equip-queue-btn text-xs font-semibold px-2.5 py-1 rounded-lg ${
            queuedItem
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
              : "bg-emerald-600 hover:bg-emerald-500 text-white"
          } transition">
          ${queuedItem ? `Queued (${queuedItem.synths}) +` : "+ Queue"}
        </button>
        <button type="button" data-open-recipe-id="${rId}"
          class="open-recipe-btn text-xs font-medium px-2 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30">
          Recipe →
        </button>`;
    }

    return `
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2">
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-1.5 mb-1">
              ${ownedBadge}
              <span class="text-[11px] text-slate-400">Lv.${item.lvl} · ${escapeHtml(formatSlotsMask(item.slots))}</span>
              ${item.isCustom ? `<span class="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">CatsEyeXI</span>` : ""}
            </div>
            <h2 class="text-sm font-semibold text-slate-100">${escapeHtml(item.name)}</h2>
          </div>

          <div class="flex items-center gap-1.5 shrink-0">
            ${actionBtns}
            <a href="${buildWikiUrl(item.name, "standard")}" target="_blank" rel="noopener noreferrer"
               class="text-xs font-medium px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
              Wiki ↗
            </a>
          </div>
        </div>

        ${item.desc ? `<p class="text-xs text-slate-300 bg-slate-950/70 rounded-lg px-2.5 py-1.5 font-mono leading-relaxed">${escapeHtml(item.desc)}</p>` : ""}

        <div class="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
          <span class="truncate max-w-[65%]">${escapeHtml(formatJobsMask(item.jobs))}</span>
          ${counts.locationsText ? `<span class="text-emerald-400/90">${escapeHtml(counts.locationsText)}</span>` : ""}
        </div>

        ${craftBadge ? `<div class="pt-1">${craftBadge}</div>` : ""}
      </div>
    `;
  }).join("");

  document.querySelectorAll(".equip-queue-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      addToCraftingQueue(Number(btn.dataset.queueRecipeId), 1);
      renderEquipment();
    });
  });

  document.querySelectorAll(".open-recipe-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const rId = Number(btn.dataset.openRecipeId);
      const found = RECIPE_BY_ID.get(rId);
      if (found) {
        selectedRecipeId = found.id;
        recipeQuery = found.name;
        el.recipeSearchInput.value = found.name;
        switchTab("crafting");
      }
    });
  });
}

function getMaterialPriceAndSources(itemId) {
  const key = String(itemId);
  const src = (window.MATERIAL_SOURCES && window.MATERIAL_SOURCES[key]) || {
    npc_gil: 0,
    vendors: [],
    gather: [],
    drops: [],
  };
  const syncedAh = currentPayload && currentPayload.data && currentPayload.data.ah_prices && currentPayload.data.ah_prices[key];

  let unitPrice = 0;
  let priceSourceLabel = "No price data";
  let isLiveAh = false;

  if (syncedAh && Number(syncedAh.median || syncedAh.last) > 0) {
    unitPrice = Number(syncedAh.median || syncedAh.last);
    priceSourceLabel = `Live AH: ${formatGil(unitPrice)}`;
    isLiveAh = true;
  } else if (src.vendors && src.vendors.length > 0 && src.vendors[0].price > 0) {
    unitPrice = Number(src.vendors[0].price);
    priceSourceLabel = `Vendor: ~${formatGil(unitPrice)}`;
  } else if (src.npc_gil > 0) {
    unitPrice = Number(src.npc_gil);
    priceSourceLabel = `Est. NPC/AH: ~${formatGil(unitPrice)}`;
  }

  return {
    unitPrice,
    priceSourceLabel,
    isLiveAh,
    vendors: src.vendors || [],
    gather: src.gather || [],
    drops: src.drops || [],
  };
}

function formatRecipeSummary(recipe, itemNames) {
  if (!recipe) return "";
  const crystalName = itemNames[String(recipe.crystal_id)] || "";
  const ingSummary = (recipe.ingredients || [])
    .map((i) => `${i.qty}× ${itemNames[String(i.id)] || `#${i.id}`}`)
    .join(", ");
  return `${crystalName ? `${crystalName} + ` : ""}${ingSummary}`;
}

function estimateSubcraftUnitMaterialCost(recipe, visited = new Set()) {
  if (!recipe || visited.has(recipe.result_id)) return 0;
  const nextVisited = new Set(visited);
  nextVisited.add(recipe.result_id);

  let batchCost = 0;
  if (recipe.crystal_id > 0) {
    batchCost += getMaterialPriceAndSources(recipe.crystal_id).unitPrice;
  }

  for (const ing of recipe.ingredients) {
    const childRecipe = PRIMARY_RECIPE_BY_RESULT_ID.get(ing.id);
    const directBuy = getMaterialPriceAndSources(ing.id).unitPrice;

    if (childRecipe && !nextVisited.has(ing.id)) {
      const childCraftUnit = estimateSubcraftUnitMaterialCost(childRecipe, nextVisited);
      const bestUnit = (directBuy > 0 && childCraftUnit > 0)
        ? Math.min(directBuy, childCraftUnit)
        : (childCraftUnit || directBuy);
      batchCost += bestUnit * ing.qty;
    } else {
      batchCost += directBuy * ing.qty;
    }
  }

  return Math.round(batchCost / Math.max(1, recipe.result_qty));
}

function buildQueuePlan(queueEntries) {
  const availablePool = new Map();
  const getPoolCount = (itemId) => {
    if (!availablePool.has(itemId)) {
      availablePool.set(itemId, getItemCounts(itemId).total);
    }
    return availablePool.get(itemId);
  };
  const consumePool = (itemId, qty) => {
    const cur = getPoolCount(itemId);
    const used = Math.min(cur, qty);
    availablePool.set(itemId, cur - used);
    return used;
  };

  const subcraftMap = new Map();
  const rawMaterialsMap = new Map();

  function addRawRequirement(itemId, qtyNeeded, isCrystal = false) {
    const used = consumePool(itemId, qtyNeeded);
    const missing = qtyNeeded - used;

    if (!rawMaterialsMap.has(itemId)) {
      rawMaterialsMap.set(itemId, {
        id: itemId,
        isCrystal,
        totalNeeded: 0,
        usedOwned: 0,
        missing: 0,
      });
    }
    const entry = rawMaterialsMap.get(itemId);
    entry.totalNeeded += qtyNeeded;
    entry.usedOwned += used;
    entry.missing += missing;
  }

  function expandRecipeNode(recipe, synthsCount, depth, visitedSet) {
    if (recipe.crystal_id > 0) {
      addRawRequirement(recipe.crystal_id, synthsCount, true);
    }

    for (const ing of recipe.ingredients) {
      const reqQty = ing.qty * synthsCount;
      const subRec = PRIMARY_RECIPE_BY_RESULT_ID.get(ing.id) || null;

      if (subRec && !visitedSet.has(ing.id) && depth < 4) {
        const usedOwned = consumePool(ing.id, reqQty);
        const missingSubQty = reqQty - usedOwned;
        const userChoseBuy = subcraftBuySet.has(ing.id);

        if (!subcraftMap.has(ing.id)) {
          subcraftMap.set(ing.id, {
            itemId: ing.id,
            recipe: subRec,
            totalNeeded: 0,
            usedOwned: 0,
            missingQty: 0,
            synthsNeeded: 0,
            mode: userChoseBuy ? "buy" : "craft",
            depth,
          });
        }
        const subEntry = subcraftMap.get(ing.id);
        subEntry.totalNeeded += reqQty;
        subEntry.usedOwned += usedOwned;
        subEntry.missingQty += missingSubQty;
        subEntry.depth = Math.max(subEntry.depth, depth);

        if (missingSubQty > 0) {
          if (userChoseBuy) {
            if (!rawMaterialsMap.has(ing.id)) {
              rawMaterialsMap.set(ing.id, {
                id: ing.id,
                isCrystal: false,
                totalNeeded: 0,
                usedOwned: 0,
                missing: 0,
              });
            }
            const rawSub = rawMaterialsMap.get(ing.id);
            rawSub.totalNeeded += reqQty;
            rawSub.usedOwned += usedOwned;
            rawSub.missing += missingSubQty;
          } else {
            const subSynths = Math.ceil(missingSubQty / Math.max(1, subRec.result_qty));
            subEntry.synthsNeeded += subSynths;
            const nextVisited = new Set(visitedSet);
            nextVisited.add(ing.id);
            expandRecipeNode(subRec, subSynths, depth + 1, nextVisited);
          }
        }
      } else {
        addRawRequirement(ing.id, reqQty, false);
      }
    }
  }

  for (const qItem of queueEntries) {
    const recipe = RECIPE_BY_ID.get(qItem.recipeId);
    if (recipe) {
      expandRecipeNode(recipe, qItem.synths, 0, new Set([recipe.result_id]));
    }
  }

  const subcraftsList = Array.from(subcraftMap.values())
    .sort((a, b) => b.depth - a.depth)
    .map((sub) => {
      const buyInfo = getMaterialPriceAndSources(sub.itemId);
      const buyUnit = buyInfo.unitPrice;
      const craftUnit = estimateSubcraftUnitMaterialCost(sub.recipe);

      const qtyToCompare = Math.max(1, sub.missingQty);
      const totalBuyCost = buyUnit * qtyToCompare;
      const totalCraftCost = craftUnit * qtyToCompare;
      const gilDiff = totalBuyCost - totalCraftCost;

      return {
        ...sub,
        buyInfo,
        buyUnit,
        craftUnit,
        totalBuyCost,
        totalCraftCost,
        gilDiff,
      };
    });

  let totalEstimatedGil = 0;
  let unpricedCount = 0;

  const shoppingList = Array.from(rawMaterialsMap.values()).map((mat) => {
    const info = getMaterialPriceAndSources(mat.id);
    const estCost = mat.missing * info.unitPrice;
    if (mat.missing > 0) {
      if (info.unitPrice > 0) totalEstimatedGil += estCost;
      else unpricedCount += 1;
    }
    return { ...mat, info, estCost };
  });

  shoppingList.sort((a, b) => {
    const aMiss = a.missing > 0 ? 0 : 1;
    const bMiss = b.missing > 0 ? 0 : 1;
    if (aMiss !== bMiss) return aMiss - bMiss;
    if (a.isCrystal !== b.isCrystal) return a.isCrystal ? 1 : -1;
    return a.id - b.id;
  });

  return {
    subcraftsList,
    shoppingList,
    totalEstimatedGil,
    unpricedCount,
  };
}

function renderCraftingQueueCard() {
  const itemNames = window.ITEM_NAMES || {};

  if (craftingQueue.length === 0) {
    el.craftingQueueCard.innerHTML = `
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-bold text-emerald-300">🛒 Crafting Queue &amp; Shopping List</h2>
        <span class="text-xs text-slate-400">Empty</span>
      </div>
      <p class="text-xs text-slate-400 leading-relaxed">
        Add multiple items (such as a chest, helm, and boots from the <strong>Equipment</strong> tab or recipes below) to combine all raw materials, compare <strong>Buy vs. Craft</strong> prices for subcrafts, and generate one unified shopping &amp; gathering list.
      </p>
    `;
    return;
  }

  const plan = buildQueuePlan(craftingQueue);
  const missingItems = plan.shoppingList.filter((m) => m.missing > 0);
  const readyItems = plan.shoppingList.filter((m) => m.missing === 0);

  const queuedItemsHtml = craftingQueue.map((qItem) => {
    const recipe = RECIPE_BY_ID.get(qItem.recipeId);
    if (!recipe) return "";
    const skillStr = (recipe.skills && recipe.skills[0]) || "No skill cap";
    return `
      <div class="flex items-center justify-between gap-2 bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2">
        <div class="min-w-0">
          <div class="text-sm font-semibold text-slate-100 truncate">
            ${escapeHtml(recipe.name)} ${recipe.result_qty > 1 ? `(×${recipe.result_qty * qItem.synths})` : ""}
          </div>
          <div class="text-[11px] text-slate-400">${escapeHtml(skillStr)}</div>
          <div class="text-[11px] text-slate-300/90 mt-0.5 truncate">${escapeHtml(formatRecipeSummary(recipe, itemNames))}</div>
        </div>

        <div class="flex items-center gap-1.5 shrink-0">
          <button type="button" data-q-dec="${qItem.recipeId}"
            class="q-dec-btn w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs">−</button>
          <span class="w-6 text-center font-mono text-xs font-semibold text-indigo-300">${qItem.synths}</span>
          <button type="button" data-q-inc="${qItem.recipeId}"
            class="q-inc-btn w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs">+</button>
          <button type="button" data-q-rem="${qItem.recipeId}" title="Remove"
            class="q-rem-btn ml-1 px-1.5 py-0.5 rounded bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 text-xs">✕</button>
        </div>
      </div>
    `;
  }).join("");

  let subcraftsSectionHtml = "";
  if (plan.subcraftsList.length > 0) {
    subcraftsSectionHtml = `
      <div class="space-y-2 pt-2 border-t border-slate-800/80">
        <div class="flex items-center justify-between">
          <h3 class="text-xs font-bold uppercase tracking-wider text-indigo-300">
            ⚒ Subcrafts: Buy vs. Craft Comparison
          </h3>
          <span class="text-[11px] text-slate-400">Tap toggle to switch</span>
        </div>

        <div class="space-y-2">
          ${plan.subcraftsList.map((sub, idx) => {
            const subName = itemNames[String(sub.itemId)] || sub.recipe.name;
            const skillStr = (sub.recipe.skills && sub.recipe.skills[0]) || "Any skill";
            const isBuyMode = sub.mode === "buy";

            let comparisonBadge = "";
            if (sub.missingQty === 0) {
              comparisonBadge = `<span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">Already Owned (${sub.usedOwned}/${sub.totalNeeded})</span>`;
            } else if (sub.buyUnit > 0 && sub.craftUnit > 0) {
              if (sub.gilDiff > 0) {
                comparisonBadge = `<span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">Save ${formatGil(sub.gilDiff)} by Crafting</span>`;
              } else if (sub.gilDiff < 0) {
                comparisonBadge = `<span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">Save ${formatGil(Math.abs(sub.gilDiff))} by Buying</span>`;
              } else {
                comparisonBadge = `<span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">Same Price</span>`;
              }
            } else if (sub.buyUnit === 0 && sub.craftUnit > 0) {
              comparisonBadge = `<span class="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">Craft Recommended (No Vendor Price)</span>`;
            }

            const priceCompareLine = sub.missingQty > 0
              ? `Buy ${sub.missingQty}×: <span class="text-slate-200 font-mono">${sub.buyUnit > 0 ? formatGil(sub.totalBuyCost) : "N/A"}</span> · Craft Mats: <span class="text-slate-200 font-mono">${sub.craftUnit > 0 ? formatGil(sub.totalCraftCost) : "N/A"}</span>`
              : `Have ${sub.usedOwned} in bags`;

            return `
              <div class="bg-slate-950/80 border ${isBuyMode ? "border-amber-500/40" : "border-indigo-500/30"} rounded-xl p-3 space-y-1.5 text-xs">
                <div class="flex items-start justify-between gap-2">
                  <div class="min-w-0">
                    <div class="flex items-center gap-1.5">
                      <span class="text-[11px] font-mono text-indigo-400">#${idx + 1}</span>
                      <span class="font-semibold text-slate-100 truncate">${escapeHtml(subName)}</span>
                      <span class="text-[11px] text-slate-400">(Need ${sub.missingQty})</span>
                    </div>
                    <div class="text-[11px] text-slate-400">${escapeHtml(skillStr)}</div>
                    <div class="text-[11px] text-slate-300/90 mt-0.5 truncate">${escapeHtml(formatRecipeSummary(sub.recipe, itemNames))}</div>
                  </div>

                  ${sub.missingQty > 0 ? `
                    <button type="button" data-toggle-subcraft-id="${sub.itemId}"
                      class="toggle-subcraft-mode-btn shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition ${
                        isBuyMode
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                          : "bg-indigo-600/25 text-indigo-300 border-indigo-500/40"
                      }">
                      ${isBuyMode ? "Mode: Buy Direct" : `Mode: Craft (${sub.synthsNeeded}×)`}
                    </button>
                  ` : ""}
                </div>

                <div class="flex flex-wrap items-center justify-between gap-1.5 pt-1 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <span>${priceCompareLine}</span>
                  ${comparisonBadge}
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  const shoppingHtml = missingItems.length === 0
    ? `<div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-300 font-medium">
        ✓ You already have every material needed for your entire crafting queue!
      </div>`
    : `<div class="space-y-2">
        ${missingItems.map((mat) => {
          const name = itemNames[String(mat.id)] || `Item #${mat.id}`;
          const checkKey = `mat:${mat.id}:${mat.missing}`;
          const isChecked = shoppingCheckedSet.has(checkKey);
          const sourcesLines = [];

          if (mat.info.vendors.length > 0) {
            const topV = mat.info.vendors[0];
            sourcesLines.push(`<div class="text-emerald-300/95">🏪 <strong>Buy:</strong> ${escapeHtml(topV.name)} (${formatGil(topV.price)}${topV.max_price > topV.price ? `–${formatGil(topV.max_price)}` : ""})</div>`);
          }
          if (mat.info.gather.length > 0) {
            sourcesLines.push(`<div class="text-sky-300/95">⛏ <strong>Gather:</strong> ${escapeHtml(mat.info.gather.join(", "))}</div>`);
          }
          if (mat.info.drops.length > 0) {
            sourcesLines.push(`<div class="text-amber-300/95">⚔ <strong>Farm Drop:</strong> ${escapeHtml(mat.info.drops.join(", "))}</div>`);
          }
          if (sourcesLines.length === 0) {
            sourcesLines.push(`<div class="text-slate-400">🏛 <strong>Source:</strong> Auction House / Bazaars</div>`);
          }

          return `
            <div class="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-1.5 text-xs ${isChecked ? "opacity-50" : ""}">
              <div class="flex items-start gap-2.5">
                <input type="checkbox" data-shop-key="${escapeHtml(checkKey)}" ${isChecked ? "checked" : ""}
                  class="shop-item-cb mt-0.5 h-4 w-4 rounded accent-emerald-500 shrink-0 cursor-pointer" />
                <div class="min-w-0 flex-1">
                  <div class="flex items-start justify-between gap-2">
                    <div>
                      <span class="font-bold text-rose-300">Need ${mat.missing}×</span>
                      <span class="font-semibold text-slate-100 ${isChecked ? "line-through" : ""}">${mat.isCrystal ? "💎 " : ""}${escapeHtml(name)}</span>
                      <span class="block text-[11px] text-slate-400">
                        Have ${mat.usedOwned}/${mat.totalNeeded} · ${escapeHtml(mat.info.priceSourceLabel)}
                        ${mat.estCost > 0 ? ` · <span class="text-amber-300 font-mono">${formatGil(mat.estCost)}</span>` : ""}
                      </span>
                    </div>
                    <div class="flex items-center gap-1 shrink-0">
                      <a href="${buildCatsEyeAhUrl(name)}" target="_blank" rel="noopener noreferrer"
                         class="text-[10px] font-medium px-2 py-1 rounded bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30">
                        AH ↗
                      </a>
                      <a href="${buildWikiUrl(name, "standard")}" target="_blank" rel="noopener noreferrer"
                         class="text-[10px] font-medium px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300">
                        Wiki ↗
                      </a>
                    </div>
                  </div>
                  <div class="text-[11px] space-y-0.5 pt-1.5 mt-1.5 border-t border-slate-800/80">
                    ${sourcesLines.join("")}
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join("")}
      </div>`;

  const alreadyHaveSummary = readyItems.length > 0
    ? `<div class="text-[11px] text-emerald-400/90 pt-1">
        ✓ Already in bags: ${readyItems.map((r) => `${r.usedOwned}× ${itemNames[String(r.id)] || `#${r.id}`}`).join(", ")}
      </div>`
    : "";

  el.craftingQueueCard.innerHTML = `
    <div class="flex items-center justify-between gap-2">
      <div>
        <h2 class="text-sm font-bold text-emerald-300">🛒 Crafting Queue (${craftingQueue.length} items)</h2>
        <p class="text-[11px] text-slate-400">Est. Total Buy Cost: <span class="font-mono font-semibold text-amber-300">${formatGil(plan.totalEstimatedGil)}${plan.unpricedCount > 0 ? "+" : ""}</span></p>
      </div>
      <button id="clearCraftingQueueBtn" type="button"
        class="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700">
        Clear Queue
      </button>
    </div>

    <div class="space-y-1.5">${queuedItemsHtml}</div>

    ${subcraftsSectionHtml}

    <div class="space-y-2 pt-2 border-t border-slate-800/80">
      <div class="flex items-center justify-between">
        <h3 class="text-xs font-bold uppercase tracking-wider text-rose-300">
          Combined Shopping &amp; Gathering List (${missingItems.length})
        </h3>
      </div>
      ${shoppingHtml}
      ${alreadyHaveSummary}
    </div>
  `;

  document.getElementById("clearCraftingQueueBtn").addEventListener("click", () => {
    craftingQueue = [];
    subcraftBuySet.clear();
    shoppingCheckedSet.clear();
    saveCraftingQueue();
    saveSubcraftBuySet();
    saveShoppingCheckedSet();
    renderCrafting();
    renderEquipment();
  });

  document.querySelectorAll(".q-inc-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const rId = Number(btn.dataset.qInc);
      const entry = craftingQueue.find((q) => q.recipeId === rId);
      if (entry) {
        entry.synths += 1;
        saveCraftingQueue();
        renderCrafting();
      }
    });
  });

  document.querySelectorAll(".q-dec-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const rId = Number(btn.dataset.qDec);
      const idx = craftingQueue.findIndex((q) => q.recipeId === rId);
      if (idx !== -1) {
        if (craftingQueue[idx].synths > 1) {
          craftingQueue[idx].synths -= 1;
        } else {
          craftingQueue.splice(idx, 1);
        }
        saveCraftingQueue();
        renderCrafting();
        renderEquipment();
      }
    });
  });

  document.querySelectorAll(".q-rem-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const rId = Number(btn.dataset.qRem);
      craftingQueue = craftingQueue.filter((q) => q.recipeId !== rId);
      saveCraftingQueue();
      renderCrafting();
      renderEquipment();
    });
  });

  document.querySelectorAll(".toggle-subcraft-mode-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const itemId = Number(btn.dataset.toggleSubcraftId);
      if (subcraftBuySet.has(itemId)) subcraftBuySet.delete(itemId);
      else subcraftBuySet.add(itemId);
      saveSubcraftBuySet();
      renderCraftingQueueCard();
    });
  });

  document.querySelectorAll(".shop-item-cb").forEach((cb) => {
    cb.addEventListener("change", (e) => {
      const k = e.target.dataset.shopKey;
      if (e.target.checked) shoppingCheckedSet.add(k);
      else shoppingCheckedSet.delete(k);
      saveShoppingCheckedSet();
      renderCraftingQueueCard();
    });
  });
}

function renderRecipeDetail(recipe) {
  if (!recipe) {
    el.recipeDetailCard.classList.add("hidden");
    return;
  }

  const itemNames = window.ITEM_NAMES || {};
  const plan = buildQueuePlan([{ recipeId: recipe.id, synths: synthMultiplier }]);

  let maxSynthsFromBag = Infinity;
  let maxSynthsTotal = Infinity;
  const checkDirect = [];
  if (recipe.crystal_id > 0) checkDirect.push({ id: recipe.crystal_id, qty: 1 });
  recipe.ingredients.forEach((i) => checkDirect.push({ id: i.id, qty: i.qty }));

  checkDirect.forEach((req) => {
    const c = getItemCounts(req.id);
    maxSynthsFromBag = Math.min(maxSynthsFromBag, Math.floor(c.inBag / req.qty));
    maxSynthsTotal = Math.min(maxSynthsTotal, Math.floor(c.total / req.qty));
  });

  const directHtml = checkDirect.map((req) => {
    const name = itemNames[String(req.id)] || `Item #${req.id}`;
    const needed = req.qty * synthMultiplier;
    const c = getItemCounts(req.id);
    const missing = Math.max(0, needed - c.total);
    const isSub = PRIMARY_RECIPE_BY_RESULT_ID.has(req.id);

    const statusBadge = missing === 0
      ? `<span class="text-[11px] font-medium px-2 py-0.5 rounded-full border bg-emerald-500/15 text-emerald-400 border-emerald-500/30">Ready</span>`
      : `<span class="text-[11px] font-medium px-2 py-0.5 rounded-full border bg-rose-500/15 text-rose-300 border-rose-500/30">Need ${missing}</span>`;

    return `
      <div class="flex items-center justify-between gap-2 py-2 border-t border-slate-800/80">
        <div class="min-w-0">
          <div class="flex items-center gap-1.5 text-sm font-medium text-slate-100">
            <span class="truncate">${req.id === recipe.crystal_id ? "💎 " : ""}${escapeHtml(name)}</span>
            ${isSub ? `<span class="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">Subcraft</span>` : ""}
          </div>
          <div class="text-xs text-slate-400">
            Have: <span class="text-slate-200 font-mono">${c.total}</span> / ${needed}
            ${c.locationsText ? `<span class="text-slate-500">(${escapeHtml(c.locationsText)})</span>` : ""}
          </div>
        </div>
        <div class="shrink-0">${statusBadge}</div>
      </div>
    `;
  }).join("");

  const skillText = recipe.skills && recipe.skills.length ? recipe.skills.join(" / ") : "No skill cap";
  const outputTotal = recipe.result_qty * synthMultiplier;

  el.recipeDetailCard.classList.remove("hidden");
  el.recipeDetailCard.innerHTML = `
    <div class="flex items-start justify-between gap-2">
      <div>
        <div class="flex items-center gap-2">
          <h2 class="text-base font-bold text-slate-100">${escapeHtml(recipe.name)} ×${outputTotal}</h2>
          ${recipe.desynth ? `<span class="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">Desynth</span>` : ""}
        </div>
        <p class="text-xs text-slate-400 mt-0.5">${escapeHtml(skillText)}</p>
      </div>
      <div class="flex items-center gap-1.5 shrink-0">
        <button type="button" id="addSelectedRecipeToQueueBtn"
          class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white">
          + Queue (${synthMultiplier}×)
        </button>
        <a href="${buildWikiUrl(recipe.name, "standard")}" target="_blank" rel="noopener noreferrer"
           class="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-400">
          Wiki ↗
        </a>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-2 bg-slate-950/70 rounded-lg p-2.5 text-xs">
      <div>
        <span class="text-slate-400 block text-[11px]">From Bag:</span>
        <span class="font-mono font-semibold text-emerald-400">${maxSynthsFromBag} synths</span>
      </div>
      <div>
        <span class="text-slate-400 block text-[11px]">With Storage:</span>
        <span class="font-mono font-semibold text-indigo-300">${maxSynthsTotal} synths</span>
      </div>
      <div>
        <span class="text-slate-400 block text-[11px]">Est. Missing Cost:</span>
        <span class="font-mono font-semibold text-amber-300">${formatGil(plan.totalEstimatedGil)}</span>
      </div>
    </div>

    <div>${directHtml}</div>
  `;

  document.getElementById("addSelectedRecipeToQueueBtn").addEventListener("click", () => {
    addToCraftingQueue(recipe.id, synthMultiplier);
    renderCraftingQueueCard();
  });
}

function renderCrafting() {
  renderCraftingQueueCard();

  const allRecipes = window.CRAFT_RECIPES || [];
  const itemNames = window.ITEM_NAMES || {};
  const q = recipeQuery.trim().toLowerCase();

  const matches = q
    ? allRecipes.filter((r) => r.name.toLowerCase().includes(q)).slice(0, 40)
    : allRecipes.slice(0, 25);

  if (!selectedRecipeId && matches.length > 0) {
    selectedRecipeId = matches[0].id;
  }

  const activeRecipe = RECIPE_BY_ID.get(selectedRecipeId) || matches[0] || null;
  renderRecipeDetail(activeRecipe);

  if (matches.length === 0) {
    el.recipeList.innerHTML = `
      <div class="text-center py-8 text-sm text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800/80">
        No crafting recipes found matching "${escapeHtml(recipeQuery)}".
      </div>`;
    return;
  }

  el.recipeList.innerHTML = matches.map((r) => {
    const isSelected = activeRecipe && r.id === activeRecipe.id;
    const crystalName = itemNames[String(r.crystal_id)] || "";
    const ingSummary = r.ingredients
      .map((i) => `${i.qty}× ${itemNames[String(i.id)] || `#${i.id}`}`)
      .join(", ");

    return `
      <div class="flex items-center gap-2 bg-slate-900 border ${isSelected ? "border-indigo-500" : "border-slate-800"} rounded-xl p-3 transition">
        <button type="button" data-recipe-id="${r.id}" class="recipe-card min-w-0 flex-1 text-left">
          <div class="flex items-center justify-between gap-2">
            <span class="text-sm font-semibold text-slate-100 truncate">
              ${escapeHtml(r.name)} ${r.result_qty > 1 ? `(×${r.result_qty})` : ""}
            </span>
            <span class="text-xs text-indigo-400 shrink-0">${escapeHtml(r.skills[0] || "")}</span>
          </div>
          <p class="text-xs text-slate-400 mt-1 truncate">
            ${crystalName ? `${escapeHtml(crystalName)} + ` : ""}${escapeHtml(ingSummary)}
          </p>
        </button>

        <button type="button" data-quick-queue-id="${r.id}"
          class="quick-queue-btn shrink-0 text-xs font-semibold px-2.5 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30">
          + Queue
        </button>
      </div>
    `;
  }).join("");

  document.querySelectorAll(".recipe-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedRecipeId = Number(btn.dataset.recipeId);
      renderCrafting();
    });
  });

  document.querySelectorAll(".quick-queue-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      addToCraftingQueue(Number(btn.dataset.quickQueueId), 1);
      renderCraftingQueueCard();
    });
  });
}

async function loadCharacterData(characterName) {
  el.syncStatus.textContent = "Loading...";
  try {
    const res = await fetch(`${apiBase}/v1/characters/${encodeURIComponent(characterName)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    currentPayload = await res.json();
    el.syncStatus.textContent = formatRelativeTime(currentPayload.updated_at);
    renderQuests();
    renderRouteOptimizer();
    renderEquipment();
    renderCrafting();
  } catch (err) {
    el.syncStatus.textContent = `Sync error (${err.message})`;
  }
}

async function init() {
  el.apiBaseInput.value = apiBase;
  el.recipeSearchInput.value = recipeQuery;
  updateQueueNavBadge();

  const savedDefaults = loadDefaultFilters();
  el.defaultNotCollected.checked = savedDefaults.not_collected;
  el.defaultCollected.checked = savedDefaults.collected;
  el.defaultComplete.checked = savedDefaults.complete;
  syncToggleButtonsUI();

  try {
    const res = await fetch(`${apiBase}/v1/characters`);
    const chars = await res.json();

    if (!chars.length) {
      el.syncStatus.textContent = "No characters synced yet";
      renderQuests();
      renderRouteOptimizer();
      renderEquipment();
      renderCrafting();
      return;
    }

    el.characterSelect.innerHTML = chars
      .map((c) => `<option value="${escapeHtml(c.character_name)}">${escapeHtml(c.character_name)}</option>`)
      .join("");

    await loadCharacterData(chars[0].character_name);
  } catch (err) {
    el.syncStatus.textContent = "API unreachable — tap ⚙ to check URL";
    renderQuests();
    renderRouteOptimizer();
    renderEquipment();
    renderCrafting();
  }
}

el.tabQuestsBtn.addEventListener("click", () => switchTab("quests"));
el.tabRouteBtn.addEventListener("click", () => switchTab("route"));
el.tabEquipmentBtn.addEventListener("click", () => switchTab("equipment"));
el.tabCraftingBtn.addEventListener("click", () => switchTab("crafting"));

el.characterSelect.addEventListener("change", (e) => loadCharacterData(e.target.value));
el.refreshBtn.addEventListener("click", () => {
  if (el.characterSelect.value) loadCharacterData(el.characterSelect.value);
});
el.settingsBtn.addEventListener("click", () => el.settingsPanel.classList.toggle("hidden"));
el.saveApiBtn.addEventListener("click", () => {
  apiBase = el.apiBaseInput.value.trim().replace(/\/+$/, "");
  localStorage.setItem("questsync_api_base", apiBase);
  el.settingsPanel.classList.add("hidden");
  init();
});

el.defaultNotCollected.addEventListener("change", saveDefaultFilterSettings);
el.defaultCollected.addEventListener("change", saveDefaultFilterSettings);
el.defaultComplete.addEventListener("change", saveDefaultFilterSettings);

document.querySelectorAll(".status-toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.filter;
    activeFilters[key] = !activeFilters[key];
    syncToggleButtonsUI();
    renderQuests();
  });
});

el.toggleAllFiltersBtn.addEventListener("click", () => {
  activeFilters = { not_collected: true, collected: true, complete: true };
  syncToggleButtonsUI();
  renderQuests();
});

el.searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value.trim().toLowerCase();
  renderQuests();
});
el.regionSelect.addEventListener("change", (e) => {
  selectedRegion = e.target.value;
  renderQuests();
});
el.prereqEligibilitySelect.addEventListener("change", (e) => {
  prereqEligibilityFilter = e.target.value;
  renderQuests();
});
el.prereqTypeSelect.addEventListener("change", (e) => {
  prereqTypeFilter = e.target.value;
  renderQuests();
});

el.routeStartHubSelect.addEventListener("change", renderRouteOptimizer);
el.routeScopeSelect.addEventListener("change", renderRouteOptimizer);
el.routeIncMissions.addEventListener("change", renderRouteOptimizer);
el.routeIncCollected.addEventListener("change", renderRouteOptimizer);
el.routeIncEligible.addEventListener("change", renderRouteOptimizer);
el.routeBatchSizeSelect.addEventListener("change", renderRouteOptimizer);
el.clearRouteChecksBtn.addEventListener("click", () => {
  routeCheckedSteps.clear();
  localStorage.removeItem("questsync_route_checked");
  renderRouteOptimizer();
});

el.equipSearchInput.addEventListener("input", (e) => {
  equipQuery = e.target.value;
  renderEquipment();
});
el.equipMaxLvlInput.addEventListener("input", (e) => {
  equipMaxLvl = Math.max(0, Number(e.target.value) || 0);
  renderEquipment();
});
el.equipJobSelect.addEventListener("change", (e) => {
  equipJob = e.target.value;
  renderEquipment();
});
el.equipSlotSelect.addEventListener("change", (e) => {
  equipSlot = e.target.value;
  renderEquipment();
});
el.equipOwnedSelect.addEventListener("change", (e) => {
  equipOwnedFilter = e.target.value;
  renderEquipment();
});
el.equipCraftableSelect.addEventListener("change", (e) => {
  equipCraftableFilter = e.target.value;
  renderEquipment();
});
el.equipCraftSkillSelect.addEventListener("change", (e) => {
  equipCraftSkillFilter = e.target.value;
  renderEquipment();
});

el.recipeSearchInput.addEventListener("input", (e) => {
  recipeQuery = e.target.value;
  selectedRecipeId = null;
  renderCrafting();
});
el.synthCountInput.addEventListener("input", (e) => {
  synthMultiplier = Math.max(1, Number(e.target.value) || 1);
  renderCrafting();
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

init();
