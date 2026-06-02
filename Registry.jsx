// Registry — org-level home for Containers + Resources registration.
// Default tab: Containers. Drilling into a container links to Trust Center.

const CONTAINERS = [
  {
    name: "hr-assist",
    image: "ghcr.io/opaque-co/hr-assist@sha256:7f3c…a91d",
    workspaces: ["HR Internal"],
    workspaceCount: 1,
    status: "Registered",
    method: "CLI",
    lastAttested: "24 Jan 2026, 3:41 PM",
    attestStatus: "1 FAILED",
    registeredBy: "Annemarie Selaya",
    registered: "12 Jan 2026",
  },
  {
    name: "fin-rag",
    image: "ghcr.io/opaque-co/fin-rag@sha256:b4e1…0c2f",
    workspaces: ["Finance Department"],
    workspaceCount: 1,
    status: "Registered",
    method: "CLI",
    lastAttested: "24 Jan 2026, 3:38 PM",
    attestStatus: "ALL VERIFIED",
    registeredBy: "Deborah Mercy",
    registered: "08 Jan 2026",
  },
  {
    name: "fin-rag-v3",
    image: "ghcr.io/opaque-co/fin-rag@sha256:c9d2…5b71",
    workspaces: [],
    workspaceCount: 0,
    status: "Registered",
    method: "CLI",
    lastAttested: "—",
    attestStatus: "Not yet attested",
    registeredBy: "Deborah Mercy",
    registered: "06 Jan 2026",
  },
  {
    name: "hr-rag-v2",
    image: "ghcr.io/opaque-co/hr-rag@sha256:1a8b…ef03",
    workspaces: ["HR Internal"],
    workspaceCount: 1,
    status: "Registered",
    method: "CLI",
    lastAttested: "24 Jan 2026, 3:41 PM",
    attestStatus: "ALL VERIFIED",
    registeredBy: "Annemarie Selaya",
    registered: "29 Dec 2025",
  },
  {
    name: "claims-analytics",
    image: "ghcr.io/opaque-co/claims@sha256:e740…ba6c",
    workspaces: ["Finance Department", "Sales & Marketing"],
    workspaceCount: 2,
    status: "Registered",
    method: "CLI",
    lastAttested: "23 Jan 2026, 11:02 AM",
    attestStatus: "ALL VERIFIED",
    registeredBy: "Priya Manikandan",
    registered: "18 Dec 2025",
  },
  {
    name: "payroll-data-api",
    image: "ghcr.io/opaque-co/payroll@sha256:32fa…981b",
    workspaces: ["Finance Department"],
    workspaceCount: 1,
    status: "Pending review",
    method: "CLI",
    lastAttested: "—",
    attestStatus: "Not yet attested",
    registeredBy: "Deborah Mercy",
    registered: "04 Jan 2026",
  },
  {
    name: "vendor-doc-ingest",
    image: "ghcr.io/opaque-co/vendor-doc@sha256:5c81…77ee",
    workspaces: [],
    workspaceCount: 0,
    status: "Pending review",
    method: "CLI",
    lastAttested: "—",
    attestStatus: "Not yet attested",
    registeredBy: "Priya Manikandan",
    registered: "02 Jan 2026",
  },
  {
    name: "support-summarizer",
    image: "ghcr.io/opaque-co/support-sum@sha256:9b34…2dd1",
    workspaces: ["Sales & Marketing"],
    workspaceCount: 1,
    status: "Registered",
    method: "CLI",
    lastAttested: "22 Jan 2026, 8:14 AM",
    attestStatus: "ALL VERIFIED",
    registeredBy: "Maya Ramirez",
    registered: "21 Dec 2025",
  },
  {
    name: "marketing-personalize",
    image: "ghcr.io/opaque-co/mkt-personalize@sha256:aa12…bb88",
    workspaces: ["Sales & Marketing"],
    workspaceCount: 1,
    status: "Registered",
    method: "CLI",
    lastAttested: "21 Jan 2026, 4:50 PM",
    attestStatus: "ALL VERIFIED",
    registeredBy: "Evan McMillon",
    registered: "14 Dec 2025",
  },
  {
    name: "benefits-rag",
    image: "ghcr.io/opaque-co/benefits-rag@sha256:dd09…44a2",
    workspaces: ["HR Internal"],
    workspaceCount: 1,
    status: "Registered",
    method: "CLI",
    lastAttested: "20 Jan 2026, 9:33 AM",
    attestStatus: "ALL VERIFIED",
    registeredBy: "Annemarie Selaya",
    registered: "10 Dec 2025",
  },
  {
    name: "leads-scorer",
    image: "ghcr.io/opaque-co/leads-scorer@sha256:71b9…3a07",
    workspaces: [],
    workspaceCount: 0,
    status: "Deregistered",
    method: "CLI",
    lastAttested: "12 Dec 2025, 2:41 PM",
    attestStatus: "Inactive",
    registeredBy: "Jordan Bellamy",
    registered: "30 Nov 2025",
  },
  {
    name: "compliance-monitor",
    image: "ghcr.io/opaque-co/compliance@sha256:0fa1…6c4d",
    workspaces: ["Finance Department", "HR Internal"],
    workspaceCount: 2,
    status: "Registered",
    method: "CLI",
    lastAttested: "19 Jan 2026, 6:12 PM",
    attestStatus: "ALL VERIFIED",
    registeredBy: "Noah Westergaard",
    registered: "22 Nov 2025",
  },
];

const STATUS_FILTERS = ["All statuses", "Registered", "Pending review", "Deregistered"];
const ROWS_PER_PAGE_REG = 10;

// ---------------- Status chips ----------------

const regStatusChip = (status) => {
  if (status === "Registered")     return <Chip variant="success-out">REGISTERED</Chip>;
  if (status === "Pending review") return <Chip variant="warn">PENDING REVIEW</Chip>;
  if (status === "Deregistered")   return <Chip variant="neutral">DEREGISTERED</Chip>;
  return <Chip variant="neutral">{status}</Chip>;
};

const attestChip = (status) => {
  if (status === "ALL VERIFIED")     return <Chip variant="success-out">ALL VERIFIED</Chip>;
  if (status === "1 FAILED")         return <Chip variant="error">1 FAILED</Chip>;
  if (status === "FAILED")           return <Chip variant="error">FAILED</Chip>;
  if (status === "Not yet attested") return <span className="reg-muted">Not yet attested</span>;
  if (status === "Inactive")         return <span className="reg-muted">—</span>;
  return <Chip variant="neutral">{status}</Chip>;
};

// ---------------- Workspace permissions cell ----------------

const WorkspacePerms = ({ workspaces }) => {
  if (!workspaces || workspaces.length === 0) {
    return <span className="reg-unbound">No workspaces · <a className="link" href="#" onClick={(e) => e.preventDefault()}>Permission</a></span>;
  }
  if (workspaces.length === 1) {
    return <span className="reg-ws">{workspaces[0]}</span>;
  }
  return (
    <span className="reg-ws-multi">
      <span className="reg-ws">{workspaces[0]}</span>
      <span className="reg-ws-more">+{workspaces.length - 1}</span>
    </span>
  );
};

// ---------------- Containers tab ----------------

const REG_CONTAINERS = [
  { name: "HR Assist",             registeredBy: "Annemarie Selaya",  registered: "14 Apr 2026" },
  { name: "fin-rag",               registeredBy: "Evan McMillon",     registered: "12 Feb 2026" },
  { name: "fin-rag-v3",            registeredBy: "Deborah Mercy",     registered: "24 Jan 2026" },
  { name: "HR RAG v1",             registeredBy: "Janice Johnson",    registered: "24 Jan 2026" },
  { name: "claims-analytics",      registeredBy: "Priya Manikandan",  registered: "22 Jan 2026" },
  { name: "payroll-data-api",      registeredBy: "Deborah Mercy",     registered: "18 Jan 2026" },
  { name: "vendor-doc-ingest",     registeredBy: "Priya Manikandan",  registered: "15 Jan 2026" },
  { name: "support-summarizer",    registeredBy: "Maya Ramirez",      registered: "12 Jan 2026" },
  { name: "marketing-personalize", registeredBy: "Evan McMillon",     registered: "09 Jan 2026" },
  { name: "benefits-rag",          registeredBy: "Annemarie Selaya",  registered: "07 Jan 2026" },
  { name: "leads-scorer",          registeredBy: "Jordan Bellamy",    registered: "04 Jan 2026" },
  { name: "compliance-monitor",    registeredBy: "Noah Westergaard",  registered: "29 Dec 2025" },
  { name: "hr-assist-v2",          registeredBy: "Annemarie Selaya",  registered: "22 Dec 2025" },
  { name: "fin-rag-v2",            registeredBy: "Deborah Mercy",     registered: "18 Dec 2025" },
  { name: "contract-analyzer",     registeredBy: "Priya Manikandan",  registered: "14 Dec 2025" },
  { name: "expense-classifier",    registeredBy: "Maya Ramirez",      registered: "09 Dec 2025" },
  { name: "sales-intel",           registeredBy: "Maya Ramirez",      registered: "05 Dec 2025" },
  { name: "recruiter-screener",    registeredBy: "Annemarie Selaya",  registered: "02 Dec 2025" },
  { name: "legal-doc-review",      registeredBy: "Priya Manikandan",  registered: "27 Nov 2025" },
  { name: "procurement-advisor",   registeredBy: "Devon Oduya",       registered: "22 Nov 2025" },
  { name: "onboarding-guide",      registeredBy: "Jordan Bellamy",    registered: "18 Nov 2025" },
  { name: "policy-auditor",        registeredBy: "Priya Manikandan",  registered: "14 Nov 2025" },
  { name: "incident-retro",        registeredBy: "Devon Oduya",       registered: "09 Nov 2025" },
  { name: "internal-search",       registeredBy: "Annemarie Selaya",  registered: "04 Nov 2025" },
  { name: "release-notes",         registeredBy: "Jordan Bellamy",    registered: "30 Oct 2025" },
  { name: "meeting-minutes",       registeredBy: "Maya Ramirez",      registered: "26 Oct 2025" },
  { name: "data-room-assistant",   registeredBy: "Priya Manikandan",  registered: "22 Oct 2025" },
  { name: "comp-modeler",          registeredBy: "Devon Oduya",       registered: "17 Oct 2025" },
  { name: "security-review",       registeredBy: "Noah Westergaard",  registered: "12 Oct 2025" },
  { name: "kb-curator",            registeredBy: "Annemarie Selaya",  registered: "07 Oct 2025" },
];

const ContainersTab = () => {
  const [page, setPage] = React.useState(1);
  const [sort, setSort] = React.useState({ field: null, dir: "asc" });

  const onSort = (field) => {
    setSort((s) => s.field === field
      ? { field, dir: s.dir === "asc" ? "desc" : "asc" }
      : { field, dir: "asc" });
    setPage(1);
  };

  const filtered = React.useMemo(() => {
    let list = [...REG_CONTAINERS];
    if (sort.field) {
      const dir = sort.dir === "asc" ? 1 : -1;
      list = list.sort((a, b) => {
        const av = a[sort.field] || "";
        const bv = b[sort.field] || "";
        return av < bv ? -1 * dir : av > bv ? 1 * dir : 0;
      });
    }
    return list;
  }, [sort]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / ROWS_PER_PAGE_REG));
  const safePage = Math.min(page, pageCount);
  const startIdx = (safePage - 1) * ROWS_PER_PAGE_REG;
  const rows = filtered.slice(startIdx, startIdx + ROWS_PER_PAGE_REG);
  const rangeFrom = total === 0 ? 0 : startIdx + 1;
  const rangeTo = Math.min(startIdx + ROWS_PER_PAGE_REG, total);

  return (
    <>
      <div className="reg-info-banner">
        <Icon name="info" size={20} />
        <span className="reg-info-text">
          Container registration is CLI-only. Grant workspace access here so containers can be
          included as nodes in Studio-built workflows.
        </span>
        <a className="reg-info-link" href="#" onClick={(e) => e.preventDefault()}>
          View CLI docs
          <Icon name="arrow_outward" size={16} />
        </a>
      </div>

      <div className="table-wrap">
        <table className="opq-table wf-table reg-table">
          <thead>
            <tr>
              <SortHeader label="Name"            field="name"         sort={sort} onSort={onSort} />
              <SortHeader label="Registered by"   field="registeredBy" sort={sort} onSort={onSort} />
              <SortHeader label="Date registered" field="registered"   sort={sort} onSort={onSort} last />
              <th className="actions-col"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.name}>
                <td>
                  <a className="link reg-name" href="TrustCenter.html">{c.name}</a>
                </td>
                <td>{c.registeredBy}</td>
                <td className="reg-muted">{c.registered}</td>
                <td className="actions-col">
                  <button className="icon-btn" title="More">
                    <Icon name="more_vert" size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: "48px 12px", color: "var(--opq-ink-400)" }}>
                  No containers registered yet.
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
    </>
  );
};

// ---------------- Resources tab (org-level) ----------------

const REG_RESOURCES = [
  { name: "HR Policies Corpus",      type: "Data Sources", boundTo: ["HR Internal"],                           registeredBy: "Annemarie Selaya", updated: "18 Apr 2026" },
  { name: "Claude Sonnet 4.5",       type: "Models",       boundTo: ["HR Internal", "Finance Department", "Sales & Marketing"], registeredBy: "Platform", updated: "14 Apr 2026" },
  { name: "Salesforce CRM",          type: "Data Sources", boundTo: ["Sales & Marketing"],                     registeredBy: "Deborah Mercy",    updated: "12 Apr 2026" },
  { name: "Web Search",              type: "Agent Tools",  boundTo: ["HR Internal", "Sales & Marketing"],      registeredBy: "Platform",         updated: "11 Apr 2026" },
  { name: "Confluence Wiki",         type: "Data Sources", boundTo: ["HR Internal"],                           registeredBy: "Priya Manikandan", updated: "09 Apr 2026" },
  { name: "SQL Query Tool",          type: "Agent Tools",  boundTo: ["Finance Department"],                    registeredBy: "Jordan Bellamy",   updated: "07 Apr 2026" },
  { name: "Claude Haiku 4.5",        type: "Models",       boundTo: ["HR Internal", "Finance Department"],     registeredBy: "Platform",         updated: "04 Apr 2026" },
  { name: "Employee Handbook PDFs",  type: "Data Sources", boundTo: ["HR Internal"],                           registeredBy: "Annemarie Selaya", updated: "02 Apr 2026" },
  { name: "Jira Issues",             type: "Data Sources", boundTo: [],                                        registeredBy: "Noah Westergaard", updated: "29 Mar 2026" },
  { name: "Code Interpreter",        type: "Agent Tools",  boundTo: ["Finance Department"],                    registeredBy: "Devon Oduya",      updated: "26 Mar 2026" },
  { name: "Zendesk Tickets",         type: "Data Sources", boundTo: ["Sales & Marketing"],                     registeredBy: "Maya Ramirez",     updated: "22 Mar 2026" },
  { name: "Google Drive",            type: "Data Sources", boundTo: ["HR Internal", "Sales & Marketing"],      registeredBy: "Jordan Bellamy",   updated: "18 Mar 2026" },
  { name: "Claude Opus 4",           type: "Models",       boundTo: [],                                        registeredBy: "Platform",         updated: "14 Mar 2026" },
  { name: "Slack Export",            type: "Data Sources", boundTo: ["HR Internal"],                           registeredBy: "Evan McMillon",    updated: "10 Mar 2026" },
  { name: "Email Sender",            type: "Agent Tools",  boundTo: ["Sales & Marketing"],                     registeredBy: "Devon Oduya",      updated: "06 Mar 2026" },
  { name: "Vendor Contracts",        type: "Data Sources", boundTo: ["Finance Department"],                    registeredBy: "Priya Manikandan", updated: "02 Mar 2026" },
  { name: "Calendar API",            type: "Agent Tools",  boundTo: ["HR Internal"],                           registeredBy: "Annemarie Selaya", updated: "26 Feb 2026" },
  { name: "Finance Ledger",          type: "Data Sources", boundTo: ["Finance Department"],                    registeredBy: "Deborah Mercy",    updated: "22 Feb 2026" },
  { name: "GPT-4o (fallback)",       type: "Models",       boundTo: [],                                        registeredBy: "Platform",         updated: "18 Feb 2026" },
  { name: "GitHub Issues",           type: "Data Sources", boundTo: [],                                        registeredBy: "Noah Westergaard", updated: "14 Feb 2026" },
];

const TYPE_FILTERS_REG = ["All types", "Data Sources", "Agent Tools", "Models"];
const TYPE_ICONS_REG = {
  "Data Sources": "database",
  "Agent Tools":  "construction",
  "Models":       "network_intel_node",
};

const RegTypeCell = ({ type }) => (
  <span className="type-cell">
    <Icon name={TYPE_ICONS_REG[type] || "category"} size={18} />
    <span>{type}</span>
  </span>
);

const BoundCell = ({ boundTo, onBind }) => {
  if (!boundTo || boundTo.length === 0) {
    return <span className="reg-unbound">Unbound · <a className="link" href="#" onClick={(e) => { e.preventDefault(); onBind && onBind(); }}>Bind</a></span>;
  }
  if (boundTo.length === 1) return <span className="reg-ws">{boundTo[0]}</span>;
  return (
    <span className="reg-ws-multi">
      <span className="reg-ws">{boundTo[0]}</span>
      <span className="reg-ws-more">+{boundTo.length - 1}</span>
    </span>
  );
};

const ResourcesTab = () => {
  const [page, setPage] = React.useState(1);
  const [sort, setSort] = React.useState({ field: null, dir: "asc" });
  const [query, setQuery] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("All types");
  const [registerOpen, setRegisterOpen] = React.useState(false);
  const [openMenu, setOpenMenu] = React.useState(null);
  const [toast, setToast] = React.useState(null);
  React.useEffect(() => {
    if (openMenu === null) return;
    const onDoc = () => setOpenMenu(null);
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, [openMenu]);
  React.useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const onSort = (field) => {
    setSort((s) => s.field === field
      ? { field, dir: s.dir === "asc" ? "desc" : "asc" }
      : { field, dir: "asc" });
    setPage(1);
  };

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = REG_RESOURCES.filter(r => {
      if (typeFilter !== "All types" && r.type !== typeFilter) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        r.registeredBy.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q)
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
  }, [query, sort, typeFilter]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / ROWS_PER_PAGE_REG));
  const safePage = Math.min(page, pageCount);
  const startIdx = (safePage - 1) * ROWS_PER_PAGE_REG;
  const rows = filtered.slice(startIdx, startIdx + ROWS_PER_PAGE_REG);
  const rangeFrom = total === 0 ? 0 : startIdx + 1;
  const rangeTo = Math.min(startIdx + ROWS_PER_PAGE_REG, total);

  return (
    <>
      <p className="reg-tab-helper">
        Org-level passive resources. Every registered resource is available org-wide to any
        workflow that references it — there is no workspace binding.
      </p>
      <div className="filter-bar reg-filter-bar">
        <label className="search-field">
          <input
            placeholder="Search resources..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          />
          <Icon name="search" size={18} />
        </label>
        <div className="type-filters">
          {TYPE_FILTERS_REG.map(t => (
            <button
              key={t}
              className={`type-filter${typeFilter === t ? " active" : ""}`}
              onClick={() => { setTypeFilter(t); setPage(1); }}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="spacer" />
        <Button variant="primary" icon="add" size="sm" onClick={() => setRegisterOpen(true)}>Register resource</Button>
      </div>

      <div className="table-wrap">
        <table className="opq-table wf-table reg-table">
          <thead>
            <tr>
              <SortHeader label="Name"          field="name"         sort={sort} onSort={onSort} />
              <SortHeader label="Type"          field="type"         sort={sort} onSort={onSort} />
              <SortHeader label="Registered by" field="registeredBy" sort={sort} onSort={onSort} />
              <SortHeader label="Last updated"  field="updated"      sort={sort} onSort={onSort} last />
              <th className="actions-col"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name}>
                <td>
                  <a className="link" href="#" onClick={(e) => e.preventDefault()}>{r.name}</a>
                </td>
                <td><RegTypeCell type={r.type} /></td>
                <td>{r.registeredBy}</td>
                <td className="reg-muted">{r.updated}</td>
                <td className="actions-col" style={{ position: "relative" }}>
                  <button className="icon-btn" title="More" onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === r.name ? null : r.name); }}>
                    <Icon name="more_vert" size={18} />
                  </button>
                  {openMenu === r.name && (
                    <div className="reg-row-menu" onClick={(e) => e.stopPropagation()}>
                      <button><Icon name="edit" size={16} /><span>Edit configuration</span></button>
                      <button className="reg-row-menu-danger"><Icon name="delete" size={16} /><span>Unregister</span></button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "48px 12px", color: "var(--opq-ink-400)" }}>
                  No resources match your filters.
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

      <RegisterResourceModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onComplete={(r) => setToast(r)}
      />
      {toast && (
        <div className="rr-toast">
          <span className="rr-toast-dot" />
          <span><strong>{toast.name}</strong> registered as {toast.type}</span>
          <button className="rr-toast-close" onClick={() => setToast(null)}>
            <Icon name="close" size={16} />
          </button>
        </div>
      )}
    </>
  );
};

// ---------------- Main Registry component ----------------

const Registry = () => {
  const [tab, setTab] = React.useState("Containers");

  return (
    <>
      <PageHeader
        title="Registry"
        tabs={["Containers", "Resources"]}
        activeTab={tab}
        onTab={setTab}
      />
      <div className="scroll">
        <div className="page-body reg-page">
          {tab === "Containers" ? <ContainersTab /> : <ResourcesTab />}
        </div>
      </div>
    </>
  );
};

Object.assign(window, { Registry });
