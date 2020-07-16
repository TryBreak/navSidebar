const Koa = require("koa");
const path = require("path");
const staticServe = require("koa-static");
const app = new Koa();

//设置静态资源的路径
const staticPath = "./src";

app.use(staticServe(path.join(__dirname, staticPath)));

app.use(async (ctx) => {
  ctx.body = '<a href="/demo.html">go demo.html</a>';
});

const port = 8765;

app.listen(port, "0.0.0.0", () => {
  console.log(
    `服务已经启动,请在浏览器中输入 http://localhost:${port}/demo.html`
  );
});
