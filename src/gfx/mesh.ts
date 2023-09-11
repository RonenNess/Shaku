import { Color } from "../utils";

/**
 * Class to hold a mesh.
 */
export class Mesh {

	public positions: WebGLBuffer;
	public textureCoords: WebGLBuffer;
	public colors: WebGLBuffer;
	public indices: WebGLBuffer;
	public indicesCount: number;

	private color: Color;

	/**
	 * Create the mesh object.
	 * @param vertices positions buffer.
	 * @param vertices texture coords buffer.
	 * @param vertices colors buffer.
	 * @param indices buffer.
	 * @param how many indices we have.
	 */
	public constructor(positions: WebGLBuffer, textureCoords: WebGLBuffer, colors: WebGLBuffer, indices: WebGLBuffer, indicesCount: number) {
		this.positions = positions;
		this.textureCoords = textureCoords;
		this.colors = colors;
		this.indices = indices;
		this.indicesCount = indicesCount;
		this.color = new Color(-1, -1, -1, -1);
		Object.freeze(this);
	}

	/**
	 * Override the colors buffer, if possible.
	 * @param gl WebGL context.
	 * @param color Color to set.
	 */
	public overrideColors(gl: WebGLRenderingContext, color: Color): void {
		if(color.equals(this.color)) return;
		this.color.copy(color);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.colors);
		const colors = [];
		for(let i = 0; i < this.indicesCount; ++i) {
			colors.push(color.r);
			colors.push(color.g);
			colors.push(color.b);
			colors.push(color.a);
		}
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.DYNAMIC_DRAW);
	}
}
