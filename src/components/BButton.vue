<template>
    <button
        :class="classArray"
        :style="linkStyle"
        :type="!disabled ? type : 'button'"
        @click="handleClick"
        @mousedown="onMouseDown($event)"
        @mouseup="onMouseUp($event)"
    >
        <slot />
        <div
            v-if="disabled && disabledMessage"
            v-popover.hover="disabledMessage"
            class="btn-popover"
        />
    </button>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import {Variant} from "@/types";

type LinkStyle = {
    color?: string;
}

export default defineComponent({
    name: 'b-button',
    props: {
        variant: {
            type: String as PropType<Variant>,
            default: () => 'secondary',
        },
        link: {
            type: [Boolean, String],
            default: () => false,
        },
        type: {
            type: String as PropType<'submit' | 'reset' | 'button'>,
            default: 'button',
        },
        size: { type: String as PropType<'sm' | 'lg'> },
        disabled: {
            type: Boolean,
            default: () => false,
        },
        disabledMessage: String,
    },
    emits: ['click', 'mousedown', 'mouseup'],
    setup(props, context) {
        function isLinkWithoutCustomColor(): boolean {
            return !!props.link && typeof props.link !== 'string';
        }

        function getVariantClass(): string {
            switch (props.variant) {
            case 'primary':
                return 'btn-primary';
            case 'secondary':
                return 'btn-secondary';
            case 'tertiary':
                return 'btn-tertiary';
            case 'success':
                return 'btn-success';
            case 'danger':
                return 'btn-danger';
            case 'warning':
                return 'btn-warning';
            case 'info':
                return 'btn-info';
            case 'light':
                return 'btn-light';
            case 'dark':
                return 'btn-dark';
            default:
                // eslint-disable-next-line no-console
                console.warn(`Bad variant of ${props.variant} in button`);
                return 'btn-primary';
            }
        }

        function getLinkClass(): string {
            switch (props.variant) {
            case 'primary':
                return 'btn-link btn-primary-link';
            case 'secondary':
                return 'btn-link btn-secondary-link';
            case 'tertiary':
                return 'btn-link btn-tertiary-link';
            case 'success':
                return 'btn-link btn-success-link';
            case 'danger':
                return 'btn-link btn-danger-link';
            case 'warning':
                return 'btn-link btn-warning-link';
            case 'info':
                return 'btn-link btn-info-link';
            case 'light':
                return 'btn-link btn-light-link';
            case 'dark':
                return 'btn-link btn-dark-link';
            default:
                // eslint-disable-next-line no-console
                console.warn(`Bad variant of ${props.variant} in button`);
                return 'btn-link btn-primary';
            }
        }

        function getSizeClass(): string {
            if (props.size) {
                if (props.size === 'sm' || props.size === 'lg') return `btn-${props.size}`;
                // eslint-disable-next-line no-console
                console.warn(`Bad size prop of ${props.size} in button`);
            }
            return '';
        }

        function isLinkWithCustomColor(): boolean {
            return typeof props.link === 'string';
        }

        const classArray = computed((): Array<string> => {
            const arr = ['btn'];
            if (props.disabled) arr.push('btn-disabled');
            if (!props.link) arr.push(getVariantClass());
            if (isLinkWithoutCustomColor()) arr.push(getLinkClass());
            if (isLinkWithCustomColor()) {
                arr.push('btn-link-custom');
            }
            arr.push(getSizeClass());
            return arr;
        });

        const linkStyle = computed((): LinkStyle => {
            if (typeof props.link === 'string') {
                return {
                    color: props.link,
                };
            }
            return {};
        });

        function handleClick() {
            if (!props.disabled) context.emit('click');
        }

        function onMouseDown(event: MouseEvent) {
            if (!props.disabled) context.emit('mousedown', event);
        }

        function onMouseUp(event: MouseEvent) {
            if (!props.disabled) context.emit('mouseup', event);
        }

        return {
            handleClick,
            classArray,
            linkStyle,
            onMouseDown,
            onMouseUp,
        };
    },
});
</script>

<style scoped lang="scss">
.btn-popover {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
}

.btn-link-custom, .btn-link {
    text-decoration: none;
}

.btn-check:focus + .btn-link-custom, .btn-link-custom:focus, .btn-link-custom:focus {
    box-shadow: none !important;
}

.btn-link-custom:hover, .btn-link:hover {
    filter: brightness(.85) !important;
}
</style>
