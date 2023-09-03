import { Vertex } from "../gfx";
import { Vector2, Vector3 } from "./shapes";

const EPSILON = Number.EPSILON;

/**
 * Implements a matrix.
 */
export class Matrix {
	public static readonly identity = new Matrix([
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1,
	], false);

	public values: number[] | Float32Array;

	/**
	 * Create the matrix.
	 * @param values matrix values array.
	 * @param cloneValues if true or undefined, will clone values instead of just holding a reference to them.
	 */
	public constructor(values: number[], cloneValues: boolean) {
		// if no values are set, use identity
		if(!values) {
			values = Matrix.identity.values;
			cloneValues = true;
		}

		// clone values
		if(cloneValues || cloneValues === undefined) this.values = values.slice(0);
		// copy values reference
		else this.values = values;
	}

	/**
	 * Set the matrix values.
	 */
	public set(
		v11: number, v12: number, v13: number, v14: number,
		v21: number, v22: number, v23: number, v24: number,
		v31: number, v32: number, v33: number, v34: number,
		v41: number, v42: number, v43: number, v44: number,
	) {
		this.values = new Float32Array([
			v11, v12, v13, v14,
			v21, v22, v23, v24,
			v31, v32, v33, v34,
			v41, v42, v43, v44,
		]);
	}

	/**
	 * Clone the matrix.
	 * @returns Cloned matrix.
	 */
	public clone(): Matrix {
		const ret = new Matrix(this.values, true);
		return ret;
	}

	/**
	 * Compare this matrix to another matrix.
	 * @param other Matrix to compare to.
	 * @returns If matrices are the same.
	 */
	public equals(other: Matrix): boolean {
		if(other === this) return true;
		if(!other) return false;
		for(let i = 0; i < this.values.length; ++i) {
			if(this.values[i] !== other.values[i]) return false;
		}
		return true;
	}

	/**
	 * Clone and invert the matrix.
	 * @returns Cloned inverted matrix.
	 */
	public inverted(): Matrix {
		return this.clone().invertSelf();
	}

	/**
	 * Invert this matrix.
	 * @returns Self.
	 */
	public invertSelf(): Matrix {
		// based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
		const te = this.values,

			n11 = te[0], n21 = te[1], n31 = te[2], n41 = te[3],
			n12 = te[4], n22 = te[5], n32 = te[6], n42 = te[7],
			n13 = te[8], n23 = te[9], n33 = te[10], n43 = te[11],
			n14 = te[12], n24 = te[13], n34 = te[14], n44 = te[15],

			t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
			t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
			t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
			t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;

		const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;

		if(det === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

		const detInv = 1 / det;

		te[0] = t11 * detInv;
		te[1] = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * detInv;
		te[2] = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * detInv;
		te[3] = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * detInv;

		te[4] = t12 * detInv;
		te[5] = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv;
		te[6] = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv;
		te[7] = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv;

		te[8] = t13 * detInv;
		te[9] = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv;
		te[10] = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv;
		te[11] = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv;

		te[12] = t14 * detInv;
		te[13] = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * detInv;
		te[14] = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * detInv;
		te[15] = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * detInv;

		return this;
	}

	/**
	 * Transform a target.
	 * @param target Transforms a target, that can be vector2, vector3, or vertex.
	 * @returns Transformed result.
	 */
	public transform(target: Vector2): Vector2;
	public transform(target: Vector3): Vector3;
	public transform(target: Vertex): Vertex;
	public transform(target: Vector2 | Vector3 | Vertex): Vector2 | Vector3 | Vertex {
		if(target instanceof Vector2) return Matrix.transformVector2(this, target);
		if(target instanceof Vector3) return Matrix.transformVector3(this, target);
		if(target instanceof Vertex) return Matrix.transformVertex(this, target);
		throw new Error("Unknown type to transform!");
	}

	/**
	 * Multiply this matrix with another matrix, putting results in self.
	 * @param other Matrix to multiply with.
	 * @returns This.
	 */
	public multiplySelfWith(other: Matrix): Matrix {
		return Matrix.multiplyIntoFirst(this, other);
	}

	/**
	 * Multiply this matrix with another matrix and return a new result matrix.
	 * @param other Matrix to multiply with.
	 * @returns New result matrix.
	 */
	public multiplyWith(other: Matrix): Matrix {
		return Matrix.multiply(this, other);
	}

	/**
	 * Create an orthographic projection matrix.
	 * @returns a new matrix with result.
	 */
	public static createOrthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix {
		return new Matrix([
			2 / (right - left), 0, 0, 0,
			0, 2 / (top - bottom), 0, 0,
			0, 0, 2 / (near - far), 0,

			(left + right) / (left - right),
			(bottom + top) / (bottom - top),
			(near + far) / (near - far),
			1,
		], false);
	}

	/**
	 * Create a perspective projection matrix.
	 * @returns a new matrix with result.
	 */
	public static createPerspective(fieldOfViewInRadians: number, aspectRatio: number, near: number, far: number): Matrix {
		const f = 1.0 / Math.tan(fieldOfViewInRadians / 2);
		const rangeInv = 1 / (near - far);

		return new Matrix([
			f / aspectRatio, 0, 0, 0,
			0, f, 0, 0,
			0, 0, (near + far) * rangeInv, -1,
			0, 0, near * far * rangeInv * 2, 0,
		], false);
	}

	/**
	 * Create a translation matrix.
	 * @returns a new matrix with result.
	 */
	public static createTranslation(x = 0, y = 0, z = 0): Matrix {
		return new Matrix([
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			x || 0, y || 0, z || 0, 1,
		], false);
	}

	/**
	 * Create a scale matrix.
	 * @returns a new matrix with result.
	 */
	public static createScale(x = 1, y = 1, z = 1): Matrix {
		return new Matrix([
			x, 0, 0, 0,
			0, y, 0, 0,
			0, 0, z, 0,
			0, 0, 0, 1,
		], false);
	}

	/**
	 * Create a rotation matrix around X axis.
	 * @returns a new matrix with result.
	 */
	public static createRotationX(a: number): Matrix {
		const sin = Math.sin;
		const cos = Math.cos;
		return new Matrix([
			1, 0, 0, 0,
			0, cos(a), -sin(a), 0,
			0, sin(a), cos(a), 0,
			0, 0, 0, 1,
		], false);
	}

	/**
	 * Create a rotation matrix around Y axis.
	 * @returns a new matrix with result.
	 */
	public static createRotationY(a: number): Matrix {
		const sin = Math.sin;
		const cos = Math.cos;
		return new Matrix([
			cos(a), 0, sin(a), 0,
			0, 1, 0, 0,
			-sin(a), 0, cos(a), 0,
			0, 0, 0, 1,
		], false);
	}

	/**
	 * Create a rotation matrix around Z axis.
	 * @returns a new matrix with result.
	 */
	public static createRotationZ(a: number): Matrix {
		const sin = Math.sin;
		const cos = Math.cos;
		return new Matrix([
			cos(a), -sin(a), 0, 0,
			sin(a), cos(a), 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1,
		], false);
	}

	/**
	 * Multiply two matrices.
	 * @returns a new matrix with result.
	 */
	public static multiply(matrixA: Matrix, matrixB: Matrix): Matrix {
		// Slice the second matrix up into rows
		const row0 = [matrixB.values[0], matrixB.values[1], matrixB.values[2], matrixB.values[3]];
		const row1 = [matrixB.values[4], matrixB.values[5], matrixB.values[6], matrixB.values[7]];
		const row2 = [matrixB.values[8], matrixB.values[9], matrixB.values[10], matrixB.values[11]];
		const row3 = [matrixB.values[12], matrixB.values[13], matrixB.values[14], matrixB.values[15]];

		// Multiply each row by matrixA
		const result0 = multiplyMatrixAndPoint(matrixA.values, row0);
		const result1 = multiplyMatrixAndPoint(matrixA.values, row1);
		const result2 = multiplyMatrixAndPoint(matrixA.values, row2);
		const result3 = multiplyMatrixAndPoint(matrixA.values, row3);

		// Turn the result rows back into a single matrix
		return new Matrix([
			result0[0], result0[1], result0[2], result0[3],
			result1[0], result1[1], result1[2], result1[3],
			result2[0], result2[1], result2[2], result2[3],
			result3[0], result3[1], result3[2], result3[3],
		], false);
	}

	/**
	 * Creates a look-at matrix - a matrix rotated to look at a given position.
	 * @param eyePosition Eye position.
	 * @param targetPosition Position the matrix should look at.
	 * @param upVector Optional vector representing "up" direction.
	 * @returns a new matrix with result.
	 */
	public static createLookAt(eyePosition: Vector3, targetPosition: Vector3, upVector?: Vector3): Matrix {
		const eye = eyePosition;
		const center = targetPosition;
		const up = upVector || Vector3.upReadonly;
		let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
		if(
			Math.abs(eye.x - center.x) < EPSILON &&
			Math.abs(eye.y - center.y) < EPSILON &&
			Math.abs(eye.z - center.z) < EPSILON
		) return Matrix.identity.clone();

		z0 = eye.x - center.x;
		z1 = eye.y - center.y;
		z2 = eye.z - center.z;
		len = 1 / Math.hypot(z0, z1, z2);
		z0 *= len;
		z1 *= len;
		z2 *= len;
		x0 = up.y * z2 - up.z * z1;
		x1 = up.z * z0 - up.x * z2;
		x2 = up.x * z1 - up.y * z0;
		len = Math.hypot(x0, x1, x2);
		if(!len) {
			x0 = 0;
			x1 = 0;
			x2 = 0;
		} else {
			len = 1 / len;
			x0 *= len;
			x1 *= len;
			x2 *= len;
		}
		y0 = z1 * x2 - z2 * x1;
		y1 = z2 * x0 - z0 * x2;
		y2 = z0 * x1 - z1 * x0;
		len = Math.hypot(y0, y1, y2);
		if(!len) {
			y0 = 0;
			y1 = 0;
			y2 = 0;
		} else {
			len = 1 / len;
			y0 *= len;
			y1 *= len;
			y2 *= len;
		}
		const out = [];
		out[0] = x0;
		out[1] = y0;
		out[2] = z0;
		out[3] = 0;
		out[4] = x1;
		out[5] = y1;
		out[6] = z1;
		out[7] = 0;
		out[8] = x2;
		out[9] = y2;
		out[10] = z2;
		out[11] = 0;
		out[12] = -(x0 * eye.x + x1 * eye.y + x2 * eye.z);
		out[13] = -(y0 * eye.x + y1 * eye.y + y2 * eye.z);
		out[14] = -(z0 * eye.x + z1 * eye.y + z2 * eye.z);
		out[15] = 1;
		return new Matrix(out, false);
	}

	/**
	 * Multiply an array of matrices.
	 * @param matrices Matrices to multiply.
	 * @returns new matrix with multiply result.
	 */
	public static multiplyMany(matrices: Matrix[]): Matrix {
		let ret = matrices[0];
		for(let i = 1; i < matrices.length; i++) ret = Matrix.multiply(ret, matrices[i]);
		return ret;
	}

	/**
	 * Multiply two matrices and put result in first matrix.
	 * @returns matrixA, after it was modified.
	 */
	public static multiplyIntoFirst(matrixA: Matrix, matrixB: Matrix): Matrix {
		// Slice the second matrix up into rows
		const row0 = [matrixB.values[0], matrixB.values[1], matrixB.values[2], matrixB.values[3]];
		const row1 = [matrixB.values[4], matrixB.values[5], matrixB.values[6], matrixB.values[7]];
		const row2 = [matrixB.values[8], matrixB.values[9], matrixB.values[10], matrixB.values[11]];
		const row3 = [matrixB.values[12], matrixB.values[13], matrixB.values[14], matrixB.values[15]];

		// Multiply each row by matrixA
		const result0 = multiplyMatrixAndPoint(matrixA.values, row0);
		const result1 = multiplyMatrixAndPoint(matrixA.values, row1);
		const result2 = multiplyMatrixAndPoint(matrixA.values, row2);
		const result3 = multiplyMatrixAndPoint(matrixA.values, row3);

		// Turn the result rows back into a single matrix
		matrixA.set(
			result0[0], result0[1], result0[2], result0[3],
			result1[0], result1[1], result1[2], result1[3],
			result2[0], result2[1], result2[2], result2[3],
			result3[0], result3[1], result3[2], result3[3]
		);

		// return the first matrix after it was modified
		return matrixA;
	}

	/**
	 * Multiply an array of matrices into the first matrix in the array.
	 * @param matrices Matrices to multiply.
	 * @returns first matrix in array, after it was modified.
	 */
	public static multiplyManyIntoFirst(matrices: Matrix[]): Matrix {
		let ret = matrices[0];
		for(let i = 1; i < matrices.length; i++) ret = Matrix.multiplyIntoFirst(ret, matrices[i]);
		return ret;
	}

	/**
	 * Transform a 2d vertex.
	 * @param matrix Matrix to use to transform vector.
	 * @param vertex Vertex to transform.
	 * @returns A transformed vertex (cloned, not the original).
	 */
	public static transformVertex(matrix: Matrix, vertex: Vertex): Vertex {
		return new Vertex(
			(vertex.position.isVector2) ? Matrix.transformVector2(matrix, vertex.position) : Matrix.transformVector3(matrix, vertex.position),
			vertex.textureCoord,
			vertex.color);
	}

	/**
	 * Transform a 2d vector.
	 * @param matrix Matrix to use to transform vector.
	 * @param vector Vector to transform.
	 * @returns Transformed vector.
	 */
	public static transformVector2(matrix: Matrix, vector: Vector2 | Vector3): Vector2 {
		const x = vector.x;
		const y = vector.y;
		const z = vector instanceof Vector3 ? vector.z : 0;
		const e = matrix.values;

		const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);

		const resx = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
		const resy = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;

		return new Vector2(resx, resy);
	}

	/**
	 * Transform a 3d vector.
	 * @param matrix Matrix to use to transform vector.
	 * @param vector Vector to transform.
	 * @returns Transformed vector.
	 */
	public static transformVector3(matrix: Matrix, vector: Vector3): Vector3 {
		const x = vector.x, y = vector.y, z = vector.z || 0;
		const e = matrix.values;

		const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);

		const resx = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
		const resy = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
		const resz = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;

		return new Vector3(resx, resy, resz);
	}
}

/**
 * Multiply matrix and vector.
 * @private
 */
function multiplyMatrixAndPoint(matrix: number[], point: [number, number, number, number]): [number, number, number, number] {
	// Give a simple variable name to each part of the matrix, a column and row number
	const c0r0 = matrix[0], c1r0 = matrix[1], c2r0 = matrix[2], c3r0 = matrix[3];
	const c0r1 = matrix[4], c1r1 = matrix[5], c2r1 = matrix[6], c3r1 = matrix[7];
	const c0r2 = matrix[8], c1r2 = matrix[9], c2r2 = matrix[10], c3r2 = matrix[11];
	const c0r3 = matrix[12], c1r3 = matrix[13], c2r3 = matrix[14], c3r3 = matrix[15];

	// Now set some simple names for the point
	const x = point[0];
	const y = point[1];
	const z = point[2];
	const w = point[3];

	// Multiply the point against each part of the 1st column, then add together
	const resultX = (x * c0r0) + (y * c0r1) + (z * c0r2) + (w * c0r3);

	// Multiply the point against each part of the 2nd column, then add together
	const resultY = (x * c1r0) + (y * c1r1) + (z * c1r2) + (w * c1r3);

	// Multiply the point against each part of the 3rd column, then add together
	const resultZ = (x * c2r0) + (y * c2r1) + (z * c2r2) + (w * c2r3);

	// Multiply the point against each part of the 4th column, then add together
	const resultW = (x * c3r0) + (y * c3r1) + (z * c3r2) + (w * c3r3);

	return [resultX, resultY, resultZ, resultW];
}
