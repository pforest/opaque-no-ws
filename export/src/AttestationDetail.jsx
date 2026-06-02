// Workload Attestation Detail — graph view of the attested workload's trust chain.
// Top: workflow graph (LLMs, agents, tools, data) with attestation chips and aTLS edges.
// Middle: policies sidebar applied to the workflow.
// Bottom: platform / hardware / root-of-trust verification stack.

const ConfidentialChip = ({ label = "CONFIDENTIAL" }) => (
  <span className="ad-chip ad-chip--confidential">
    <span className="material-symbols-outlined" style={{ fontSize: 12 }}>lock</span>
    <span>{label}</span>
  </span>
);

const AttestedChip = ({ label = "ATTESTED" }) => (
  <span className="ad-chip ad-chip--attested">
    <span>{label}</span>
  </span>
);

const VerifiedChip = ({ label = "VERIFIED" }) => (
  <span className="ad-chip ad-chip--verified">
    <span className="material-symbols-outlined" style={{ fontSize: 12 }}>check</span>
    <span>{label}</span>
  </span>
);

const EnforcedChip = ({ label = "ENFORCED" }) => (
  <span className="ad-chip ad-chip--enforced">
    <span className="material-symbols-outlined" style={{ fontSize: 12 }}>check</span>
    <span>{label}</span>
  </span>
);

// node primitives
const GraphNode = ({ x, y, w = 156, kind = "default", icon, title, chip, edgeLabel, edgeLabelPos }) => (
  <div
    className={`ad-node ad-node--${kind}`}
    style={{ left: x, top: y, width: w }}
  >
    {chip && <div className="ad-node-chip">{chip}</div>}
    <div className="ad-node-body">
      {icon && <span className="material-symbols-outlined ad-node-icon">{icon}</span>}
      <span className="ad-node-title">{title}</span>
    </div>
  </div>
);

// little lock indicator floating on edges
const EdgeLock = ({ x, y }) => (
  <div className="ad-edge-lock" style={{ left: x, top: y }}>
    <span className="material-symbols-outlined" style={{ fontSize: 11 }}>lock</span>
  </div>
);

const EdgeLabel = ({ x, y, lines, accent = false }) => (
  <div className={`ad-edge-label${accent ? " ad-edge-label--accent" : ""}`} style={{ left: x, top: y }}>
    {lines.map((l, i) => <div key={i}>{l}</div>)}
  </div>
);

// the graph — fixed coordinates, drawn with absolutely-positioned nodes + an SVG layer for edges
const AttestationGraph = () => {
  const W = 940, H = 360;
  // edge path helper
  return (
    <div className="ad-graph" style={{ width: W, height: H }}>
      {/* edges layer */}
      <svg className="ad-edges" width={W} height={H}>
        {/* Llama 3_2 -> HR Orchestrator */}
        <path d="M 200 175 C 240 175, 280 130, 380 130" />
        {/* Falcon H1 -> HR Orchestrator */}
        <path d="M 720 175 C 680 175, 620 130, 520 130" />
        {/* HR Orchestrator -> HR Analytics Agent */}
        <path d="M 430 165 C 430 200, 320 230, 320 250" />
        {/* HR Orchestrator -> Employee Onboarding */}
        <path d="M 450 165 C 450 200, 470 230, 470 250" />
        {/* HR Orchestrator -> HR Self Service */}
        <path d="M 470 165 C 480 200, 600 220, 620 245" />
        {/* HR Analytics Agent -> HR Analytics Tool (regular TLS) */}
        <path d="M 320 305 C 320 320, 280 330, 250 340" />
        {/* HR Analytics Agent -> HR Data Tool */}
        <path d="M 330 305 C 330 320, 360 330, 380 340" />
        {/* Employee Onboarding -> HR Data Tool */}
        <path d="M 460 305 C 460 320, 410 330, 390 340" />
        {/* Employee Onboarding -> Claims Data */}
        <path d="M 480 305 C 480 320, 510 330, 520 340" />
        {/* HR Self Service -> Claims Data */}
        <path d="M 610 305 C 600 320, 560 330, 540 340" />
        {/* HR Self Service -> Leave Balance */}
        <path d="M 640 305 C 660 320, 700 330, 710 345" />
        {/* HR Self Service -> Employee Info (hidden behind tooltip) */}
        <path d="M 620 305 C 620 320, 600 330, 590 340" strokeDasharray="" />

        {/* edge lock dots — emerald circles */}
        {[
          [264, 134], [620, 134], [430, 196], [468, 196], [560, 196],
          [296, 320], [358, 322], [402, 322], [510, 322], [560, 322], [690, 322]
        ].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="6" fill="var(--opq-ink-900)" stroke="var(--opq-emerald-500)" strokeWidth="1" />
          </g>
        ))}
      </svg>

      {/* edge lock glyphs (lock icon overlay) */}
      {[
        { x: 258, y: 128 }, { x: 614, y: 128 }, { x: 424, y: 190 }, { x: 462, y: 190 }, { x: 554, y: 190 },
        { x: 290, y: 314 }, { x: 352, y: 316 }, { x: 396, y: 316 }, { x: 504, y: 316 }, { x: 554, y: 316 }, { x: 684, y: 316 }
      ].map((p, i) => (
        <div key={i} className="ad-edge-lock-glyph" style={{ left: p.x, top: p.y }}>
          <span className="material-symbols-outlined" style={{ fontSize: 10 }}>lock</span>
        </div>
      ))}

      {/* edge labels */}
      <EdgeLabel x={250} y={150} lines={["Attested TLS"]} />
      <EdgeLabel x={210} y={310} lines={["Regular TLS"]} />

      {/* LLMs (top row) */}
      <GraphNode
        x={44} y={150} w={170}
        kind="llm"
        icon=""
        title={<span><span className="ad-llama">▲</span> Llama 3_2</span>}
        chip={<ConfidentialChip />}
      />
      <GraphNode
        x={620} y={150} w={170}
        kind="llm"
        icon=""
        title={<span><span className="ad-falcon">▼</span> Falcon H1</span>}
        chip={<ConfidentialChip />}
      />

      {/* HR Orchestrator (top center) */}
      <GraphNode
        x={372} y={86} w={156}
        kind="orchestrator"
        icon="hub"
        title="HR Orchestrator Agent"
        chip={<ConfidentialChip />}
      />

      {/* Agents row */}
      <GraphNode
        x={244} y={250} w={156}
        kind="agent"
        icon="hub"
        title="HR Analytics Agent"
        chip={<AttestedChip />}
      />
      <GraphNode
        x={400} y={250} w={156}
        kind="agent"
        icon="hub"
        title="Employee Onboarding Agent"
        chip={<AttestedChip />}
      />
      <GraphNode
        x={556} y={250} w={156}
        kind="agent-plain"
        icon="hub"
        title="HR Self Service Agent"
      />

      {/* Tools row */}
      <GraphNode x={140} y={340} w={156} kind="tool" icon="build" title="HR Analytics Tool" />
      <GraphNode x={316} y={340} w={140} kind="tool" icon="build" title="HR Data Tool" />
      <GraphNode x={476} y={340} w={140} kind="tool" icon="build" title="Claims Data" />
      <GraphNode x={640} y={355} w={140} kind="tool" icon="build" title="Leave Balance Tool" />
    </div>
  );
};

const PoliciesPanel = () => (
  <div className="ad-policies">
    <div className="ad-policies-chip"><EnforcedChip /></div>
    <div className="ad-policies-head">
      <span className="material-symbols-outlined" style={{ fontSize: 16, color: "var(--opq-emerald-400)" }}>shield</span>
      <span>Policies</span>
    </div>
    <div className="ad-policies-row">
      <div className="ad-policies-key">Policy set</div>
      <div className="ad-policies-val">Confidential AI – Stand…</div>
    </div>
    <div className="ad-policies-row">
      <div className="ad-policies-key">Closure of compute</div>
      <div className="ad-policies-val">Closed</div>
    </div>
  </div>
);

const TrustCard = ({ status, title, fields }) => (
  <div className="ad-trust-card">
    <div className="ad-trust-card-chip"><VerifiedChip label={status} /></div>
    <div className="ad-trust-card-title">{title}</div>
    {fields.map((f, i) => (
      <div key={i} className="ad-trust-card-row">
        <div className="ad-trust-card-key">{f.key}</div>
        <div className="ad-trust-card-val">{f.val}</div>
      </div>
    ))}
  </div>
);

const TrustChain = () => (
  <div className="ad-trust-chain">
    {/* Edge: Workflow card -> Platform */}
    <div className="ad-trust-connector ad-trust-connector--single">
      <svg width="100%" height="48" preserveAspectRatio="none" className="ad-trust-fork-svg">
        <line x1="50%" y1="0" x2="50%" y2="48" />
      </svg>
      <span className="ad-trust-edge-label ad-trust-edge-label--on-line">Runs on</span>
    </div>

    {/* Platform */}
    <div className="ad-trust-platform-wrap">
      <TrustCard
        status="VERIFIED"
        title="Platform: OPAQUE"
        fields={[
          { key: "Platform measurement", val: "0e3b01 0e3b01f2f08 0e3b01f2f08f2f08\u2026" },
          { key: "Verified via", val: "Azure Attestation Authority" },
        ]}
      />
    </div>

    {/* Edge: Platform -> dual Hardware (fork) */}
    <div className="ad-trust-connector ad-trust-connector--fork">
      <svg width="100%" height="56" viewBox="0 0 100 56" preserveAspectRatio="none" className="ad-trust-fork-svg">
        <path d="M 50,0 L 50,28 L 25,28 L 25,56 M 50,28 L 75,28 L 75,56"
              vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="ad-trust-edge-row ad-trust-edge-row--on-fork">
        <span className="ad-trust-edge-label">Runs on</span>
        <span className="ad-trust-edge-label">Runs on</span>
      </div>
    </div>

    <div className="ad-trust-pair">
      <TrustCard
        status="VERIFIED"
        title="Hardware: AMD SEV-SNP"
        fields={[
          { key: "Hardware measurement", val: "0e3b01 0e3b01f2f08 0e3b01f2f08f2f08\u2026" },
          { key: "Verified via", val: "Azure Attestation Authority" },
        ]}
      />
      <TrustCard
        status="VERIFIED"
        title="Hardware: NVIDIA H100"
        fields={[
          { key: "Hardware measurement", val: "0e4d04 1e5h01f6f08 0e3b01f2f08f2h8t\u2026" },
          { key: "Verified via", val: "NVIDIA Remote Attestation Authority" },
        ]}
      />
    </div>

    {/* Edge: Hardware -> Root of Trust (two parallel) */}
    <div className="ad-trust-connector ad-trust-connector--parallel">
      <svg width="100%" height="48" preserveAspectRatio="none" className="ad-trust-fork-svg">
        <line x1="25%" y1="0" x2="25%" y2="48" />
        <line x1="75%" y1="0" x2="75%" y2="48" />
      </svg>
      <div className="ad-trust-edge-row ad-trust-edge-row--on-parallel">
        <span className="ad-trust-edge-label">Verified by</span>
        <span className="ad-trust-edge-label">Verified by</span>
      </div>
    </div>

    <div className="ad-trust-pair">
      <div className="ad-rot-card">
        <div className="ad-trust-card-title">Root of Trust: Azure Attestation Service</div>
        <div className="ad-trust-card-row"><div className="ad-trust-card-key">Provider</div><div className="ad-trust-card-val">Microsoft Azure</div></div>
        <div className="ad-trust-card-row"><div className="ad-trust-card-key">Expires</div><div className="ad-trust-card-val">2026-08-27 28:47 UTC</div></div>
        <div className="ad-trust-card-row"><div className="ad-trust-card-key">Issuer</div><div className="ad-trust-card-val">MMA West US</div></div>
      </div>
      <div className="ad-rot-card">
        <div className="ad-trust-card-title">Root of Trust: NVIDIA Remote Attestation Service</div>
        <div className="ad-trust-card-row"><div className="ad-trust-card-key">Provider</div><div className="ad-trust-card-val">NVIDIA</div></div>
        <div className="ad-trust-card-row"><div className="ad-trust-card-key">Expires</div><div className="ad-trust-card-val">2026-08-27 28:47 UTC</div></div>
        <div className="ad-trust-card-row"><div className="ad-trust-card-key">Issuer</div><div className="ad-trust-card-val">NRAS West US</div></div>
      </div>
    </div>
  </div>
);

const AttestationDetail = ({ onBack }) => {
  return (
    <>
      <div className="ad-page-header">
        <div className="ad-breadcrumb">
          <button className="icon-btn" onClick={onBack} title="Back">
            <Icon name="arrow_back" size={20} />
          </button>
          <span className="ad-crumb-lock">
            <Icon name="lock" size={16} />
          </span>
          <span className="ad-crumb-parent">Trust Center</span>
          <span className="ad-crumb-sep">/</span>
          <span className="ad-crumb-current">hr-assist-7x4k2 — Attestation</span>
        </div>
        <div className="ad-header-actions">
          <button className="btn btn-secondary btn-sm">View attestation details</button>
          <button className="btn btn-primary btn-sm">
            <Icon name="download" size={16} />
            Export report
          </button>
        </div>
      </div>

      <div className="scroll">
        <div className="ad-page">
          <div className="ad-graph-row">
            <div className="ad-graph-card">
              <AttestationGraph />
            </div>
            <div className="ad-applied-to">Applied to</div>
            <PoliciesPanel />
          </div>

          <TrustChain />
        </div>
      </div>
    </>
  );
};

Object.assign(window, { AttestationDetail });
