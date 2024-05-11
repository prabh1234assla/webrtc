const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

console.log(process.env.APP_ID)
const app_initialization = {
  dev: process.env.NODE_ENV !== "production",
  hostname: "localhost",
  port: process.env.PORT
};

const app = next(app_initialization);
const handle = app.getRequestHandler();

app.prepare().then(() => {

  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;
      if (pathname === '/a')
        await app.render(req, res, '/a', query);
      else if (pathname === '/b')
        await app.render(req, res, '/b', query);
      else
        await handle(req, res, parsedUrl);
    }
    catch (error) {
      console.log("Error occured while handling", req.url, error);
      res.statusCode(500);
      res.end("internal server error");
    }
  }).
    once("error", (error) => {
      console.error(error);
      process.exit(1);
    }).
    listen(app_initialization.port, () => {
      console.log(`> Ready on http://${app_initialization.hostname}:${app_initialization.port}`);
    });

});