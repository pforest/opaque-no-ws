// Workflows — org-wide home surface (No-Workspace variant).
// Status is Draft / Deployed; a Trust status badge reflects latest attestation.
// Members see only workflows they have access to; Admins/Owners see all.

const WORKFLOWS = [
  { name: "Employee HR Assist",    createdBy: "Annemarie Selaya",  status: "Deployed", trust: "Verified", updated: "14 Apr 2026", member: true },
  { name: "Employee HR Assist V2", createdBy: "Evan McMillon",     status: "Deployed", trust: "Failed",   updated: "12 Feb 2026", member: true },
  { name: "Financial RAG",         createdBy: "Deborah Mercy",     status: "Deployed", trust: "Verified", updated: "24 Jan 2026" },
  { name: "Marketing Copilot",     createdBy: "Jordan Bellamy",    status: "Draft",    trust: null,       updated: "18 Jan 2026", member: true },
  { name: "Support Triage Agent",  createdBy: "Noah Westergaard",  status: "Draft",    trust: null,       updated: "09 Jan 2026" },
];

const ROWS_PER_PAGE = 10;

const WF_STATUS_COLORS = {
  "Deployed": "var(--opq-emerald-400)",
  "Draft":    "var(--opq-ink-400)",
};

const WFStatusCell = ({ status }) => (
  <span className="status-cell">
    <span className="status-dot" style={{ background: WF_STATUS_COLORS[status] || "var(--opq-ink-400)" }} />
    <span>{status}</span>
  </span>
);

const trustChip = (trust) => {
  if (!trust) return <span className="wf-trust-none">—</span>;
  if (trust === "Verified") return <Chip variant="success-out">VERIFIED</Chip>;
  if (trust === "Failed")   return <Chip variant="error">FAILED</Chip>;
  if (trust === "At risk")  return <Chip variant="warn">AT RISK</Chip>;
  if (trust === "Pending")  return <Chip variant="neutral">PENDING</Chip>;
  return <Chip variant="neutral">{trust}</Chip>;
};

// SortHeader / Pagination / StatusCell live here and are shared via window.
const SortHeader = ({ label, field, sort, onSort, last }) => {
  const active = sort.field === field;
  const dirIcon = active && sort.dir === "desc" ? "arrow_downward" : "arrow_upward";
  return (
    <th className={`sortable${last ? " last" : ""}`} onClick={() => onSort(field)}>
      <span className="th-inner">
        <span>{label}</span>
        <span className={`sort-ind material-symbols-outlined${active ? " active" : ""}`}>{dirIcon}</span>
      </span>
    </th>
  );
};

const Pagination = ({ page, pageCount, total, rangeFrom, rangeTo, onChange }) => (
  <div className="pagination">
    <div className="pg-right">
      <span className="pg-label">Rows per page:</span>
      <button className="rows-select" type="button">
        <span>10</span>
        <Icon name="arrow_drop_down" size={18} />
      </button>
      <span className="pg-range">{rangeFrom}-{rangeTo} of {total}</span>
      <div className="pg-arrows">
        <button className="page-btn" disabled={page === 1} onClick={() => onChange(page - 1)} title="Previous">
          <Icon name="chevron_left" size={18} />
        </button>
        <button className="page-btn" disabled={page === pageCount} onClick={() => onChange(page + 1)} title="Next">
          <Icon name="chevron_right" size={18} />
        </button>
      </div>
    </div>
  </div>
);

// Legacy export kept for any other importer.
const StatusCell = WFStatusCell;

const getRoleWF = () => {
  try { return localStorage.getItem("opq-role") || "admin"; } catch (e) { return "admin"; }
};

const WorkflowsList = () => {
  const isMember = getRoleWF() === "member";
  const scoped = React.useMemo(
    () => (isMember ? WORKFLOWS.filter(w => w.member) : WORKFLOWS),
    [isMember]
  );

  const [page, setPage] = React.useState(1);
  const [sort, setSort] = React.useState({ field: null, dir: "asc" });
  const [query, setQuery] = React.useState("");

  const onSort = (field) => {
    setSort((s) => s.field === field
      ? { field, dir: s.dir === "asc" ? "desc" : "asc" }
      : { field, dir: "asc" });
    setPage(1);
  };

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = scoped.filter(w => {
      if (!q) return true;
      return (
        w.name.toLowerCase().includes(q) ||
        w.createdBy.toLowerCase().includes(q) ||
        w.status.toLowerCase().includes(q) ||
        (w.trust || "").toLowerCase().includes(q)
      );
    });
    if (sort.field) {
      const dir = sort.dir === "asc" ? 1 : -1;
      list = [...list].sort((a, b) => {
        const av = a[sort.field] || "";
        const bv = b[sort.field] || "";
        return av < bv ? -1 * dir : av > bv ? 1 * dir : 0;
      });
    }
    return list;
  }, [query, sort, scoped]);

  const counts = React.useMemo(() => {
    let deployed = 0, draft = 0, attention = 0;
    scoped.forEach(w => {
      if (w.status === "Deployed") deployed++;
      if (w.status === "Draft") draft++;
      if (w.trust === "Failed" || w.trust === "At risk") attention++;
    });
    return { deployed, draft, attention };
  }, [scoped]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / ROWS_PER_PAGE));
  const safePage = Math.min(page, pageCount);
  const startIdx = (safePage - 1) * ROWS_PER_PAGE;
  const rows = filtered.slice(startIdx, startIdx + ROWS_PER_PAGE);
  const rangeFrom = total === 0 ? 0 : startIdx + 1;
  const rangeTo = Math.min(startIdx + ROWS_PER_PAGE, total);

  // First-run empty state (no accessible workflows at all).
  if (scoped.length === 0) {
    return (
      <>
        <div className="page-header">
          <div className="title-row"><h1>Workflows</h1></div>
        </div>
        <div className="scroll">
          <div className="page-body">
            <div className="wf-empty">
              <div className="wf-empty-icon"><Icon name="graph_3" size={32} /></div>
              <div className="wf-empty-title">
                {isMember ? "You don't have access to any workflows yet" : "No workflows yet"}
              </div>
              <div className="wf-empty-body">
                {isMember
                  ? "Ask an Owner or Admin to grant you access, or create your first workflow once resources are registered."
                  : "Create your first workflow, or ask a Builder to get started. Register resources in Registry so Builders have nodes to work with."}
              </div>
              <Button variant="primary" size="sm">New workflow</Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <div className="title-row">
          <h1>Workflows</h1>
        </div>
      </div>
      <div className="scroll">
        <div className="page-body">
          <div className="metric-row" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
            <div className="card metric-tile">
              <div className="val">{counts.deployed}</div>
              <div className="lbl">
                <span className="status-dot" style={{ background: "var(--opq-emerald-400)" }} />
                <span>Deployed</span>
              </div>
            </div>
            <div className="card metric-tile">
              <div className="val">{counts.draft}</div>
              <div className="lbl">
                <span className="status-dot" style={{ background: "var(--opq-ink-400)" }} />
                <span>Draft</span>
              </div>
            </div>
          </div>

          <div className="filter-bar">
            <label className="search-field">
              <input
                placeholder="Search..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              />
              <Icon name="search" size={18} />
            </label>
            <div className="spacer" />
            <Button variant="primary" icon={null} size="sm">New workflow</Button>
          </div>

          <div className="table-wrap">
            <table className="opq-table wf-table">
              <thead>
                <tr>
                  <SortHeader label="Name"         field="name"      sort={sort} onSort={onSort} />
                  <SortHeader label="Status"       field="status"    sort={sort} onSort={onSort} />
                  <SortHeader label="Created by"   field="createdBy" sort={sort} onSort={onSort} />
                  <SortHeader label="Last updated" field="updated"   sort={sort} onSort={onSort} last />
                  <th className="actions-col"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((w) => (
                  <tr key={w.name}>
                    <td>
                      <a className="link" href="#" onClick={(e) => e.preventDefault()}>{w.name}</a>
                    </td>
                    <td><WFStatusCell status={w.status} /></td>
                    <td>{w.createdBy}</td>
                    <td>{w.updated}</td>
                    <td className="actions-col">
                      <button className="icon-btn" title="More">
                        <Icon name="more_vert" size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "48px 12px", color: "var(--opq-ink-400)" }}>
                      No workflows match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <Pagination
              page={safePage}
              pageCount={pageCount}
              total={total}
              rangeFrom={rangeFrom}
              rangeTo={rangeTo}
              onChange={(p) => setPage(Math.max(1, Math.min(pageCount, p)))}
            />
          </div>
        </div>
      </div>
    </>
  );
};

Object.assign(window, { WorkflowsList, SortHeader, Pagination, StatusCell });
