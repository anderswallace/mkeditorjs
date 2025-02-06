import { useEffect, useRef } from "react";
import "./preview.css";

interface PreviewProps {
  code: string;
  bundleError: string;
}

const html = `
    <html>
      <head>
        <style>html { background-color: white; }</style>
      </head>
      <body>
        <div id="root"></div>
        <script>
          const handleError = (err) => {
            const root = document.querySelector("#root");
            root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
            console.error(err);
          };

          window.addEventListener('error', (event) => {
            event.preventDefault();
            handleError(event.error);
          });

          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch (err) {
              handleError(err);
            }
          }, false);
        </script>
      </body>
    </html>
  `;

const Preview: React.FC<PreviewProps> = ({ code, bundleError }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    const handleLoad = () => {
      iframe.current.contentWindow.postMessage(code, "*");
    };

    const iframeElement = iframe.current;
    iframeElement.onload = handleLoad;

    // cleanup for onload listener
    return () => {
      iframeElement.onload = null;
    };
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        title="preview"
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
      />
      {bundleError && <div className="preview-error">{bundleError}</div>}
    </div>
  );
};

export default Preview;
