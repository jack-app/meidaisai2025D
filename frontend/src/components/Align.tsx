import { type JSXElement } from "solid-js"

type AlignProps = {
    children: JSXElement,
    horizontal: 'left' | 'center' | 'right',
    vertical: 'top' | 'center' | 'bottom',
}
export default function Align({children, horizontal, vertical,}: AlignProps) {
    return <div
        style={{
            width: '100%',
            height: '100%',
            "place-content": horizontal,
            "place-items": vertical,
        }}
    >
        {children}
    </div>
}