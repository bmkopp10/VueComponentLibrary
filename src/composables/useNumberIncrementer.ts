import { onBeforeUnmount } from 'vue';

type Props = {
    changeCallback: (val: number) => void
};

type UseNumberIncrementer = {
    numberChange: (val: number) => void;
    stop: () => void;
};

export default function useNumberIncrementer(props: Props): UseNumberIncrementer {
    let interval: NodeJS.Timer | undefined = undefined;
    const speeds = [250, 200, 150, 100, 50, 25, 5];
    let counter = 0;

    function stop() {
        clearInterval(interval);
        interval = undefined;
        counter = 0;
    }

    function stopAndStart(val: number, sp: number) {
        clearInterval(interval);
        interval = undefined;
        interval = setInterval(() => changerHelper(val), speeds[sp]);
    }

    function changerHelper(val: number) {
        props.changeCallback(val);
        counter++;
        if (counter === 5) {
            stopAndStart(val, 1);
        }
        if (counter === 15) {
            stopAndStart(val, 2);
        }
        if (counter === 25) {
            stopAndStart(val, 3);
        }
        if (counter === 40) {
            stopAndStart(val, 4);
        }
        if (counter === 50) {
            stopAndStart(val, 5);
        }
        if (counter === 100) {
            stopAndStart(val, 6);
        }
    }

    function numberChange(val: number) {
        props.changeCallback(val);

        if (!interval) {
            interval = setInterval(() => changerHelper(val), speeds[0]);
        }
    }

    onBeforeUnmount(() => stop());

    return {
        numberChange,
        stop,
    };
}
