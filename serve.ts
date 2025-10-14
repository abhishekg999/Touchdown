const BASE_PATH = "./dist";
const PORT = 3000;

Bun.serve({
  port: PORT,
  async fetch(req) {
    let pathname = new URL(req.url).pathname;

    if (pathname === "/") {
      pathname = "/index.html";
    }

    const filePath = BASE_PATH + pathname;
    const file = Bun.file(filePath);

    if (await file.exists()) {
      return new Response(file);
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Server running at http://localhost:${PORT}`);
