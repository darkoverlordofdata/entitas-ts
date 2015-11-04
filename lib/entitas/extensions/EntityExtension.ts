module entitas {

  import Entity = entitas.Entity;
  import Exception = entitas.Exception;
  import IComponent = entitas.IComponent;

  export function initialize(totalComponents:number, options) {

    const MAX_ENTITIES = 100;
    var instanceIndex:number = 0;
    var alloc:Array<Array<IComponent>> = null;
    var _count = 0;
    var _size = 0;

    /**
     * allocate entity pool
     *
     * @param count number of components
     * @param size max number of entities
     */
    function dim(count:number, size:number): void {
      _count = count;
      _size = size;
      alloc = new Array(size);
      for (var e=0; e<size; e++) {
        alloc[e] = new Array(count);
        for (var k=0; k<count; k++) {
          alloc[e][k] = null;
        }
      }
    }
    /**
     * Returns the next entity pool entry
     *
     * @param totalComponents
     * @returns {Array<IComponent>}
     */
    Entity.prototype.initialize = function(totalComponents:number):Array<IComponent> {
      if (alloc == null) dim(totalComponents, MAX_ENTITIES);
      this.instanceIndex = instanceIndex++;
      var mem = alloc[this.instanceIndex];
      if (typeof mem === 'undefined') {
        console.log('Insufficient memory allocation at ', this.instanceIndex, '. Allocating ', _size, ' entities.')
        for (var i=this.instanceIndex, l=i+_size; i<l; i++) {
          alloc[i] = new Array(_count);
          for (var k=0; k<_count; k++) {
            alloc[i][k] = null;
          }
        }
        mem = alloc[this.instanceIndex];
      }
      return mem;
    };
  }

}