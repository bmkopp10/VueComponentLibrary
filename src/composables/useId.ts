import { computed, ComputedRef } from 'vue';

function useId(id?: string, suffix?: string): ComputedRef<string> {
    const computedId = computed(() => id || getID(suffix));

    return computedId;
}

function getID (suffix = ''): string {
    return `__BVID__${Math.random().toString().substr(2, 6)}___BV_${suffix}__`;
}


export default useId;
