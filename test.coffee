class Counter

  constructor: (max) ->
    count = 0
    counter = () ->
      if (count < counter.max) then return ++count
      else return count = 1

    counter.max = Math.abs(parseInt(max)) || 1

    counter.__proto__ = Counter::
    # Setting the internal [[proto]]` property of the function being returned to the prototype of the constructor.

    return counter

# Allow `instanceof Function` to return `true`, as well as `call`, `apply`, etc to be used.
Counter:: = () ->

# Reset the `constructor` property of the prototype to point to the constructor `Counter`.
#Counter::constructor = Counter
Counter::reset = () ->
  while @() < @max
    i=0

counter = new Counter(3)

console.log(counter())                                # 1
counter.reset()

console.log(counter())                                # 1
console.log(counter())                                # 2
counter.reset()

console.log(counter())                                # 1
console.log(counter())                                # 2
console.log(counter())                                # 3