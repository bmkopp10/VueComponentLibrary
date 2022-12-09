<template>
    <div
        :id="uid"
        class="popover-container"
        @mouseenter="mouseenter"
        @mouseleave="mouseleave"
    >
        <slot />
        <div
            v-if="state.showContent"
            :class="['popover-content-container', {'ready': state.isReady}]"
            :style="{
                left: state.position.x+'px',
                top: state.position.y+'px',
                transform: `translate(${state.position.translateX}px, ${state.position.translateY}px)`,
            }"
        >
            <div
                ref="popoverContainer"
                class="popover-content"
                :style="{maxHeight: `${state.maxHeight}px`}"
                @click="preventParentClick"
            >
                <slot name="content">
                    <span>{{ message }}</span>
                </slot>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {
    defineComponent, nextTick, PropType, reactive, watch,
} from 'vue';
import {useDimensionCalculator} from "@/composables/useDimensionCalculator";

/*
    TODO:
        - click trigger not implemented, maybe we dont even want it?
        - there is a bug with smaller screens, i think its a problem with calculating if its too tall / wide
 */

type PopoverTrigger = 'hover' | 'click';

type Position = {
    x: number;
    y: number;
    translateX: number;
    translateY: number;
}

type MousePosition = {
    x: number;
    y: number;
}

type Bounds = {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

type State = {
    triggered: boolean;
    bounds: Bounds;
    position: Position;
    mousePosition: MousePosition;
    isFlippedHorizontally: boolean;
    isFlippedVertically: boolean;
    showContent: boolean;
    interval: any;
    isReady: boolean;
    maxHeight: number;
}

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
    name: 'popover',
    props: {
        message: String,
        hoverDelay: { type: Number, default: () => 750 },
        useMousePosition: { type: Boolean, default: () => false },
        trigger: {
            type: String as PropType<PopoverTrigger>,
            default: () => 'hover',
        },
    },
    setup(props) {
        const state = reactive<State>({
            triggered: false,
            showContent: false,
            interval: null,
            isReady: false,
            maxHeight: 10000,
            isFlippedHorizontally: false,
            isFlippedVertically: false,
            mousePosition: {
                x: 0,
                y: 0,
            },
            position: {
                x: 0,
                y: 0,
                translateX: 0,
                translateY: 0,
            },
            bounds: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
            },
        });

        const {
            deviceHeight,
            deviceWidth,
            container: popoverContainer,
            containerWidth,
            containerHeight,
            handleResize,
        } = useDimensionCalculator();

        function stopInterval() {
            clearInterval(state.interval);
        }

        function startInterval() {
            state.interval = setInterval(handleShowContent, props.hoverDelay);
        }

        const uid = uuidv4();

        function uuidv4() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                const r = Math.random() * 16 | 0; const
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        // maybe look into unwatching this on hide?
      // TODO: hook this up
        /* watch(() => router.currentRoute, () => {
            handleHideContent();
        }, { deep: true });

         */

        function getPopoverPosition(): Position {
            const triggerElement = document.getElementById(uid);

            if (triggerElement) {
                const triggerElementBounds = triggerElement.getBoundingClientRect();

                let x;
                let y;

                // save original bounds of the parent/trigger
                state.bounds.top = triggerElementBounds.top;
                state.bounds.bottom = triggerElementBounds.bottom;
                state.bounds.left = triggerElementBounds.left;
                state.bounds.right = triggerElementBounds.right;

                // if theres a problem getting the width or height, set position to mouse position as fail safe
                if (props.useMousePosition || triggerElementBounds.width === 0) {
                    x = state.mousePosition.x;
                } else {
                    x = triggerElementBounds.right;
                }

                // if theres a problem getting the width or height, set position to mouse position as fail safe
                if (props.useMousePosition || triggerElementBounds.height === 0) {
                    y = state.mousePosition.y;
                } else {
                    y = triggerElementBounds.top;
                }

                return {
                    x,
                    y,
                    translateX: 0,
                    translateY: 0,
                };
            }

            throw new Error('Unable to bind hover element');
        }

        function handleShowContent() {
            stopInterval();
            const { x, y } = getPopoverPosition();

            state.position.x = x;
            state.position.y = y;

            state.showContent = true;

            nextTick(() => {
                handleResize().then(() => {
                    if (isPopoverTooWide()) {
                        // flip horizontally
                        state.isFlippedHorizontally = true;
                        state.position.x = state.bounds.left;
                        state.position.translateX = -containerWidth.value;
                    }
                    if (isPopoverTooTall()) {
                        // flip vertically
                        state.isFlippedVertically = true;
                        state.position.translateY = -containerHeight.value;
                    }
                    calcMaxHeight();
                    state.isReady = true;
                });
            });
        }

        function isPopoverTooWide(): boolean {
            return (containerWidth.value + state.position.x + 5) > deviceWidth.value;
        }

        function isPopoverTooTall(): boolean {
            return (containerHeight.value + state.position.y + 5) > deviceHeight.value;
        }

        function calcMaxHeight() {
            // based on the y coordinate, device height and original container height, we calculate to see if
            // the popover will go off screen, if it does => add max-height with scroll
            if (state.isFlippedVertically) {
                state.maxHeight = state.position.y;
            } else {
                state.maxHeight = deviceHeight.value - state.position.y - 30;
            }
        }

        function handleHideContent() {
            resetState();
        }

        function mouseenter(e: MouseEvent) {
            // store mouse position on enter in case we use this as an anchor
            state.mousePosition.x = e.clientX;
            state.mousePosition.y = e.clientY;
            startInterval();
        }

        function mouseleave() {
            stopInterval();
            handleHideContent();
        }

        function resetState() {
            state.mousePosition.x = 0;
            state.mousePosition.y = 0;
            state.isFlippedVertically = false;
            state.isFlippedHorizontally = false;
            state.position.x = 0;
            state.position.y = 0;
            state.position.translateY = 0;
            state.position.translateX = 0;
            state.showContent = false;
            state.isReady = false;
        }

        function preventParentClick(e: PointerEvent) {
            // prevents a parent button being triggered when you click in the popover
            e.stopPropagation();
        }

        return {
            state,
            mouseenter,
            mouseleave,
            uid,
            popoverContainer,
            preventParentClick,
        };
    },
});
</script>

<style scoped lang="scss">
.popover-container {
    position: relative;
    display: flex;
}

.popover-content-container {
    position: fixed;
    padding: 15px;
    z-index: 99999999;
    overflow-y: auto;
    display: flex;
    align-content: flex-end;
    cursor: auto;

    .popover-content {
        background: #353535;
        color: white;
        padding: 10px;
        border-radius: 3px;
        overflow: auto;
        justify-content: flex-end;
    }

}
</style>
