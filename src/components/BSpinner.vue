<template>
    <component
        :is="tag"
        :class="classes"
        :role="label || $slots.label ? role : null"
        :aria-hidden="label || $slots.label ? null : true"
    >
        <span
            v-if="label || $slots.label"
            class="visually-hidden"
        >
            <slot name="label">{{ label }}</slot>
        </span>
    </component>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import {Variant} from "@/types";

export default defineComponent({
    name: 'b-spinner',
    props: {
        label: { type: String },
        role: { type: String, default: 'status' },
        small: { type: Boolean, default: false },
        tag: { type: String, default: 'span' },
        type: { type: String as PropType< 'border' | 'grow'>, default: 'border' },
        variant: { type: String as PropType<Variant> },
    },
    setup(props) {
        const classes = computed(() => ({
            'spinner-border': props.type === 'border',
            'spinner-border-sm': props.type === 'border' && props.small,
            'spinner-grow': props.type === 'grow',
            'spinner-grow-sm': props.type === 'grow' && props.small,
            [`text-${props.variant}`]: !!props.variant,
        }));
        return {
            classes,
        };
    },
});
</script>
