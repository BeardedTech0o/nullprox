import { Html, Head, Main, NextScript } from 'next/document';

// Runs before first paint so the saved (or system) theme never flashes.
const THEME_INIT = `(function(){try{var p=localStorage.getItem('nullprox-theme');var t=p==='light'||p==='dark'?p:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=t;var m=document.querySelector('meta[name=theme-color]');if(m)m.setAttribute('content',t==='dark'?'#0a0a0a':'#ffffff');}catch(e){}})();`;

export default function Document() {
  return (
    <Html lang="en" suppressHydrationWarning>
      <Head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icons/icon-192.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#ffffff" />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="nullprox" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </Head>
      <body className="bg-base">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
