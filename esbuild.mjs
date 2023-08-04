import * as esbuild from "esbuild";

const browserIIFE = () => esbuild.build({
	entryPoints: ["src/index.ts"],
	bundle: true,
	outfile: "dist/shaku.js",
	platform: "browser",
	minify: true,
});

await Promise
	.resolve()
	.then(browserIIFE)
	.catch(console.error);
