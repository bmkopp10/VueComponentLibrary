<template>
    <div
        v-click-outside="handleClickOutside"
        :class="menuClass"
    >
        <div
            :class="['dropdown-toggle', {'hide-caret': noCaret}]"
            @click="state.show = !state.show"
            @mouseover="handleMouseOver"
        >
            <slot name="button-content">
                <b-button v-if="isButton">
                    {{ title }} <faicon :icon="dropUp ? 'chevron-up' : 'chevron-down'" />
                </b-button>
                <span v-else>{{ title }}</span>
            </slot>
        </div>
        <ul
            v-if="state.show"
            class="dropdown-menu"
            :style="menuStyle"
            @click="handleClick"
        >
            <slot />
        </ul>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from 'vue';
import useScreenSize from "@/composables/useScreenSize";

type MenuStyle = {
    bottom?: number | string;
    right?: number | string;
    left?: number | string;
}

export default defineComponent({
    name: 'b-dropdown',
    props: {
        title: { type: String, default: undefined },
        right: { type: Boolean, default: true },
        left: Boolean,
        closeOnClick: Boolean,
        noCaret: { type: Boolean, default: false },
        dropUp: { type: Boolean, default: false },
        openOnHover: { type: Boolean, default: false },
        isButton: { type: Boolean, default: false },
    },
    setup(props) {
        const { isMobile } = useScreenSize();

        const state = reactive({
            show: false,
        });

        const menuClass = props.dropUp ? 'dropup' : 'dropdown';

        const menuStyle = computed((): MenuStyle => {
            if (props.dropUp) {
                if (props.left) {
                    return {
                        bottom: '2.4rem',
                        right: 0,
                        left: 'auto',
                    };
                }
                return {
                    bottom: '2.4rem',
                    right: 'auto',
                    left: 0,
                };
            }
            if (props.left) {
                return {
                    right: 0,
                    left: 'auto',
                };
            }
            return {
                right: 'auto',
                left: 0,
            };
        });

        function handleClickOutside() {
            if (state.show) {
                state.show = false;
            }
        }

        function handleClick() {
            if (props.closeOnClick) {
                state.show = false;
            }
        }

        function handleMouseOver() {
            if (props.openOnHover && !isMobile.value) {
                state.show = true;
            }
        }

        return {
            state,
            menuClass,
            menuStyle,
            handleClickOutside,
            handleClick,
            handleMouseOver,
        };
    },
});
</script>

<style scoped lang="scss">
.dropdown-toggle {
    cursor: pointer;
    width: fit-content;
}

.dropdown-menu {
    display: block;
    position: absolute;
    overflow: hidden;
}

.hide-caret:after {
    display: none;
}
</style>
