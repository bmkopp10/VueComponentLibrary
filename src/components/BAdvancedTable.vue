<template>
    <div
        id="orbis-table-wrapper"
        class="table-wrapper"
    >
        <div class="table-head">
            <sub-header :title="state.tableName">
                <template
                    v-if="tableArray.length > 1"
                    #title
                >
                    <b-form-select
                        v-model="state.tableKey"
                        :options="tableOptions"
                        class="table-selector"
                        @change="onTableChange"
                    />
                </template>

                <template #title-buttons>
                    <div
                        v-if="selectedTable.headIcon"
                        class="head-icon"
                    >
                        <component :is="selectedTable.headIcon" />
                    </div>
                </template>

                <template #options>
                    <div
                        v-if="searchOptions.length > 1"
                        class="search-option-desktop"
                    >
                        <b-form-input
                            v-if="searchType === 'string' || searchType === 'array'"
                            :model-value="state.search"
                            :placeholder="`${$t('core.common.search')}...`"
                            style="width: 300px;margin: auto 5px"
                            :autofocus="true"
                            @input="onChangeSearch"
                            @change="onChangeSearch"
                        />
                        <b-form-input
                            v-if="searchType === 'number'"
                            :model-value="state.searchNumFrom"
                            type="number"
                            :placeholder="`${$t('core.common.from')}...`"
                            :autofocus="true"
                            style="width: 150px;margin: auto 5px"
                            @input="onChangeSearchNumFrom"
                            @change="onChangeSearchNumFrom"
                        />
                        <b-form-input
                            v-if="searchType === 'number'"
                            :model-value="state.searchNumTo"
                            type="number"
                            :placeholder="`${$t('core.common.to')}...`"
                            style="width: 150px;margin: auto 5px"
                            @input="onChangeSearchNumTo"
                            @change="onChangeSearchNumTo"
                        />
                        <b-form-select
                            v-model="state.searchKey"
                            :options="searchOptions"
                            style="margin: auto 0; width: 200px;"
                            @change="resetSearch"
                        />
                    </div>
                </template>
            </sub-header>

            <div
                v-if="showTopRow"
                class="button-row"
            >
                <slot name="toprow" />
            </div>
        </div>
        <b-table
            :key="state.tableName"
            :table-key="state.tableKey"
            :items="filteredItems"
            :fields="filteredFields"
            :sticky-header="computedStickyHeader"
            :loading="loading"
            :side-pane-options="sidePaneOptions"
            :show-pagination="showPagination"
            :vertical-text-alignment="verticalTextAlignment"
        >
            <template
                v-for="(slot, name) in slots"
                #[name]="slotProps"
                :key="name"
            >
                <slot
                    :name="name"
                    :item="slotProps.item"
                />
            </template>
            <template
                v-if="hasActionSlotOrField"
                #cell(action)="row"
            >
                <slot
                    name="action"
                    :item="row.item"
                />
            </template>
            <template #head(action)>
                <b-dropdown
                    v-if="dynamicColumns"
                    class="dropdown-filter"
                    no-caret
                    right
                >
                    <template #button-content>
                        <faicon
                            icon="columns"
                            style="font-size: 24px"
                        />
                    </template>
                    <div class="dropdown-content-container">
                        <span class="dropdown-content-head">Columns</span>
                        <div class="dropdown-content">
                            <div
                                v-for="def of selectedTable.columnDefinition"
                                :key="def.key"
                                class="dropdown-content-row"
                            >
                                <b-form-checkbox
                                    inline
                                    :label="getLabelFromFormDefinition(def)"
                                    :model-value="state.dynamicColumns.some(x => isEqual(x, def.key))"
                                    @change="(value) => toggleColumn(value, def.key)"
                                />
                            </div>
                        </div>
                    </div>
                </b-dropdown>
                <span v-else />
            </template>
            <template
                v-if="hasSidePane"
                #side-pane
            >
                <slot name="side-pane">
                    <component :is="selectedTable.sidePane" />
                </slot>
            </template>
            <template
                v-if="hasSidePaneHead"
                #side-pane-head
            >
                <slot name="side-pane-head" />
            </template>
        </b-table>
    </div>
</template>

<script lang="ts">
import {
    computed, defineComponent, onBeforeMount, PropType, reactive, watch,
} from 'vue';
import BFormSelect from '../BFormSelect.vue';
import BFormCheckbox from '../BFormCheckbox.vue';
import SubHeader from '../SubHeader.vue';
import BTable from "./BTable/BTable.vue";
import {useI18n} from "vue-i18n";
import isEqual from 'lodash.isequal';
import {SidePaneOptions} from "@/components/BTable.vue";
import type {TableDefinition} from "@/types";

type State = {
    tableKey: string;
    tableName: string;
    search: string;
    searchNumFrom: number | null;
    searchNumTo: number | null;
    searchKey: string;
    dynamicColumns: Array<string>;
}

type SearchType = 'string' | 'number' | 'array';

export default defineComponent({
    name: 'b-advanced-table',
    components: {
        SubHeader,
        BFormSelect,
        BTable,
        BFormCheckbox,
    },
    props: {
        tableArray: {
            type: Array as () => Array<TableDefinition<any>>,
            required: true,
        },
        stickyHeader: String,
        loading: Boolean,
        dynamicColumns: { type: [Boolean], default: () => false },
        sidePaneOptions: Object as PropType<SidePaneOptions>,
        showPagination: { type: Boolean, default: false },
        verticalTextAlignment: {
            type: String as PropType<'top' | 'middle' | 'bottom'>,
            default: () => 'middle',
        },
    },
    emits: ['columnChange', 'onTableChange'],
    setup(props, context) {
        const hasSidePane = computed((): boolean => !!context.slots['side-pane'] || !!selectedTable.value.sidePane);

        const hasSidePaneHead = computed((): boolean => !!context.slots['side-pane-head']);

        // TODO: fix these dependencies


        const { getLabelFromFormDefinition } = useStringFormatter();
        const { t } = useI18n();
        const { titleCase } = useStringFormatter();

        // used to create the table dropdown select
        const tableOptions = computed((): Array<Option> => {
            const options: Array<Option> = [];

            for (const table of props.tableArray) {
                options.push({
                    text: table.name,
                    value: table.key,
                });
            }
            return options;
        });

        const hasActionSlotOrField = computed((): boolean => {
            const hasActionSlot = !!context.slots.action;
            const hasActionField = !!selectedTable.value.columnDefinition.find((def) => def.key === 'action');
            return hasActionSlot || hasActionField;
        });

        const slots = computed(() => context.slots);

        // show top row if slots are present
        const showTopRow = computed(() => !!context.slots.toprow);

        const computedStickyHeader = computed((): string | null => {
            if (props.stickyHeader) {
                let baseOffset = 2;
                if (showTopRow.value) baseOffset += 40;
                return `calc(${props.stickyHeader} - ${baseOffset}px)`;
            }
            return null;
        });

        const activeTable = sessionStorage.getItem(`${props.tableArray[0].key}-active`) || tableOptions.value[0].value as string;
        const state = reactive<State>({
            tableKey: activeTable,
            search: '',
            searchNumFrom: null,
            searchNumTo: null,
            searchKey: '', // what key on the object we search
            tableName: props.tableArray.find((table) => table.key === activeTable)?.name || tableOptions.value[0].text as string,
            dynamicColumns: [],
        });

        const selectedTable = computed((): TableDefinition<any> => {
            const tableFound = props.tableArray.find((table) => table.key === state.tableKey);
            if (tableFound) return tableFound;
            throw new Error('cannot find table');
        });

        const searchOptions = computed((): Array<Option> => {
            const options: Array<Option> = [
                {
                    value: '',
                    text: titleCase(t('core.selectOptions.selectSearchOption')),
                },
            ];
            for (const item of selectedTable.value.columnDefinition) {
                if (item.searchable) {
                    options.push({
                        text: item.label ? item.label : formattedLabel(item.key as string),
                        value: item.key as string,
                    });
                }
            }
            return options;
        });

        const searchType = computed((): SearchType | null => {
            if (selectedTable.value && selectedTable.value.items && selectedTable.value.items.length > 0) {
                let itemTypeForSearch;

                if (Array.isArray(state.searchKey)) {
                    itemTypeForSearch = state.searchKey.reduce((prevVal, curVal) => (prevVal === null ? prevVal : prevVal[curVal]), selectedTable.value.items[0]);

                    itemTypeForSearch = typeof itemTypeForSearch;
                } else {
                    // find a populated value so we can get the type
                    const value = selectedTable.value.items.find((x) => x[state.searchKey] !== null);
                    itemTypeForSearch = typeof value[state.searchKey];
                }

                if (itemTypeForSearch === 'string') return 'string';
                if (itemTypeForSearch === 'number') return 'number';
            }

            return null;
        });

        const filteredItems = computed(() => {
            // if user filtered out all of their columns, dont show any rows
            // if (userColumnKeys.value.length === 0) return [];

            let items = [...selectedTable.value.items];

            if (state.searchKey.length > 0 && state.search.length > 0) {
                items = items.filter((item: unknown) => {
                    let itemValue;

                    if (Array.isArray(state.searchKey)) {
                        itemValue = state.searchKey.reduce((prevVal, curVal) => (prevVal === null ? prevVal : prevVal[curVal]), item);
                    } else {
                        // @ts-ignore
                        itemValue = item[state.searchKey];
                    }

                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    if (itemValue === undefined || itemValue === null) {
                        return false;
                    }
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    if (itemValue.toString() && itemValue.toString().toLowerCase().includes(state.search.toLowerCase())) {
                        return true;
                    }
                });
            }

            if (state.searchKey.length > 0 && state.searchNumFrom) {
                items = items.filter((item: unknown) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    if (item[state.searchKey] >= state.searchNumFrom) {
                        return true;
                    }
                });
            }

            if (state.searchKey.length > 0 && state.searchNumTo) {
                items = items.filter((item: unknown) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    if (item[state.searchKey] <= state.searchNumTo) {
                        return true;
                    }
                });
            }

            return items;
        });

        function resetSearch() {
            state.search = '';
            state.searchNumTo = null;
            state.searchNumFrom = null;
        }

        function onTableChange(tableKey: string) {
            hydrateState(tableKey);
            context.emit('onTableChange', tableKey);
        }

        function formattedLabel(label: string): string {
            const result = label.replace(/([A-Z])/g, ' $1');
            return result.charAt(0)
                .toUpperCase() + result.slice(1);
        }

        // dynamic columns
        const allFields = computed(() => {
            const arr = [
                {
                    key: 'action',
                    label: '',
                    ignoreSort: true,
                    width: '100px',
                },
                ...selectedTable.value.columnDefinition,
            ];
            return arr;
        });

        function toggleColumn(value: boolean, key: string) {
            if (value && !state.dynamicColumns.find((x) => isEqual(key, x))) {
                state.dynamicColumns.push(key);
            }
            if (!value) {
                const index = state.dynamicColumns.findIndex((k) => isEqual(k, key));
                if (index > -1) state.dynamicColumns.splice(index, 1);
            }
            context.emit('columnChange', state.dynamicColumns);
        }

        function hydrateState(tableKey?: string): boolean {
            const key = tableKey ?? state?.tableKey;
            if (key) {
                if (props.tableArray.length > 1) {
                    sessionStorage.setItem(`${props.tableArray[0].key}-active`, key);
                }

                const data = sessionStorage.getItem(key);
                if (data) {
                    const res = JSON.parse(data);
                    state.search = res.search;
                    state.searchNumFrom = res.searchNumFrom;
                    state.searchNumTo = res.searchNumTo;
                    state.searchKey = res.searchKey;
                    state.dynamicColumns = res.dynamicColumns;
                    return true;
                }
            }
            return false;
        }

        function initColumns() {
            if (!hydrateState()) {
                state.dynamicColumns = selectedTable.value.columnDefinition.filter((columnDef) => !columnDef.hidden).map((columnDef) => columnDef.key as string);
            }
        }

        onBeforeMount(() => {
            initColumns();
        });

        watch(() => ({ ...state }), () => {
            if (state?.tableKey) {
                sessionStorage.setItem(state.tableKey, JSON.stringify(state));
            }
        }, { deep: true });

        const filteredFields = computed(() => {
            if (state.dynamicColumns) {
                return allFields
                    .value
                    .filter((field) => state.dynamicColumns?.findIndex((x) => isEqual(x, field.key)) > -1 || field.key === 'action');
            }
            return allFields.value;
        });

        function onChangeSearch(val: string) {
            state.search = val;
        }

        function onChangeSearchNumFrom(val: number) {
            state.searchNumFrom = val;
        }

        function onChangeSearchNumTo(val: number) {
            state.searchNumTo = val;
        }

        return {
            state,
            tableOptions,
            selectedTable,
            filteredItems,
            searchOptions,
            resetSearch,
            onTableChange,
            showTopRow,
            searchType,
            filteredFields,
            toggleColumn,
            getLabelFromFormDefinition,
            hasActionSlotOrField,
            computedStickyHeader,
            slots,
            isEqual,
            hasSidePane,
            hasSidePaneHead,
            onChangeSearch,
            onChangeSearchNumFrom,
            onChangeSearchNumTo,
            props,
        };
    },
});
</script>

<style lang="scss" scoped>
.table-wrapper {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    position: relative;
}

.table-head {
    margin-bottom: -1px;
    z-index: 3;
    border-radius: 3px;

    .top {
        height: 46px;
        padding: 0 15px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        background: #f0f0f0;
    }

    .button-row {
        height: 40px;
        width: 100%;
        display: flex;
        padding: 0 10px;
        border-bottom: 1px solid $gray-400;

        // applies styling to slot with button tag
        ::v-slotted(button) {
            margin: auto 10px auto 0;
        }
    }
}

.title {
    margin-left: 15px;
    font-size: 1rem;
    font-weight: 500;
}

.head-icon {
    margin: auto 10px;
}

.table-selector {
    max-width: 200px;
}

.dropdown-content-container {
    display: flex;
    flex-direction: column;

    .dropdown-content {
        margin: 0 12px;
    }

    .dropdown-content-head {
        margin: auto 12px;
        font-weight: bold;
        font-size: 15px;
    }

    .dropdown-content-row {
        display: flex;
        margin: 5px 0;
        min-width: 150px;

        > div {
            margin-right: 5px; // checkbox
        }

        // applies style to b-form-checkbox component label even though this is scoped
        :deep(.form-check-label) {
            font-size: inherit;
        }
    }
}

@media only screen and (min-width: 768px) {
    .search-option-desktop {
        display: flex;
    }

}

@media only screen and (max-width: 767px) {
    .search-option-desktop {
        display: none !important;
    }
}
</style>
