<template>
    <div
        v-show="show"
        id="table-container"
        :class="['table-container', {'is-dragging': isDragging }]"
    >
        <div style="display: flex;flex-grow: 1">
            <div
                class="b-table table-responsive"
                :style="[tableClass]"
            >
                <table
                    :class="['table', {'table-hover': hasRowClick}, verticalTextAlignmentClass]"
                    :style="isTableFixed() ? {tableLayout: 'fixed'} : undefined"
                >
                    <thead
                        class="b-table-head"
                        :style="[headClass]"
                    >
                        <tr id="table-head">
                            <th
                                v-for="(key, index) of columnKeys"
                                :id="`th-${key}`"
                                :key="index"
                                :style="{width: getColumnWidthByKey(key, fitToPage)}"
                                scope="col"
                                :class="[{ 'no-cursor': getIgnoreSortByKey(key) }]"
                            >
                                <slot :name="`head(${key})`">
                                    <div style="display: flex;">
                                        <div :style="{width: '100%', textAlign: getColumnDataByKey(key).align}">
                                            <span
                                                class="column-head-title"
                                                @mouseup="() => sortByTableColumn(key)"
                                            >{{ getColumnDataByKey(key).label }}</span>
                                            <component
                                                :is="getColumnDataByKey(key).headerBadge"
                                                v-if="!!getColumnDataByKey(key).headerBadge"
                                                class="header-badge"
                                            />
                                        </div>
                                        <div class="sort-display-container">
                                            <faicon
                                                v-if="sortDirection(key) === 'ascending'"
                                                icon="arrow-up"
                                            />
                                            <faicon
                                                v-if="sortDirection(key) === 'descending'"
                                                icon="arrow-down"
                                            />
                                            <span
                                                v-if="sortArray.length > 1 && (sortPosition(key) ?? 0) > 0"
                                                class="sort-position"
                                            >{{
                                                sortPosition(key)
                                            }}</span>
                                        </div>
                                    </div>
                                    <div
                                        class="table-column-slider"
                                        @mousedown="startDrag(key, $event)"
                                    />
                                </slot>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <template
                            v-for="(item, index) of paginatedItems"
                            :key="index"
                        >
                            <tr
                                :class="[striped ? 'striped' : '']"
                                :style="{height: rowHeight}"
                                @click="() => onRowClick(item.value)"
                            >
                                <td
                                    v-for="num in numberOfColumns"
                                    :key="num"
                                    :style="{textAlign: getColumnDataByIndex(num - 1).align}"
                                >
                                    <slot
                                        :name="`cell(${getColumnDataByIndex(num - 1).key})`"
                                        :item="item.value"
                                    >
                                        {{ getColumnDataForUI(num - 1, item.value) }}
                                    </slot>
                                </td>
                            </tr>
                            <tr v-if="item.hasChildren()">
                                <td :colSpan="numberOfColumns">
                                    <table class="table">
                                        <tr
                                            v-for="(groupItem, groupIndex) of item.getChildren()"
                                            :key="`${index}-${groupIndex}`"
                                            class="group-row"
                                            :style="{height: rowHeight}"
                                            @click="() => onRowClick(groupItem.value)"
                                        >
                                            <td
                                                v-for="num in numberOfColumns"
                                                :key="num"
                                            >
                                                <slot
                                                    :name="`cell(${getColumnDataByIndex(num - 1).key})`"
                                                    :item="groupItem.value"
                                                >
                                                    {{ getColumnDataForUI(num - 1, groupItem.value as object) }}
                                                </slot>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
                <div
                    v-if="loading"
                    class="loading-container"
                >
                    <div class="loading-content">
                        <slot name="loading">
                            <b-spinner />
                        </slot>
                    </div>
                </div>
                <div
                    v-if="!loading && showEmpty && items.length === 0"
                    class="empty-container"
                >
                    <div class="empty-content">
                        <slot name="empty">
                            <empty-state
                                style="background-color: white"
                                :title="emptyState.title"
                                :icon="emptyState.icon"
                                :button="emptyState.button"
                                :message="emptyState.message"
                            />
                        </slot>
                    </div>
                </div>
            </div>

            <div
                v-if="hasSidePane"
                class="side-pane-container"
                :style="{minWidth: computedSidePaneOptions.width, borderLeft: '1px solid $gray-400', ...tableClass}"
            >
                <div
                    v-if="!computedSidePaneOptions.hideHeader"
                    class="side-pane-head"
                >
                    <div>
                        <slot name="side-pane-head">
                            <span>{{ computedSidePaneOptions.title }}</span>
                        </slot>
                    </div>
                </div>
                <div class="side-pane-content">
                    <slot name="side-pane" />
                </div>
            </div>
        </div>

        <div
            v-if="showPagination"
            class="pagination"
        >
            <b-pagination
                v-model="currentPage"
                :total-rows="filteredItems.length"
                :per-page="perPage"
            />
        </div>
    </div>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    onMounted,
    onBeforeUnmount,
    PropType,
    watch,
    StyleValue,
} from 'vue';
import BBadge from '../../../components/bootstrap-library/BBadge.vue';
import {UseUnitOfMeasure} from "@/measurement/types";
import useTableSort, {TableSortObject} from "@/composables/table/useTableSort";
import EmptyState, {EmptyStateProps} from "@/components/EmptyState/EmptyState.vue";
import {i18n} from "@/translation/i18n";
import useStringFormatter from "@/composables/useStringFormatter";
import useTablePagination from "@/composables/table/useTablePagination";
import TableGroupingTree from "@/view-models/TableGroupingTree";
import {ColumnData} from "@/types/ColumnData";
import useTableWidth from "@/composables/table/useTableWidth";

type Field<T> = {
    // Keep in sync with ColumnDefinition until consolidated
    key: keyof T;
    label?: string;
    searchable?: boolean;
    // eslint-disable-next-line no-unused-vars
    formatter?: (value: any) => any;
    ignoreSort?: boolean;
    width?: string;
    hidden?: boolean;
    uom?: UseUnitOfMeasure;
    headerBadge?: any;
    align?: 'left' | 'center' | 'right';
}

export type BTableField<T> = Field<T> | keyof T;

export type SidePaneOptions = {
    title?: string;
    width?: string;
    hideHeader?: boolean;
}

export default defineComponent({
    name: 'b-table',
    components: { EmptyState, BBadge },
    props: {
        items: {
            type: Array as PropType<Array<unknown>>,
            required: true,
        },
        fields: {
            type: Array as PropType<Array<BTableField<unknown> | string>>,
            default: () => [],
        },
        defaultSort: {
            type: Array as PropType<Array<TableSortObject>>,
            default: () => [],
        },
        stickyHeader: {
            type: String,
            default: () => undefined,
        },
        striped: Boolean,
        perPage: {
            type: Number,
            default: () => 25,
        },
        showPagination: {
            type: Boolean,
            default: false,
        },
        showEmpty: {
            type: Boolean,
            default: () => true,
        },
        rowHeight: {
            type: String,
            default: () => '40px',
        },
        loading: {
            type: Boolean,
            default: () => false,
        },
        dynamicColumns: {
            type: Boolean,
            default: () => true,
        },
        fitToPage: {
            type: Boolean,
            default: () => false,
        },
        sidePaneOptions: {
            type: Object as PropType<SidePaneOptions>,
          // eslint-disable-next-line @typescript-eslint/no-empty-function
            default: () => {
            },
        },
        tableKey: {
            type: String,
            // default: router.currentRoute.value?.name,
        },
        emptyState: {
            type: Object as PropType<EmptyStateProps>,
            default: () => ({
                title: useStringFormatter().titleCase(i18n.global.t('core.common.emptyTable')),
            } as EmptyStateProps),
        },
        verticalTextAlignment: {
            type: String as PropType<'top' | 'middle' | 'bottom'>,
            default: () => 'middle',
        },
    },
    emits: ['rowClick'],
    setup(props, context) {
        const {
            resetSort,
            handleSort,
            sortDirection,
            sortPosition,
            sortArray,
            switchTable: switchSortTable,
        } = useTableSort({
            tableKey: props.tableKey,
            defaultSort: props.defaultSort,
        });

        const {
            currentPage,
            firstRowInPaginated,
            lastRowInPaginated,
            goToFirstPage,
            switchTable: switchPageTable,
        } = useTablePagination({
            tableKey: props.tableKey,
            perPage: props.perPage,
        });

        const groupedItems = computed(() => new TableGroupingTree(props.items));

        const columnKeys = computed((): Array<string> => {
            const fields: Array<string> = [];

            if (props.fields) {
                const arr = props.fields.map((field) => {
                    if (typeof field === 'string') {
                        return field;
                    }
                    return field.key;
                });
                fields.push(...arr);
            } else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                fields.push(Object.keys(props.items[0]));
            }

            return fields;
        });

        watch(() => columnKeys.value, () => {
            // If any columns were removed that are part of the sort, clear the sort
            for (let i = 0; i < sortArray.value.length; i++) {
                if (columnKeys.value.find((key) => key === sortArray.value[i].key)) {
                    continue;
                }

                resetSort();
                return;
            }
        });

        function camelCaseToLabel(key: string): string {
            const result = key.replace(/([A-Z])/g, ' $1');
            return result.charAt(0)
                .toUpperCase() + result.slice(1);
        }

        function getLabelByKey(key: string): string {
            if (props.fields) {
                const fieldData = props.fields.find((field) => typeof field !== 'string' && field.key === key) as Field<unknown> | undefined;
                if (fieldData && fieldData.label) {
                    return fieldData.label;
                }
                return camelCaseToLabel(key);
            }
            return camelCaseToLabel(key);
        }

        const numberOfColumns = computed((): number => columnKeys.value.length);

        const columnDataArray = computed((): Array<ColumnData> => {
            const arr: Array<ColumnData> = [];
            // build column data by item data
            if (!props.fields && props.items.length > 0) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                Object.keys(props.items[0])
                    .forEach((key, index) => {
                        arr.push({
                            key,
                            index,
                            label: getLabelByKey(key),
                            width: null,
                            align: 'left',
                        });
                    });
            } else {
                // build column data from fields
                const data: Array<ColumnData> = (props.fields as Array<BTableField<unknown>>).map((field, index) => {
                    if (typeof field === 'string') {
                        return {
                            key: field,
                            index,
                            label: getLabelByKey(field),
                            width: null,
                            align: 'left',
                        };
                    }
                    return {
                        key: field.key,
                        index,
                        label: field.label ? field.label : getLabelByKey(field.key),
                        width: field.width || null,
                        uom: field.uom,
                        headerBadge: field.headerBadge,
                        align: field.align ? field.align : 'left',
                    };
                });
                if (data) arr.push(...data);
            }
            return arr;
        });

        const {
            initTableWidth,
            isTableFixed,
            getColumnWidthByKey,
            startDrag,
            stopDrag,
            isDragging,
            show,
            switchTable: switchWidthTable,
        } = useTableWidth({
            tableKey: props.tableKey,
            columnData: columnDataArray,
        });

        let resizeTimeout: number | undefined;

        function handleResize() {
            clearTimeout(resizeTimeout);
            // debounce the width calculation to avoid unnecessay redraws
            resizeTimeout = setTimeout(initTableWidth, 500);
        }

        onMounted(() => {
            initTableWidth();
            window.addEventListener('resize', handleResize);
            window.addEventListener('mouseup', stopDrag);
        });

        onBeforeUnmount(() => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mouseup', stopDrag);
            clearTimeout(resizeTimeout);
        });

        watch(() => props.tableKey, (newKey) => {
            switchSortTable(newKey);
            switchPageTable(newKey);
            switchWidthTable(newKey);
        });

        function getIgnoreSortByKey(key: string): boolean {
            if (props.fields) {
                const fieldData = props.fields.find((field) => typeof field !== 'string' && field.key === key) as Field<unknown> | undefined;
                return fieldData?.ignoreSort === true;
            }
            return false;
        }

        const headClass = computed((): StyleValue => {
            if (props.stickyHeader) {
                return {
                    position: 'sticky',
                    top: '0px',
                };
            }
            return {};
        });

        const tableClass = computed(() => {
            if (props.stickyHeader) {
                return {
                    height: `calc(${props.stickyHeader} - ${props.showPagination ? '50px' : '0px'})`,
                };
            }
            return {};
        });

        const verticalTextAlignmentClass = computed(() => `vertical-align-text-${props.verticalTextAlignment}`);

        function getColumnDataByIndex(index: number): ColumnData {
            const data = columnDataArray.value.find((columnData) => columnData.index === index);
            if (data) return data;
            throw new Error('Cannot find column data');
        }

        function getColumnDataForUI(index: number, item: object): string | number {
            const data = columnDataArray.value.find((columnData) => columnData.index === index);
            if (Array.isArray(data?.key)) {
                const itemValue = data?.key.reduce((prevVal, curVal) => (prevVal === null ? prevVal : prevVal[curVal]), item);

                return itemValue;
            }
            if (data?.uom) {
                // @ts-ignore
                return data.uom.convertFromBase(item[getColumnDataByIndex(index).key]);
            }
            // @ts-ignore
            return item[getColumnDataByIndex(index).key];
        }

        function getColumnDataByKey(key: string): ColumnData {
            const data = columnDataArray.value.find((columnData) => columnData.key === key);
            if (data) return data;
            throw new Error('Cannot find column data');
        }

        function sortByTableColumn(key: string) {
            if (isDragging.value) return;
            const definition = props.fields.find((field) => typeof field !== 'string' && field.key === key);
            if (definition && typeof definition !== 'string' && definition.ignoreSort) {
                return;
            }

            handleSort(key);
        }

        function isEven(n: number): boolean {
            return n % 2 === 0;
        }

        function onRowClick(item: unknown) {
            context.emit('rowClick', item);
        }

        const hasRowClick = computed((): boolean => !!(context.attrs.onRowClick));

        function formatValue(key: any) {
            return typeof key === 'string' ? key.trim().toLowerCase() : key;
        }

        const filteredItems = computed(() => groupedItems.value);

        watch(() => filteredItems.value.length, () => {
            // only go back to first page if we don't have enough results
            if (firstRowInPaginated.value > filteredItems.value.length) {
                goToFirstPage();
            }
        });

        const sortedItems = computed(() => {
            const items = filteredItems.value;

            if (sortArray.value.length === 0) return items;

            // needs to be in reverse
            for (let i = sortArray.value.length - 1; i >= 0; i--) {
                const sortObj = sortArray.value[i];

                items.sortGroups((a, b) => {
                    let valueA;
                    let valueB;

                    if (Array.isArray(sortObj.key)) {
                        valueA = sortObj.key.reduce(
                            // @ts-ignore
                            (prevVal, curVal) => (prevVal === null ? prevVal : prevVal[curVal]),
                            a,
                        );

                        valueB = sortObj.key.reduce(
                            // @ts-ignore
                            (prevVal, curVal) => (prevVal === null ? prevVal : prevVal[curVal]),
                            b,
                        );

                        valueA = formatValue(valueA);
                        valueB = formatValue(valueB);
                    } else {
                        // @ts-ignore
                        valueA = formatValue(a[sortObj.key]);
                        // @ts-ignore
                        valueB = formatValue(b[sortObj.key]);
                    }

                    if (valueA === null || valueA === undefined) {
                        return 1;
                    }

                    if (valueB === null || valueB === undefined) {
                        return -1;
                    }

                    if (valueA < valueB) {
                        return sortObj.direction === 'descending' ? -1 : 1;
                    }
                    if (valueA > valueB) {
                        return sortObj.direction === 'descending' ? 1 : -1;
                    }

                    return 0;
                });
            }

            return items;
        });

        const paginatedItems = computed(() => {
            if (props.showPagination) {
                // @ts-ignore
                return sortedItems.value.toFlatArray().filter((item, index) => {
                    const rowNumber = index + 1;

                    return rowNumber >= firstRowInPaginated.value && rowNumber <= lastRowInPaginated.value;
                });
            }
            return sortedItems.value.toArray();
        });

        const hasSidePane = computed(() => !!context.slots['side-pane']);

        const computedSidePaneOptions = computed((): SidePaneOptions => ({
            width: props.sidePaneOptions?.width || '300px',
            title: props.sidePaneOptions?.title || 'Side Pane',
            hideHeader: props.sidePaneOptions?.hideHeader || false,
        }));

        return {
            columnKeys,
            numberOfColumns,
            getColumnDataByIndex,
            getColumnDataByKey,
            isEven,
            tableClass,
            headClass,
            onRowClick,
            hasRowClick,
            currentPage,
            paginatedItems,
            filteredItems,
            sortByTableColumn,
            sortPosition,
            sortDirection,
            sortArray,
            isTableFixed,
            getColumnWidthByKey,
            show,
            getColumnDataForUI,
            getIgnoreSortByKey,
            hasSidePane,
            computedSidePaneOptions,
            startDrag,
            stopDrag,
            isDragging,
            verticalTextAlignmentClass,
        };
    },
});
</script>

<style lang="scss" scoped>
.table-container {
    position: relative;
    display: flex;
    flex-direction: column;
    /* min-height: 500px; */

    &.is-dragging {
        cursor: col-resize;

        .b-table {
            th {
                cursor: col-resize;
            }
        }
    }
}

.b-table {
    border-bottom: 1px solid #efefef;
    table-layout: fixed;
    position: relative;

    tr.striped:nth-child(even) {
        background-color: #f9f9f9;
    }

    tr:hover {
        background-color: #f9f9f9;
    }

    .vertical-align-text-top td {
        vertical-align: text-top;
    }

    .vertical-align-text-middle td {
        vertical-align: middle;
    }

    .vertical-align-text-bottom td {
        vertical-align: text-bottom;
    }

    td {
        padding: 0 15px;
        text-align: left;
        overflow-wrap: break-word; // this will break up long strings (often email), not sure if this desired, but it eliminates gross overflow
    }

    th {
        padding: 0 15px;
        vertical-align: middle;
        position: relative;
        user-select: none;

        &.no-cursor {
            cursor: initial;
        }
    }

    :deep(.table-column-slider) {
        cursor: col-resize;
        position: absolute;
        top: 0;
        right: -10px;
        height: 100%;
        width: 20px;
    }

    th:last-child {
        :deep(.table-column-slider) {
            cursor: col-resize;
            position: absolute;
            top: 0;
            right: 0;
            height: 100%;
            width: 10px;
        }
    }
}

thead {
    * {
        border-color: $gray-400 !important;
    }
}

.pagination {
    position: relative;
    height: 50px;
    background: white;
    margin-top: -1px;
    border-top: 1px solid #efefef;
    display: flex;
    padding-left: 6px;

    span {
        margin: auto 30px;
    }
}

.table-hover {
    tr:hover {
        cursor: pointer;
    }
}

.table {
    margin-bottom: 0;
}

.b-table-head {
    z-index: 1;
    background: white;
    height: 50px;
    border: none;
}

.sort-display-container {
    width: 40px;
    display: flex;

    > * {
        margin: auto;
    }
}

.sort-position {
    background: #dadada;
    padding: 3px 7px 2px 7px;
    border-radius: 60px;
    font-size: 10px;
}

.empty-container {
    display: flex;
    height: calc(100% - 56px);

    .empty-content {
        margin: auto;
    }
}

.loading-container {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;

    .loading-content {
        margin: auto;
        padding-bottom: 50px;
    }
}

.side-pane-container {
    background-color: #f0f0f0;
    display: flex;
    flex-direction: column;

    .side-pane-head {
        min-height: 50px;
        max-height: 50px;
        vertical-align: middle;
        user-select: none;

        div {
            height: 100%;
            border-bottom: 1px solid $gray-400;
            display: flex;

            span {
                font-weight: bold;
                color: #212529;
                margin: auto;
            }
        }
    }

    .side-pane-content {
        overflow-y: auto;
        flex-grow: 1;
    }
}

.column-head-title {
    cursor: pointer;
}

.group-row {
    background-color: $gray-300;
}

.header-badge {
    // the positioning isn't perfect, it probably behaves strangely with longer header titles
    // its something we'll just have to re-evaluate as we see issues
    position: absolute;
    padding: 2px 5px;
    z-index: 9;
    top: 5px;
    margin-left: 10px;
}
</style>
