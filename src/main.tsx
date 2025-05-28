
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add error handling for deployment
const container = document.getElementById("root");

if (!container) {
  console.error("Root container not found. Make sure there's a div with id='root' in your HTML.");
} else {
  try {
    const root = createRoot(container);
    root.render(<App />);
    
    // Hide loading indicator if it exists
    const loading = document.getElementById('loading');
    if (loading) {
      loading.style.display = 'none';
    }
  } catch (error) {
    console.error("Error initializing React app:", error);
    container.innerHTML = `
      <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif; color: #d32f2f;">
        <h1>Error Loading Game</h1>
        <p>There was an error loading the Perfect 20 game. Please refresh the page or contact support.</p>
        <details>
          <summary>Error Details</summary>
          <pre>${error}</pre>
        </details>
      </div>
    `;
  }
}
