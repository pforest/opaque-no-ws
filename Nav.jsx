// Left nav rail — 220px. NO-WORKSPACE VARIANT (3.0 UX brief).
// Flat single-group sidebar: no workspace picker, no scope groups, no separator.
// Top: optional cluster picker (multi-cluster orgs). Then a flat nav list.
// Footer: user menu. Role-aware — Member sees a reduced list.

const CLUSTERS = [
  { name: "US-East Prod",    region: "Azure · East US",     dot: "var(--opq-emerald-500)" },
  { name: "EU-West Prod",    region: "Azure · West Europe", dot: "var(--opq-emerald-500)" },
  { name: "US-West Staging", region: "Azure · West US 2",   dot: "var(--opq-warn-500)"    },
];

// Role is persisted to localStorage by the Tweaks panel; default Admin.
const getRole = () => {
  try { return localStorage.getItem("opq-role") || "admin"; } catch (e) { return "admin"; }
};

const USERS = {
  admin:  { name: "Annemarie Selaya", initials: "AS", role: "Admin" },
  member: { name: "Jordan Bellamy",   initials: "JB", role: "Builder" },
};

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

const Nav = ({ activeRoute, onNavigate }) => {
  const role = getRole();
  const isMember = role === "member";
  const user = isMember ? USERS.member : USERS.admin;

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

  // Flat, single-group nav. Admin/Owner sees all; Member sees Workflows + Trust.
  const allItems = [
    { key: "workflows", icon: "graph_3",       label: "Workflows",    route: "workflows",    href: "Workflows.html",  roles: ["admin", "member"] },
    { key: "registry",  icon: "storage",       label: "Registry",     route: "registry",     href: "Registry.html",   roles: ["admin"] },
    { key: "trust",     icon: "verified_user", label: "Trust Center", route: "trust",        href: "TrustCenter.html",roles: ["admin", "member"] },
    { key: "org",       icon: "settings",      label: "Org Settings", route: "org-settings", href: "OrgSettings.html",roles: ["admin"] },
  ];
  const items = allItems.filter(i => i.roles.includes(role));

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

      <div style={{ height: 8 }} />
      <div className="nav-section">{items.map(row)}</div>

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

Object.assign(window, { Nav, ClusterMenu });
