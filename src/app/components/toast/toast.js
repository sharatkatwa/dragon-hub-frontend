const listeners = new Set();
let toasts = [];

const DEFAULT_DURATION = 4200;

const emit = () => {
  listeners.forEach((listener) => listener(toasts));
};

const remove = (id) => {
  toasts = toasts.filter((toast) => toast.id !== id);
  emit();
};

const createToast = (type, message, options = {}) => {
  const id = crypto.randomUUID();
  const toast = {
    id,
    type,
    message,
    title: options.title,
    duration: options.duration ?? DEFAULT_DURATION,
  };

  toasts = [toast, ...toasts].slice(0, 4);
  emit();

  if (toast.duration > 0) {
    window.setTimeout(() => remove(id), toast.duration);
  }

  return id;
};

export const toast = {
  success: (message, options) => createToast("success", message, options),
  error: (message, options) => createToast("error", message, options),
  warning: (message, options) => createToast("warning", message, options),
  info: (message, options) => createToast("info", message, options),
  dismiss: remove,
  clear: () => {
    toasts = [];
    emit();
  },
};

export const toastStore = {
  getSnapshot: () => toasts,
  subscribe: (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
