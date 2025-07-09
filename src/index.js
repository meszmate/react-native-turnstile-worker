export default {
  async fetch(request) {
    const params = new URL(request.url).searchParams;

    const html = `
      <!DOCTYPE html>
      <html lang="${params.get("language") || "en"}">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Cloudflare Turnstile</title>
          <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
          <style>
            html, body {
              margin: 0;
              height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: #f8f8f8;
            }
          </style>
        </head>
        <body>
          <div id="cf-turnstile-container"></div>
          <script>
            function postMessage(event, data = null) {
              window.ReactNativeWebView?.postMessage(JSON.stringify({ event, data }));
            }

            window.onload = () => {
              const widgetId = turnstile.render('#cf-turnstile-container', {
                sitekey: '${params.get("sitekey") || ""}',
                action: '${params.get("action") || ""}',
                cData: '${params.get("cData") || ""}',
                theme: '${params.get("theme") || "auto"}',
                language: '${params.get("language") || "en"}',
                tabindex: ${params.get("tabIndex") || 0},
                responseField: ${params.get("responseField") || "undefined"},
                responseFieldName: '${params.get("responseFieldName") || ""}',
                size: '${params.get("size") || "normal"}',
                fixedSize: ${params.get("fixedSize") || "undefined"},
                retry: '${params.get("retry") || "auto"}',
                retryInterval: ${params.get("retryInterval") || 8000},
                refreshExpired: '${params.get("refreshExpired") || ""}',
                appearance: '${params.get("appearance") || ""}',
                execution: '${params.get("execution") || ""}',
                id: '${params.get("id") || ""}',

                callback: token => postMessage('verify', token),
                'expired-callback': () => postMessage('expired'),
                'error-callback': err => postMessage('error', err),
                'timeout-callback': () => postMessage('timeout'),
                'before-interactive-callback': () => postMessage('beforeInteractive'),
                'after-interactive-callback': () => postMessage('afterInteractive'),
                'unsupported-callback': () => postMessage('unsupported')
              });

              postMessage('load', widgetId);
            };
          </script>
        </body>
      </html>
    `;

    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  },
};
