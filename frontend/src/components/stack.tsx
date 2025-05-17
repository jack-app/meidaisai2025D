import { type JSXElement, type JSX } from 'solid-js'

type StackProps = {
  children: JSX.ArrayElement,
};
/** 
 * 垂直方向にコンポーネントを重ねる．
 * 重ねられるコンポーネントとしては，基本的にStack.Itemを使用する．
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
