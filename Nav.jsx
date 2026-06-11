// Left nav rail — 220px. 3.0 UX brief v2 — Default Workspace Model.
// SINGLE-WORKSPACE MODE: the default workspace is invisible — no workspace
// picker, flat list split by a divider (Agent Studio above, org destinations
// below). MULTI-WORKSPACE MODE: same flat list — the workspace picker now
// lives inside the Agent Studio header (WorkspaceSelect in Workflows.jsx),
// not in the rail. Active workspace from opqGetWorkspace().
// Footer: user menu. Role-aware: Owner/Global Admin see the full list;
// Member sees only Agent Studio + Trust Center.

const CLUSTERS = [
  { name: "US-East Prod",    region: "Azure · East US",     dot: "var(--opq-emerald-500)" },
  { name: "EU-West Prod",    region: "Azure · West Europe", dot: "var(--opq-emerald-500)" },
  { name: "US-West Staging", region: "Azure · West US 2",   dot: "var(--opq-warn-500)"    },
];


const ClusterMenu = ({ current, onPick, onClose }) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const onDocClick = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="cl-menu" ref={ref}>
      <div className="cl-menu-label">Clusters</div>
      <div className="cl-menu-list">
        {CLUSTERS.map(c => (
          <button
            key={c.name}
            className={`cl-menu-item${c.name === current ? " current" : ""}`}
            onClick={() => { onPick(c); onClose(); }}
          >
            <span className="cl-dot" style={{ background: c.dot }} />
            <span className="cl-menu-text">
              <span className="cl-menu-name">{c.name}</span>
              <span className="cl-menu-region">{c.region}</span>
            </span>
            {c.name === current && <Icon name="check" size={18} />}
          </button>
        ))}
      </div>
    </div>
  );
};

// Workspace picker dropdown (multi-workspace mode). Search appears at 3+
// accessible workspaces; "New workspace" routes admins to Org Settings.
const WorkspaceMenu = ({ current, isAdmin, onPick, onClose }) => {
  const [q, setQ] = React.useState("");
  const ref = React.useRef(null);
  React.useEffect(() => {
    const onDocClick = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const showSearch = OPQ_WORKSPACES.length >= 3;
  const filtered = OPQ_WORKSPACES.filter(w =>
    w.name.toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <div className="ws-menu" ref={ref}>
      {showSearch && (
        <label className="ws-menu-search">
          <input autoFocus placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
          <Icon name="search" size={18} />
        </label>
      )}
      {showSearch && <div className="ws-menu-section-label">Recents</div>}
      <div className="ws-menu-list">
        {filtered.map(w => (
          <button
            key={w.name}
            className={`ws-menu-item${w.name === current ? " current" : ""}`}
            onClick={() => { onPick(w); onClose(); }}>
            <span className="ws-initials">{w.initials}</span>
            <span className="ws-menu-name">{w.name}</span>
            {w.isDefault && <span className="ws-default-badge">Default</span>}
          </button>
        ))}
        {filtered.length === 0 && <div className="ws-menu-empty">No workspaces</div>}
      </div>
      {isAdmin && (
        <React.Fragment>
          <div className="ws-menu-divider" />
          <a className="ws-menu-item ws-new" href="OrgSettings.html?view=workspaces">
            <Icon name="add" size={20} />
            <span className="ws-menu-name">New workspace</span>
          </a>
        </React.Fragment>
      )}
    </div>
  );
};

const Nav = ({ activeRoute, onNavigate }) => {
  const role = opqGetRole();
  const isAdmin = opqIsAdmin(role);
  const user = OPQ_PERSONA[role] || OPQ_PERSONA.member;

  const [clOpen, setClOpen] = React.useState(false);
  const [userOpen, setUserOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);
  const [cluster, setCluster] = React.useState("US-East Prod");
  const current = CLUSTERS.find(c => c.name === cluster) || CLUSTERS[0];

  const userRef = React.useRef(null);
  React.useEffect(() => {
    if (!userOpen) return;
    const onDocClick = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    };
    const onKey = (e) => { if (e.key === "Escape") setUserOpen(false); };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [userOpen]);

  // Workspace-scoped group (default workspace is implicit/invisible).
  const studioItems = [
    { key: "workflows", icon: "graph_3", label: "Agent Studio", route: "workflows", href: "index.html" },
  ];
  // Org-scoped group below the divider. Members see only Trust Center.
  const orgItems = [
    { key: "registry", icon: "storage",       label: "Registry",     route: "registry",     href: "Registry.html",    show: isAdmin },
    { key: "trust",    icon: "verified_user", label: "Trust Center", route: "trust",        href: "TrustCenter.html", show: true },
  ].filter(i => i.show);

  const isActive = (item) => activeRoute === item.route;

  const row = (item) => (
    <a
      key={item.key}
      className={`nav-item${isActive(item) ? " active" : ""}`}
      href={item.href}
      onClick={(e) => {
        if (item.href === "#") { e.preventDefault(); onNavigate && onNavigate(item.route); }
      }}
      title={collapsed ? item.label : undefined}
    >
      <Icon name={item.icon} size={20} />
      {!collapsed && <span>{item.label}</span>}
    </a>
  );

  return (
    <aside className={`nav${collapsed ? " collapsed" : ""}`}>
      <div className="nav-header">
        {!collapsed && <OpaqueLogo width={88} color="var(--opq-emerald-500)" />}
        <button
          className="nav-dock"
          title={collapsed ? "Expand" : "Collapse"}
          onClick={() => { setCollapsed(c => !c); setClOpen(false); setUserOpen(false); }}
        >
          <Icon name="dock_to_right" size={18} />
        </button>
      </div>

      {/* Cluster picker hidden — single-cluster org (multi-cluster orgs only) */}
      {/* Workspace picker moved into Agent Studio header (see WorkspaceSelect). */}

      <div style={{ height: 8 }} />
      <div className="nav-section">{studioItems.map(row)}</div>
      <div className="nav-divider" />
      <div className="nav-section">{orgItems.map(row)}</div>

      <div className="nav-spacer" />

      <div className="nav-footer" ref={userRef}>
        {userOpen && (
          <div className="user-menu">
            <button className="user-menu-item">
              <Icon name="person" size={20} />
              {!collapsed && <span>My Profile</span>}
            </button>
            {isAdmin && (
              <a className="user-menu-item" href="OrgSettings.html?view=users">
                <Icon name="group" size={20} />
                {!collapsed && <span>User Management</span>}
              </a>
            )}
            {isAdmin && (
              <a className="user-menu-item" href="OrgSettings.html">
                <Icon name="settings" size={20} />
                {!collapsed && <span>Org Settings</span>}
              </a>
            )}
            <button className="user-menu-item">
              <Icon name="logout" size={20} />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        )}
        <button
          className={`user-pill${userOpen ? " active" : ""}`}
          onClick={() => setUserOpen(o => !o)}
          title={collapsed ? user.name : undefined}
        >
          <span className="user-avatar">{user.initials}</span>
          {!collapsed && (
            <span className="user-text">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role}</span>
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};

Object.assign(window, { Nav, ClusterMenu, WorkspaceMenu });