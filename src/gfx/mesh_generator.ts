import Mesh from "./mesh";

/**
 * Utility class to generate meshes.
 * @private
 */
class MeshGenerator {
	/**
	 * Create the mesh generator.
	 */
	constructor(gl) {
		this._gl = gl;
	}

	/**
	 * Generate and return a textured quad.
	 * @returns {Mesh} Quad mesh.
	 */
	quad() {
		const gl = this._gl;

		const positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		let x = 0.5; // <- 0.5 so total size would be 1x1
		const positions = [
			-x, -x, 0,
			x, -x, 0,
			-x, x, 0,
			x, x, 0,
		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

		const textureCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
		const textureCoordinates = [
			0.0, 0.0,
			1.0, 0.0,
			0.0, 1.0,
			1.0, 1.0,
		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

		const colorsBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
		const colors = [
			1, 1, 1, 1,
			1, 1, 1, 1,
			1, 1, 1, 1,
			1, 1, 1, 1,
		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.DYNAMIC_DRAW);

		const indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		const indices = [
			0, 1, 3, 2
		];
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

		return new Mesh(positionBuffer, textureCoordBuffer, colorsBuffer, indexBuffer, indices.length);
	}
}

// export the meshes generator.
export default MeshGenerator;
