<template>
    <div :class="classArray">
        <slot />
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
    name: 'BCol',
    props: {
        cols: {
            type: String,
            default: null,
        },
        colsOffset: {
            type: String,
            default: null,
        },
        sm: {
            type: String,
            default: null,
        },
        md: {
            type: String,
            default: null,
        },
        lg: {
            type: String,
            default: null,
        },
        xl: {
            type: String,
            default: null,
        },
    },
    setup(props) {
        const classArray = computed(() => {
            const arr = ['col'];
            if (props.cols) arr.push(`col-${props.cols}`);
            if (props.colsOffset) arr.push(`offset-${props.colsOffset}`);
            if (props.sm) arr.push(`col-sm-${props.sm}`);
            if (props.md) arr.push(`col-md-${props.md}`);
            if (props.lg) arr.push(`col-lg-${props.lg}`);
            if (props.xl) arr.push(`col-xl-${props.xl}`);
            return arr;
        });

        return {
            classArray,
        };
    },
});
</script>

<style scoped lang="scss">

</style>
