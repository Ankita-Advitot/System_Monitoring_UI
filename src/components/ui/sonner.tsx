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
          // Custom styles for warning, error, and success
          error: "group-[.toaster]:bg-red-600 group-[.toaster]:text-white group-[.toaster]:border-red-700",
          warning: "group-[.toaster]:bg-yellow-400 group-[.toaster]:text-black group-[.toaster]:border-yellow-500",
          success: "group-[.toaster]:bg-green-600 group-[.toaster]:text-white group-[.toaster]:border-green-700",
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
