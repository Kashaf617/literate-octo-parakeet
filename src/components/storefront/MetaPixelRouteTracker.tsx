"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, Suspense } from "react";

function RouteTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip initial page load because the server inline script fires the first PageView
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Fire PageView on client-side route changes for both pixel accounts
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("trackSingle", "1598075851656701", "PageView");
      window.fbq("trackSingle", "1579772036918681", "PageView");
    }
  }, [pathname, searchParams]);

  return null;
}

export default function MetaPixelRouteTracker() {
  return (
    <Suspense fallback={null}>
      <RouteTrackerInner />
    </Suspense>
  );
}
