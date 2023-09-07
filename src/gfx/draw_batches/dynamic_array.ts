

/**
 * A polyfill version of "ArrayBuffer.transfer".
 * If native ArrayBuffer.transfer exists, will use it internally.
 * From: https://reference.codeproject.com/javascript/reference/global_objects/arraybuffer/transfer#Browser_compatibility
 */
function transferPolyfill(source, dest) {
	// to handle typed buffers
	if(source.buffer instanceof ArrayBuffer) source = source.buffer;
	if(dest.buffer instanceof ArrayBuffer) source = dest.buffer;

	// use native
	if(ArrayBuffer.transfer) return ArrayBuffer.transfer(source, dest);

	// polyfill
	if(dest.byteLength >= source.byteLength) {
		let nextOffset = 0;
		let leftBytes = source.byteLength;
		const wordSizes = [8, 4, 2, 1];
		wordSizes.forEach(function(_wordSize_) {
			if(leftBytes >= _wordSize_) {
				const done = transferWith(_wordSize_, source, dest, nextOffset, leftBytes);
				nextOffset = done.nextOffset;
				leftBytes = done.leftBytes;
			}
		});
	}

	function transferWith(wordSize, source, dest, nextOffset, leftBytes) {
		let ViewClass = Uint8Array;
		switch(wordSize) {
			case 8: ViewClass = Float64Array; break;
			case 4: ViewClass = Float32Array; break;
			case 2: ViewClass = Uint16Array; break;
			case 1: ViewClass = Uint8Array; break;
			default: ViewClass = Uint8Array; break;
		}
		const view_source = new ViewClass(source, nextOffset, Math.trunc(leftBytes / wordSize));
		const view_dest = new ViewClass(dest, nextOffset, Math.trunc(leftBytes / wordSize));
		for(let i = 0; i < view_dest.length; i++) view_dest[i] = view_source[i];
		return {
			nextOffset: view_source.byteOffset + view_source.byteLength,
			leftBytes: source.byteLength - (view_source.byteOffset + view_source.byteLength),
		};
	}
}

/**
 * A float 32 array that grows automatically.
 */
export class DynamicArray<T extends Int8Array | Uint8Array | Float32Array | Float64Array> {
	public buffer: T;
	public index: number;
	public type: (startSize: number) => T;

	private startSize: number;

	/**
	 * Create the array.
	 * @param startSize Starting size.
	 * @param {*} type Array type (defaults to Float32Array).
	 */
	public constructor(startSize: number, type = Float32Array) {
		this.buffer = new this.type(startSize);
		this.index = 0;
		this.startSize = startSize;
	}

	/**
	 * Reset the array back to original size.
	 */
	public reset(includeSize: boolean) {
		this.index = 0;
		if(includeSize && this.buffer.length !== this.startSize) this.buffer = new this.type(this.startSize);
	}

	/**
	 * Push a value into the array and grow it if necessary.
	 * @param value Value to push.
	 */
	public push(value: number) {
		if(this.index >= this.buffer.length) {
			const newBuffer = new this.type(this.buffer.length * 2);
			transferPolyfill(this.buffer, newBuffer);
			this.buffer = newBuffer;
		}
		this.buffer[this.index++] = value;
	}
}
