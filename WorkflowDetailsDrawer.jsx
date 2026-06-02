// Workflow details drawer — pinned to right side. Two tabs: Summary and Details.

const WD_SUMMARY = {
  closure: {
    workflowName: "Employee HR Assist",
    workflowMeasurement: "0x7f3a…b9c1",
    policy: "Confidential AI – Standard (Enforced)",
  },
  attestation: {
    status: "Verified",
    lastVerified: "2026-01-26 11:47 AM",
    workflowHash: "0e3b01 0e3b01f2f08 0e3b01f2f08f2f08a3e4c…",
  },
  components: {
    models: ["Llama 3_2", "Falcon H1"],
    agents: ["HR Orchestrator", "HR Analytics Agent", "Employee Onboarding", "HR Self Service"],
    tools: ["HR Analytics Tool", "HR Data Tool", "Claims Data", "Employee Info Tool", "Leave Balance Tool"],
  },
  policies: [
    { name: "Data Policies", count: 3 },
    { name: "Access Policies", count: 2 },
  ],
  trustChain: [
    { layer: "Workflow", desc: "Platform config hash matches attested deployment" },
    { layer: "Platform", desc: "Hardware platform measurement verified by MAA and NRAS" },
    { layer: "Hardware", desc: "Root SEV-SNP attestation signed by MAA" },
    { layer: "Hardware", desc: "Root H100 attestation signed by NRAS" },
  ],
};

const WD_DETAILS = {
  attestationOverview: {
    description: "Establishes what was attested, when, where, and whether it passed, forming the root record for audit traceability.",
    fields: [
      { k: "Attestation UUID", v: "0b3f988c-9ada-43cb-a8d4-3c3e28887e3a" },
      { k: "Workflow UUID", v: "05d62a4e-4c7f-44ec-8852-9cf06513ed1d" },
      { k: "Workflow Name", v: "Employee HR Assist" },
      { k: "Node Name", v: "aks-pool1-32061274-vmss000000" },
      { k: "Attested at", v: "Feb 2, 2026, 19:16:04 UTC" },
      { k: "Attestation Status", v: <span className="wd-verified-row"><Icon name="check" size={14} /> Verified</span> },
      { k: "Error message", v: "None" },
    ],
  },
  tokenMetadata: {
    description: "Proves who issued the attestation, who it's valid for, and its cryptographic lifetime.",
    fields: [
      { k: "Issuer", v: "authority.opaque.co" },
      { k: "Audience", v: "compute.opaque.co" },
      { k: "Issued at", v: "Feb 2, 2026" },
      { k: "Expires at", v: "Feb 2, 2026" },
      { k: "Key type", v: "Elliptic Curve (P-256)" },
      { k: "Algorithm", v: "ES256" },
      { k: "Public key", v: "Bound to this attestation" },
    ],
  },
  authorityContext: {
    description: "Anchors trust in Opaque as the policy-enforcing attestation authority.",
    fields: [
      { k: "Authority Version", v: "1.0" },
      { k: "Runtime", v: "Azure Confidential VM (CVM)" },
      { k: "OPAQUE Nonce", v: "Unique, single-use challenge" },
      { k: "Expires at", v: "Feb 2, 2026" },
      { k: "Key type", v: "Elliptic Curve (P-256)" },
      { k: "Algorithm", v: "ES256" },
      { k: "Public key", v: "Bound to this attestation" },
    ],
  },
  azureDoc: {
    description: "Provides hardware-rooted evidence directly from Azure's attestation service.",
    fields: [
      { k: "Issuer", v: "Azure Attestation Service (East US 2)" },
      { k: "Attestation type", v: "Azure VM" },
      { k: "Protocol version", v: "2.0" },
      { k: "Secure boot", v: "Enabled" },
    ],
  },
};

const WDRow = ({ k, v }) => (
  <div className="wd-row">
    <div className="wd-row-key">{k}</div>
    <div className="wd-row-val">{v}</div>
  </div>
);

const WDSection = ({ title, description, fields }) => (
  <div className="wd-section">
    <h3 className="wd-section-title">{title}</h3>
    {description && <p className="wd-section-desc">{description}</p>}
    {fields.map((f, i) => <WDRow key={i} k={f.k} v={f.v} />)}
  </div>
);

const WDListRow = ({ label, count }) => (
  <button className="wd-list-row">
    <span>{count != null ? `${label} (${count})` : label}</span>
    <Icon name="chevron_right" size={18} />
  </button>
);

const WDComponentGroup = ({ title, items }) => (
  <div className="wd-component-group">
    <div className="wd-component-group-title">{title} ({items.length})</div>
    {items.map((it, i) => (
      <button key={i} className="wd-list-row wd-list-row--inset">
        <span>{it}</span>
        <Icon name="chevron_right" size={18} />
      </button>
    ))}
  </div>
);

const WDSummaryTab = () => (
  <>
    <div className="wd-section">
      <h3 className="wd-section-title">Closure of compute summary</h3>
      <div className="wd-row-stack">
        <div className="wd-stack-key">Workflow name</div>
        <div className="wd-stack-val">{WD_SUMMARY.closure.workflowName}</div>
      </div>
      <div className="wd-row-stack">
        <div className="wd-stack-key">Workflow measurement</div>
        <div className="wd-stack-val">{WD_SUMMARY.closure.workflowMeasurement}</div>
      </div>
      <div className="wd-row-stack">
        <div className="wd-stack-key">Policy</div>
        <div className="wd-stack-val">{WD_SUMMARY.closure.policy}</div>
      </div>
    </div>

    <div className="wd-divider" />

    <div className="wd-section">
      <h3 className="wd-section-title">Attestation</h3>
      <div className="wd-row-stack">
        <div className="wd-stack-key">Status</div>
        <div className="wd-stack-val">{WD_SUMMARY.attestation.status}</div>
      </div>
      <div className="wd-row-stack">
        <div className="wd-stack-key">Last verified</div>
        <div className="wd-stack-val">{WD_SUMMARY.attestation.lastVerified}</div>
      </div>
      <div className="wd-row-stack">
        <div className="wd-stack-key">Workflow hash</div>
        <div className="wd-stack-val wd-stack-val--with-copy">
          <span className="wd-mono-trunc">{WD_SUMMARY.attestation.workflowHash}</span>
          <button className="icon-btn wd-copy-btn" title="Copy">
            <Icon name="content_copy" size={14} />
          </button>
        </div>
      </div>
    </div>

    <div className="wd-divider" />

    <div className="wd-section">
      <h3 className="wd-section-title">Components</h3>
      <WDComponentGroup title="Models" items={WD_SUMMARY.components.models} />
      <WDComponentGroup title="Agents" items={WD_SUMMARY.components.agents} />
      <WDComponentGroup title="Tools" items={WD_SUMMARY.components.tools} />
    </div>

    <div className="wd-divider" />

    <div className="wd-section">
      <h3 className="wd-section-title">Policies</h3>
      {WD_SUMMARY.policies.map((p, i) => (
        <WDListRow key={i} label={p.name} count={p.count} />
      ))}
    </div>

    <div className="wd-divider" />

    <div className="wd-section">
      <h3 className="wd-section-title">Trust Chain</h3>
      {WD_SUMMARY.trustChain.map((row, i) => (
        <div key={i} className="wd-trust-row">
          <div className="wd-trust-layer">{row.layer}</div>
          <div className="wd-trust-desc">{row.desc}</div>
          <Icon name="check" size={14} className="wd-trust-check" />
        </div>
      ))}
    </div>
  </>
);

const WDDetailsTab = () => (
  <>
    <WDSection
      title="Attestation overview"
      description={WD_DETAILS.attestationOverview.description}
      fields={WD_DETAILS.attestationOverview.fields}
    />
    <div className="wd-divider" />
    <WDSection
      title="Token Metadata"
      description={WD_DETAILS.tokenMetadata.description}
      fields={WD_DETAILS.tokenMetadata.fields}
    />
    <div className="wd-divider" />
    <WDSection
      title="OPAQUE Authority Context"
      description={WD_DETAILS.authorityContext.description}
      fields={WD_DETAILS.authorityContext.fields}
    />
    <div className="wd-divider" />
    <WDSection
      title="Azure Attestation Document"
      description={WD_DETAILS.azureDoc.description}
      fields={WD_DETAILS.azureDoc.fields}
    />
  </>
);

const WorkflowDetailsDrawer = ({ open, onClose, initialTab = "Summary" }) => {
  const [tab, setTab] = React.useState(initialTab);
  React.useEffect(() => { if (open) setTab(initialTab); }, [open, initialTab]);

  if (!open) return null;
  return (
    <div className="wd-drawer">
      <div className="wd-drawer-head">
        <h2 className="wd-drawer-title">Workflow details</h2>
        <button className="icon-btn" onClick={onClose} title="Close">
          <Icon name="close" size={20} />
        </button>
      </div>
      <div className="wd-drawer-tabs">
        {["Summary", "Details"].map(t => (
          <button
            key={t}
            className={`wd-drawer-tab${tab === t ? " active" : ""}`}
            onClick={() => setTab(t)}
          >{t}</button>
        ))}
      </div>
      <div className="wd-drawer-body">
        {tab === "Summary" ? <WDSummaryTab /> : <WDDetailsTab />}
      </div>
    </div>
  );
};

Object.assign(window, { WorkflowDetailsDrawer });
