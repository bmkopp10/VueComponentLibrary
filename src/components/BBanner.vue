<template>
    <div :class="classes">
        <div class="banner-content">
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import {Variant} from "@/types";

export default defineComponent({
    name: 'b-banner',
    props: {
        variant: {
            type: String as PropType<Variant>,
            default: () => 'secondary',
        },
    },
    setup(props) {
        const classes = computed(() => [
            'b-banner',
            `bg-${props.variant}`,
        ]);

        return {
            classes,
        };
    },
});
</script>

<style scoped>
.b-banner {
    height: 48px;
    display: flex;
}
.banner-content {
    margin: auto;
}
</style>
