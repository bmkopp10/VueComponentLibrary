<template>
    <full-calendar :options="calendarOptions">
        <template
            v-if="hasEventContentSlot"
            #eventContent="item"
        >
            <slot
                name="eventContent"
                :item="item"
            />
        </template>
    </full-calendar>
</template>

<script lang="ts">

import {
    computed, defineComponent, onBeforeMount, PropType, ref,
} from 'vue';
import FullCalendar, { EventApi } from '@fullcalendar/vue3';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions, ViewApi } from '@fullcalendar/core';

export interface EventDate<T> {
    title: string;
    start: Date;
    end: Date;
    editable: boolean;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    extendedProps: T
}

export type InteractiveCalendarMouseEventInfo = {
    el: HTMLElement;
    event: EventApi;
    jsEvent: MouseEvent;
    view: ViewApi;
}

export default defineComponent({
    name: 'interactive-calendar',
    components: { FullCalendar },
    props: {
        modelValue: { type: Array as PropType<Array<EventDate<unknown>>>, default: () => [] },
        hiddenDays: { type: Array as PropType<Array<number>>, default: () => [] },
        slotMinTime: { type: String, default: '00:00:00' },
        slotMaxTime: { type: String, default: '23:59:59' },
        height: { type: Number, default: undefined },
        editable: { type: Boolean, default: false },
    },
    emits: ['update:modelValue', 'eventMouseEnter', 'eventMouseLeave'],
    setup(props, context) {
        const show = ref<boolean>(false);

        const hasEventContentSlot = computed((): boolean => !!context.slots.eventContent);

        onBeforeMount(async () => {
            show.value = true;
        });

        function handleEventDragComplete(arg: unknown) {
            // send api call, while its busy dull the content card and disable edits, if response fails move the card back
            context.emit('update:modelValue');
        }

        const calendarOptions = computed((): CalendarOptions => ({
            plugins: [interactionPlugin, timeGridPlugin],
            initialView: 'timeGridWeek',
            headerToolbar: {
                left: 'prev,next',
                center: 'title',
                right: 'timeGridDay,timeGridWeek',
            },
            editable: props.editable,
            slotMinTime: props.slotMinTime,
            slotMaxTime: props.slotMaxTime,
            events: props.modelValue as any, // why doesn't the correct type work?
            stickyHeaderDates: true,
            expandRows: true,
            height: props.height,
            hiddenDays: props.hiddenDays,
            slotEventOverlap: false,
            eventMouseEnter: (mouseEnterInfo: InteractiveCalendarMouseEventInfo) => context.emit('eventMouseEnter', mouseEnterInfo),
            eventMouseLeave: (mouseLeaveInfo: InteractiveCalendarMouseEventInfo) => context.emit('eventMouseLeave', mouseLeaveInfo),
            eventDrop: handleEventDragComplete,
        }));

        return {
            calendarOptions,
            hasEventContentSlot,
        };
    },
});

</script>

<style lang="scss">
.calendar-content-grow {
    min-height: 100%;
    height: fit-content !important;
}

.calendar-content-overlap {
    z-index: 2 !important;
}

.fc .fc-toolbar.fc-header-toolbar {
    margin: 0 !important;
    padding: 15px !important;
}

.fc-prev-button {
    margin-right: 5px !important;
}

.fc-timeGridDay-button {
    margin-right: 5px !important;
}
</style>
