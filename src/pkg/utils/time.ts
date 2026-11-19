type TimeUnit = 'seconds' | 'minutes' | 'hours' | 'days';
type SecondsUnit = 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days';

export function toMs(time: number, unit: TimeUnit): number {
    switch (unit) {
        case 'seconds': return time * 1000;
        case 'minutes': return time * 60 * 1000;
        case 'hours': return time * 60 * 60 * 1000;
        case 'days': return time * 24 * 60 * 60 * 1000;
        default: throw new Error("Invalid time unit");
    }
}

export function toSeconds(time: number, unit: SecondsUnit): number {
    switch (unit) {
        case 'milliseconds': return time / 1000;
        case 'seconds': return time;
        case 'minutes': return time * 60;
        case 'hours': return time * 60 * 60;
        case 'days': return time * 24 * 60 * 60;
        default: throw new Error("Invalid time unit");
    }
}