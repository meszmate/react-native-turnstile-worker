export default {
  async fetch(request) {
    const params = new URL(request.url).searchParams;
    const sitekey = params.get("sitekey");
    if (!sitekey) return new Response("Missing 'sitekey'", { status: 400 });

    const theme = params.get("theme") || "auto";
    const size = params.get("size") || "normal";
    const tabindex = params.get("tabindex") || "0";
    const lang = params.get("lang") || "en";
    const action = params.get("action") || "";
    const cData = params.get("cData") || "";

    const html = `
      <!DOCTYPE html>
      <html lang="${lang}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
        <title>Turnstile</title>
        <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
        <style>body { margin:0; height:100vh; display:flex; align-items:center; justify-content:center; }</style>
      </head>
      <body>
        <div id="cf-turnstile-container"></div>
        <script>
          function postMessage(event, data = null) {
            window.ReactNativeWebView?.postMessage(JSON.stringify({event, data}));
          }

          window.onload = () => {
            const widgetId = turnstile.render('#cf-turnstile-container', {
              sitekey: '${sitekey}',
              theme: '${theme}',
              size: '${size}',
              tabindex: ${tabindex},
              action: '${action}',
              cData: '${cData}',
              callback: token => postMessage('verify', token),
              'expired-callback': () => postMessage('expired'),
              'error-callback': (err) => postMessage('error', err),
              'timeout-callback': () => postMessage('timeout'),
              'before-interactive-callback': () => postMessage('beforeInteractive'),
              'after-interactive-callback': () => postMessage('afterInteractive'),
              'unsupported-callback': () => postMessage('unsupported'),
            });
            postMessage('load', widgetId);
          };
        </script>
      </body>
      </html>
    `;

    return new Response(html, { headers: { "Content-Type": "text/html" } });
  }
};
