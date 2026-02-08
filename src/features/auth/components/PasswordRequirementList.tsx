import { Check, X } from 'lucide-react';
import { PASSWORD_REQUIREMENTS } from '../constants/authConstants';
import { cn } from '@/lib/utils';

interface PasswordRequirementListProps {
    value: string;
}

export const PasswordRequirementList = ({ value }: PasswordRequirementListProps) => {
    return (
        <div className="mt-3 space-y-2 text-xs">
            <p className="text-muted-foreground font-medium mb-1">Password must contain:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                {PASSWORD_REQUIREMENTS.map((req) => {
                    const isMet = req.regex.test(value);
                    return (
                        <div
                            key={req.id}
                            className={cn(
                                'flex items-center gap-1.5 transition-colors',
                                isMet ? 'text-green-500' : 'text-muted-foreground/60'
                            )}
                        >
                            <div className={cn(
                                'flex-shrink-0 w-3.5 h-3.5 rounded-full flex items-center justify-center border',
                                isMet ? 'bg-green-500/10 border-green-500/20' : 'bg-muted border-border'
                            )}>
                                {isMet ? (
                                    <Check className="w-2.5 h-2.5" />
                                ) : (
                                    <div className="w-1 h-1 rounded-full bg-current opacity-40" />
                                )}
                            </div>
                            <span className={cn(isMet && 'font-medium')}>{req.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
