/* @refresh reload */
import './index.css'

// solid bootstrap
import { render } from 'solid-js/web'
import ViewRoot from './view.tsx'
const root = document.getElementById('root')
render(
    () => <>
        <ViewRoot />
    </>, 
    root!
)
