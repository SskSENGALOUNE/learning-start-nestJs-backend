// src/common/utils/perf-timer.ts
export function startTimer(label: string) {
    const start = performance.now();
    return {
        stop: () => {
            const ms = (performance.now() - start).toFixed(2);
            console.log(`⏱  [${label}] ${ms} ms`);
            return Number(ms);
        },
    };
}
