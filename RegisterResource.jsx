// Register Resource flow — 3-step modal: type → connector → configure.
// Mirrors the existing integrations flow but improved: search on picker,
// inline success state, dark theme to match the rest of the app.

const RR_TYPES = [
  {
    key: "data",
    label: "Data Source",
    icon: "database",
    desc: "Connect to an external data source for retrieval.",
  },
  {
    key: "tool",
    label: "Agent Tool",
    icon: "construction",
    desc: "Expose an action or external API to agent workflows.",
  },
  {
    key: "model",
    label: "Model",
    icon: "network_intel_node",
    desc: "Configure a language model for reasoning, generation, or retrieval.",
  },
];

// Connector catalogs per type. Each: id, name, desc, icon (material symbol),
// tone (color accent), fields (form schema).
const RR_CATALOG = {
  data: [
    {
      id: "azure_ai_search",
      name: "Azure AI Search Retriever",
      desc: "Retrieves relevant results from an Azure AI Search index.",
      icon: "cloud",
      tone: "info",
      fields: [
        { id: "name", label: "Resource name", required: true, placeholder: "Azure AI Search Connector" },
        { id: "description", label: "Description", type: "textarea" },
        { id: "endpoint", label: "Search endpoint", required: true, placeholder: "https://<service>.search.windows.net" },
        { id: "apiKey", label: "API key", type: "password", help: "API key can only be updated by the person who entered it." },
        { id: "indexName", label: "Index name", required: true, placeholder: "Enter index name" },
      ],
    },
    {
      id: "qdrant",
      name: "Qdrant Retriever",
      desc: "Retrieves relevant results from a Qdrant vector database.",
      icon: "deployed_code",
      tone: "error",
      fields: [
        { id: "name", label: "Resource name", required: true, placeholder: "Qdrant Retriever Connector" },
        { id: "description", label: "Description", type: "textarea" },
        { id: "url", label: "Qdrant server URL", required: true, placeholder: "Enter Qdrant server URL" },
        { id: "apiKey", label: "API key", type: "password", placeholder: "Enter API key (if using Qdrant Cloud)", help: "API key can only be updated by the person who entered it." },
        { id: "collection", label: "Collection name", required: true, placeholder: "Enter collection name" },
        {
          id: "embedding",
          label: "Embedding model",
          type: "select",
          options: [
            "sentence-transformers/all-MiniLM-L6-v2 — Default",
            "sentence-transformers/all-mpnet-base-v2",
            "BAAI/bge-small-en-v1.5",
            "BAAI/bge-large-en-v1.5",
          ],
          help: "Supported HuggingFace embedding models.",
        },
      ],
    },
    {
      id: "neo4j",
      name: "Neo4j-Cypher",
      desc: "Runs Cypher queries against a Neo4j graph database.",
      icon: "polyline",
      tone: "info",
      fields: [
        { id: "name", label: "Resource name", required: true },
        { id: "description", label: "Description", type: "textarea" },
        { id: "url", label: "Bolt URL", required: true, placeholder: "bolt://host:7687" },
        { id: "user", label: "Username", required: true },
        { id: "password", label: "Password", type: "password" },
      ],
    },
    {
      id: "postgres",
      name: "PostgreSQL Connector",
      desc: "Runs SQL queries against a PostgreSQL database and returns structured results.",
      icon: "table_view",
      tone: "info",
      fields: [
        { id: "name", label: "Resource name", required: true },
        { id: "description", label: "Description", type: "textarea" },
        { id: "host", label: "Host", required: true },
        { id: "port", label: "Port", placeholder: "5432" },
        { id: "database", label: "Database", required: true },
        { id: "user", label: "Username", required: true },
        { id: "password", label: "Password", type: "password" },
      ],
    },
    {
      id: "hyde",
      name: "HyDE Retriever",
      desc: "Hypothetical Document Embeddings retriever. Generates a hypothetical answer via LLM, embeds it, then retrieves nearest documents.",
      icon: "lightbulb",
      tone: "warn",
      fields: [
        { id: "name", label: "Resource name", required: true },
        { id: "description", label: "Description", type: "textarea" },
        { id: "baseRetriever", label: "Base retriever", type: "select", required: true, options: ["Azure AI Search Connector", "Qdrant Retriever Connector"] },
        { id: "model", label: "Hypothesis model", type: "select", options: ["Claude Haiku 4.5", "Claude Sonnet 4.5"] },
      ],
    },
    {
      id: "smart",
      name: "Smart Retriever",
      desc: "Adaptive retriever that classifies query complexity and selects the optimal strategy.",
      icon: "auto_awesome",
      tone: "success",
      fields: [
        { id: "name", label: "Resource name", required: true },
        { id: "description", label: "Description", type: "textarea" },
      ],
    },
  ],
  tool: [
    {
      id: "mcp",
      name: "MCP Tool",
      desc: "Calls tools exposed by an MCP server and returns the results.",
      icon: "extension",
      tone: "success",
      fields: [
        { id: "name", label: "Resource name", required: true },
        { id: "description", label: "Description", type: "textarea" },
        { id: "url", label: "MCP server URL", required: true, placeholder: "https://mcp.example.com" },
        { id: "apiKey", label: "API key", type: "password" },
      ],
    },
    {
      id: "websearch",
      name: "Web Search",
      desc: "Web search via approved provider with allow-list controls.",
      icon: "language",
      tone: "info",
      fields: [
        { id: "name", label: "Resource name", required: true },
        { id: "description", label: "Description", type: "textarea" },
        { id: "provider", label: "Provider", type: "select", options: ["Brave", "Bing", "Google PSE"] },
        { id: "apiKey", label: "API key", type: "password" },
      ],
    },
    {
      id: "sql",
      name: "SQL Query Tool",
      desc: "Run parameterized SQL queries against a registered database.",
      icon: "data_object",
      tone: "info",
      fields: [
        { id: "name", label: "Resource name", required: true },
        { id: "description", label: "Description", type: "textarea" },
        { id: "database", label: "Bound database", type: "select", required: true, options: ["Finance Ledger", "Vendor Contracts"] },
      ],
    },
    {
      id: "http",
      name: "HTTP Fetch",
      desc: "Fetch an HTTP URL and return the response body.",
      icon: "public",
      tone: "warn",
      fields: [
        { id: "name", label: "Resource name", required: true },
        { id: "description", label: "Description", type: "textarea" },
        { id: "allowList", label: "Domain allow-list", type: "textarea", placeholder: "one domain per line", required: true },
      ],
    },
  ],
  model: [
    {
      id: "claude",
      name: "Anthropic Claude",
      desc: "Claude family models via Anthropic API.",
      icon: "psychology",
      tone: "warn",
      fields: [
        { id: "name", label: "Resource name", required: true, placeholder: "Claude Sonnet 4.5" },
        { id: "description", label: "Description", type: "textarea" },
        { id: "model", label: "Model", type: "select", required: true, options: ["claude-sonnet-4-5", "claude-haiku-4-5", "claude-opus-4"] },
        { id: "apiKey", label: "API key", type: "password", required: true },
      ],
    },
    {
      id: "azure_openai",
      name: "Azure OpenAI",
      desc: "OpenAI models via Azure deployment.",
      icon: "cloud",
      tone: "info",
      fields: [
        { id: "name", label: "Resource name", required: true },
        { id: "description", label: "Description", type: "textarea" },
        { id: "endpoint", label: "Endpoint", required: true },
        { id: "deployment", label: "Deployment name", required: true },
        { id: "apiKey", label: "API key", type: "password", required: true },
      ],
    },
    {
      id: "vllm",
      name: "vLLM (self-hosted)",
      desc: "OpenAI-compatible endpoint served by vLLM.",
      icon: "memory",
      tone: "success",
      fields: [
        { id: "name", label: "Resource name", required: true },
        { id: "description", label: "Description", type: "textarea" },
        { id: "endpoint", label: "Endpoint", required: true, placeholder: "http://vllm.internal:8000/v1" },
        { id: "model", label: "Model id", required: true, placeholder: "meta-llama/Llama-3.1-8B-Instruct" },
      ],
    },
  ],
};

// ---------------- Step 1: pick type ----------------

const RRTypeStep = ({ selected, onSelect }) => (
  <>
    <p className="rr-helper">
      Register an org-level passive resource. Once registered, it is available org-wide
      to any workflow — no workspace binding required.
    </p>
    <div className="rr-type-grid">
      {RR_TYPES.map(t => (
        <button
          key={t.key}
          className={`rr-type-card${selected === t.key ? " selected" : ""}`}
          onClick={() => onSelect(t.key)}
        >
          <div className="rr-type-head">
            <Icon name={t.icon} size={20} />
            <span>{t.label}</span>
          </div>
          <div className="rr-type-desc">{t.desc}</div>
        </button>
      ))}
    </div>
  </>
);

// ---------------- Step 2: pick connector ----------------

const RRConnectorStep = ({ type, selected, onSelect, query, onQuery }) => {
  const list = RR_CATALOG[type] || [];
  const q = query.trim().toLowerCase();
  const filtered = q
    ? list.filter(c => c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q))
    : list;

  return (
    <>
      <div className="rr-connector-search">
        <label className="search-field" style={{ width: "100%" }}>
          <input
            placeholder="Search connectors..."
            value={query}
            onChange={(e) => onQuery(e.target.value)}
          />
          <Icon name="search" size={18} />
        </label>
      </div>
      <div className="rr-connector-grid">
        {filtered.map(c => (
          <button
            key={c.id}
            className={`rr-connector-card${selected === c.id ? " selected" : ""}`}
            onClick={() => onSelect(c.id)}
          >
            <div className="rr-connector-head">
              <span className={`rr-connector-icon tone-${c.tone}`}>
                <Icon name={c.icon} size={20} />
              </span>
              <span className="rr-connector-name">{c.name}</span>
            </div>
            <div className="rr-connector-desc">{c.desc}</div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="rr-empty">No connectors match "{query}".</div>
        )}
      </div>
    </>
  );
};

// ---------------- Step 3: configure ----------------

const RRField = ({ field, value, onChange, error }) => {
  const showError = error && !value;
  const inputCls = `rr-input${showError ? " err" : ""}`;
  let control;
  if (field.type === "textarea") {
    control = (
      <textarea
        className={inputCls}
        rows={3}
        placeholder={field.placeholder}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  } else if (field.type === "select") {
    control = (
      <div className="rr-select-wrap">
        <select
          className={inputCls}
          value={value || (field.options && field.options[0]) || ""}
          onChange={(e) => onChange(e.target.value)}
        >
          {(field.options || []).map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <Icon name="expand_more" size={18} />
      </div>
    );
  } else if (field.type === "password") {
    control = (
      <div className="rr-input-with-icon">
        <Icon name="lock" size={16} />
        <input
          className={inputCls}
          type="password"
          placeholder={field.placeholder}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  } else {
    control = (
      <input
        className={inputCls}
        type="text"
        placeholder={field.placeholder}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  return (
    <div className="rr-field">
      <label className="rr-label">
        {field.label}
        {field.required && <span className="rr-req">*</span>}
      </label>
      {control}
      {showError
        ? <div className="rr-err-msg">{field.label} is required</div>
        : (field.help && <div className="rr-help">{field.help}</div>)}
    </div>
  );
};

const RRConfigureStep = ({ connector, values, onChange, errors }) => (
  <>
    <p className="rr-helper">{connector.desc}</p>
    <div className="rr-form">
      {connector.fields.map(f => (
        <RRField
          key={f.id}
          field={f}
          value={values[f.id]}
          onChange={(v) => onChange(f.id, v)}
          error={errors[f.id]}
        />
      ))}
    </div>
  </>
);

// ---------------- Step 4: success ----------------

const RRSuccessStep = ({ name, type, onClose }) => (
  <div className="rr-success">
    <div className="rr-success-icon">
      <Icon name="check_circle" size={32} />
    </div>
    <div className="rr-success-title">Resource registered</div>
    <div className="rr-success-name">{name}</div>
    <p className="rr-success-body">
      <span className="rr-success-strong">{name}</span> is now in the org-level resource pool
      and immediately available as a node in Studio for any workflow.
    </p>
    <div className="rr-success-actions">
      <Button variant="primary" size="sm" onClick={onClose}>Done</Button>
    </div>
  </div>
);

// ---------------- Modal shell ----------------

const RegisterResourceModal = ({ open, onClose, onComplete }) => {
  const [step, setStep] = React.useState(1);
  const [type, setType] = React.useState(null);
  const [connectorId, setConnectorId] = React.useState(null);
  const [pickerQuery, setPickerQuery] = React.useState("");
  const [values, setValues] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const [submitted, setSubmitted] = React.useState(null);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  React.useEffect(() => {
    if (open) {
      setStep(1); setType(null); setConnectorId(null);
      setPickerQuery(""); setValues({}); setErrors({}); setSubmitted(null);
    }
  }, [open]);

  if (!open) return null;

  const connector = type && connectorId
    ? (RR_CATALOG[type] || []).find(c => c.id === connectorId)
    : null;

  const stepLabels = ["Type", "Connector", "Configure"];

  const onChangeField = (id, v) => {
    setValues(s => ({ ...s, [id]: v }));
    if (errors[id]) setErrors(e => ({ ...e, [id]: false }));
  };

  const goNext = () => {
    if (step === 1 && type) setStep(2);
    else if (step === 2 && connectorId) setStep(3);
    else if (step === 3) {
      // validate required fields
      const errs = {};
      connector.fields.forEach(f => {
        if (f.required && !values[f.id]) errs[f.id] = true;
      });
      setErrors(errs);
      if (Object.keys(errs).length === 0) {
        const name = values.name || connector.name;
        setSubmitted({ name, typeKey: type });
        setStep(4);
        onComplete && onComplete({ name, type: RR_TYPES.find(t => t.key === type).label, connector: connector.name });
      }
    }
  };

  const goBack = () => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  };

  const canAdvance =
    (step === 1 && !!type) ||
    (step === 2 && !!connectorId) ||
    (step === 3);

  const titleByStep = {
    1: "Register a resource",
    2: `Choose a ${type ? RR_TYPES.find(t => t.key === type).label.toLowerCase() : "connector"}`,
    3: connector ? `Configure ${connector.name}` : "Configure",
    4: "All set",
  };

  return (
    <div className="rr-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="rr-modal" role="dialog" aria-modal="true">
        <div className="rr-modal-head">
          <div className="rr-modal-title-row">
            <h2 className="rr-modal-title">{titleByStep[step]}</h2>
            <button className="rr-close" onClick={onClose} aria-label="Close">
              <Icon name="close" size={20} />
            </button>
          </div>
          {step <= 3 && (
            <ol className="rr-stepper">
              {stepLabels.map((lbl, i) => {
                const n = i + 1;
                const state = n < step ? "done" : n === step ? "current" : "todo";
                return (
                  <li key={lbl} className={`rr-step ${state}`}>
                    <span className="rr-step-num">
                      {state === "done" ? <Icon name="check" size={14} /> : n}
                    </span>
                    <span className="rr-step-lbl">{lbl}</span>
                    {n < stepLabels.length && <span className="rr-step-bar" />}
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        <div className="rr-modal-body">
          {step === 1 && <RRTypeStep selected={type} onSelect={setType} />}
          {step === 2 && (
            <RRConnectorStep
              type={type}
              selected={connectorId}
              onSelect={setConnectorId}
              query={pickerQuery}
              onQuery={setPickerQuery}
            />
          )}
          {step === 3 && connector && (
            <RRConfigureStep
              connector={connector}
              values={values}
              onChange={onChangeField}
              errors={errors}
            />
          )}
          {step === 4 && submitted && (
            <RRSuccessStep
              name={submitted.name}
              type={submitted.typeKey}
              onClose={onClose}
            />
          )}
        </div>

        {step <= 3 && (
          <div className="rr-modal-foot">
            {step > 1 ? (
              <Button variant="secondary" size="sm" onClick={goBack}>Back</Button>
            ) : (
              <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
            )}
            <div className="rr-foot-spacer" />
            <button
              className={`btn btn-primary btn-sm${canAdvance ? "" : " is-disabled"}`}
              onClick={canAdvance ? goNext : undefined}
              disabled={!canAdvance}
            >
              {step === 3 ? "Save configuration" : "Next"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { RegisterResourceModal });
