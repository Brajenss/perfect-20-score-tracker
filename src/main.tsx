
import { createRoot } from 'react-dom/client'
import './index.css'

// Lazy load the App component for code splitting
const App = lazy(() => import('./App.tsx'));

import { lazy, Suspense } from 'react';

// Simple loading component for instant display
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-lg font-semibold text-gray-700">Loading Perfect 20...</p>
    </div>
  </div>
);

// Add error handling for deployment
const container = document.getElementById("root");

if (!container) {
  console.error("Root container not found. Make sure there's a div with id='root' in your HTML.");
} else {
  try {
    const root = createRoot(container);
    root.render(
      <Suspense fallback={<LoadingSpinner />}>
        <App />
      </Suspense>
    );
    
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
