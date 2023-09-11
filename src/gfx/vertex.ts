import { Color, Vector2, Vector3 } from "../utils";

/**
 * A vertex we can push to sprite batch.
 */
export class Vertex {
	public position: Vector2 | Vector3;
	public textureCoord: Vector2;
	public color: Color;
	public normal: Vector3;
	public binormal: Vector3;
	public tangent: Vector3;

	/**
	 * Create the vertex data.
	 * @param position Vertex position.
	 * @param textureCoord Vertex texture coord (in pixels).
	 * @param color Vertex color (undefined will default to white).
	 * @param normal Vertex normal.
	 */
	public constructor(position: Vector2 | Vector3 = Vector2.zero(), textureCoord: Vector2 = Vector2.zero(), color = Color.white, normal: Vector3) {
		this.position = position;
		this.textureCoord = textureCoord;
		this.color = color;
		this.normal = normal;
	}

	/**
	 * Set position.
	 * @param position Vertex position.
	 * @param useRef If true, will not clone the given position vector and use its reference instead.
	 * @returns this.
	 */
	public setPosition(position: Vector2 | Vector3, useRef: boolean): Vertex {
		this.position = useRef ? position : position.clone();
		return this;
	}

	/**
	 * Set texture coordinates.
	 * @param textureCoord Vertex texture coord (in pixels).
	 * @param useRef If true, will not clone the given coords vector and use its reference instead.
	 * @returns this.
	 */
	public setTextureCoords(textureCoord: Vector2, useRef: boolean): Vertex {
		this.textureCoord = useRef ? textureCoord : textureCoord.clone();
		return this;
	}

	/**
	 * Set vertex color.
	 * @param color Vertex color.
	 * @param useRef If true, will not clone the given color and use its reference instead.
	 * @returns this.
	 */
	public setColor(color: Color, useRef: boolean): Vertex {
		this.color = useRef ? color : color.clone();
		return this;
	}

	/**
	 * Set vertex normal.
	 * @param normal Vertex normal.
	 * @param useRef If true, will not clone the given normal and use its reference instead.
	 * @returns this.
	 */
	public setNormal(normal: Vector3, useRef: boolean): Vertex {
		this.normal = useRef ? normal : normal.clone();
		return this;
	}

	/**
	 * Set vertex binormal.
	 * @param binormal Vertex binormal.
	 * @param useRef If true, will not clone the given binormal and use its reference instead.
	 * @returns this.
	 */
	public setBinormal(binormal: Vector3, useRef: boolean): Vertex {
		this.binormal = useRef ? binormal : binormal.clone();
		return this;
	}

	/**
	 * Set vertex tangent.
	 * @param tangent Vertex tangent.
	 * @param useRef If true, will not clone the given tangent and use its reference instead.
	 * @returns this.
	 */
	public setTangent(tangent: Vector3, useRef: boolean): Vertex {
		this.tangent = useRef ? tangent : tangent.clone();
		return this;
	}
}
