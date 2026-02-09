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
          description: "group-[.toast]:text-inherit opacity-90",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          // Transparent vibrant styles for dark theme
          error: "group-[.toaster]:bg-red-500/20 group-[.toaster]:text-red-200 group-[.toaster]:border-red-500/50 group-[.toaster]:backdrop-blur",
          warning: "group-[.toaster]:bg-yellow-500/20 group-[.toaster]:text-yellow-200 group-[.toaster]:border-yellow-500/50 group-[.toaster]:backdrop-blur",
          success: "group-[.toaster]:bg-emerald-500/20 group-[.toaster]:text-emerald-200 group-[.toaster]:border-emerald-500/50 group-[.toaster]:backdrop-blur",
        },
      }}
      {...props}
    />
  );
};

const toast = {
  ...sonnerToast,
  error: (message: string | React.ReactNode, data?: any) => {
    return sonnerToast.error(message, data);
  },
  warning: (message: string | React.ReactNode, data?: any) => {
    return sonnerToast.warning(message, data);
  },
  // Allow other types to pass through
  success: (message: string | React.ReactNode, data?: any) => sonnerToast.success(message, data),
  info: (message: string | React.ReactNode, data?: any) => sonnerToast.info(message, data),
};

export { Toaster, toast };
