/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import Script from "next/script";

// This is used by quill to highlight the code
export function HightLight() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/monokai-sublime.min.css"
      />
      <Script
        strategy="beforeInteractive"
        src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js"
      />
    </>
  );
}
