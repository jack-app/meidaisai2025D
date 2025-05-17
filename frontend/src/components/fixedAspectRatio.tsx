import { createSignal, onMount, type JSX } from 'solid-js';
import Align from './Align';

type FixedAspectRatioProps = {
    children: JSX.Element,
    width: number,
    height: number,
}

export default function FixedAspectRatio({children, width, height,}: FixedAspectRatioProps) {
    const ratio = height / width;

    const [getHeight, setHeight] = createSignal(width);
    const [getWidth, setWidth] = createSignal(height);

    let holder!: HTMLDivElement;

    onMount(() => {
        const {width, height} = calc(holder, ratio)
        setWidth(width)
        setHeight(height)
        window.addEventListener('resize', () => {
            const {width, height} = calc(holder, ratio)
            setWidth(width)
            setHeight(height)
        })
    })

    return <div
        ref={holder}
        style={{
            position: 'relative',
            width: '100%',
            height: '100%',
        }}>
            <Align horizontal="center" vertical="center">
                <div 
                    children={children}
                    style={{
                        width: `${getWidth()}px`,
                        height: `${getHeight()}px`,
                        overflow: 'hidden',
                    }}
                />
            </Align>
        </div>
}

function calc(holder: HTMLElement, ratio: number) {
    const maxHeight = holder.clientHeight
    const maxWidth = holder.clientWidth

    let height = maxWidth * ratio
    let width = maxWidth

    if (height > maxHeight) {
        height = maxHeight
        width = maxHeight / ratio
    }

    return {width, height}
}
