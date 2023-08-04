

/**
 * A polyfill version of 'ArrayBuffer.transfer'.
 * If native ArrayBuffer.transfer exists, will use it internally.
 * From: https://reference.codeproject.com/javascript/reference/global_objects/arraybuffer/transfer#Browser_compatibility
 */
function transferPolyfill(source, dest) {
	// to handle typed buffers
	if(source.buffer instanceof ArrayBuffer) { source = source.buffer; }
	if(dest.buffer instanceof ArrayBuffer) { source = dest.buffer; }

	// use native
	if(ArrayBuffer.transfer) {
		return ArrayBuffer.transfer(source, dest);
	}

	// polyfill
	if(dest.byteLength >= source.byteLength) {
		var nextOffset = 0;
		var leftBytes = source.byteLength;
		var wordSizes = [8, 4, 2, 1];
		wordSizes.forEach(function(_wordSize_) {
			if(leftBytes => _wordSize_) {
				var done = transferWith(_wordSize_, source, dest, nextOffset, leftBytes);
				nextOffset = done.nextOffset;
				leftBytes = done.leftBytes;
			}
		});
	}

	function transferWith(wordSize, source, dest, nextOffset, leftBytes) {
		var ViewClass = Uint8Array;
		switch(wordSize) {
			case 8:
				ViewClass = Float64Array;
				break;
			case 4:
				ViewClass = Float32Array;
				break;
			case 2:
				ViewClass = Uint16Array;
				break;
			case 1:
				ViewClass = Uint8Array;
				break;
			default:
				ViewClass = Uint8Array;
				break;
		}
		var view_source = new ViewClass(source, nextOffset, Math.trunc(leftBytes / wordSize));
		var view_dest = new ViewClass(dest, nextOffset, Math.trunc(leftBytes / wordSize));
		for(var i = 0; i < view_dest.length; i++) {
			view_dest[i] = view_source[i];
		}
		return {
			nextOffset: view_source.byteOffset + view_source.byteLength,
			leftBytes: source.byteLength - (view_source.byteOffset + view_source.byteLength)
		};
	}
}

/**
 * A float 32 array that grows automatically.
 */
class DynamicArray {
	/**
	 * Create the array.
	 * @param {Number} startSize Starting size.
	 * @param {*} type Array type (defaults to Float32Array).
	 */
	constructor(startSize, type) {
		this.type = type || Float32Array;
		this.buffer = new this.type(startSize);
		this.index = 0;
		this._startSize = startSize;
	}

	/**
	 * Reset the array back to original size.
	 */
	reset(includeSize) {
		this.index = 0;
		if(includeSize && this.buffer.length !== this._startSize) {
			this.buffer = new this.type(this._startSize);
		}
	}

	/**
	 * Push a value into the array and grow it if necessary.
	 * @param {Number} value Value to push.
	 */
	push(value) {
		if(this.index >= this.buffer.length) {
			let newBuffer = new this.type(this.buffer.length * 2);
			transferPolyfill(this.buffer, newBuffer);
			this.buffer = newBuffer;
		}
		this.buffer[this.index++] = value;
	}
}

// export the dynamic float32 array.
export default DynamicArray;
