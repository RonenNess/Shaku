import Color from "../utils/color";
import Vector2 from "../utils/vector2";
import Vector3 from "../utils/vector3";

/**
 * A vertex we can push to sprite batch.
 */
class Vertex {
	/**
	 * Create the vertex data.
	 * @param {Vector2|Vector3} position Vertex position.
	 * @param {Vector2} textureCoord Vertex texture coord (in pixels).
	 * @param {Color} color Vertex color (undefined will default to white).
	 * @param {Vector3} normal Vertex normal.
	 */
	constructor(position, textureCoord, color, normal) {
		this.position = position || Vector2.zero();
		this.textureCoord = textureCoord || Vector2.zero();
		this.color = color || Color.white;
		this.normal = normal;
	}

	/**
	 * Set position.
	 * @param {Vector2|Vector3} position Vertex position.
	 * @param {Boolean} useRef If true, will not clone the given position vector and use its reference instead.
	 * @returns {Vertex} this.
	 */
	setPosition(position, useRef) {
		this.position = useRef ? position : position.clone();
		return this;
	}

	/**
	 * Set texture coordinates.
	 * @param {Vector2} textureCoord Vertex texture coord (in pixels).
	 * @param {Boolean} useRef If true, will not clone the given coords vector and use its reference instead.
	 * @returns {Vertex} this.
	 */
	setTextureCoords(textureCoord, useRef) {
		this.textureCoord = useRef ? textureCoord : textureCoord.clone();
		return this;
	}

	/**
	 * Set vertex color.
	 * @param {Color} color Vertex color.
	 * @param {Boolean} useRef If true, will not clone the given color and use its reference instead.
	 * @returns {Vertex} this.
	 */
	setColor(color, useRef) {
		this.color = useRef ? color : color.clone();
		return this;
	}

	/**
	 * Set vertex normal.
	 * @param {Vector3} normal Vertex normal.
	 * @param {Boolean} useRef If true, will not clone the given normal and use its reference instead.
	 * @returns {Vertex} this.
	 */
	setNormal(normal, useRef) {
		this.normal = useRef ? normal : normal.clone();
		return this;
	}

	/**
	 * Set vertex binormal.
	 * @param {Vector3} binormal Vertex binormal.
	 * @param {Boolean} useRef If true, will not clone the given binormal and use its reference instead.
	 * @returns {Vertex} this.
	 */
	setBinormal(binormal, useRef) {
		this.binormal = useRef ? binormal : binormal.clone();
		return this;
	}

	/**
	 * Set vertex tangent.
	 * @param {Vector3} tangent Vertex tangent.
	 * @param {Boolean} useRef If true, will not clone the given tangent and use its reference instead.
	 * @returns {Vertex} this.
	 */
	setTangent(tangent, useRef) {
		this.tangent = useRef ? tangent : tangent.clone();
		return this;
	}
}

// export the vertex class
export default Vertex;