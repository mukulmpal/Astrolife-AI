"use client";

import Script from "next/script";

export function Analytics() {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";

  return (
    <>
      {posthogKey && (
        <>
          <Script id="posthog-init" strategy="afterInteractive">
            {`
              !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags reloadFeatureFlags".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
              posthog.init(${JSON.stringify(posthogKey)}, { api_host: ${JSON.stringify(posthogHost)}, capture_pageview: true });
            `}
          </Script>
        </>
      )}
      <Script id="astrolife-client-monitoring" strategy="afterInteractive">
        {`
          (() => {
            const send = (payload) => {
              try {
                navigator.sendBeacon && navigator.sendBeacon('/api/monitor/client-error', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
              } catch {}
            };
            window.addEventListener('error', (event) => send({
              type: 'error',
              message: event.message,
              source: event.filename,
              line: event.lineno,
              column: event.colno,
              path: location.pathname
            }));
            window.addEventListener('unhandledrejection', (event) => send({
              type: 'unhandledrejection',
              message: String(event.reason && (event.reason.message || event.reason)),
              path: location.pathname
            }));
          })();
        `}
      </Script>
    </>
  );
}
