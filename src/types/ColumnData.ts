import {UseUnitOfMeasure} from "@/measurement/types";

export type ColumnData = {
    key: string;
    index: number;
    label?: string;
    width?: string | null;
    uom?: UseUnitOfMeasure;
    headerBadge?: any;
    align: 'left' | 'center' | 'right';
};
