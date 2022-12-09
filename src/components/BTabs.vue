<template>
    <div>
        <div class="tabs-container">
            <template
                v-for="({tab, active, disabled}, i) in tabs"
                :key="i"
            >
                <div
                    class="tab-container"
                    :style="{width: `${100/numOfTabs}%`}"
                >
                    <div @click="() => handleTabClick(i)">
                        <component
                            :is="tab"
                            :active="active"
                            :disabled="disabled"
                            tab
                            style="height:100%"
                        />
                    </div>
                </div>
            </template>
        </div>
        <div>
            <component :is="activeContent" />
        </div>
    </div>
</template>

<script lang="ts">

import { computed, defineComponent, ref } from 'vue';
import BDivider from './BDivider.vue';
import BCol from './BCol.vue';
import BRow from './BRow.vue';
import BButton from './BButton.vue';

export default defineComponent({
    name: 'b-tabs',
    components: {
        BButton, BDivider, BCol, BRow,
    },
    props: {},
    setup(props, context) {
        const _tabIndex = ref(0);
        const _currentTabButton = ref('');

        const tabIndex = computed({
            get: () => _tabIndex.value,
            set: (value: number) => {
                _tabIndex.value = value;
                if (tabs.value.length > 0 && value >= 0 && value < tabs.value.length) {
                    _currentTabButton.value = tabs.value[value].buttonId;
                } else {
                    _currentTabButton.value = '';
                }
            },
        });

        const tabs = computed(() => {
            let tabs: any[] = [];
            if (context.slots.default) {
                tabs = getTabs(context.slots).map((tab: any, index) => {
                    if (!tab.props) tab.props = {};
                    const active = tabIndex.value > -1 ? index === tabIndex.value : tab.props.active === '';
                    return {
                        active,
                        disabled: tab.props.disabled === '',
                        title: tab.props.title,
                        onClick: tab.props.onClick,
                        tab,
                    };
                });
            }
            return tabs;
        });

        function getTabs(slots: any): any[] {
            if (!slots || !slots.default) return [];
            return slots
                .default()
                .reduce((arr: number[], slot: any) => {
                    if (typeof slot.type === 'symbol') {
                        arr = arr.concat(slot.children);
                    } else {
                        arr.push(slot);
                    }
                    return arr;
                }, [])
                .filter((child: any) => child.type?.name === 'b-tab');
        }

        const activeContent = computed(() => {
            let content;
            if (context.slots.default) {
                getTabs(context.slots).map((tab: any, index) => {
                    if (_tabIndex.value === index) {
                        content = tab.children.default;
                    }
                });
            }
            return content;
        });

        function handleTabClick(index: number) {
            _tabIndex.value = index;
        }

        const numOfTabs = computed(() => tabs.value.length);

        return {
            tabs,
            handleTabClick,
            tabIndex,
            activeContent,
            numOfTabs,
        };
    },
});
</script>

<style scoped lang="scss">
.tab-container {
    cursor: pointer;
    display: flex;

    > * {
        margin: auto;
        width: 100%;
        height: 100%;
    }

}
.tabs-container {
    height: 38px;
    background: transparent;
    display: flex;
}
</style>
