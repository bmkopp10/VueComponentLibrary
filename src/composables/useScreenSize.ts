import {
    computed, onUnmounted, ref, ComputedRef, Ref,
} from 'vue';

type UseScreenSize = {
    isMobile: ComputedRef<boolean>;
    screenWidth: Ref<number>;
    screenHeight: Ref<number>;
};

export default function useScreenSize(): UseScreenSize {
    const screenWidth = ref<number>(window.innerWidth);
    const screenHeight = ref(window.innerHeight);
    const mobileBreakPoint = 1280;

    function handleResize() {
        screenWidth.value = window.innerWidth;
        screenHeight.value = window.innerHeight;
    }

    window.addEventListener('resize', handleResize);
    document.addEventListener('zoomChange', handleResize);
    handleResize();

    onUnmounted(() => {
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('zoomChange', handleResize);
    });

    const isMobile = computed((): boolean => screenWidth.value <= mobileBreakPoint);

    return {
        isMobile,
        screenWidth,
        screenHeight,
    };
}
