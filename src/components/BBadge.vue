<template>
    <component
        :is="tag"
        class="badge"
        :class="classes"
        @click="handleClick"
    >
        <slot />
    </component>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import type {Variant} from "@/types";

export default defineComponent({
    name: 'b-badge',
    props: {
        textIndicator: { type: Boolean, default: false },
        dotIndicator: { type: Boolean, default: false },
        pill: { type: Boolean, default: false },
        tag: { type: String, default: 'span' },
        variant: { type: String as PropType<Variant>, default: 'secondary' },
    },
    emits: ['onClick'], // must use @click, this is the only way it works with context.attrs
    setup(props, context) {
        const hasClick = computed((): boolean => !!(context.attrs.onClick));

        const classes = computed(() => ({
            [`bg-${props.variant}`]: props.variant,
            'text-dark': ['warning', 'info', 'light'].includes(props.variant),
            'rounded-pill': props.pill,
            'position-absolute top-0 start-100 translate-middle': props.textIndicator || props.dotIndicator,
            'p-2 border border-light rounded-circle': props.dotIndicator,
            clickable: hasClick.value,
        }));

        function handleClick() {
            context.emit('onClick');
        }

        return {
            classes,
            handleClick,
            hasClick,
        };
    },
});
</script>

<style scoped>

.clickable {
    cursor: pointer;
}

</style>
