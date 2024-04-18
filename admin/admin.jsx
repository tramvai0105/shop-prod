import './admin.css'
import React from 'react'
import { createRoot } from 'react-dom/client';
import AdminPanel from "./AdminPanel.tsx"

const root = createRoot(document.getElementById('root'));
root.render(<AdminPanel />);
