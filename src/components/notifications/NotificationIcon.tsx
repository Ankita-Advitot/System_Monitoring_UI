import { Bell } from 'lucide-react';
import { useSystemStore } from '@/store/systemStore';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { NotificationList } from './NotificationList';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export const NotificationIcon = () => {
    const { alerts, readAlertIds } = useSystemStore();
    const unreadCount = alerts.filter(alert => !readAlertIds.has(alert.id)).length;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-primary/5 transition-colors">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2.5 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive border-2 border-background"></span>
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-85 p-0 mr-4" align="end">
                <NotificationList />
            </PopoverContent>
        </Popover>
    );
};
