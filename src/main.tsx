import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

import './styles/lib/normalize.css'
import './styles/lib/bootstrap-grid.min.css'
import './styles/index.scss'
import './styles/global.scss'
import './styles/_alerts.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
