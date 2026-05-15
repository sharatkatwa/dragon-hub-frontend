import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";
import { useSyncExternalStore } from "react";
import { toast, toastStore } from "./toast";

const toastStyles = {
  success: {
    icon: CheckCircle2,
    title: "Success",
    accent: "text-signal-green",
    glow: "bg-signal-green/12",
  },
  error: {
    icon: AlertCircle,
    title: "Error",
    accent: "text-signal-red",
    glow: "bg-signal-red/12",
  },
  warning: {
    icon: AlertTriangle,
    title: "Warning",
    accent: "text-signal-amber",
    glow: "bg-signal-amber/14",
  },
  info: {
    icon: Info,
    title: "Info",
    accent: "text-signal-blue",
    glow: "bg-signal-blue/12",
  },
};

const ToastItem = ({ item }) => {
  const style = toastStyles[item.type] || toastStyles.info;
  const Icon = style.icon;

  return (
    <div
      className="glass-panel interactive-surface pointer-events-auto grid w-full grid-cols-[auto_1fr_auto] gap-3 rounded-xl p-4"
      role={item.type === "error" ? "alert" : "status"}
    >
      <span
        className={[
          "mt-0.5 grid size-9 place-items-center rounded-lg",
          style.accent,
          style.glow,
        ].join(" ")}
      >
        <Icon aria-hidden="true" size={19} strokeWidth={2.2} />
      </span>

      <div className="min-w-0">
        <p className="text-sm font-bold text-[var(--text-primary)]">
          {item.title || style.title}
        </p>
        <p className="mt-1 text-sm leading-5 text-[var(--text-secondary)]">
          {item.message}
        </p>
      </div>

      <button
        aria-label="Dismiss notification"
        className="grid size-8 place-items-center rounded-md text-[var(--text-muted)] transition hover:bg-white/55 hover:text-[var(--text-primary)]"
        onClick={() => toast.dismiss(item.id)}
        type="button"
      >
        <X aria-hidden="true" size={17} strokeWidth={2.2} />
      </button>
    </div>
  );
};

const Toaster = () => {
  const toasts = useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot,
    toastStore.getSnapshot
  );

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[220] flex w-[min(420px,calc(100vw-2rem))] flex-col gap-3">
      {toasts.map((item) => (
        <ToastItem item={item} key={item.id} />
      ))}
    </div>
  );
};

export default Toaster;
