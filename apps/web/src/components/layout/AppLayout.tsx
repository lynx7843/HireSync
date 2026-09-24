import { NavLink, Outlet } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/candidates', label: 'Candidates' },
  { to: '/applications', label: 'Applications' },
];

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-black">
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

      {/* Render the specific page based on the route */}
      <Outlet />
    </div>
  );
}