import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigation } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/candidates', label: 'Candidates' },
  { to: '/applications', label: 'Applications' },
];

export default function AppLayout() {
  const navigation = useNavigation();
  const [isNavigating, setIsNavigating] = useState(false);

  if (navigation.state === 'loading' && !isNavigating) {
    setIsNavigating(true);
  }

  // Implement the requested artificial delay
  useEffect(() => {
    if (navigation.state === 'idle' && isNavigating) {
      const timer = setTimeout(() => setIsNavigating(false), 1500); // 1.5 second buffer
      return () => clearTimeout(timer);
    }
  }, [navigation.state, isNavigating]);

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-black relative">
      <header className="flex items-center gap-12 border-b border-neutral-200 bg-white px-8 py-5">
        <div className="text-[26px] font-extrabold tracking-wide text-[#7A1315]">
          HIRESYNC
        </div>
        <nav className="flex items-center gap-10">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive
                  ? 'border-b-2 border-[#7A1315] pb-2 text-[15px] font-semibold text-[#7A1315]'
                  : 'text-[15px] font-medium text-neutral-500 hover:text-black'
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      {/* Global Loading Overlay */}
      {isNavigating && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-[#7A1315]"></div>
            <p className="text-sm font-bold tracking-widest text-[#7A1315]">LOADING...</p>
          </div>
        </div>
      )}

      {/* Render the specific page based on the route */}
      <Outlet />
    </div>
  );
}