<template>
    <option
        :value="value"
        :disabled="disabled"
    >
        <slot />
    </option>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'b-form-select-option',
    props: {
        // eslint-disable-next-line vue/require-prop-types
        value: { required: true },
        disabled: { type: Boolean, default: false },
    },
});
</script>
