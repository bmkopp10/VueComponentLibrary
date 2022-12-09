import {
    computed, ComputedRef, Ref, ref, watch,
} from 'vue';

type UseTablePagination = {
    currentPage: Ref<number>,
    firstRowInPaginated: ComputedRef<number>,
    lastRowInPaginated: ComputedRef<number>,
    goToFirstPage: () => void,
    switchTable: (newTableKey: string | undefined) => void;
};

type Props = {
    perPage: number;
    tableKey?: string;
};

export default function useTablePagination(props: Props): UseTablePagination {
    const tableKey = ref(props.tableKey);
    const currentPage = ref(tableKey.value ? parseInt(sessionStorage.getItem(`${tableKey.value}-page`) ?? '1') : 1);

    const firstRowInPaginated = computed((): number => ((currentPage.value - 1) * props.perPage) + 1);

    const lastRowInPaginated = computed((): number => currentPage.value * props.perPage);

    function goToFirstPage() {
        currentPage.value = 1;
    }

    watch(() => currentPage.value, () => {
        if (tableKey.value) {
            sessionStorage.setItem(`${tableKey.value}-page`, currentPage.value.toString());
        }
    });

    function hydrate() {
        if (tableKey.value) {
            currentPage.value = parseInt(sessionStorage.getItem(`${tableKey.value}-page`) ?? '1');
        }
    }

    function switchTable(newTableKey: string | undefined) {
        tableKey.value = newTableKey;
        hydrate();
    }

    return {
        currentPage,
        firstRowInPaginated,
        lastRowInPaginated,
        goToFirstPage,
        switchTable,
    };
}
