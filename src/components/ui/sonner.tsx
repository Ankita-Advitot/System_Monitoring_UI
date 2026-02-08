import { useTheme } from "next-themes";
import { Toaster as Sonner, toast as sonnerToast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          // Custom styles for warning and error to ensure Yellow and Red
          error: "group-[.toaster]:bg-red-500 group-[.toaster]:text-white group-[.toaster]:border-red-600",
          warning: "group-[.toaster]:bg-yellow-500 group-[.toaster]:text-black group-[.toaster]:border-yellow-600",
        },
      }}
      {...props}
    />
  );
};

// Priority logic: Critical > Warning
let isCriticalActive = false;

const toast = {
  ...sonnerToast,
  error: (message: string | React.ReactNode, data?: any) => {
    isCriticalActive = true;
    const id = sonnerToast.error(message, {
      ...data,
      onAutoClose: () => {
        isCriticalActive = false;
        data?.onAutoClose?.();
      },
      onDismiss: () => {
        isCriticalActive = false;
        data?.onDismiss?.();
      },
    });
    return id;
  },
  warning: (message: string | React.ReactNode, data?: any) => {
    // If a critical alert is currently active, do not show the warning
    if (isCriticalActive) {
      console.log("Suppressing warning toast because a critical toast is active.");
      return null;
    }
    return sonnerToast.warning(message, data);
  },
  // Allow other types to pass through
  success: (message: string | React.ReactNode, data?: any) => sonnerToast.success(message, data),
  info: (message: string | React.ReactNode, data?: any) => sonnerToast.info(message, data),
};

export { Toaster, toast };
