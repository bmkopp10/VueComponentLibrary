<template>
    <div class="form-check">
        <input
            class="form-check-input"
            type="checkbox"
            :checked="modelValue"
            :value="modelValue"
            :disabled="disabled"
            @change="handleChange"
        >
        <div @click="handleChange">
            <slot>
                <label class="form-check-label">
                    {{ label }}
                </label>
            </slot>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'b-form-checkbox',
    props: {
        modelValue: { type: Boolean, default: false },
        checked: { type: Boolean, default: false },
        label: String,
        disabled: { type: Boolean, default: false },
        inline: { type: Boolean, default: false },
    },
    emits: ['update:modelValue', 'input', 'change'],
    setup(props, context) {
        function handleChange(e: InputEvent) {
            const value = !props.modelValue;
            context.emit('update:modelValue', value);
            context.emit('change', value);
            context.emit('input', value);
        }

        return {
            handleChange,
        };
    },
});
</script>
<style scoped>
.form-check {
    text-align: left;
}
</style>
