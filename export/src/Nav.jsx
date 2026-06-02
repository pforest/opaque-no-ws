// Left nav rail — 220px, workspace picker + workspace / org nav + user footer.

const WORKSPACES = [
  { initials: "FI", name: "Finance Department", color: "var(--opq-emerald-500)" },
  { initials: "HR", name: "HR Internal",        color: "var(--opq-emerald-500)" },
  { initials: "SM", name: "Sales & Marketing",  color: "var(--opq-emerald-500)" },
];

// Per brief: search bar shows only when user has access to 3+ workspaces.
const SEARCH_THRESHOLD = 3;

const WorkspaceMenu = ({ current, onPick, onClose }) => {
  const [q, setQ] = React.useState("");
  const ref = React.useRef(null);
  React.useEffect(() => {
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const showSearch = WORKSPACES.length >= SEARCH_THRESHOLD;
  const filtered = WORKSPACES.filter(w =>
    w.name.toLowerCase().includes(q.trim().toLowerCase())
  );

  return (
    <div className="ws-menu" ref={ref}>
      {showSearch && (
        <label className="ws-menu-search">
          <input
            autoFocus
            placeholder="Search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Icon name="search" size={18} />
        </label>
      )}

      {showSearch && <div className="ws-menu-section-label">Recents</div>}
      <div className="ws-menu-list">
        {filtered.map(w => (
          <button
            key={w.name}
            className={`ws-menu-item${w.name === current ? " current" : ""}`}
            onClick={() => { onPick(w); onClose(); }}
          >
            <span className="ws-initials">{w.initials}</span>
            <span className="ws-menu-name">{w.name}</span>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="ws-menu-empty">No workspaces</div>
        )}
      </div>

      <div className="ws-menu-divider" />

      <a className="ws-menu-item ws-new" href="CreateWorkspace.html">
        <Icon name="add" size={20} />
        <span className="ws-menu-name">New workspace</span>
      </a>
    </div>
  );
};

const Nav = ({ activeRoute, onNavigate, scoped = true }) => {
  const [wsOpen, setWsOpen] = React.useState(false);
  const [userOpen, setUserOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);
  const [workspace, setWorkspace] = React.useState("HR Internal");
  const current = WORKSPACES.find(w => w.name === workspace) || WORKSPACES[1];
  // Per brief: when the user is on the Workspaces list surface (no active
  // workspace scope), the picker shows "Select a workspace" and the
  // workspace-scoped group collapses entirely.
  const isScoped = scoped && activeRoute !== "workspaces";

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

  const items = [
    { key: "workflows",   icon: "graph_3",       label: "Workflows",          route: "studio",       href: "Workflows.html",         scope: "ws" },
    { key: "resources",   icon: "grid_view",     label: "Resources",          route: "resources",    href: "Resources.html",         scope: "ws" },
    { key: "ws-settings", icon: "tune",          label: "Workspace Settings", route: "ws-settings",  href: "WorkspaceSettings.html", scope: "ws" },
    { key: "workspaces",  icon: "workspaces",    label: "Workspaces",         route: "workspaces",   href: "Workspaces.html",        scope: "org" },
    { key: "registry",    icon: "storage",       label: "Registry",           route: "registry",     href: "#",                      scope: "org" },
    { key: "trust",       icon: "verified_user", label: "Trust Center",       route: "trust",        href: "TrustCenter.html",       scope: "org" },
    { key: "org-settings",icon: "settings",      label: "Org Settings",       route: "org-settings", href: "#",                      scope: "org" },
  ];
  const ws = items.filter(i => i.scope === "ws");
  const org = items.filter(i => i.scope === "org");

  const isActive = (item) =>
    activeRoute === item.route ||
    (item.route === "studio" && activeRoute === "studio-canvas");

  const row = (item) => (
    <a
      key={item.key}
      className={`nav-item${isActive(item) ? " active" : ""}`}
      href={item.href}
      onClick={(e) => {
        if (item.href === "#") {
          e.preventDefault();
          onNavigate && onNavigate(item.route);
        }
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
          onClick={() => { setCollapsed(c => !c); setWsOpen(false); setUserOpen(false); }}
        >
          <Icon name="dock_to_right" size={18} />
        </button>
      </div>

      <div className="ws-picker">
        <button
          className={`ws-pill${wsOpen ? " open" : ""}${!isScoped ? " placeholder" : ""}`}
          onClick={() => setWsOpen(o => !o)}
          title={collapsed ? (isScoped ? current.name : "Select a workspace") : undefined}
        >
          <span className="ws-left">
            {isScoped
              ? <span className="ws-initials">{current.initials}</span>
              : <Icon name="workspaces" size={18} style={{ color: "var(--opq-ink-400)" }} />}
            {!collapsed && (
              <span className="ws-name">
                {isScoped ? current.name : "Select a workspace"}
              </span>
            )}
          </span>
          {!collapsed && <Icon name="unfold_more" size={18} />}
        </button>
        {wsOpen && (
          <WorkspaceMenu
            current={isScoped ? current.name : null}
            onPick={(w) => setWorkspace(w.name)}
            onClose={() => setWsOpen(false)}
          />
        )}
      </div>

      <div style={{ height: 8 }} />
      {isScoped && <div className="nav-section">{ws.map(row)}</div>}
      {isScoped && <div className="nav-divider" />}
      <div className="nav-section">{org.map(row)}</div>

      <div className="nav-spacer" />

      <div className="nav-footer" ref={userRef}>
        {userOpen && (
          <div className="user-menu">
            <button className="user-menu-item">
              <Icon name="person" size={20} />
              {!collapsed && <span>Profile Settings</span>}
            </button>
            <button className="user-menu-item">
              <Icon name="logout" size={20} />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        )}
        <button
          className={`user-pill${userOpen ? " active" : ""}`}
          onClick={() => setUserOpen(o => !o)}
          title={collapsed ? "Annemarie Selaya" : undefined}
        >
          <span className="user-avatar">AS</span>
          {!collapsed && <span className="user-name">Annemarie Selaya</span>}
        </button>
      </div>
    </aside>
  );
};

Object.assign(window, { Nav, WorkspaceMenu });
