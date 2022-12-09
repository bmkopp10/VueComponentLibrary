<template>
    <form
        @submit.prevent="onSubmit"
        @reset.prevent="onReset"
    >
        <slot />
    </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'b-form',
    emits: ['submit', 'reset'],
    setup(props, context) {
        function onSubmit() {
            context.emit('submit');
        }

        function onReset() {
            context.emit('reset');
        }

        return {
            onSubmit,
            onReset,
        };
    },
});
</script>
