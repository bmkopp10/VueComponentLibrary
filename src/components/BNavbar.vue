<template>
    <nav :class="classArray">
        <slot />
    </nav>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import {Variant} from "@/types";

export default defineComponent({
    name: 'b-navbar',
    props: {
        variant: {
            type: String as PropType<Variant>,
            default: 'primary',
        },
    },
    setup(props) {
        const classArray = computed((): Array<string> => {
            const arr = ['navbar'];
            arr.push(getVariantClass());
            return arr;
        });

        function getVariantClass(): string {
            switch (props.variant) {
            case 'primary':
                return 'bg-primary';
            case 'secondary':
                return 'bg-secondary';
            case 'tertiary':
                return 'bg-tertiary';
            case 'success':
                return 'bg-success';
            case 'danger':
                return 'bg-danger';
            case 'warning':
                return 'bg-warning';
            case 'info':
                return 'bg-info';
            case 'light':
                return 'bg-light';
            case 'dark':
                return 'bg-dark';
            default:
                console.warn(`Bad variant of ${props.variant} in button`);
                return 'bg-primary';
            }
        }

        return {
            classArray,
        };
    },
});
</script>

<style scoped>
.navbar {
    padding: 0 1em !important;
    height: 56px !important;
}
</style>
