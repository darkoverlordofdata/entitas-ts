module entitas {
  /*
   * BitSets are packed into arrays of "words."  Currently a word
   * consists of 32 bits, requiring 5 address bits.
   */
  const ADDRESS_BITS_PER_WORD = 5;
  const BITS_PER_WORD = 1 << ADDRESS_BITS_PER_WORD; // 32
  const WORD_MASK = 0xffffffff;

  /**
   * @see http://stackoverflow.com/questions/6506356/java-implementation-of-long-numberoftrailingzeros
   */
  function numberOfTrailingZeros(i:number):number {
    if (i == 0) return 64;
    var x:number = i;
    var y:number;
    var n:number = 63;
    y = x << 32;
    if (y != 0) {
      n -= 32;
      x = y;
    }
    y = x << 16;
    if (y != 0) {
      n -= 16;
      x = y;
    }
    y = x << 8;
    if (y != 0) {
      n -= 8;
      x = y;
    }
    y = x << 4;
    if (y != 0) {
      n -= 4;
      x = y;
    }
    y = x << 2;
    if (y != 0) {
      n -= 2;
      x = y;
    }
    return (n - ((x << 1) >>> 63));
  }

  export class BitSet {

    private words_:number[];

    constructor(nbits:number = 0) {
      if (nbits < 0) {
        throw RangeError("Negative Array Size: [" + nbits + ']')
      } else if (nbits === 0) {
        this.words_ = [];
      } else {
        var words = this.words_ = new Array(((nbits - 1) >> ADDRESS_BITS_PER_WORD) + 1);
        for (var i = 0, l = words.length; i < l; i++) {
          words[i] = 0;
        }
      }
    }

    nextSetBit(fromIndex:number) {

      var u = fromIndex >> ADDRESS_BITS_PER_WORD;
      var words = this.words_;
      var wordsInUse = words.length;

      var word = words[u] & (WORD_MASK << fromIndex);
      while (true) {
        if (word !== 0)
          return (u * BITS_PER_WORD) + numberOfTrailingZeros(word);
        if (++u === wordsInUse)
          return -1;
        word = words[u];
      }
    }

    intersects(set:BitSet):boolean {
      var words = this.words_;
      var wordsInUse = words.length;

      for (var i = Math.min(wordsInUse, set.words_.length) - 1; i >= 0; i--)
        if ((words[i] & set.words_[i]) != 0)
          return true;
      return false;
    }

    hasAll(set:BitSet):boolean {
      var words = this.words_;
      var wordsInUse = words.length;

      for (var i = Math.min(wordsInUse, set.words_.length) - 1; i >= 0; i--)
        if ((words[i] & set.words_[i]) != set.words_[i])
          return false;
      return true;
    }

    // length():number {
    // 	return this.length_;
    // }

    // and(set:BitSet):BitSet {

    // }
    // or(set:BitSet):BitSet {

    // }
    // nand(set:BitSet):BitSet {

    // }
    // nor(set:BitSet):BitSet {

    // }
    // not(set:BitSet):BitSet {

    // }
    // xor(set:BitSet):BitSet {

    // }
    // equals(set:BitSet):boolean {

    // }
    // clone():BitSet {

    // }
    isEmpty():boolean {
      return this.words_.length === 0;
    }

    // toString():string {

    // }
    // cardinality():number {

    // }

    // msb():number {

    // }

    set(bitIndex:number, value:boolean = true):number {
      var wordIndex = bitIndex >> ADDRESS_BITS_PER_WORD;
      var words = this.words_;
      var wordsInUse = words.length;
      var wordsRequired = wordIndex + 1;

      if (wordsInUse < wordsRequired) {
        words.length = Math.max(2 * wordsInUse, wordsRequired);
        for (var i = wordsInUse, l = words.length; i < l; i++) {
          words[i] = 0;
        }
      }

      if (value) {
        return words[wordIndex] |= (1 << bitIndex)
      } else {
        return words[wordIndex] &= ~(1 << bitIndex);
      }
    }

    // setRange(from:number, to:number, value:number):number {

    // }

    get(bitIndex:number):boolean {

      var wordIndex = bitIndex >> ADDRESS_BITS_PER_WORD;
      var words = this.words_;
      var wordsInUse = words.length;

      return (wordIndex < wordsInUse) && ((words[wordIndex] & (1 << bitIndex)) != 0);
    }

    // getRange(from:number, to:number):number {

    // }

    clear(bitIndex?:number):number {
      if (bitIndex === null) {
        var words = this.words_;
        var wordsInUse = words.length;
        while (wordsInUse > 0) {
          words[--wordsInUse] = 0;
        }
        return;
      }

      var wordIndex = bitIndex >> ADDRESS_BITS_PER_WORD;
      this.words_[wordIndex] &= ~(1 << bitIndex);
    }

    // flip(from?:number, to?:number):number {

    // }

    // nextClearBit(fromIndex:number) {

    // }

    // nextSetBit(fromIndex:number) {

    // }
  }
}