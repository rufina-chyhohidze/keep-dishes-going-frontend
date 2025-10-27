export function getTimeRemaining(createdAt: string) {
    const FIVE_MINUTES = 2 * 60 * 1000;
    const orderTime = new Date(createdAt).getTime();
    const now = Date.now();
    const remaining = FIVE_MINUTES - (now - orderTime);
    return remaining > 0 ? remaining : 0;
}

export function formatTime(ms: number) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
}
