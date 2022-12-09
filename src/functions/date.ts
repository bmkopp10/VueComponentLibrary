const isoDateFormat = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)((-(\d{2}):(\d{2})|Z)?)$/;
const minimumDate = new Date(1, 1, 1);
const createNewDate = () => new Date();

function isIsoDateString(data: any): boolean {
    return data && typeof data === 'string' && isoDateFormat.test(data);
}

export const normalizeDate = (data: any): any => {
    // Assume a date object was already passed in
    if (typeof data === 'object') {
        return data;
    }

    if (isIsoDateString(data)) {
        // Modern browsers can handle direct conversion from ISO 8601 strings
        return new Date(data);
    }

    return null;
};

// todo what is this?? it seems to be confusing how we add a date of 1/1/1901 instead of just storing nulls in the db.
export const normalizeDateIfMinimum = (data: Date | undefined): Date | null => {
    if (data && data > minimumDate) {
        return data;
    }

    return null;
};

export const normalizeDateIfNull = (data: Date | null) => (data || minimumDate);

export function formatMilitaryTime(date: Date): string {
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
}

export function formatDateUI(date: Date): string {
    if (!date || date.getFullYear() === 1) { // TODO: Prevents crashing when sorting by anything besides ship date
        return '';
    }
    return `${date.getDate()}-${date.toLocaleString('default', { month: 'short' })}-${date.toLocaleString('default', { year: '2-digit' })}`;
}

export function formatDateTimeUI(date: Date): string {
    if (!date || date.getFullYear() === 1) { // TODO: Prevents crashing when sorting by anything besides ship date
        return '';
    }

    return `${formatDateUI(date)} ${formatMilitaryTime(date)}`;
}

export function isSameDay(dateA: Date | string, dateB: Date | string) {
    const dateObjA = new Date(dateA);
    const dateObjB = new Date(dateB);

    return dateObjA.getDate() === dateObjB.getDate()
        && dateObjA.getMonth() === dateObjB.getMonth()
        && dateObjA.getFullYear() === dateObjB.getFullYear();
}

export function getNumberOfDays(start: Date | string, end: Date | string) {
    const date1 = new Date(start);
    const date2 = new Date(end);

    // One day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;

    // Calculating the time difference between two dates
    const diffInTime = date2.getTime() - date1.getTime();

    // Calculating the no. of days between two dates
    return Math.round(diffInTime / oneDay);
}

export function daysBack(days: number): Date {
    const currentDayOfMonth = createNewDate().getDate();
    const difference = currentDayOfMonth - days;
    const previousDay = createNewDate().setDate(difference);
    return new Date(previousDay);
}

export function todayAtMidnight(): Date {
    return new Date(new Date(Date.now()).setHours(0, 0, 0, 0));
}
