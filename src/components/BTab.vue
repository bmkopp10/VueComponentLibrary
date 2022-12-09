<template>
    <div>
        <div :class="['tab', {'tab-active bg-primary': active}]">
            <slot name="tab">
                <span>{{ title }}</span>
                <span
                    v-if="badge"
                    class="tab-badge"
                >{{ badge }}</span>
            </slot>
        </div>
        <div v-if="!tab">
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'b-tab',
    props: {
        title: String,
        active: Boolean,
        tab: { type: Boolean, default: () => false },
        badge: String,
    },
});
</script>

<style lang="scss" scoped>

.tab {
    height:100%;
    display: flex;
    border-radius: var(--border-radius);

    span {
        margin: auto;
    }
}

::v-slotted(.tab-active *) {
   // in case you want to add custom styles
}

.tab-badge {
    background-color: red;
    padding: 2px 8px;
    margin-left: 5px;
    margin-right: 5px;
    border-radius: 50%;
}

</style>
