export default {
  async fetch(request) {
    const p = new URL(request.url).searchParams;

    const s = (key, fallback) => {
      const v = p.get(key);
      return v === null || v === '' ? fallback : v;
    };
    const n = (key, fallback) => {
      const v = p.get(key);
      return v === null || v === '' ? fallback : Number(v);
    };
    const b = (key, fallback) => {
      const v = p.get(key);
      return v === null || v === '' ? fallback : v === 'true';
    };

		const options = {
			sitekey: s('sitekey', ''),
			theme: s('theme', 'auto'),
			language: s('language', 'en'),
			size: s('size', 'normal'),
			tabindex: n('tabIndex', 0),
			retry: s('retry', 'auto'),
			retryInterval: n('retryInterval', 8000),
			...(s('action') && { action: s('action') }),
			...(s('cData') && { cData: s('cData') }),
			...(s('appearance') && { appearance: s('appearance') }),
			...(s('refreshExpired') && { refreshExpired: s('refreshExpired') }),
			...(s('execution') && { execution: s('execution') }),
			...(s('responseField') && { responseField: b('responseField') }),
			...(s('responseFieldName') && { responseFieldName: s('responseFieldName') }),
			...(s('id') && { id: s('id') }),
		};

		const html = `
<!DOCTYPE html>
<html lang="${options.language}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cloudflare Turnstile</title>
    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
    <style>
      html,body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#f8f8f8}
    </style>
  </head>
  <body>
    <div id="cf-turnstile-container"></div>
    <script>
      function post(event, data = null) {
        window.ReactNativeWebView?.postMessage(JSON.stringify({ event, data }));
      }
      window.onload = () => {
        const widgetId = turnstile.render('#cf-turnstile-container', {
          ...${JSON.stringify(options)},
          callback: token => post('verify', token),
          'expired-callback': () => post('expired'),
          'error-callback': err => post('error', err),
          'timeout-callback': () => post('timeout'),
          'before-interactive-callback': () => post('beforeInteractive'),
          'after-interactive-callback': () => post('afterInteractive'),
          'unsupported-callback': () => post('unsupported')
        });
        post('load', widgetId);
      };
    </script>
  </body>
</html>`;

    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  },
};
