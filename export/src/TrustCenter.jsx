// Trust Center — Overview tab. Matches the attached design exactly.

const TC_METRICS = [
  { label: "Active workloads", value: "12" },
  { label: "Policies enforced", value: "47" },
  { label: "Enforced L30d",     value: "100%" },
  { label: "Blocks L30d",       value: "8" },
];

const BLOCKED = [
  { ts: "18 Mar 2026, 2:31 PM",  policy: "Network policy",    workload: "Employee HR Assist", pod: "hr-assist-7x4k3",  event: "Outbound connection to api.openai.com:443 blocked — not in approved egress allow-list" },
  { ts: "18 Mar 2026, 2:14 PM",  policy: "Runtime integrity", workload: "Employee HR Assist", pod: "hr-assist-7x4k4",  event: "Attestation failed — container image digest mismatch, workload denied execution" },
  { ts: "18 Mar 2026, 2:11 PM",  policy: "Network policy",    workload: "Financial RAG",      pod: "fin-rag-7x4k5",    event: "Inbound aTLS handshake rejected — claims-analytics-svc did not present valid attestation" },
  { ts: "18 Mar 2026, 1:31 PM",  policy: "Runtime integrity", workload: "HR Rag",             pod: "hr-rag-7x4k6",     event: "Attestation failed — LLM_API_ENDPOINT env var did not present valid value" },
  { ts: "18 Mar 2026, 12:46 PM", policy: "Network policy",    workload: "Financial RAG",      pod: "fin-rag-7x4k7",    event: "Outbound aTLS handshake failed — payroll-data-api attestation evidence rejected" },
  { ts: "18 Mar 2026, 12:31 PM", policy: "Pod access",        workload: "Employee HR Assis…", pod: "hr-assist-7x4k8",  event: "Pod exec denied — alice.chen@opaque.co attempted kubectl exec on production pod" },
  { ts: "18 Mar 2026, 11:24 AM", policy: "Network policy",    workload: "Employee HR Assist", pod: "hr-assist-7x4k9",  event: "Outbound connection to hr-reporting-vendor.com:443 blocked — destination not allow-listed" },
  { ts: "18 Mar 2026, 9:39 AM",  policy: "Runtime integrity", workload: "Employee HR Assist", pod: "hr-assist-7x4k10", event: "Attestation failed — unexpected volume mount /tmp/pii-buffer not in attested spec" },
];

const ATTESTATION = [
  {
    workload: "Employee HR Assist", type: "Container", instances: "3 pods",
    lastAttested: "", mode: "Production", status: "1 FAILED", failureType: "",
    children: [
      { name: "hr-assist-7x4k2", lastAttested: "24 Jan 2026, 3:41 PM", status: "VERIFIED",  failureType: "" },
      { name: "hr-assist-9m2p1", lastAttested: "24 Jan 2026, 3:41 PM", status: "FAILED",    failureType: "Measurement mismatch" },
      { name: "hr-assist-3j8w5", lastAttested: "24 Jan 2026, 3:41 PM", status: "VERIFIED",  failureType: "" },
    ],
  },
  { workload: "HR RAG v2",       type: "Workflow",   instances: "1 pod",              lastAttested: "24 Jan 2026, 3:41 PM", mode: "Dev mode",    status: "ALL VERIFIED", failureType: "" },
  { workload: "Financial RAG v2", type: "Container", instances: "2 pods",             lastAttested: "",                     mode: "Production",  status: "ALL VERIFIED", failureType: "" },
  { workload: "Financial RAG v3", type: "Container", instances: "No active instances", lastAttested: "",                    mode: "Production",  status: "ALL VERIFIED", failureType: "" },
];

// ---------- Small bits ----------

const TCSelect = ({ icon, label }) => (
  <button type="button" className="tc-select">
    {icon && <Icon name={icon} size={18} />}
    <span>{label}</span>
    <Icon name="expand_more" size={18} />
  </button>
);

const TCSearch = ({ placeholder }) => (
  <label className="tc-search">
    <input placeholder={placeholder} />
    <Icon name="search" size={16} />
  </label>
);

const statusChip = (status) => {
  if (status === "VERIFIED")     return <Chip variant="success-out">VERIFIED</Chip>;
  if (status === "ALL VERIFIED") return <Chip variant="success-out">ALL VERIFIED</Chip>;
  if (status === "FAILED")       return <Chip variant="error">FAILED</Chip>;
  if (status === "1 FAILED")     return <Chip variant="error">1 FAILED</Chip>;
  return <Chip variant="neutral">{status}</Chip>;
};

// ---------- Blocked Executions / Active Policies section ----------

const BlockedExecutionsSection = () => {
  const [sub, setSub] = React.useState("Blocked executions");
  return (
    <div className="tc-section">
      <div className="tc-subtabs">
        {["Blocked executions", "Active policies"].map(t => (
          <button
            key={t}
            className={`tc-subtab${sub === t ? " active" : ""}`}
            onClick={() => setSub(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div style={{ marginTop: 20, marginBottom: 16 }}>
        <TCSearch placeholder="Search blocked events" />
      </div>

      <table className="tc-table">
        <thead>
          <tr>
            <th style={{ width: 180 }}>Timestamp</th>
            <th style={{ width: 160 }}>Policy</th>
            <th style={{ width: 180 }}>Workload</th>
            <th style={{ width: 160 }}>Pod</th>
            <th>Event</th>
            <th style={{ width: 40 }}></th>
          </tr>
        </thead>
        <tbody>
          {BLOCKED.map((e, i) => (
            <tr key={i}>
              <td className="tc-muted">{e.ts}</td>
              <td>{e.policy}</td>
              <td>{e.workload}</td>
              <td>{e.pod}</td>
              <td className="tc-event">{e.event}</td>
              <td className="tc-kebab-cell">
                <button className="icon-btn" title="More">
                  <Icon name="more_vert" size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ---------- Workload Attestation section ----------

const AttestationRow = ({ row, onOpenResult }) => {
  const [open, setOpen] = React.useState(row.workload === "Employee HR Assist");
  const hasChildren = !!row.children;
  return (
    <>
      <tr className="tc-parent-row">
        <td className="tc-expand-cell">
          {hasChildren ? (
            <button
              className="tc-expand"
              onClick={() => setOpen(o => !o)}
              aria-label={open ? "Collapse" : "Expand"}
            >
              <Icon name={open ? "keyboard_arrow_down" : "chevron_right"} size={18} />
            </button>
          ) : (
            <button className="tc-expand">
              <Icon name="chevron_right" size={18} />
            </button>
          )}
          <a className="link" href="#" onClick={(e) => e.preventDefault()}>{row.workload}</a>
        </td>
        <td>{row.type}</td>
        <td>{row.instances}</td>
        <td className="tc-muted">{row.lastAttested}</td>
        <td>{row.mode}</td>
        <td>
          {row.status && statusChip(row.status)}
        </td>
        <td>{row.failureType}</td>
        <td className="tc-result-cell">
          <a className="link" href="#" onClick={(e) => e.preventDefault()}>View</a>
        </td>
        <td className="tc-export-cell">
          <a className="link" href="#" onClick={(e) => e.preventDefault()}>Export</a>
        </td>
      </tr>
      {hasChildren && open && row.children.map((c, i) => (
        <tr key={i} className="tc-child-row">
          <td className="tc-child-name">{c.name}</td>
          <td></td>
          <td></td>
          <td className="tc-muted">{c.lastAttested}</td>
          <td></td>
          <td>{statusChip(c.status)}</td>
          <td>{c.failureType}</td>
          <td className="tc-result-cell">
            <a
              className="link"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (c.name === "hr-assist-7x4k2" && onOpenResult) onOpenResult(c.name);
              }}
            >View</a>
          </td>
          <td className="tc-export-cell">
            <a
              className="link"
              href={c.name === "hr-assist-7x4k2" ? (window.__resources && window.__resources.governanceRecord) : "#"}
              download={c.name === "hr-assist-7x4k2" ? "OPAQUE-Governance-Record.pdf" : undefined}
              onClick={(e) => {
                if (c.name !== "hr-assist-7x4k2") { e.preventDefault(); return; }
                e.preventDefault();
                fetch(window.__resources.governanceRecord)
                  .then(r => r.blob())
                  .then(blob => {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "OPAQUE-Governance-Record.pdf";
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    setTimeout(() => URL.revokeObjectURL(url), 1000);
                  });
              }}
            >Export</a>
          </td>
        </tr>
      ))}
    </>
  );
};

const WorkloadAttestationSection = ({ onOpenResult }) => (
  <div className="tc-section">
    <h2 className="tc-section-title">Workload attestation</h2>
    <div style={{ marginBottom: 16 }}>
      <TCSelect label="All statuses" />
    </div>

    <table className="tc-table tc-table--attestation">
      <thead>
        <tr>
          <th style={{ width: 240 }}>Workload</th>
          <th style={{ width: 120 }}>Type</th>
          <th style={{ width: 180 }}>Active Instances</th>
          <th style={{ width: 180 }}>Last attested</th>
          <th style={{ width: 120 }}>Mode</th>
          <th style={{ width: 140 }}>Status</th>
          <th>Failure type</th>
          <th style={{ width: 80, textAlign: "right" }}>Result</th>
          <th style={{ width: 80, textAlign: "right" }}></th>
        </tr>
      </thead>
      <tbody>
        {ATTESTATION.map((r, i) => <AttestationRow key={i} row={r} onOpenResult={onOpenResult} />)}
      </tbody>
    </table>
  </div>
);

// ---------- Main component ----------

const TrustCenter = () => {
  const [tab, setTab] = React.useState("Overview");
  const [resultPod, setResultPod] = React.useState(null);

  if (resultPod) {
    return <AttestationDetail podName={resultPod} onBack={() => setResultPod(null)} />;
  }

  return (
    <>
      <PageHeader
        title="Trust Center"
        tabs={["Overview", "Audit Log"]}
        activeTab={tab}
        onTab={setTab}
      />
      <div className="scroll">
        <div className="page-body tc-page">
          <div className="tc-filter-row">
            <TCSelect icon="calendar_today" label="Last 7 days" />
            <TCSelect label="All workspaces" />
          </div>

          <h2 className="tc-section-title">Policy enforcement</h2>
          <div className="tc-metric-row">
            {TC_METRICS.map(m => (
              <div key={m.label} className="card tc-metric-tile">
                <div className="lbl">{m.label}</div>
                <div className="val">{m.value}</div>
              </div>
            ))}
          </div>

          <BlockedExecutionsSection />
          <WorkloadAttestationSection onOpenResult={(name) => setResultPod(name)} />
        </div>
      </div>
    </>
  );
};

Object.assign(window, { TrustCenter });
