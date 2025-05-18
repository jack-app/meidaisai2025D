/* @refresh reload */
import { render } from 'solid-js/web'
import './index.css'

import ViewRoot from './view.tsx'


// solid bootstrap
const root = document.getElementById('root')
render(
    () => <>
        <ViewRoot />
    </>, 
    root!
)
