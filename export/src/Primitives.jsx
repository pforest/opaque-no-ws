// Opaque UI Kit — shared primitive components.
// NOTE: each component file exports onto `window` at the end so
// multiple <script type="text/babel"> blocks can share scope.

const OpaqueLogo = ({ width = 90, color = "currentColor" }) => (
  <svg width={width} height={width * (14/80)} viewBox="0 0 80 14" style={{ color }} fill="currentColor">
    <path d="M 70.21 0.244 L 80 0.244 L 80 2.395 L 72.669 2.395 L 72.669 5.736 L 79.799 5.736 L 79.799 8.02 L 72.669 8.02 L 72.669 11.612 L 80 11.612 L 80 13.794 L 70.21 13.794 L 70.21 0.244 Z M 65.651 0.244 L 65.651 8.591 C 65.651 10.197 64.843 11.764 62.165 11.778 C 59.487 11.764 58.68 10.197 58.68 8.591 L 58.68 0.244 L 56.229 0.244 L 56.229 8.546 C 56.229 11.813 58.006 14 62.165 14 C 66.324 14 68.101 11.813 68.101 8.546 L 68.101 0.244 L 65.651 0.244 Z M 52.112 12.03 L 55.114 12.03 C 55.425 12.684 55.834 13.265 56.336 13.762 C 56.419 13.844 56.504 13.923 56.591 14 L 46.827 14 C 42.343 14 39.605 10.866 39.605 7 C 39.605 3.134 42.343 0 46.827 0 C 51.31 0 54.048 3.134 54.048 7 C 54.048 9.463 52.802 11.379 50.936 12.384 C 51.34 12.188 51.598 12.03 52.112 12.03 Z M 46.827 11.846 C 49.748 11.846 51.49 9.676 51.49 7 C 51.49 4.324 49.748 2.155 46.827 2.155 C 43.905 2.155 42.163 4.324 42.163 7 C 42.163 9.676 43.905 11.846 46.827 11.846 Z M 29.852 10.721 L 28.591 13.793 L 25.805 13.793 C 25.836 13.702 31.545 0.832 31.805 0.244 L 33.942 0.244 C 34.203 0.832 39.912 13.702 39.943 13.793 L 37.157 13.793 L 35.896 10.721 L 29.852 10.721 Z M 32.906 3.189 L 32.841 3.189 L 30.706 8.627 L 35.04 8.627 L 32.906 3.189 Z M 27.65 4.41 C 27.65 6.554 26.011 8.638 23.409 8.638 L 18.573 8.638 L 18.573 13.794 L 16.078 13.794 L 16.078 0.244 L 22.888 0.244 C 26.548 0.244 27.65 2.265 27.65 4.41 Z M 25.156 4.454 C 25.156 3.381 24.556 2.314 23.193 2.314 L 18.573 2.314 L 18.573 6.565 L 22.651 6.565 C 24.414 6.565 25.156 5.526 25.156 4.454 Z M 7.222 0 C 2.738 0 0 3.134 0 7 C 0 10.866 2.738 14 7.222 14 C 11.705 14 14.444 10.866 14.444 7 C 14.444 3.134 11.705 0 7.222 0 Z M 11.885 7 C 11.885 9.676 10.143 11.845 7.222 11.845 C 4.301 11.845 2.558 9.676 2.558 7 C 2.558 4.324 4.3 2.154 7.222 2.154 C 10.144 2.154 11.885 4.324 11.885 7 Z"/>
  </svg>
);

const Icon = ({ name, size = 20, filled = false, style }) => (
  <span className="material-symbols-outlined" style={{
    fontSize: size,
    fontVariationSettings: filled ? "'FILL' 1" : undefined,
    ...style
  }}>{name}</span>
);

const Button = ({ variant = "primary", size = "md", icon, children, onClick }) => (
  <button className={`btn btn-${variant}${size === "sm" ? " btn-sm" : ""}`} onClick={onClick}>
    {icon && <Icon name={icon} size={size === "sm" ? 16 : 18} />}
    {children}
  </button>
);

const IconButton = ({ icon, solid = false, onClick, title }) => (
  <button className={`icon-btn${solid ? " solid" : ""}`} onClick={onClick} title={title}>
    <Icon name={icon} size={18} />
  </button>
);

const Chip = ({ variant = "success", children }) => (
  <span className={`chip chip-${variant}`}>{children}</span>
);

const Status = ({ tone = "success", children }) => (
  <span className="status"><span className={`dot dot-${tone}`} />{children}</span>
);

const Field = ({ icon = "search", placeholder, value, onChange, width }) => (
  <label className="field-wrap" style={{ width }}>
    {icon && <Icon name={icon} size={18} />}
    <input value={value || ""} placeholder={placeholder} onChange={e => onChange && onChange(e.target.value)} />
  </label>
);

const Select = ({ label, size, width }) => (
  <button className={`select${size === "sm" ? " sm" : ""}`} style={{ width, minWidth: width }}>
    <span>{label}</span>
    <Icon name="expand_more" size={18} />
  </button>
);

const MetricCard = ({ label, value, delta, deltaTone = "muted" }) => (
  <div className="card metric">
    <div className="lbl">{label}</div>
    <div className="val">{value}</div>
    <div className={`delta ${deltaTone}`}>{delta}</div>
  </div>
);

const PageHeader = ({ title, chip, subtitle, actions, tabs, activeTab, onTab }) => (
  <div className="page-header">
    <div className="title-row">
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <h1>{title}</h1>
        {chip && <Chip variant={chip.variant}>{chip.label}</Chip>}
        {subtitle && <span className="subtitle">{subtitle}</span>}
      </div>
      {actions && <div className="actions">{actions}</div>}
    </div>
    {tabs && (
      <div className="tabs">
        {tabs.map(t => (
          <button key={t} className={`tab${activeTab === t ? " active" : ""}`} onClick={() => onTab && onTab(t)}>{t}</button>
        ))}
      </div>
    )}
  </div>
);

Object.assign(window, { OpaqueLogo, Icon, Button, IconButton, Chip, Status, Field, Select, MetricCard, PageHeader });
