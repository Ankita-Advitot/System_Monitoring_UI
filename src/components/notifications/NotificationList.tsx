import { useSystemStore } from '@/store/systemStore';
import { NotificationItem } from './NotificationItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { CheckCheck } from 'lucide-react';

export const NotificationList = () => {
    const { alerts, markAllAlertsAsRead, readAlertIds } = useSystemStore();
    const unreadCount = alerts.filter(a => !readAlertIds.includes(a.id)).length;


    return (
        <div className="flex flex-col w-80 max-h-[500px] overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between shrink-0 bg-background/95 backdrop-blur">
                <h3 className="font-semibold text-sm">Notifications</h3>
                {unreadCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs gap-1.5"
                        onClick={() => markAllAlertsAsRead()}
                    >
                        <CheckCheck className="w-3.5 h-3.5" />
                        Mark all as read
                    </Button>
                )}
            </div>
            <ScrollArea className="flex-1 min-h-0">
                <div className="max-h-[350px]">
                    {alerts.length > 0 ? (
                        <div className="flex flex-col divide-y divide-border/50">
                            {alerts.map((alert) => (
                                <NotificationItem key={alert.id} notification={alert} />
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <p className="text-sm text-muted-foreground">No notifications yet</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
            <div className="p-2 border-t text-center shrink-0 bg-muted/5">
                <p className="text-[10px] text-muted-foreground">
                    Showing last {alerts.length} alerts
                </p>
            </div>
        </div>
    );
};
