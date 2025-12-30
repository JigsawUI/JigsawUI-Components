import React from "react";
import { useToast } from "./use-toast";
import { Portal } from "../../primitives";

const TOAST_STYLES = {
  success: { border: "#10b981", bg: "#f0fdf4", color: "#166534" },
  error: { border: "#ef4444", bg: "#fef2f2", color: "#991b1b" },
  info: { border: "#3b82f6", bg: "#eff6ff", color: "#1e40af" },
};

const ToastIcon = ({ type }: { type: string }) => {
  const size = 20;
  if (type === "success") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    );
  }
  if (type === "error") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
};

export const ToastViewport = () => {
  const { toasts } = useToast();

  return (
    <Portal>
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          padding: "16px",
          gap: "12px",
          zIndex: 9999,
          pointerEvents: "none",
        }}
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} {...toast} />
        ))}
      </div>
    </Portal>
  );
};

const ToastItem = ({ id, title, description, type = "info" }: any) => {
  const { removeToast } = useToast();
  const styles = TOAST_STYLES[type as keyof typeof TOAST_STYLES];

  return (
    <div
      role="status"
      style={{
        pointerEvents: "auto",
        backgroundColor: styles.bg,
        borderLeft: `4px solid ${styles.border}`,
        borderTop: "1px solid #e5e7eb",
        borderRight: "1px solid #e5e7eb",
        borderBottom: "1px solid #e5e7eb",
        padding: "12px 16px",
        borderRadius: "6px",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        minWidth: "320px",
        display: "flex",
        gap: "12px",
        alignItems: "start",
        color: styles.color,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ marginTop: "2px" }}>
        <ToastIcon type={type} />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: "14px", lineHeight: "20px" }}>
          {title}
        </div>
        {description && (
          <div style={{ fontSize: "12px", opacity: 0.8, marginTop: "2px" }}>
            {description}
          </div>
        )}
      </div>

      <button
        onClick={() => removeToast(id)}
        aria-label="Close"
        style={{
          cursor: "pointer",
          border: "none",
          background: "none",
          color: "inherit",
          opacity: 0.5,
          fontSize: "20px",
          lineHeight: "1",
          padding: "0 4px",
        }}
        onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
        onMouseOut={(e) => (e.currentTarget.style.opacity = "0.5")}
      >
        ×
      </button>
    </div>
  );
};
