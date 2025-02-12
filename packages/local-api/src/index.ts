import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "path";
import { createCellsRouter } from "./routes/cells";
import { create } from "domain";

export const serve = (
  port: number,
  filename: string,
  dir: string,
  useProxy: boolean
) => {
  const app = express();

  app.use(createCellsRouter(filename, dir));

  if (useProxy) {
    app.use(
      createProxyMiddleware({
        target: "http://localhost:3000",
        ws: true,
      })
    );
  } else {
    const packagePath = require.resolve(
      "@mkeditorjs/local-client/build/index.html"
    );
    app.use(express.static(path.dirname(packagePath)));
  }

  app.listen(port, () => {
    console.log("Listening on port", port);
  });
};
