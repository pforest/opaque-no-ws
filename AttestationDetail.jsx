// Workload Detail Surface — per-pod attestation drill-down.
// Replaces the prior graph view. Mirrors the markdown wireframe in the
// Trust Center: Surface Design Directions doc (Pod detail view section).

// ---------- Fixtures ----------
// Two pods are wired: a FAILED example (matches the spec's primary
// wireframe, with PCR 7 mismatch at Layer 2), and a VERIFIED example
// (every layer passes — Layer 3 reached).

const POD_DETAILS = {
  "hr-assist-9m2p1": {
    workload: "Employee HR Assist",
    workspace: "HR Internal",
    mode: "Production",
    pod: "hr-assist-9m2p1",
    provider: "Azure (AMD SEV-SNP)",
    region: "US East",
    coverage: "2026-04-09 14:30:02 UTC",
    verdict: "FAILED",
    verdictHeadline: "Measurement mismatch at Layer 2 (Platform / PodVM)",
    layers: [
      { id: "hw", title: "Hardware (TEE)", n: 1, status: "VERIFIED", summary: "AMD SEV-SNP hardware report signed by AMD VCEK.",
        attrs: [
          { k: "Type",             reg: "AMD SEV-SNP",        run: "AMD SEV-SNP",        ok: true },
          { k: "Attestation rpt",  reg: "0x9c4e…a8f3",        run: "0x9c4e…a8f3",        ok: true },
          { k: "Signed by",        reg: "AMD · VCEK",         run: "AMD · VCEK",         ok: true },
          { k: "VCEK fingerprint", reg: "a1:f2:9c:84…e7:2b", run: "a1:f2:9c:84…e7:2b",   ok: true },
        ]},
      { id: "plat", title: "Platform (PodVM)", n: 2, status: "FAILED", summary: "PCR 7 does not match registered manifest — bootloader not as expected.",
        attrs: [
          { k: "Image",     reg: "CoCo PodVM v0.17.0", run: "CoCo PodVM v0.17.0", ok: true },
          { k: "Signed by", reg: "OPAQUE Systems",     run: "OPAQUE Systems",     ok: true },
          { k: "PCR 3",     reg: "PUAV/LXMAtofR0BV…",  run: "PUAV/LXMAtofR0BV…",  ok: true },
          { k: "PCR 7",     reg: "ek2aVR7TmEkmNfcP…",  run: "x9F3aGgsmKLkmQiP…",  ok: false, note: "bootloader not as expected" },
          { k: "PCR 11",    reg: "OMoKpGovvdyA/Sgs…",  run: "—",                  ok: null,  note: "chain halted at PCR 7" },
        ]},
      { id: "app", title: "Application (Workflow)", n: 3, status: "NOT REACHED", summary: "Attestation halted at Layer 2; application layer not evaluated.", attrs: null },
    ],
    whatFailed: {
      headline: "PCR 7 measurement does not match the registered manifest value.",
      lines: [
        { k: "Expected", v: "ek2aVR7TmEkmNfcP… (bootloader v3.2.1, signed by OPAQUE Systems)" },
        { k: "Observed", v: "x9F3aGgsmKLkmQiP…" },
      ],
      cause: "PodVM image was rebuilt with a different bootloader without re-registering the manifest.",
    },
  },

  "hr-assist-7x4k2": {
    workload: "Employee HR Assist",
    workspace: "HR Internal",
    mode: "Production",
    pod: "hr-assist-7x4k2",
    provider: "Azure (AMD SEV-SNP)",
    region: "US East",
    coverage: "2026-01-24 15:41:07 UTC",
    verdict: "VERIFIED",
    verdictHeadline: "Manifest match · Hardware valid · Policies enforced",
    layers: [
      { id: "hw", title: "Hardware (TEE)", n: 1, status: "VERIFIED", summary: "AMD SEV-SNP hardware report signed by AMD VCEK.",
        attrs: [
          { k: "Type",             reg: "AMD SEV-SNP",        run: "AMD SEV-SNP",        ok: true },
          { k: "Attestation rpt",  reg: "0x9c4e…a8f3",        run: "0x9c4e…a8f3",        ok: true },
          { k: "Signed by",        reg: "AMD · VCEK",         run: "AMD · VCEK",         ok: true },
          { k: "VCEK fingerprint", reg: "a1:f2:9c:84…e7:2b", run: "a1:f2:9c:84…e7:2b",   ok: true },
        ]},
      { id: "plat", title: "Platform (PodVM)", n: 2, status: "VERIFIED", summary: "PodVM image and PCRs match registered manifest.",
        attrs: [
          { k: "Image",     reg: "CoCo PodVM v0.17.0", run: "CoCo PodVM v0.17.0", ok: true },
          { k: "Signed by", reg: "OPAQUE Systems",     run: "OPAQUE Systems",     ok: true },
          { k: "PCR 3",     reg: "PUAV/LXMAtofR0BV…",  run: "PUAV/LXMAtofR0BV…",  ok: true },
          { k: "PCR 7",     reg: "ek2aVR7TmEkmNfcP…",  run: "ek2aVR7TmEkmNfcP…",  ok: true },
          { k: "PCR 11",    reg: "OMoKpGovvdyA/Sgs…",  run: "OMoKpGovvdyA/Sgs…",  ok: true },
        ]},
      { id: "app", title: "Application (Workflow)", n: 3, status: "VERIFIED", summary: "Workflow signature and definition match registered manifest.",
        attrs: [
          { k: "Name",                reg: "HR Assist Workflow", run: "HR Assist Workflow", ok: true },
          { k: "Signed by",           reg: "OPAQUE Systems",     run: "OPAQUE Systems",     ok: true },
          { k: "Workflow server",     reg: "0x7f3a…b9c1",        run: "0x7f3a…b9c1",        ok: true },
          { k: "Workflow definition", reg: "0x4e2d…a8f3",        run: "0x4e2d…a8f3",        ok: true },
        ]},
    ],
    whatFailed: null,
  },
};

// ---------- Status chip ----------

const LayerStatus = ({ status }) => {
  if (status === "VERIFIED")   return <span className="wd-stat wd-stat--ok"><Icon name="check" size={14} />VERIFIED</span>;
  if (status === "FAILED")     return <span className="wd-stat wd-stat--fail"><Icon name="close" size={14} />FAILED</span>;
  if (status === "NOT REACHED")return <span className="wd-stat wd-stat--off">— NOT REACHED</span>;
  return <span className="wd-stat wd-stat--off">{status}</span>;
};

// ---------- One layer accordion ----------

const Layer = ({ layer, defaultOpen }) => {
  const [open, setOpen] = React.useState(defaultOpen);
  const collapsible = !!layer.attrs;
  return (
    <div className={`wd-layer wd-layer--${layer.status.toLowerCase().replace(" ", "-")}`}>
      <button
        type="button"
        className="wd-layer-head"
        onClick={() => collapsible && setOpen(o => !o)}
        disabled={!collapsible}
      >
        <span className="wd-layer-caret">
          {collapsible && <Icon name={open ? "keyboard_arrow_down" : "chevron_right"} size={18} />}
        </span>
        <span className="wd-layer-title">
          <span className="wd-layer-n">Layer {layer.n}</span>
          <span className="wd-layer-sep">—</span>
          <span className="wd-layer-name">{layer.title}</span>
        </span>
        <span className="wd-layer-status"><LayerStatus status={layer.status} /></span>
      </button>
      {open && collapsible && (
        <div className="wd-layer-body">
          <div className="wd-layer-summary">{layer.summary}</div>
          <table className="wd-attr">
            <thead>
              <tr>
                <th style={{ width: 200 }}>Attribute</th>
                <th>Registered (Manifest)</th>
                <th>Runtime</th>
                <th style={{ width: 32 }}></th>
              </tr>
            </thead>
            <tbody>
              {layer.attrs.map((a, i) => (
                <tr key={i} className={a.ok === false ? "wd-attr-fail" : a.ok === null ? "wd-attr-skip" : ""}>
                  <td className="wd-attr-key">{a.k}</td>
                  <td className="wd-attr-val wd-mono">{a.reg}</td>
                  <td className="wd-attr-val wd-mono">
                    <span>{a.run}</span>
                    {a.note && <span className="wd-attr-note"> — {a.note}</span>}
                  </td>
                  <td className="wd-attr-mark">
                    {a.ok === true && <Icon name="check" size={16} />}
                    {a.ok === false && <Icon name="close" size={16} />}
                    {a.ok === null && <span className="wd-attr-dash">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!collapsible && (
        <div className="wd-layer-body wd-layer-body--empty">{layer.summary}</div>
      )}
    </div>
  );
};

// ---------- Export menu (3 artifact buttons) ----------

const ExportButton = ({ label, sub, disabled, onClick }) => (
  <button
    type="button"
    className={`wd-export-btn${disabled ? " wd-export-btn--disabled" : ""}`}
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    title={disabled ? "Evidence is produced on attestation failure only" : undefined}
  >
    <Icon name="download" size={16} />
    <span className="wd-export-btn-text">
      <span className="wd-export-btn-label">{label}</span>
      <span className="wd-export-btn-sub">{sub}</span>
    </span>
  </button>
);

// ---------- Main page ----------

const AttestationDetail = ({ podName, onBack }) => {
  const data = POD_DETAILS[podName] || POD_DETAILS["hr-assist-7x4k2"];
  const isFail = data.verdict === "FAILED";

  const downloadFile = (url, filename) => {
    fetch(url)
      .then(r => r.blob())
      .then(blob => {
        const objUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = objUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(objUrl), 1000);
      });
  };

  return (
    <>
      <div className="wd-page-header">
        <div className="wd-breadcrumb">
          <button className="icon-btn" onClick={onBack} title="Back">
            <Icon name="arrow_back" size={20} />
          </button>
          <a className="wd-crumb-parent" href="#" onClick={(e) => { e.preventDefault(); onBack && onBack(); }}>
            Trust Center
          </a>
          <span className="wd-crumb-sep">/</span>
          <span className="wd-crumb-mid">{data.workload}</span>
          <span className="wd-crumb-sep">/</span>
          <span className="wd-crumb-current">{data.pod}</span>
        </div>

        <div className="wd-header-actions">
          <ExportButton
            label="Manifest"
            sub="Pre-execution"
            onClick={() => downloadFile("assets/OPAQUE-Governance-Record.pdf", `${data.pod}-manifest.pdf`)}
          />
          <ExportButton
            label="Result"
            sub="Governance Record"
            onClick={() => downloadFile("assets/OPAQUE-Governance-Record.pdf", "OPAQUE-Governance-Record.pdf")}
          />
          <ExportButton
            label="Evidence"
            sub={isFail ? "Raw runtime measurements" : "Failure only"}
            disabled={!isFail}
            onClick={() => downloadFile("assets/attestation-report.json", `${data.pod}-evidence.json`)}
          />
        </div>
      </div>

      <div className="scroll">
        <div className="wd-page">
          {/* Coverage anchor */}
          <div className="wd-coverage">
            <Icon name="schedule" size={14} />
            <span className="wd-coverage-label">Coverage</span>
            <span className="wd-coverage-val">{data.coverage}</span>
            <span className="wd-coverage-note">(single attestation moment)</span>
          </div>

          {/* Workload + pod meta */}
          <div className="wd-meta">
            <div className="wd-meta-row">
              <span className="wd-meta-key">Workload</span>
              <span className="wd-meta-val">
                {data.workload}
                <span className="wd-meta-dot">·</span>
                {data.workspace}
                <span className="wd-meta-dot">·</span>
                <span className="wd-meta-mode">{data.mode}</span>
              </span>
            </div>
            <div className="wd-meta-row">
              <span className="wd-meta-key">Pod</span>
              <span className="wd-meta-val wd-mono">
                {data.pod}
                <span className="wd-meta-dot">·</span>
                <span className="wd-mono-off">{data.provider}</span>
                <span className="wd-meta-dot">·</span>
                <span className="wd-mono-off">{data.region}</span>
              </span>
            </div>
          </div>

          {/* Verdict */}
          <div className="wd-section-label">Verdict</div>
          <div className={`wd-verdict ${isFail ? "wd-verdict--fail" : "wd-verdict--ok"}`}>
            <div className="wd-verdict-icon">
              <Icon name={isFail ? "cancel" : "check_circle"} size={32} />
            </div>
            <div className="wd-verdict-text">
              <div className="wd-verdict-headline">
                {isFail ? "FAILED" : "ALL CHECKS PASSED"}
                {isFail && <span className="wd-verdict-sub"> — {data.verdictHeadline}</span>}
              </div>
              {!isFail && <div className="wd-verdict-sub-line">{data.verdictHeadline}</div>}
            </div>
          </div>

          {/* Layered Trust Chain */}
          <div className="wd-section-label">Layered Trust Chain</div>
          <div className="wd-chain">
            {data.layers.map((l, i) => (
              <Layer
                key={l.id}
                layer={l}
                defaultOpen={l.status === "FAILED" || (!isFail && l.status === "VERIFIED" && i === 0)}
              />
            ))}
          </div>

          {/* What failed */}
          {isFail && data.whatFailed && (
            <>
              <div className="wd-what-head">
                <div className="wd-section-label wd-section-label--inline">What failed</div>
                <button className="wd-what-todo" disabled>
                  <Icon name="lightbulb" size={14} />
                  What to do
                  <span className="wd-what-todo-soon">(coming soon)</span>
                </button>
              </div>
              <div className="wd-what">
                <div className="wd-what-headline">{data.whatFailed.headline}</div>
                <div className="wd-what-grid">
                  {data.whatFailed.lines.map((l, i) => (
                    <div key={i} className="wd-what-line">
                      <span className="wd-what-key">{l.k}:</span>
                      <span className="wd-what-val wd-mono">{l.v}</span>
                    </div>
                  ))}
                </div>
                <div className="wd-what-cause">
                  <span className="wd-what-cause-key">Most likely cause:</span>{" "}
                  {data.whatFailed.cause}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

Object.assign(window, { AttestationDetail });
