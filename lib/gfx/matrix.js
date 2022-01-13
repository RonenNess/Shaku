/**
 * Matrix class.
 * Based on code from https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Matrix_math_for_the_web
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\matrix.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
 'use strict';

 /**
  * Implements a matrix.
  */
class Matrix
{
    /**
     * Create the matrix.
     * @param values matrix values array.
     * @param cloneValues if true or undefined, will clone values instead of just holding a reference to them.
     */
    constructor(values, cloneValues)
    {
        if (cloneValues || cloneValues === undefined) {
            this.values = values.slice(0);
        }
        else {
            this.values = values;
        }
    }

    /**
     * Set the matrix values.
     */
     set(v11, v12, v13, v14, v21, v22, v23, v24, v31, v32, v33, v34, v41, v42, v43, v44)
     {
         this.values = new Float32Array([ v11, v12, v13, v14,
                         v21, v22, v23, v24,
                         v31, v32, v33, v34,
                         v41, v42, v43, v44
                     ]);
     }

    /**
     * Clone the matrix.
     * @returns {Matrix} Cloned matrix.
     */
    clone()
    {
        let ret = new Matrix(this.values, true);
        return ret;
    }
    
    /**
     * Compare this matrix to another matrix.
     * @param {Matrix} other Matrix to compare to.
     * @returns {Boolean} If matrices are the same.
     */
    equals(other)
    {
        if (other === this) { return true; }
        if (!other) { return false; }
        for (let i = 0; i < this.values.length; ++i) {
            if (this.values[i] !== other.values[i]) { return false; }
        }
        return true;
    }

    /**
     * Create an orthographic projection matrix.
     * @returns {Matrix} a new matrix with result.
     */
    static orthographic(left, right, bottom, top, near, far) 
    {
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
     * @returns {Matrix} a new matrix with result.
     */
    static perspective(fieldOfViewInRadians, aspectRatio, near, far) 
    {
        var f = 1.0 / Math.tan(fieldOfViewInRadians / 2);
        var rangeInv = 1 / (near - far);
      
        return new Matrix([
          f / aspectRatio, 0,                          0,   0,
          0,               f,                          0,   0,
          0,               0,    (near + far) * rangeInv,  -1,
          0,               0,  near * far * rangeInv * 2,   0
        ], false);
    }

    /**
     * Create a translation matrix.
     * @returns {Matrix} a new matrix with result.
     */
    static translate(x, y, z)
    {
        return new Matrix([
            1,          0,          0,          0,
            0,          1,          0,          0,
            0,          0,          1,          0,
            x || 0,     y || 0,     z || 0,     1
        ], false);
    }

    /**
     * Create a scale matrix.
     * @returns {Matrix} a new matrix with result.
     */
    static scale(x, y, z)
    {
        return new Matrix([
            x || 1,         0,              0,              0,
            0,              y || 1,         0,              0,
            0,              0,              z || 1,         0,
            0,              0,              0,              1
        ], false);
    }
    
    /**
     * Create a rotation matrix around X axis.
     * @returns {Matrix} a new matrix with result.
     */
    static rotateX(a)
    {
        let sin = Math.sin;
        let cos = Math.cos;
        return new Matrix([
            1,       0,        0,     0,
            0,  cos(a),  -sin(a),     0,
            0,  sin(a),   cos(a),     0,
            0,       0,        0,     1
        ], false);
    }
        
    /**
     * Create a rotation matrix around Y axis.
     * @returns {Matrix} a new matrix with result.
     */
    static rotateY(a)
    {
        let sin = Math.sin;
        let cos = Math.cos;
        return new Matrix([
             cos(a),   0, sin(a),   0,
                  0,   1,      0,   0,
            -sin(a),   0, cos(a),   0,
                  0,   0,      0,   1
        ], false);
    }
        
    /**
     * Create a rotation matrix around Z axis.
     * @returns {Matrix} a new matrix with result.
     */
    static rotateZ(a)
    {
        let sin = Math.sin;
        let cos = Math.cos;
        return new Matrix([
            cos(a), -sin(a),    0,    0,
            sin(a),  cos(a),    0,    0,
                0,       0,    1,    0,
                0,       0,    0,    1
        ], false);
    }
    
    /**
     * Multiply two matrices. 
     * @returns {Matrix} a new matrix with result.
     */
    static multiply(matrixA, matrixB) 
    {
        // Slice the second matrix up into rows
        let row0 = [matrixB.values[ 0], matrixB.values[ 1], matrixB.values[ 2], matrixB.values[ 3]];
        let row1 = [matrixB.values[ 4], matrixB.values[ 5], matrixB.values[ 6], matrixB.values[ 7]];
        let row2 = [matrixB.values[ 8], matrixB.values[ 9], matrixB.values[10], matrixB.values[11]];
        let row3 = [matrixB.values[12], matrixB.values[13], matrixB.values[14], matrixB.values[15]];
      
        // Multiply each row by matrixA
        let result0 = multiplyMatrixAndPoint(matrixA.values, row0);
        let result1 = multiplyMatrixAndPoint(matrixA.values, row1);
        let result2 = multiplyMatrixAndPoint(matrixA.values, row2);
        let result3 = multiplyMatrixAndPoint(matrixA.values, row3);
      
        // Turn the result rows back into a single matrix
        return new Matrix([
          result0[0], result0[1], result0[2], result0[3],
          result1[0], result1[1], result1[2], result1[3],
          result2[0], result2[1], result2[2], result2[3],
          result3[0], result3[1], result3[2], result3[3]
        ], false);
    }

    /**
     * Multiply an array of matrices.
     * @param {Array<Matrix>} matrices Matrices to multiply.
     * @returns {Matrix} new matrix with multiply result.
     */
    static multiplyMany(matrices)
    {
        let ret = matrices[0];
        for(let i = 1; i < matrices.length; i++) {
            ret = Matrix.multiply(ret, matrices[i]);
        }        
        return ret;
    }
        
    /**
     * Multiply two matrices and put result in first matrix. 
     * @returns {Matrix} matrixA, after it was modified.
     */
    static multiplyIntoFirst(matrixA, matrixB) 
    {
        // Slice the second matrix up into rows
        let row0 = [matrixB.values[ 0], matrixB.values[ 1], matrixB.values[ 2], matrixB.values[ 3]];
        let row1 = [matrixB.values[ 4], matrixB.values[ 5], matrixB.values[ 6], matrixB.values[ 7]];
        let row2 = [matrixB.values[ 8], matrixB.values[ 9], matrixB.values[10], matrixB.values[11]];
        let row3 = [matrixB.values[12], matrixB.values[13], matrixB.values[14], matrixB.values[15]];
    
        // Multiply each row by matrixA
        let result0 = multiplyMatrixAndPoint(matrixA.values, row0);
        let result1 = multiplyMatrixAndPoint(matrixA.values, row1);
        let result2 = multiplyMatrixAndPoint(matrixA.values, row2);
        let result3 = multiplyMatrixAndPoint(matrixA.values, row3);
    
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
     * @param {Array<Matrix>} matrices Matrices to multiply.
     * @returns {Matrix} first matrix in array, after it was modified.
     */
     static multiplyManyIntoFirst(matrices)
     {
         let ret = matrices[0];
         for(let i = 1; i < matrices.length; i++) {
             ret = Matrix.multiplyIntoFirst(ret, matrices[i]);
         }        
         return ret;
     }
}


/**
 * Multiply matrix and vector.
 * @private
 */
function multiplyMatrixAndPoint(matrix, point) 
{
    // Give a simple variable name to each part of the matrix, a column and row number
    let c0r0 = matrix[ 0], c1r0 = matrix[ 1], c2r0 = matrix[ 2], c3r0 = matrix[ 3];
    let c0r1 = matrix[ 4], c1r1 = matrix[ 5], c2r1 = matrix[ 6], c3r1 = matrix[ 7];
    let c0r2 = matrix[ 8], c1r2 = matrix[ 9], c2r2 = matrix[10], c3r2 = matrix[11];
    let c0r3 = matrix[12], c1r3 = matrix[13], c2r3 = matrix[14], c3r3 = matrix[15];

    // Now set some simple names for the point
    let x = point[0];
    let y = point[1];
    let z = point[2];
    let w = point[3];

    // Multiply the point against each part of the 1st column, then add together
    let resultX = (x * c0r0) + (y * c0r1) + (z * c0r2) + (w * c0r3);

    // Multiply the point against each part of the 2nd column, then add together
    let resultY = (x * c1r0) + (y * c1r1) + (z * c1r2) + (w * c1r3);

    // Multiply the point against each part of the 3rd column, then add together
    let resultZ = (x * c2r0) + (y * c2r1) + (z * c2r2) + (w * c2r3);

    // Multiply the point against each part of the 4th column, then add together
    let resultW = (x * c3r0) + (y * c3r1) + (z * c3r2) + (w * c3r3);

    return [resultX, resultY, resultZ, resultW];
}


/**
 * An identity matrix.
 */
Matrix.identity = new Matrix([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
], false);
Object.freeze(Matrix.identity);

// export the matrix object
module.exports = Matrix;