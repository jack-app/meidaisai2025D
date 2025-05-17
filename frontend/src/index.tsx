/* @refresh reload */
import { render } from 'solid-js/web'
import './index.css'
import ViewRoot from './view.tsx'

import './const.ts'

// solid bootstrap
const root = document.getElementById('root')
render(() => <ViewRoot />, root!)
