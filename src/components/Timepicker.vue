<template>
    <b-col
        :cols="cols"
        :lg="lg"
        :md="md"
        :sm="sm"
        :xs="xs"
    >
        <div ref="timepickerRef">
            <b-form-input
                :label="label"
                :error="error"
                :model-value="formattedDateString"
                prevent-typing
                :placeholder="placeholder"
                :disabled="disabled"
                @focus="openTimeSelector"
                @blur="closeTimeSelector"
            />
            <div
                v-if="state.showTimepicker"
                class="timepicker"
                @mousedown="onTimepickerMousedown"
            >
                <div class="timepicker-selection-content">
                    <div class="time-column">
                        <div class="time-column-head">
                            <strong>Hours</strong>
                        </div>
                        <b-button
                            v-for="h of hours"
                            :key="h"
                            :class="{'h-active': selectedHour === h}"
                            :variant="selectedHour === h ? 'primary' : 'light'"
                            @click="() => selectHour(h)"
                        >
                            {{ h }}
                        </b-button>
                    </div>
                    <div class="time-column">
                        <div class="time-column-head">
                            <strong>Minutes</strong>
                        </div>
                        <b-button
                            v-for="m of minutes"
                            :key="m"
                            :class="{'m-active': selectedMinutes === m}"
                            :variant="selectedMinutes === m ? 'primary' : 'light'"
                            @click="() => selectMinute(m)"
                        >
                            {{ m.toString().padStart(2, '0') }}
                        </b-button>
                    </div>
                </div>
                <div class="timepicker-button-row">
                    <b-button
                        variant="primary"
                        @click="closeTimeSelector"
                    >
                        Close
                    </b-button>
                </div>
            </div>
        </div>
    </b-col>
</template>

<script lang="ts">
import {
    computed, defineComponent, nextTick, PropType,
    reactive, ref, watch,
} from 'vue';
import BFormInput from '@package/components/bootstrap-library/BFormInput.vue';
import BButton from '@package/components/bootstrap-library/BButton.vue';
import BCol from '@package/components/bootstrap-library/BCol.vue';
import {todayAtMidnight} from "@/functions/date";

type State = {
    showTimepicker: boolean;
}

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
    name: 'timepicker',
    components: { BCol, BButton, BFormInput },
    props: {
        modelValue: { type: Date, default: undefined },
        cols: { type: String, default: '' },
        lg: { type: String, default: '' },
        md: { type: String, default: '' },
        sm: { type: String, default: '' },
        xs: { type: String, default: '' },
        label: { type: String, default: undefined },
        placeholder: { type: String, default: undefined },
        error: { type: String, default: undefined },
        minuteStep: { type: Number as PropType<1 | 5 | 10 | 15 | 30>, default: 1 },
        setMinutes: { type: Number as PropType<number>, default: undefined },
        minHours: { type: Number, default: 0 },
        maxHours: { type: Number, default: 23 },
        date: { type: Date, default: todayAtMidnight() },
        disabled: { type: Boolean, default: false },
    },
    emits: ['update:modelValue'],
    setup(props, context) {
        const state = reactive<State>({
            showTimepicker: false,
        });

        const dateMidnight = computed((): Date => new Date(props.date?.setHours(0, 0, 0, 0)));

        watch(() => dateMidnight.value, (newVal: Date, oldVal: Date) => {
            if (props.modelValue && newVal.toDateString() !== oldVal.toDateString()) {
                const date = new Date(newVal);
                date.setHours(props.modelValue?.getHours() || 0, props.modelValue?.getMinutes() || 0, 0, 0);
                context.emit('update:modelValue', date);
            }
        });

        const timepickerRef = ref<HTMLElement | null>(null);

        const minutes = computed((): Array<number> => {
            if (props.setMinutes !== undefined) return [props.setMinutes];
            const result: Array<number> = [];
            for (let i = 0; i < 60; i += props.minuteStep) {
                if (i % props.minuteStep === 0) result.push(i);
            }
            return result;
        });

        const hours = computed((): Array<number> => {
            const result: Array<number> = [];
            for (let i = props.minHours; i <= props.maxHours; i++) {
                result.push(i);
            }
            return result;
        });

        const selectedHour = computed((): number | null => {
            if (props.modelValue?.getHours) {
                return props.modelValue.getHours();
            }
            return null;
        });

        const selectedMinutes = computed((): number | null => {
            if (props.modelValue?.getMinutes) {
                return props.modelValue.getMinutes();
            }
            return null;
        });

        const formattedDateString = computed((): string => {
            if (props.modelValue) {
                return `${props.modelValue.getHours()}:${props.modelValue.getMinutes().toString().padStart(2, '0')}`;
            }
            return '';
        });

        function centerSelectedValues() {
            const hButtons = timepickerRef.value?.getElementsByClassName('h-active');
            if (hButtons && hButtons.length > 0) {
                hButtons[0].scrollIntoView({
                    block: 'center',
                });
            }
            const mButtons = timepickerRef.value?.getElementsByClassName('m-active');
            if (mButtons && mButtons.length > 0) {
                mButtons[0].scrollIntoView({
                    block: 'center',
                });
            }
        }

        function openTimeSelector() {
            state.showTimepicker = true;
            nextTick(() => centerSelectedValues());
        }

        function closeTimeSelector() {
            state.showTimepicker = false;
            // not in love with this, but we need to make sure it's blurred on close so it's easy to reopen
            const el = timepickerRef.value?.getElementsByTagName('input');
            if (el) el[0].blur();
        }

        function onTimepickerMousedown(evt: MouseEvent) {
            evt.preventDefault();
        }

        function selectMinute(minute: number) {
            const date = new Date(dateMidnight.value);
            date.setHours(props.modelValue?.getHours() || 0, minute, 0, 0);
            context.emit('update:modelValue', date);
        }

        function selectHour(hour: number) {
            const date = new Date(dateMidnight.value);
            date.setHours(hour, props.setMinutes ? props.setMinutes : props.modelValue?.getMinutes() || 0, 0, 0);
            context.emit('update:modelValue', date);
        }

        return {
            hours,
            minutes,
            openTimeSelector,
            closeTimeSelector,
            state,
            onTimepickerMousedown,
            formattedDateString,
            selectHour,
            selectMinute,
            timepickerRef,
            selectedMinutes,
            selectedHour,
        };
    },
});
</script>

<style scoped lang="scss">
.timepicker {
    position: absolute;
    height: 300px;
    width: 300px;
    border: 1px solid $gray-400;
    border-radius: var(--border-radius);
    background-color: white;
    z-index: 1;
    display: flex;
    flex-direction: column;
    margin-top: 3px;
    filter: drop-shadow(1px 3px 10px $gray-300);

    .timepicker-selection-content {
        display: flex;
        overflow: hidden;
    }

    .time-column {
        width: 50%;
        overflow-y: auto;
        display: flex;
        flex-direction: column;

        button {
            margin: 5px;
        }
    }

    .time-column-head {
        height: 40px;
        position: sticky;
        top: 0;
        z-index: 1;
        background-color: white;
        padding: 10px;
        border-bottom: 1px solid $gray-300;
    }

    .timepicker-button-row {
        display: flex;
        justify-content: flex-end;
        border-top: 1px solid $gray-300;

        button {
            margin: 5px;
        }
    }

}
</style>
