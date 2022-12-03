import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import ThemeProvider, { FixedGlobalStyle, ThemedGlobalStyle } from './theme'

import App from './pages/App'

const Index: React.FC = () => (
    <StrictMode>
        <FixedGlobalStyle />
        <ThemeProvider>
            <ThemedGlobalStyle />
            <App />
        </ThemeProvider>
    </StrictMode>
)

const container = document.getElementById('app');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(<Index />);
