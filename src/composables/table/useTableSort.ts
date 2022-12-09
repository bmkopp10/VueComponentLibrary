import {
    onBeforeMount, onBeforeUnmount, Ref, ref,
} from 'vue';

type SortDirection = 'ascending' | 'descending';

export type TableSortObject = {
    key: string | Array<string>;
    direction: SortDirection
};

type UseTableSort = {
    resetSort: () => void;
    handleSort: (key: string) => void;
    sortDirection: (key: string) => SortDirection | 'none';
    sortPosition: (key: string) => number | null;
    sortArray: Ref<Array<TableSortObject>>
    switchTable: (newTableKey: string | undefined) => void;
};

type Props = {
    tableKey?: string,
    defaultSort?: Array<TableSortObject>
};

export default function useTableSort(props: Props): UseTableSort {
    const sortArray = ref<Array<TableSortObject>>(props.defaultSort ? [...props.defaultSort] : []);
    const shiftHold = ref(false);
    const tableKey = ref(props.tableKey);

    function keyDown(e: KeyboardEvent) {
        if (e.key === 'Shift') {
            shiftHold.value = true;
        }
    }

    function keyUp(e: KeyboardEvent) {
        if (e.key === 'Shift') {
            shiftHold.value = false;
        }
    }

    function hydrate() {
        if (tableKey.value) {
            const data = sessionStorage.getItem(`${tableKey.value}-sort`);
            if (data) {
                sortArray.value = JSON.parse(data);
            }
        }
    }

    onBeforeMount(() => {
        window.addEventListener('keydown', keyDown);
        window.addEventListener('keyup', keyUp);
        hydrate();
    });

    onBeforeUnmount(() => {
        window.removeEventListener('keydown', keyDown);
        window.removeEventListener('keyup', keyUp);
    });

    function resetSort() {
        sortArray.value.length = 0;
    }

    function checkEqualKeys(keyA: string | Array<string>, keyB: string | Array<string>): boolean {
        if (keyA === keyB) {
            return true;
        }

        if (Array.isArray(keyA) && Array.isArray(keyB)) {
            return keyA.every((val, index) => val === keyB[index]);
        }

        return false;
    }

    function handleSort(key: string | Array<string>) {
        if (shiftHold.value) {
            const index = sortArray.value.findIndex((obj) => (checkEqualKeys(obj.key, key)));
            if (index > -1) {
                if (sortArray.value[index].direction === 'ascending') {
                    sortArray.value[index].direction = 'descending';
                } else {
                    sortArray.value[index].direction = 'ascending';
                }
            } else {
                sortArray.value.push({
                    key,
                    direction: 'descending',
                });
            }
        } else if (sortArray.value.length === 1) {
            // if it's already included, flip the direction or remove
            if (checkEqualKeys(sortArray.value[0].key, key)) {
                if (sortArray.value[0].direction === 'descending') {
                    sortArray.value[0].direction = 'ascending';
                } else {
                    sortArray.value[0].direction = 'descending';
                }
            } else {
                const sortObj: TableSortObject = {
                    key,
                    direction: 'descending',
                };
                sortArray.value = [sortObj];
            }
        } else {
            // if not holding shift and it's empty or has multiples, clear array and set it
            const sortObj: TableSortObject = {
                key,
                direction: 'descending',
            };

            sortArray.value = [sortObj];
        }
        if (tableKey.value) {
            sessionStorage.setItem(`${tableKey.value}-sort`, JSON.stringify(sortArray.value));
        }
    }

    function sortDirection(key: string | Array<string>): 'ascending' | 'descending' | 'none' {
        const sortObj = sortArray.value.find((obj) => checkEqualKeys(obj.key, key));
        if (sortObj) return sortObj.direction;
        return 'none';
    }

    function sortPosition(key: string): number | null {
        const index = sortArray.value.findIndex((obj) => obj.key === key);
        if (index >= 0) return index + 1;
        return null;
    }

    function switchTable(newTableKey: string | undefined) {
        tableKey.value = newTableKey;
        hydrate();
    }

    return {
        resetSort,
        handleSort,
        sortDirection,
        sortPosition,
        sortArray,
        switchTable,
    };
}
