import { type JSXElement, type JSX } from 'solid-js'

type StackProps = {
  children: JSX.ArrayElement,
};
/**
 * このコンポーネントは、子要素をZ軸方向（重なり順）に重ねて配置します。
 * 通常はStack.Itemコンポーネントと組み合わせて使用し、各要素を絶対配置で重ねます。
 * 
 * 使い方例:
 * 
 * ```tsx
 * <Stack>
 *   <Stack.Item>背面の要素</Stack.Item>
 *   <Stack.Item>前面の要素</Stack.Item>
 * </Stack>
 * ```
 * 
 * Stack.Itemのstyleプロパティを使うことで、各要素の位置やサイズを個別に調整できます。
 * 
 * 配置順について:
 * 上に記述したStack.Itemほど背面に、下に記述したStack.Itemほど前面に表示されます。
 * つまり、リストの後ろに書いた要素ほど手前に表示されます。
 */
export default function Stack({children,}: StackProps) {
  return <div 
    style={{
      position: 'relative',
      width: '100%',
      height: '100%',
    }}
  >
    {children}
  </div>
}

type StackItemProps = {
  children: JSXElement,
  style?: JSX.CSSProperties,
};
Stack.Item = function ({children, style}: StackItemProps) {
  return <div 
    style={{
      position: 'absolute',
      ...(style ?? {
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      })
    }}
  >
    {children}
  </div>
}
