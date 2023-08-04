

const { Color } = require("../utils");

/**
 * Class to hold a mesh.
 */
class Mesh {
	/**
	 * Create the mesh object.
	 * @param {WebGLBuffer} positions vertices positions buffer.
	 * @param {WebGLBuffer} textureCoords vertices texture coords buffer.
	 * @param {WebGLBuffer} colorss vertices colors buffer.
	 * @param {WebGLBuffer} indices indices buffer.
	 * @param {Number} indicesCount how many indices we have.
	 */
	constructor(positions, textureCoords, colorsBuffer, indices, indicesCount) {
		this.positions = positions;
		this.textureCoords = textureCoords;
		this.colors = colorsBuffer;
		this.indices = indices;
		this.indicesCount = indicesCount;
		this.__color = new Color(-1, -1, -1, -1);
		Object.freeze(this);
	}

	/**
	 * Override the colors buffer, if possible.
	 * @param {WebGl} gl WebGL context.
	 * @param {Color} color Color to set.
	 */
	overrideColors(gl, color) {
		if(color.equals(this.__color)) { return; }
		this.__color.copy(color);

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

// export the mesh class.
export default Mesh;
