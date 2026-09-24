import { createBrowserRouter, RouterProvider, Navigate, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';

// Import your existing skeletons
import HireSyncLogin from './features/Login';
import HireSyncDashboard from './features/Dashboard';
import HireSyncCandidates from './features/Candidates';
import HireSyncAddCandidate from './features/AddCandidate';
import HireSyncCandidateProfile from './features/CandidateProfile';
import HireSyncApplications from './features/Applications';
import HireSyncAddApplication from './features/AddApplication';
import HireSyncApplicationDetail from './features/ApplicationDetail';

function RouteError() {
  const error = useRouteError();
  console.error(error);
  return (
    <div role="alert" style={{ padding: '2rem' }}>
      <h2>Something went wrong</h2>
      <p>
        {isRouteErrorResponse(error) && error.status === 404
          ? 'Page not found.'
          : 'An unexpected error occurred. Please try again.'}
      </p>
      <a href="/dashboard">Back to dashboard</a>
    </div>
  );
}

const router = createBrowserRouter([
  { path: "/login", element: <HireSyncLogin />, errorElement: <RouteError /> },
  {
    path: "/",
    element: <AppLayout />,
    // Top-level safety net (e.g. if the layout itself fails)
    errorElement: <RouteError />,
    children: [
      {
        // Pathless route: errors render inside the layout instead of replacing it
        errorElement: <RouteError />,
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
          { path: "applications/new", element: <HireSyncAddApplication /> },
          { path: "applications/:id", element: <HireSyncApplicationDetail /> },
        ],
      },
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;