"use client";

export function PrintBar({
  clientPhone,
  number,
  label,
}: {
  clientPhone: string;
  number: string;
  label: string;
}) {
  const wa = clientPhone
    ? `https://wa.me/${clientPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
        `Hello, here is your ${label} (${number}) from Plexus Workshop.`
      )}`
    : "";
  return (
    <div
      className="noprint"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        display: "flex",
        gap: 8,
        justifyContent: "center",
        padding: "10px",
        background: "#0a0a0a",
      }}
    >
      <button
        onClick={() => window.print()}
        style={btn("#f59e0b", "#0a0a0a")}
      >
        Print / Save PDF
      </button>
      {wa && (
        <a href={wa} target="_blank" rel="noopener noreferrer" style={btn("#1f7a3d", "#fff")}>
          WhatsApp client
        </a>
      )}
      <a href="/plexusadmin" style={btn("transparent", "#aaa", "#333")}>
        Done
      </a>
    </div>
  );
}

function btn(bg: string, fg: string, border?: string): React.CSSProperties {
  return {
    background: bg,
    color: fg,
    border: border ? `1px solid ${border}` : "none",
    borderRadius: 10,
    padding: "10px 16px",
    fontSize: 14,
    fontWeight: 600,
    textDecoration: "none",
    cursor: "pointer",
  };
}
