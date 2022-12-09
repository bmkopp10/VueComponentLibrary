<template>
    <b-col
        id="date-input"
        :cols="cols"
        :lg="lg"
        :md="md"
        :sm="sm"
        :xs="xs"
    >
        <label v-if="label">
            {{ label }}
        </label>
        <!-- todo get brians opinion on icon -->
        <!-- <b-icon icon="calendar"/> -->
        <div class="datepicker">
            <datepicker
                v-model="picked"
                :class="['form-control', {'readonly': readonly}, $style.datepicker]"
                :input-format="inputFormat"
                :lower-limit="lowerLimit"
                :upper-limit="upperLimit"
                :disabled="isDisabled"
                @input="onInput($event)"
            />
        </div>
    </b-col>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import Datepicker from 'vue3-datepicker';

export default defineComponent({
    name: 'b-form-datepicker',
    components: { Datepicker },
    props: {
        cols: String,
        lg: String,
        md: String,
        sm: String,
        xs: String,
        label: String,
        disabled: Boolean,
        moreInfo: String,
        upperLimit: Date,
        lowerLimit: Date,
        readonly: { type: Boolean, default: () => false },
        inputFormat: { type: String, default: 'MM-dd-yyyy' },
    },
    emits: ['update:modelValue', 'input'],
    setup(props, context) {
        const picked = ref(new Date());

        function onInput(evt: any) {
            const { value } = evt.target;
            context.emit('update:modelValue', value);
            context.emit('input', value);
        }

        const isDisabled = computed(() => props.readonly || props.disabled);

        return {
            picked,
            onInput,
            isDisabled,
        };
    },
});
</script>

<style lang="scss" scoped>
.datepicker {
    padding-left: 10px;
    background-color: #fff !important;
}

label {
    display: flex;
    margin-left: 5px;
}
.readonly {
    background: transparent!important;
    border-top: none;
    border-left: none;
    border-right: none;
    border-radius: 0!important;
    padding-left: 5px;
    padding-bottom: 0px;
    padding-top: 10px;
}
</style>
