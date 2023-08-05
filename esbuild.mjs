import * as esbuild from "esbuild";

/**
 * @type {esbuild.BuildOptions}
 */
const common = {
	entryPoints: ["src/index.ts"],
	bundle: true,
	minify: false,
	treeShaking: false,
	loader: {
		".vert": "text",
		".frag": "text",
	},
};

const browserIIFE = () => esbuild.build({
	...common,
	outfile: "dist/shaku.js",
	format: "iife",
	globalName: "Shaku",
});

const browserESM = () => esbuild.build({
	...common,
	outfile: "dist/shaku.mjs",
	format: "esm",
});

await Promise
	.resolve()
	.then(browserIIFE)
	.then(browserESM)
	.catch(console.error);
