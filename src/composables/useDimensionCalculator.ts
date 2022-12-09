import {
    ref, onMounted, onUnmounted, onActivated, onDeactivated,
} from 'vue';

export function useDimensionCalculator() {
    const container = ref<HTMLTextAreaElement | null>(null);
    const containerWidth = ref(0);
    const containerHeight = ref(0);
    const deviceHeight = ref(0);
    const deviceWidth = ref(0);
    const containerBounds = ref<DOMRect>(new DOMRect());

    function handleResize(): Promise<boolean> {
        return new Promise((resolve) => {
            if (container.value) {
                containerWidth.value = container.value?.clientWidth;
                containerHeight.value = container.value?.clientHeight;
            }
            if (container.value) containerBounds.value = container.value.getBoundingClientRect();
            deviceHeight.value = window.innerHeight;
            deviceWidth.value = window.innerWidth;
            resolve(true);
        });
    }

    onMounted(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
    });

    onActivated(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
    });

    onUnmounted(() => {
        window.removeEventListener('resize', handleResize);
    });

    onDeactivated(() => {
        window.removeEventListener('resize', handleResize);
    });

    return {
        container, containerHeight, containerWidth, deviceHeight, deviceWidth, containerBounds, handleResize,
    };
}
