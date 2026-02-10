import { AlertEvent } from '@/features/dashboard/types/dashboardTypes';
import { useSystemStore } from '@/store/systemStore';
import { cn } from '@/lib/utils';
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NotificationItemProps {
    notification: AlertEvent;
}

const getIcon = (severity: string, isResolved?: boolean) => {
    if (isResolved) return <CheckCircle2 className="w-5 h-5 text-success" />;
    switch (severity) {
        case 'critical':
            return <AlertCircle className="w-5 h-5 text-destructive" />;
        case 'warning':
            return <AlertTriangle className="w-5 h-5 text-warning" />;
        default:
            return <Info className="w-5 h-5 text-primary" />;
    }
};

export const NotificationItem = ({ notification }: NotificationItemProps) => {
    const { readAlertIds, markAlertAsRead } = useSystemStore();
    const isRead = readAlertIds.includes(notification.id);


    return (
        <div
            onClick={() => markAlertAsRead(notification.id)}
            className={cn(
                'p-4 border-b last:border-0 cursor-pointer transition-colors hover:bg-muted/50 flex gap-3',
                isRead ? 'bg-background opacity-60' : 'bg-muted/20'
            )}
        >
            <div className="shrink-0 mt-1">
                {getIcon(notification.severity, notification.is_resolved)}
            </div>
            <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start gap-2">
                    <p className={cn(
                        'text-sm font-medium leading-none',
                        !isRead && 'text-foreground',
                        isRead && 'text-muted-foreground'
                    )}>
                        {notification.resource_type.toUpperCase()} {notification.event_type.replace('_', ' ')}
                    </p>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(notification.event_at), { addSuffix: true })}
                    </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                    {notification.reason}
                </p>
            </div>
        </div>
    );
};
