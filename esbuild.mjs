import * as esbuild from "esbuild";

const browserIIFE = () => esbuild.build({
	entryPoints: ["src/index.ts"],
	bundle: true,
	outfile: "dist/index.js",
	platform: "browser",
});

await Promise
	.resolve()
	.then(browserIIFE)
	.catch(console.error);
