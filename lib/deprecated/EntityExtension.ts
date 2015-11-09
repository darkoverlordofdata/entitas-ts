module entitas {

  import Entity = entitas.Entity;
  import Exception = entitas.Exception;
  import IComponent = entitas.IComponent;

  export function initialize(totalComponents:number, options) {

    var instanceIndex:number = 0;
    var alloc:Array<Array<IComponent>> = null;
    var size:number = options.entities || 100;

    /**
     * allocate entity pool
     *
     * @param count number of components
     * @param size max number of entities
     */
    function dim(count:number, size:number): void {
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
     * @returns Array<IComponent>
     */
    Entity.prototype.initialize = function(totalComponents:number):Array<IComponent> {
      var mem;
      if (alloc == null) dim(totalComponents, size);
      this.instanceIndex = instanceIndex++;
      if (mem = alloc[this.instanceIndex]) return mem;

      console.log('Insufficient memory allocation at ', this.instanceIndex, '. Allocating ', size, ' entities.')
      for (var i=this.instanceIndex, l=i+size; i<l; i++) {
        alloc[i] = new Array(totalComponents);
        for (var k=0; k<totalComponents; k++) {
          alloc[i][k] = null;
        }
      }
      mem = alloc[this.instanceIndex];
      return mem;
    };
  }

}