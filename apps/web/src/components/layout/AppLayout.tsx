import { useState, useEffect } from 'react';
import { Outlet, useNavigation } from 'react-router-dom';

export default function AppLayout() {
  const navigation = useNavigation();
  const [isNavigating, setIsNavigating] = useState(false);

  // Implement the requested artificial delay
  useEffect(() => {
    if (navigation.state === 'loading') {
      setIsNavigating(true);
    } else if (navigation.state === 'idle' && isNavigating) {
      const timer = setTimeout(() => setIsNavigating(false), 1500); // 1.5 second buffer
      return () => clearTimeout(timer);
    }
  }, [navigation.state, isNavigating]);

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-black relative">
      {/* NOTE: In a full refactor, you would extract your custom headers 
        from the individual files and put a unified global header here using <Link> tags.
        For this phase, we will just render your existing pages exactly as they are via Outlet.
      */}
      
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