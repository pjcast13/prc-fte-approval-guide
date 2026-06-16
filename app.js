const statuses = [
  { id: "01", label: "01 Intake: classify fixed or flex", stage: "Intake", owner: "Hiring manager plus Business Ops", action: "Confirm whether the position is fixed or flexed.", evidence: "Job code or fixed-position listing checked." },
  { id: "02", label: "02 Intake: request submitted", stage: "Intake", owner: "Hiring manager", action: "Submit or confirm position request in the portfolio intake path.", evidence: "Request ID or email confirmation." },
  { id: "03", label: "03 FTE review pending", stage: "Intake", owner: "Business Ops or portfolio leader", action: "Confirm the next FTE review meeting and who is representing the request.", evidence: "Next meeting date and named owner." },
  { id: "04", label: "04 FTE denied", stage: "Closed", owner: "Portfolio leader", action: "Close or rework before a requisition is submitted.", evidence: "Decision marked in request system." },
  { id: "05", label: "05 FTE approved", stage: "Requisition", owner: "Hiring manager", action: "Submit the requisition in Workday or Beeline.", evidence: "Approval note or system decision." },
  { id: "06", label: "06 Req submission pending", stage: "Requisition", owner: "Hiring manager", action: "Create the Workday or Beeline requisition.", evidence: "No requisition number yet." },
  { id: "07", label: "07 Req approvals pending", stage: "Requisition", owner: "Hiring manager leaders", action: "Clear hiring manager and leader approvals.", evidence: "Approval chain still open." },
  { id: "08", label: "08 Ready for PRC export", stage: "PRC", owner: "Business Ops", action: "Confirm inclusion in the Friday noon PRC export.", evidence: "Approved req visible for export." },
  { id: "09", label: "09 PRC review pending", stage: "PRC", owner: "PRC", action: "Watch for the Monday PRC decision.", evidence: "Exported list or PRC agenda." },
  { id: "10", label: "10 PRC approved", stage: "Recruiting", owner: "Hiring manager plus TA", action: "Work with Talent Acquisition to fill the position.", evidence: "PRC decision email." },
  { id: "11", label: "11 PRC RFI", stage: "PRC", owner: "Assigned response owner", action: "Send the requested information to PRC.", evidence: "RFI email with requested info." },
  { id: "12", label: "12 PRC denied", stage: "Appeal", owner: "VP", action: "Decide whether VP appeal is warranted.", evidence: "Denial email." },
  { id: "13", label: "13 PRG appeal pending", stage: "Appeal", owner: "VP or delegate", action: "Get on the PRG calendar and submit the appeal form.", evidence: "VP intent email and PRG slot." },
  { id: "14", label: "14 PRG approved", stage: "Recruiting", owner: "Hiring manager plus TA", action: "Work with Talent Acquisition to fill the position.", evidence: "PRG approval notice." },
  { id: "15", label: "15 PRG denied", stage: "Appeal", owner: "SVP", action: "Decide whether SVP appeal is warranted.", evidence: "PRG denial notice." },
  { id: "16", label: "16 PRE appeal pending", stage: "Appeal", owner: "SVP", action: "Schedule and prepare for PRE appeal.", evidence: "PRE scheduling email." },
  { id: "17", label: "17 PRE approved", stage: "Recruiting", owner: "Hiring manager plus TA", action: "Work with Talent Acquisition to fill the position.", evidence: "PRE approval notice." },
  { id: "18", label: "18 Closed: denied or withdrawn", stage: "Closed", owner: "Portfolio leader", action: "Close the req or rework as a new request.", evidence: "Final denial, no-appeal decision, or withdrawal." },
  { id: "19", label: "19 Recruiting active", stage: "Recruiting", owner: "Hiring manager plus TA", action: "Track posting and candidate activity.", evidence: "TA handoff or active posting." },
];

const baseNodes = {
  classify: { title: "Classify position", owner: "Hiring manager plus Business Ops", cadence: "Before routing", detail: "Decide whether the position follows the fixed or flex path.", statusId: "01" },
  fixedSubmit: { title: "Submit fixed-position request", owner: "Hiring manager", cadence: "At intake", detail: "Use the clinical portfolio request form.", statusId: "02" },
  fixedPrep: { title: "Fixed requests pulled for DR prep", owner: "Business Ops", cadence: "Friday noon", detail: "Business Ops prepares the file for the upcoming direct-report meeting.", statusId: "03" },
  fixedDr: { title: "Direct report represents request", owner: "Sam Wald direct-report leader", cadence: "Monday", detail: "The leader overseeing the role represents the request at the DR meeting.", statusId: "03" },
  flexReview: { title: "Portfolio FTE review", owner: "Portfolio FTE approval group", cadence: "Varies", detail: "Flex requests are reviewed in the portfolio-level FTE approval meeting.", statusId: "03" },
  fteDenied: { title: "FTE denied", owner: "Portfolio leader", cadence: "Monday or Tuesday notice", detail: "Decision is marked and the leader or submitter is notified.", statusId: "04", terminal: "stop" },
  fteApproved: { title: "FTE approved", owner: "Approving group", cadence: "Gate cleared", detail: "The position can now move to requisition submission.", statusId: "05" },
  reqSubmit: { title: "Submit Workday or Beeline requisition", owner: "Hiring manager", cadence: "Within two weeks", detail: "The approved FTE becomes a formal requisition.", statusId: "06" },
  reqApprovals: { title: "Clear requisition approvals", owner: "Hiring manager and leaders", cadence: "Within 24 hours each", detail: "Hiring manager approval and one to two leadership approvals clear the chain.", statusId: "07" },
  prcExport: { title: "Export approved requisitions", owner: "Business Ops", cadence: "Friday noon", detail: "Approved Workday or Beeline reqs are exported for PRC.", statusId: "08" },
  prcReview: { title: "PRC review", owner: "PRC", cadence: "Monday 10 AM", detail: "PRC reviews and decides based on the algorithm.", statusId: "09" },
  prcApproved: { title: "PRC approved", owner: "Hiring manager plus TA", cadence: "Monday or Tuesday notice", detail: "Work with Talent Acquisition to fill the position.", statusId: "10", terminal: "good" },
  prcRfi: { title: "PRC requested information", owner: "Assigned response owner", cadence: "Respond quickly", detail: "Email the requested information to PRC, then return to the PRC queue.", statusId: "11" },
  prcDenied: { title: "PRC denied", owner: "VP", cadence: "Monday or Tuesday notice", detail: "Align with VP on whether to appeal at PRG.", statusId: "12" },
  prgIntent: { title: "VP appeal intent", owner: "VP", cadence: "Before PRG scheduling", detail: "VP emails PRC with intent to appeal and asks to get on the PRG calendar.", statusId: "13" },
  prgPacket: { title: "Appeal form submitted", owner: "VP or delegate", cadence: "Day before PRG", detail: "Prepare and submit the PRC appeal form.", statusId: "13" },
  prgReview: { title: "PRG appeal review", owner: "VP or delegate", cadence: "Thursday morning", detail: "VP presents the appeal at scheduled PRG.", statusId: "13" },
  prgApproved: { title: "PRG approved", owner: "Hiring manager plus TA", cadence: "After PRG", detail: "Work with Talent Acquisition to fill the position.", statusId: "14", terminal: "good" },
  prgDenied: { title: "PRG denied", owner: "SVP", cadence: "After PRG", detail: "Align with SVP on whether to appeal again at PRE.", statusId: "15" },
  preIntent: { title: "SVP appeal intent", owner: "SVP", cadence: "Ad hoc", detail: "Email PRC to schedule SVP for PRE.", statusId: "16" },
  preReview: { title: "PRE appeal review", owner: "SVP", cadence: "Ad hoc", detail: "SVP represents the appeal at PRE.", statusId: "16" },
  preApproved: { title: "PRE approved", owner: "Hiring manager plus TA", cadence: "After PRE", detail: "Work with Talent Acquisition to fill the position.", statusId: "17", terminal: "good" },
  closed: { title: "Closed", owner: "Portfolio leader", cadence: "Final", detail: "No appeal, final denial, or withdrawal.", statusId: "18", terminal: "stop" },
  recruiting: { title: "Recruiting active", owner: "Hiring manager plus TA", cadence: "After approval", detail: "Track posting and candidate activity.", statusId: "19", terminal: "good" },
};

const state = {
  type: null,
  fteDecision: null,
  reqSubmitted: null,
  reqApproved: null,
  prcDecision: null,
  vpAppeal: null,
  prgDecision: null,
  svpAppeal: null,
  preDecision: null,
  statusOverride: null,
};

const decisionConfig = [
  {
    id: "type",
    title: "Position type",
    note: "This chooses the intake lane.",
    options: [
      { value: "fixed", label: "Fixed" },
      { value: "flex", label: "Flex" },
    ],
    visible: () => true,
  },
  {
    id: "fteDecision",
    title: "FTE approval",
    note: "Use the DR or portfolio decision.",
    options: [
      { value: "pending", label: "Pending" },
      { value: "approved", label: "Approved" },
      { value: "denied", label: "Denied" },
    ],
    visible: () => Boolean(state.type),
  },
  {
    id: "reqSubmitted",
    title: "Requisition submitted",
    note: "Workday or Beeline.",
    options: [
      { value: "no", label: "No" },
      { value: "yes", label: "Yes" },
    ],
    visible: () => state.fteDecision === "approved",
  },
  {
    id: "reqApproved",
    title: "Approval chain",
    note: "Hiring manager and leaders.",
    options: [
      { value: "pending", label: "Pending" },
      { value: "complete", label: "Complete" },
    ],
    visible: () => state.reqSubmitted === "yes",
  },
  {
    id: "prcDecision",
    title: "PRC decision",
    note: "Monday review outcome.",
    options: [
      { value: "pending", label: "Pending" },
      { value: "approved", label: "Approved" },
      { value: "rfi", label: "RFI" },
      { value: "denied", label: "Denied" },
    ],
    visible: () => state.reqApproved === "complete",
  },
  {
    id: "vpAppeal",
    title: "VP appeal",
    note: "PRG path.",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
    visible: () => state.prcDecision === "denied",
  },
  {
    id: "prgDecision",
    title: "PRG decision",
    note: "Thursday appeal result.",
    options: [
      { value: "pending", label: "Pending" },
      { value: "approved", label: "Approved" },
      { value: "denied", label: "Denied" },
    ],
    visible: () => state.vpAppeal === "yes",
  },
  {
    id: "svpAppeal",
    title: "SVP appeal",
    note: "PRE path.",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
    visible: () => state.prgDecision === "denied",
  },
  {
    id: "preDecision",
    title: "PRE decision",
    note: "Final appeal result.",
    options: [
      { value: "pending", label: "Pending" },
      { value: "approved", label: "Approved" },
      { value: "denied", label: "Denied" },
    ],
    visible: () => state.svpAppeal === "yes",
  },
];

const dependencyOrder = decisionConfig.map((item) => item.id);

function statusById(id) {
  return statuses.find((status) => status.id === id) || statuses[0];
}

function resetAfter(id) {
  const index = dependencyOrder.indexOf(id);
  dependencyOrder.slice(index + 1).forEach((key) => {
    state[key] = null;
  });
  state.statusOverride = null;
}

function choose(id, value) {
  state[id] = value;
  resetAfter(id);
  render();
}

function getPath() {
  const nodes = [baseNodes.classify];

  if (!state.type) return nodes;

  if (state.type === "fixed") {
    nodes.push(baseNodes.fixedSubmit, baseNodes.fixedPrep, baseNodes.fixedDr);
  } else {
    nodes.push(baseNodes.flexReview);
  }

  if (!state.fteDecision || state.fteDecision === "pending") return nodes;
  if (state.fteDecision === "denied") return [...nodes, baseNodes.fteDenied];

  nodes.push(baseNodes.fteApproved);
  if (!state.reqSubmitted || state.reqSubmitted === "no") return [...nodes, baseNodes.reqSubmit];

  nodes.push(baseNodes.reqSubmit);
  if (!state.reqApproved || state.reqApproved === "pending") return [...nodes, baseNodes.reqApprovals];

  nodes.push(baseNodes.reqApprovals, baseNodes.prcExport, baseNodes.prcReview);
  if (!state.prcDecision || state.prcDecision === "pending") return nodes;
  if (state.prcDecision === "approved") return [...nodes, baseNodes.prcApproved, baseNodes.recruiting];
  if (state.prcDecision === "rfi") return [...nodes, baseNodes.prcRfi];

  nodes.push(baseNodes.prcDenied);
  if (!state.vpAppeal) return nodes;
  if (state.vpAppeal === "no") return [...nodes, baseNodes.closed];

  nodes.push(baseNodes.prgIntent, baseNodes.prgPacket, baseNodes.prgReview);
  if (!state.prgDecision || state.prgDecision === "pending") return nodes;
  if (state.prgDecision === "approved") return [...nodes, baseNodes.prgApproved, baseNodes.recruiting];

  nodes.push(baseNodes.prgDenied);
  if (!state.svpAppeal) return nodes;
  if (state.svpAppeal === "no") return [...nodes, baseNodes.closed];

  nodes.push(baseNodes.preIntent, baseNodes.preReview);
  if (!state.preDecision || state.preDecision === "pending") return nodes;
  if (state.preDecision === "approved") return [...nodes, baseNodes.preApproved, baseNodes.recruiting];
  return [...nodes, baseNodes.closed];
}

function getCurrentNode(path) {
  if (state.statusOverride) {
    return { status: statusById(state.statusOverride), node: null };
  }
  const nonTerminal = [...path].reverse().find((node) => !node.terminal);
  const current = path[path.length - 1].terminal ? path[path.length - 1] : nonTerminal;
  return { status: statusById(current.statusId), node: current };
}

function renderDecisions() {
  const stack = document.getElementById("decisionStack");
  stack.innerHTML = "";
  const visible = decisionConfig.filter((item) => item.visible());
  const answered = visible.filter((item) => Boolean(state[item.id])).length;
  document.getElementById("stepCount").textContent = `Step ${Math.min(answered + 1, decisionConfig.length)}`;

  visible.forEach((decision) => {
    const card = document.createElement("section");
    card.className = `decision-card ${state[decision.id] ? "" : "active"}`;
    card.innerHTML = `
      <div class="decision-title">${decision.title}</div>
      <div class="decision-note">${decision.note}</div>
      <div class="choice-grid"></div>
    `;
    const grid = card.querySelector(".choice-grid");
    decision.options.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.choice = `${decision.id}:${option.value}`;
      button.className = `choice-button ${state[decision.id] === option.value ? "selected" : ""}`;
      button.innerHTML = `<span>${option.label}</span><span class="arrow" aria-hidden="true">›</span>`;
      button.addEventListener("click", () => choose(decision.id, option.value));
      grid.appendChild(button);
    });
    stack.appendChild(card);
  });
}

function renderPath(path, currentStatus) {
  const list = document.getElementById("pathList");
  list.innerHTML = "";
  document.getElementById("pathMode").textContent = state.type ? `${state.type[0].toUpperCase()}${state.type.slice(1)} path` : "Choose a path";

  path.forEach((node, index) => {
    const status = statusById(node.statusId);
    const item = document.createElement("article");
    const isCurrent = !state.statusOverride && status.id === currentStatus.id && index === path.findLastIndex((pathNode) => pathNode.statusId === node.statusId);
    item.className = `path-node ${isCurrent ? "current" : ""} ${node.terminal ? `terminal ${node.terminal}` : ""}`;
    item.innerHTML = `
      <div class="node-index">${index + 1}</div>
      <div>
        <div class="node-title">${node.title}</div>
        <div class="node-meta">
          <span class="tag">${status.label}</span>
          <span class="tag">${node.owner}</span>
          <span class="tag">${node.cadence}</span>
        </div>
        <p class="node-text">${node.detail}</p>
      </div>
    `;
    list.appendChild(item);
  });
}

function renderTracker(status, node) {
  document.getElementById("currentStatus").textContent = status.label;
  document.body.dataset.status = status.id;
  document.getElementById("waitingOn").textContent = node ? node.owner : status.owner;
  document.getElementById("nextGate").textContent = node ? node.title : status.action;
  document.getElementById("stagePill").textContent = status.stage;
  document.getElementById("trackerStatus").textContent = status.label;
  document.getElementById("trackerOwner").textContent = status.owner;
  document.getElementById("trackerAction").textContent = status.action;
  document.getElementById("trackerEvidence").textContent = status.evidence;
}

function renderStatusLibrary(currentStatus) {
  const library = document.getElementById("statusLibrary");
  library.innerHTML = "";
  statuses.forEach((status) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = `status-item ${status.id === currentStatus.id ? "active" : ""}`;
    item.innerHTML = `<strong>${status.label}</strong><span>${status.stage}</span>`;
    item.addEventListener("click", () => {
      state.statusOverride = status.id;
      render();
    });
    library.appendChild(item);
  });
}

function render() {
  const path = getPath();
  const { status, node } = getCurrentNode(path);
  renderDecisions();
  renderPath(path, status);
  renderTracker(status, node);
  renderStatusLibrary(status);
}

function showToast(text) {
  const toast = document.getElementById("toast");
  toast.textContent = text;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

function copySummary() {
  const status = document.getElementById("trackerStatus").textContent;
  const owner = document.getElementById("trackerOwner").textContent;
  const action = document.getElementById("trackerAction").textContent;
  const evidence = document.getElementById("trackerEvidence").textContent;
  const summary = `Status: ${status}\nOwner: ${owner}\nNext action: ${action}\nEvidence: ${evidence}`;
  navigator.clipboard?.writeText(summary).then(
    () => showToast("Status copied"),
    () => showToast("Copy unavailable"),
  );
}

document.getElementById("resetButton").addEventListener("click", () => {
  dependencyOrder.forEach((key) => {
    state[key] = null;
  });
  state.statusOverride = null;
  render();
});

document.getElementById("copyButton").addEventListener("click", copySummary);

render();
