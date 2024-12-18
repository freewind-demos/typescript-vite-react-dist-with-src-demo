import React from 'react'
import ReactDOM from 'react-dom/client'
import sayHello from '@packages/utils/hello'

function App() {
    return (
        <div>
            <h1>{sayHello('World')}</h1>
        </div>
    )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
) 