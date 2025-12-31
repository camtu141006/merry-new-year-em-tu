import clsx from 'clsx';
import useStore from '../../store/useStore';

// --- HAND CURSOR COMPONENT ---
const HandCursor = () => {
    const { handCursor, handState, isHandTrackingEnabled } = useStore();
    if (!isHandTrackingEnabled) return null;
    
    // Màu sắc và icon theo gesture
    const cursorConfig = {
        'pointing': { 
            bg: 'bg-transparent', 
            border: 'border-yellow-400', 
            shadow: 'shadow-[0_0_15px_#EAB308]',
            scale: 'scale-100',
            icon: '👆',
            pingColor: 'bg-yellow-400/30'
        },
        'victory': { 
            bg: 'bg-blue-500', 
            border: 'border-blue-400', 
            shadow: 'shadow-[0_0_15px_#3B82F6]',
            scale: 'scale-90',
            icon: '✌️',
            pingColor: 'bg-blue-400/30'
        },
        'three_fingers': { 
            bg: 'bg-green-500', 
            border: 'border-green-400', 
            shadow: 'shadow-[0_0_15px_#10B981]',
            scale: 'scale-125',
            icon: '🖖',
            pingColor: 'bg-green-400/30'
        },
        'open_palm': { 
            bg: 'bg-orange-500', 
            border: 'border-orange-400', 
            shadow: 'shadow-[0_0_15px_#F97316]',
            scale: 'scale-140',
            icon: '🖐️',
            pingColor: 'bg-orange-400/30'
        },
        'closed_fist': { 
            bg: 'bg-purple-500', 
            border: 'border-purple-400', 
            shadow: 'shadow-[0_0_15px_#A855F7]',
            scale: 'scale-90',
            icon: '✊',
            pingColor: 'bg-purple-400/30'
        },
        'idle': { 
            bg: 'bg-transparent', 
            border: 'border-gold-400', 
            shadow: 'shadow-[0_0_10px_#FACC15]',
            scale: 'scale-100',
            icon: null,
            pingColor: 'bg-gold-400/20'
        }
    };

    const currentConfig = cursorConfig[handState] || cursorConfig.idle;
    
    return (
        <div 
            className={clsx(
                "fixed w-8 h-8 rounded-full border-2 z-50 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ease-out flex items-center justify-center",
                currentConfig.border,
                currentConfig.bg,
                currentConfig.shadow,
                currentConfig.scale
            )}
            style={{ 
                left: `${handCursor.x * 100}%`, 
                top: `${handCursor.y * 100}%` 
            }}
        >
            {/* Ping effect */}
            <div className={clsx(
                "absolute inset-0 rounded-full animate-ping",
                currentConfig.pingColor
            )} />
            
            {/* Icon hiển thị */}
            {currentConfig.icon && (
                <div className="relative z-10 text-lg leading-none">
                    {currentConfig.icon}
                </div>
            )}
        </div>
    );
};

export default HandCursor;

