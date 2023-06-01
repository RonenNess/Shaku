export = Matrix;
/**
 * Implements a matrix.
 */
declare class Matrix {
    /**
     * Create an orthographic projection matrix.
     * @returns {Matrix} a new matrix with result.
     */
    static createOrthographic(left: any, right: any, bottom: any, top: any, near: any, far: any): Matrix;
    /**
     * Create a perspective projection matrix.
     * @returns {Matrix} a new matrix with result.
     */
    static createPerspective(fieldOfViewInRadians: any, aspectRatio: any, near: any, far: any): Matrix;
    /**
     * Create a translation matrix.
     * @returns {Matrix} a new matrix with result.
     */
    static createTranslation(x: any, y: any, z: any): Matrix;
    /**
     * Create a scale matrix.
     * @returns {Matrix} a new matrix with result.
     */
    static createScale(x: any, y: any, z: any): Matrix;
    /**
     * Create a rotation matrix around X axis.
     * @returns {Matrix} a new matrix with result.
     */
    static createRotationX(a: any): Matrix;
    /**
     * Create a rotation matrix around Y axis.
     * @returns {Matrix} a new matrix with result.
     */
    static createRotationY(a: any): Matrix;
    /**
     * Create a rotation matrix around Z axis.
     * @returns {Matrix} a new matrix with result.
     */
    static createRotationZ(a: any): Matrix;
    /**
     * Multiply two matrices.
     * @returns {Matrix} a new matrix with result.
     */
    static multiply(matrixA: any, matrixB: any): Matrix;
    /**
     * Creates a look-at matrix - a matrix rotated to look at a given position.
     * @param {Vector3} eyePosition Eye position.
     * @param {Vector3} targetPosition Position the matrix should look at.
     * @param {Vector3=} upVector Optional vector representing 'up' direction.
     * @returns {Matrix} a new matrix with result.
     */
    static createLookAt(eyePosition: Vector3, targetPosition: Vector3, upVector?: Vector3 | undefined): Matrix;
    /**
     * Multiply an array of matrices.
     * @param {Array<Matrix>} matrices Matrices to multiply.
     * @returns {Matrix} new matrix with multiply result.
     */
    static multiplyMany(matrices: Array<Matrix>): Matrix;
    /**
     * Multiply two matrices and put result in first matrix.
     * @returns {Matrix} matrixA, after it was modified.
     */
    static multiplyIntoFirst(matrixA: any, matrixB: any): Matrix;
    /**
     * Multiply an array of matrices into the first matrix in the array.
     * @param {Array<Matrix>} matrices Matrices to multiply.
     * @returns {Matrix} first matrix in array, after it was modified.
     */
    static multiplyManyIntoFirst(matrices: Array<Matrix>): Matrix;
    /**
     * Transform a 2d vertex.
     * @param {Matrix} matrix Matrix to use to transform vector.
     * @param {Vertex} vertex Vertex to transform.
     * @returns {Vertex} A transformed vertex (cloned, not the original).
     */
    static transformVertex(matrix: Matrix, vertex: Vertex): Vertex;
    /**
     * Transform a 2d vector.
     * @param {Matrix} matrix Matrix to use to transform vector.
     * @param {Vector2} vector Vector to transform.
     * @returns {Vector2} Transformed vector.
     */
    static transformVector2(matrix: Matrix, vector: Vector2): Vector2;
    /**
     * Transform a 3d vector.
     * @param {Matrix} matrix Matrix to use to transform vector.
     * @param {Vector3} vector Vector to transform.
     * @returns {Vector3} Transformed vector.
     */
    static transformVector3(matrix: Matrix, vector: Vector3): Vector3;
    /**
     * Create the matrix.
     * @param values matrix values array.
     * @param cloneValues if true or undefined, will clone values instead of just holding a reference to them.
     */
    constructor(values: any, cloneValues: any);
    values: any;
    /**
     * Set the matrix values.
     */
    set(v11: any, v12: any, v13: any, v14: any, v21: any, v22: any, v23: any, v24: any, v31: any, v32: any, v33: any, v34: any, v41: any, v42: any, v43: any, v44: any): void;
    /**
     * Clone the matrix.
     * @returns {Matrix} Cloned matrix.
     */
    clone(): Matrix;
    /**
     * Compare this matrix to another matrix.
     * @param {Matrix} other Matrix to compare to.
     * @returns {Boolean} If matrices are the same.
     */
    equals(other: Matrix): boolean;
    /**
     * Clone and invert the matrix.
     * @returns {Matrix} Clonsed inverted matrix.
     */
    inverted(): Matrix;
    /**
     * Invert this matrix.
     * @returns {Matrix} Self.
     */
    invertSelf(): Matrix;
    /**
     * Transform a target.
     * @param {Vector2|Vector3|Vertex} target Transforms a target, that can be vector2, vector3, or vertex.
     * @returns {Vector2|Vector3|Vector3} Transformed result.
     */
    transform(target: Vector2 | Vector3 | Vertex): Vector2 | Vector3 | Vector3;
    /**
     * Multiply this matrix with another matrix, putting results in self.
     * @param {Matrix} other Matrix to multiply with.
     * @returns {Matrix} This.
     */
    multiplySelfWith(other: Matrix): Matrix;
    /**
     * Multiply this matrix with another matrix and return a new result matrix.
     * @param {Matrix} other Matrix to multiply with.
     * @returns {Matrix} New result matrix.
     */
    multiplyWith(other: Matrix): Matrix;
}
declare namespace Matrix {
    const identity: Matrix;
}
import Vector2 = require("./vector2");
import Vector3 = require("./vector3");
import Vertex = require("../gfx/vertex");
//# sourceMappingURL=matrix.d.ts.map