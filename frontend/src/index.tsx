/* @refresh reload */
import './index.css'

// firebase bootstrap
// authやfirestoreが必要な場合はconst.tsからインポートして使う．
import { initializeApp } from "firebase/app";
initializeApp({
    projectId: "metype-ffe25",
    apiKey: "AIzaSyA8p4gso3Jo2N00ABARjlBICy471S58PpU"
});

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
