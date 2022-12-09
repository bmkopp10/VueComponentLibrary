<template>
    <li>
        <a
            :class="classArray"
            @click="handleClick"
        >
            <slot />
            <div
                v-if="disabled && disabledMessage"
                v-popover.hover="disabledMessage"
                class="btn-popover"
            />
        </a>
    </li>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
    name: 'b-dropdown-item',
    props: {
        disabled: {
            type: Boolean,
            default: () => false,
        },
        disabledMessage: String,
    },
    emits: ['click'],
    setup(props, context) {
        const classArray = computed((): Array<string> => {
            const arr = ['dropdown-item'];
            if (props.disabled) arr.push('btn-disabled');
            return arr;
        });

        function handleClick() {
            if (!props.disabled) context.emit('click');
        }

        return {
            handleClick,
            classArray,
        };
    },

});
</script>

<style scoped lang="scss">

.dropdown-item {
    cursor: pointer;
    position: relative;
}

.dropdown-item.active, .dropdown-item:active {
    color: #fff;
    text-decoration: none;
    background-color: transparent;
}

.btn-popover {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
}

</style>
