import * as esbuild from "esbuild";

/**
 * @type {esbuild.BuildOptions}
 */
const common = {
	entryPoints: ["src/index.ts"],
	bundle: true,
	treeShaking: false,
	loader: {
		".vert": "text",
		".frag": "text",
	},
	tsconfig: "tsconfig.json",
};

const browserIIFE = () => esbuild.build({
	...common,
	outfile: "dist/shaku.js",
	platform: "browser",
	format: "iife",
	globalName: "Shaku",
	minify: false,
});

const browserIIFEMin = () => esbuild.build({
	...common,
	outfile: "dist/shaku.min.js",
	platform: "browser",
	format: "iife",
	globalName: "Shaku",
	minify: true,
});

const esm = () => esbuild.build({
	...common,
	outfile: "dist/shaku.mjs",
	platform: "neutral",
	format: "esm",
});

await Promise
	.resolve()
	.then(browserIIFE)
	.then(browserIIFEMin)
	.then(esm)
	.catch(console.error);
