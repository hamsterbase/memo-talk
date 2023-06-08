import Koa from "koa";
import Router from "@koa/router";
import fs from "fs/promises";
import path from "path";
import koaBody from "koa-body";

const app = new Koa();
const router = new Router();

const DATA_FOLDER = "data";

// 获取文件列表
router.get("/public/api/v1/folder", async (ctx) => {
  const { folder } = ctx.request.body;
  const folderPath = path.join(DATA_FOLDER, folder);
  try {
    const files = await fs.readdir(folderPath);
    ctx.body = files;
  } catch (err) {
    if (err.code === "ENOENT") {
      ctx.status = 404;
      ctx.body = "Folder Not Found";
    } else {
      ctx.status = 500;
      ctx.body = "Internal Server Error";
      console.error(err);
    }
  }
});

// 获取文件内容
router.get("/public/api/v1/file", async (ctx) => {
  const { folder, file } = ctx.request.body;
  const filePath = path.join(DATA_FOLDER, folder, file);
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    ctx.body = fileContent;
  } catch (err) {
    if (err.code === "ENOENT") {
      ctx.status = 404;
      ctx.body = "File Not Found";
    } else {
      ctx.status = 500;
      ctx.body = "Internal Server Error";
      console.error(err);
    }
  }
});

// 删除文件
router.del("/public/api/v1/file", async (ctx) => {
  const { folder, file } = ctx.request.body;
  const filePath = path.join(DATA_FOLDER, folder, file);
  try {
    await fs.unlink(filePath);
    ctx.body = "File Deleted";
  } catch (err) {
    if (err.code === "ENOENT") {
      ctx.status = 404;
      ctx.body = "File Not Found";
    } else {
      ctx.status = 500;
      ctx.body = "Internal Server Error";
      console.error(err);
    }
  }
});

// 写入文件
router.post(
  "/public/api/v1/file",
  koaBody({ multipart: true, formidable: { maxFileSize: 1024 * 1024 } }),
  async (ctx) => {
    const { folder, file, content } = ctx.request.body;
    const filePath = path.join(DATA_FOLDER, folder, file);
    try {
      await fs.mkdir(path.join(DATA_FOLDER, folder), { recursive: true });
      await fs.writeFile(filePath, content);
      ctx.body = "File Created";
    } catch (err) {
      ctx.status = 500;
      ctx.body = "Internal Server Error";
      console.error(err);
    }
  }
);

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});