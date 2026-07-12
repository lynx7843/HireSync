import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';

// Import your existing skeletons
import HireSyncDashboard from './features/Dashboard';
import HireSyncCandidates from './features/Candidates';
import HireSyncAddCandidate from './features/AddCandidate';
import HireSyncCandidateProfile from './features/CandidateProfile';
import HireSyncApplications from './features/Applications';
import HireSyncApplicationDetail from './features/ApplicationDetail';

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      // Default route redirects to dashboard
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <HireSyncDashboard /> },
      
      // Candidates Domain
      { path: "candidates", element: <HireSyncCandidates /> },
      { path: "candidates/new", element: <HireSyncAddCandidate /> },
      { path: "candidates/:id", element: <HireSyncCandidateProfile /> },
      
      // Applications Domain
      { path: "applications", element: <HireSyncApplications /> },
      { path: "applications/:id", element: <HireSyncApplicationDetail /> },
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;