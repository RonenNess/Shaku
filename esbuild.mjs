import * as esbuild from "esbuild";

const shaderPlugin = {

};

const browserIIFE = () => esbuild.build({
	entryPoints: ["src/index.ts"],
	outfile: "dist/shaku.js",
	format: "iife",
	globalName: "Shaku",
	bundle: true,
	minify: true,
	loader: {
		".vert": "text",
		".frag": "text",
	},
});

await Promise
	.resolve()
	.then(browserIIFE)
	.catch(console.error);
