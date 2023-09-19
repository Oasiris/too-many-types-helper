import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Example from './routes/Example'
import Home from './routes/Home'

const MainRoutes: React.FC = () => {
    return (
        <>
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="example/*" element={<Example />} />
                {/* <Route path="/" exact component={Home} /> */}
                {/* <Route path="/" component={NotFound} /> */}
            </Routes>
        </>
    )
}

const App: React.FC = () => {
    return (
        <>
            <Router>
                <MainRoutes />
            </Router>
        </>
    )
}

export default App
