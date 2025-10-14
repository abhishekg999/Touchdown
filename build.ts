import { cp, mkdir, rm } from "node:fs/promises";

const outdir = "./dist";

async function build() {
  console.log("Building Touchdown...");

  try {
    console.log("Cleaning dist directory...");
    await rm(outdir, { recursive: true, force: true });
    await mkdir(outdir, { recursive: true });

    console.log("Bundling application...");
    const result = await Bun.build({
      entrypoints: ["./src/index.html"],
      outdir,
      sourcemap: "external",
      target: "browser",
      minify: true,
      splitting: true,
    });

    if (!result.success) {
      console.error("Build failed:");
      for (const log of result.logs) {
        console.error(log);
      }
      process.exit(1);
    }

    console.log("Copying public assets...");
    await cp("./public", outdir, { recursive: true });

    console.log("Build complete!");
    console.log(`Output: ${outdir}`);
    console.log(`Files: ${result.outputs.length} bundles`);
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

build();
