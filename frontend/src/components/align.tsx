import { type JSXElement } from "solid-js"

type AlignProps = {
    children: JSXElement,
    horizontal: 'left' | 'center' | 'right',
    vertical: 'top' | 'center' | 'bottom',
}

/**
 * 子要素を指定した水平方向（left, center, right）および垂直方向（top, center, bottom）に揃えて配置するコンポーネントです。
 *
 * @param children 配置する子要素
 * @param horizontal 水平方向の揃え位置（'left' | 'center' | 'right'）
 * @param vertical 垂直方向の揃え位置（'top' | 'center' | 'bottom'）
 */
export default function Align(prop: AlignProps) {
    return <div
        style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            "justify-content": prop.horizontal,
            "align-items": prop.vertical,
            "place-content": prop.horizontal,
            "place-items": prop.vertical,
        }}
    >
        {prop.children}
    </div>
}