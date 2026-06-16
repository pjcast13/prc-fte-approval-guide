const statuses = [
  { id: "01", label: "01 Decide fixed vs flex", stage: "Intake", owner: "Hiring manager", action: "Check the job code or ask Business Ops whether this role is fixed or flexed.", evidence: "Fixed or flexed is written in your notes." },
  { id: "02", label: "02 Submit position request", stage: "Intake", owner: "Hiring manager", action: "Submit the position request in the right intake path, then save the request ID or confirmation.", evidence: "Request ID, submission confirmation, or forwarded intake email." },
  { id: "03", label: "03 Waiting for FTE approval", stage: "Intake", owner: "Business Ops or portfolio leader", action: "Ask: what meeting is this going to, when is it, and who is speaking for it?", evidence: "Meeting date and named presenter." },
  { id: "04", label: "04 FTE denied", stage: "Closed", owner: "Portfolio leader", action: "Decide whether to rework the request or stop before creating a requisition.", evidence: "Denial marked in the request system or decision email." },
  { id: "05", label: "05 FTE approved", stage: "Requisition", owner: "Hiring manager", action: "Open Workday or Beeline and create the requisition.", evidence: "FTE approval note or system decision." },
  { id: "06", label: "06 Create Workday or Beeline req", stage: "Requisition", owner: "Hiring manager", action: "Create the req and put the req number in your tracker.", evidence: "Workday or Beeline requisition number." },
  { id: "07", label: "07 Chase req approvers", stage: "Requisition", owner: "Hiring manager leaders", action: "Look at the approval chain and nudge the person whose approval is sitting.", evidence: "Approval chain screenshot or status showing the pending approver." },
  { id: "08", label: "08 Confirm Friday PRC export", stage: "PRC", owner: "Business Ops", action: "Ask Business Ops whether this approved req made the Friday noon PRC export.", evidence: "Included on export list or confirmed by Business Ops." },
  { id: "09", label: "09 Wait for Monday PRC decision", stage: "PRC", owner: "PRC", action: "Watch for the Monday or Tuesday PRC decision email.", evidence: "PRC agenda, exported list, or decision email." },
  { id: "10", label: "10 PRC approved", stage: "Recruiting", owner: "Hiring manager plus TA", action: "Confirm TA has the req and recruiting is active.", evidence: "TA handoff, posting, or candidate activity." },
  { id: "11", label: "11 Answer PRC RFI", stage: "PRC", owner: "Assigned response owner", action: "Find the missing info, send it to PRC, and note what was sent.", evidence: "RFI response email sent to PRC." },
  { id: "12", label: "12 Decide PRG appeal", stage: "Appeal", owner: "VP", action: "Ask the VP whether they want to appeal the denial at PRG.", evidence: "VP says appeal or no appeal." },
  { id: "13", label: "13 Prepare PRG appeal", stage: "Appeal", owner: "VP or delegate", action: "Get the VP on the PRG calendar and finish the appeal form before the meeting.", evidence: "PRG calendar slot and completed appeal form." },
  { id: "14", label: "14 PRG approved", stage: "Recruiting", owner: "Hiring manager plus TA", action: "Confirm TA has the req and recruiting is active.", evidence: "PRG approval notice plus TA handoff." },
  { id: "15", label: "15 Decide PRE appeal", stage: "Appeal", owner: "SVP", action: "Ask the SVP whether they want to appeal the PRG denial at PRE.", evidence: "SVP says appeal or no appeal." },
  { id: "16", label: "16 Prepare PRE appeal", stage: "Appeal", owner: "SVP", action: "Schedule the PRE appeal and prepare the SVP to present the case.", evidence: "PRE schedule confirmation." },
  { id: "17", label: "17 PRE approved", stage: "Recruiting", owner: "Hiring manager plus TA", action: "Confirm TA has the req and recruiting is active.", evidence: "PRE approval notice plus TA handoff." },
  { id: "18", label: "18 Closed", stage: "Closed", owner: "Portfolio leader", action: "Mark the req closed and write why: denied, no appeal, withdrawn, or rework later.", evidence: "Final denial, no-appeal decision, or withdrawal note." },
  { id: "19", label: "19 Recruiting active", stage: "Recruiting", owner: "Hiring manager plus TA", action: "Track posting, candidate slate, and hiring progress outside the PRC approval path.", evidence: "Posting, TA update, or candidate activity." },
];

const baseNodes = {
  classify: { title: "Find the lane", owner: "Hiring manager", cadence: "Before routing", detail: "Check the job code or ask Business Ops: fixed or flexed?", statusId: "01" },
  fixedSubmit: { title: "Submit the fixed-position request", owner: "Hiring manager", cadence: "At intake", detail: "Submit the request, then save the request ID or confirmation email.", statusId: "02" },
  fixedPrep: { title: "Confirm it made Friday prep", owner: "Business Ops", cadence: "Friday noon", detail: "Ask Business Ops: did this fixed request make the Friday file for Monday review?", statusId: "03" },
  fixedDr: { title: "Confirm who will speak for it", owner: "Senior leadership direct-report leader", cadence: "Monday", detail: "Write down the leader representing the request and the Monday meeting date.", statusId: "03" },
  flexReview: { title: "Get the flex request on the portfolio review agenda", owner: "Portfolio leader or Business Ops", cadence: "Varies", detail: "Ask: what portfolio FTE meeting will review this, and who owns the ask?", statusId: "03" },
  fteDenied: { title: "Stop or rework before creating a req", owner: "Portfolio leader", cadence: "After decision", detail: "Write the denial reason. Decide whether to rework the request or close it.", statusId: "04", terminal: "stop" },
  fteApproved: { title: "Start the requisition", owner: "Hiring manager", cadence: "After FTE approval", detail: "Use the FTE approval to create the Workday or Beeline requisition.", statusId: "05" },
  reqSubmit: { title: "Create the req number", owner: "Hiring manager", cadence: "Within two weeks", detail: "Open Workday or Beeline, create the requisition, and copy the req number into the tracker.", statusId: "06" },
  reqApprovals: { title: "Nudge the stuck approver", owner: "Hiring manager leaders", cadence: "Within 24 hours each", detail: "Check the approval chain. If someone is sitting on it, send a direct nudge.", statusId: "07" },
  prcExport: { title: "Confirm Friday export", owner: "Business Ops", cadence: "Friday noon", detail: "Ask Business Ops whether this approved req was included in the Friday PRC export.", statusId: "08" },
  prcReview: { title: "Wait for the PRC decision email", owner: "PRC", cadence: "Monday 10 AM", detail: "After Monday PRC, watch for the decision email on Monday or Tuesday.", statusId: "09" },
  prcApproved: { title: "Hand it to recruiting", owner: "Hiring manager plus TA", cadence: "After PRC approval", detail: "Confirm TA has the req and recruiting is active.", statusId: "10", terminal: "good" },
  prcRfi: { title: "Answer the PRC RFI", owner: "Assigned response owner", cadence: "Same week", detail: "Find the missing information, email it to PRC, and save what you sent.", statusId: "11" },
  prcDenied: { title: "Ask whether the VP wants to appeal", owner: "VP", cadence: "After PRC denial", detail: "Send the denial summary to the VP and ask for an appeal yes or no.", statusId: "12" },
  prgIntent: { title: "Get on the PRG calendar", owner: "VP or delegate", cadence: "Before PRG scheduling", detail: "Send PRC the VP's intent to appeal and ask for the next PRG slot.", statusId: "13" },
  prgPacket: { title: "Finish the PRG appeal form", owner: "VP or delegate", cadence: "Day before PRG", detail: "Complete the appeal form and send it before the PRG deadline.", statusId: "13" },
  prgReview: { title: "Prepare the VP for PRG", owner: "VP or delegate", cadence: "Thursday morning", detail: "Give the VP the short case: why this role, why now, and what happens if it stays denied.", statusId: "13" },
  prgApproved: { title: "Hand it to recruiting", owner: "Hiring manager plus TA", cadence: "After PRG approval", detail: "Confirm TA has the req and recruiting is active.", statusId: "14", terminal: "good" },
  prgDenied: { title: "Ask whether the SVP wants to appeal", owner: "SVP", cadence: "After PRG denial", detail: "Send the PRG denial summary to the SVP and ask for a PRE appeal yes or no.", statusId: "15" },
  preIntent: { title: "Schedule PRE", owner: "SVP or delegate", cadence: "Ad hoc", detail: "Email PRC to schedule the SVP for PRE.", statusId: "16" },
  preReview: { title: "Prepare the SVP for PRE", owner: "SVP or delegate", cadence: "Ad hoc", detail: "Give the SVP the short case and the prior denial history.", statusId: "16" },
  preApproved: { title: "Hand it to recruiting", owner: "Hiring manager plus TA", cadence: "After PRE approval", detail: "Confirm TA has the req and recruiting is active.", statusId: "17", terminal: "good" },
  closed: { title: "Close the loop", owner: "Portfolio leader", cadence: "Final", detail: "Mark the req closed and write the reason so it does not keep floating.", statusId: "18", terminal: "stop" },
  recruiting: { title: "Track recruiting outside PRC", owner: "Hiring manager plus TA", cadence: "After approval", detail: "PRC is done. Move the work to posting, candidate slate, and hiring follow-through.", statusId: "19", terminal: "good" },
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
    title: "1. What type of position is this?",
    note: "Pick one. This decides which approval lane the request uses.",
    options: [
      { value: "fixed", label: "Fixed" },
      { value: "flex", label: "Flex" },
    ],
    visible: () => true,
  },
  {
    id: "fteDecision",
    title: "2. Has the FTE been approved?",
    note: "Use the decision from the fixed DR review or the flex portfolio review.",
    options: [
      { value: "pending", label: "Pending" },
      { value: "approved", label: "Approved" },
      { value: "denied", label: "Denied" },
    ],
    visible: () => Boolean(state.type),
  },
  {
    id: "reqSubmitted",
    title: "3. Is there a Workday or Beeline req?",
    note: "If there is no req number yet, this is the next move.",
    options: [
      { value: "no", label: "No" },
      { value: "yes", label: "Yes" },
    ],
    visible: () => state.fteDecision === "approved",
  },
  {
    id: "reqApproved",
    title: "4. Are req approvals complete?",
    note: "Check the Workday or Beeline approval chain.",
    options: [
      { value: "pending", label: "Pending" },
      { value: "complete", label: "Complete" },
    ],
    visible: () => state.reqSubmitted === "yes",
  },
  {
    id: "prcDecision",
    title: "5. What did PRC decide?",
    note: "Use the PRC decision email. Pending means it is still waiting for the Monday decision.",
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
    title: "6. Is the VP appealing at PRG?",
    note: "If no, close the req. If yes, prepare the PRG appeal.",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
    visible: () => state.prcDecision === "denied",
  },
  {
    id: "prgDecision",
    title: "7. What did PRG decide?",
    note: "Use the PRG appeal result.",
    options: [
      { value: "pending", label: "Pending" },
      { value: "approved", label: "Approved" },
      { value: "denied", label: "Denied" },
    ],
    visible: () => state.vpAppeal === "yes",
  },
  {
    id: "svpAppeal",
    title: "8. Is the SVP appealing at PRE?",
    note: "If no, close the req. If yes, prepare the PRE appeal.",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
    visible: () => state.prgDecision === "denied",
  },
  {
    id: "preDecision",
    title: "9. What did PRE decide?",
    note: "This is the final appeal result.",
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
        <div class="node-kicker">${isCurrent ? "You are here" : node.terminal ? "End state" : "Earlier step"}</div>
        <div class="node-title">${node.title}</div>
        <div class="node-meta">
          <span class="tag">${status.label}</span>
          <span class="tag">${node.owner}</span>
          <span class="tag">${node.cadence}</span>
        </div>
        <p class="node-text"><strong>Action:</strong> ${node.detail}</p>
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
  document.querySelector("#currentActionCard strong").textContent = status.action;
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
