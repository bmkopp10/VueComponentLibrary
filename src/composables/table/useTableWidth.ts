import {
    Ref, ref, nextTick, ComputedRef,
} from 'vue';
import {ColumnData} from "@/types/ColumnData";

export type DragData = {
    x: number;
    y: number;
    columnKey: string;
};

export type TableStyle = {
    isFixed: boolean;
    columnWidths: Map<string, string>;
};

type UseTableWidth = {
    initTableWidth: () => void;
    isTableFixed: () => boolean;
    getColumnWidthByKey: (key: string, fitToPage: boolean) => string | null;
    setColumnWidthByKey: (key: string, width: string) => void;
    startDrag: (columnKey: string, e: PointerEvent | MouseEvent) => void;
    stopDrag: (e: PointerEvent | MouseEvent) => void;
    isDragging: Ref<boolean>;
    show: Ref<boolean>;
    switchTable: (newTableKey: string | undefined) => void;
};

type Props = {
    tableKey?: string,
    columnData: ComputedRef<Array<ColumnData>>;
};

export default function useTableWidth(props: Props): UseTableWidth {
    const minColumnWidth = 100;
    const tableKey = ref(props.tableKey);
    const tableStyle: TableStyle = {
        isFixed: false,
        columnWidths: new Map(),
    };
    const dragData: DragData = { x: NaN, y: NaN, columnKey: '' };
    const isDragging = ref(false);
    const show = ref(true);

    function getColumnWidthByKey(key: string, fitToPage: boolean): string | null {
        if (tableStyle.isFixed) {
            if (tableStyle.columnWidths.has(key)) {
                return tableStyle.columnWidths.get(key) as string;
            }

            let defaultWidthStyle = 'auto';

            if (!fitToPage) {
                const el = document.getElementById(`th-${key}`);

                const defaultWidth = Math.max(el?.getBoundingClientRect().width || 0, minColumnWidth);

                defaultWidthStyle = `${defaultWidth}px`;
            }

            return defaultWidthStyle;
        }
        return null;
    }

    function setColumnWidthByKey(key: string, width: string) {
        tableStyle.columnWidths.set(key, width);
        if (tableKey.value) {
            const data = Object.fromEntries(tableStyle.columnWidths);
            sessionStorage.setItem(`${tableKey.value}-style`, JSON.stringify(data));
        }
    }

    function initTableWidth() {
        tableStyle.isFixed = false;

        let colMap: Map<string, string>;
        if (tableKey.value) {
            const data = sessionStorage.getItem(`${tableKey.value}-style`);
            if (data) {
                colMap = new Map(Object.entries(JSON.parse(data)));
            }
        }

        props.columnData.value.forEach((data: ColumnData) => {
            if (colMap?.get(data.key)) {
                setColumnWidthByKey(data.key, `${colMap.get(data.key)}`);
                return;
            }
            if (data.width) {
                setColumnWidthByKey(data.key, data.width);
            }
        });
        show.value = false;
        nextTick(() => {
            tableStyle.isFixed = true;
            show.value = true;
        });
    }

    function startDrag(columnKey: string, e: PointerEvent | MouseEvent) {
        dragData.columnKey = columnKey;
        dragData.x = e.clientX;
        dragData.y = e.clientY;
        isDragging.value = true;
    }

    function stopDrag(e: PointerEvent | MouseEvent) {
        if (isDragging.value) {
            const curWidth = parseFloat(tableStyle.columnWidths.get(dragData.columnKey)?.replace('px', '') ?? `${minColumnWidth}`);
            const width = Math.max(curWidth + (e.x - dragData.x), minColumnWidth);
            setColumnWidthByKey(dragData.columnKey, `${width}px`);

            dragData.columnKey = '';
            dragData.x = NaN;
            dragData.y = NaN;
            isDragging.value = false;
        }
    }

    function isTableFixed() {
        return tableStyle.isFixed;
    }

    function switchTable(newTableKey: string | undefined) {
        tableKey.value = newTableKey;
        initTableWidth();
    }

    return {
        initTableWidth,
        isTableFixed,
        getColumnWidthByKey,
        setColumnWidthByKey,
        startDrag,
        stopDrag,
        isDragging,
        show,
        switchTable,
    };
}
