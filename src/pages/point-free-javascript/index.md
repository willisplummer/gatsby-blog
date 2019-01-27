---
title: 'Clean Up Your JavaScript By Going Point-Free'
date: '2018-01-31'
langs: ['en']
spoiler: 'A primer on point-free syntax in JavaScript'
---

New blogs are intimidating, so I figured I'd start with a relatively straightforward post explaining in my own words what [point-free style](https://en.wikipedia.org/wiki/Tacit_programming) (AKA _tacit programming_) is and how it works. I figured this was worth blogging about because I've tried to show point-free syntax to coworkers a few times and always found myself surprised at how difficult it is to articulate.

A generic definition of point-free is that it's when a function is defined without mentioning its arguments (_or_ 'points'). On its own, that's probably not very helpful, but hopefully by the end of this post it will start making sense.

Let's look at a simple function that accepts an array of numbers, maps over the array and increments each element by one.

_(I'll be writing all my tests using [jest](https://jestjs.io/)'s syntax.)_

```js
const incrArr = arr => arr.map(n => n + 1)

describe('incrArr', () => {
  it('increments each number in the array', () => {
    expect(incrArr([1, 2, 3]))
      .toEqual([2, 3, 4])
  })
})
```

Pretty straight foward, right? Now, lets say that we want to unit-test the anonymous function we pass to `map`. We can rewrite the above as:

```js
const incr = n => n + 1

describe('incr', () => {
  it('increments a number by 1', () => {
    expect(incr(5)).toEqual(6)
  })
})

const incrArr = arr => arr.map(n => incr(n))

describe('incrArr', () => {
  it('increments each number in the array', () => {
    expect(incrArr([1, 2, 3]))
      .toEqual([2, 3, 4])
  })
})
```

This is what I see a lot of people do, and it's fine, but there's an untested anonymous function connecting `map` and `incr`. We can improve our code even further by refactoring `incrArr` to:

```js
const incrArr = arr => arr.map(incr)
```

This final implementation is point-free, because we're not defining the arguments that get passed to `incr`. Instead, we're just saying that `incr` will implicitly accept all of the arguments passed in by `map`.

At first, I found this syntax to be a little confusing because you can't see explicitly which arguments `map` passes to `incr`, but now that I'm used to it, this style is much easier to reason about.

This is especially true when considering longer method chains:

```js
const transformArr = arr => arr
  .map(n => n + 1)
  .filter(n => n % 2 === 0)
  .reduce((acc, n) => acc + n, 0)
```

which we can rewrite as

```js
const incr = n => n + 1
const isEven = n => n % 2 === 0
const sum = (acc, n) => acc + n

const transformArr = arr => arr
  .map(incr)
  .filter(isEven)
  .reduce(sum, 0)
```

Hopefully, it's pretty clear that the point-free style here is much more expressive about the transformations that we're performing. Beyond expressiveness, we end up breaking out the anonymous functions into single-purpose named functions which can be tested in isolation and reused throughout the application, which will help to DRY up our codebase.

Another great candidate for point-free syntax is a promise chain. For example:

```js
fetch('https://jsonplaceholder.typicode.com/todos/1')
  .then(response => response.json())
  .then(json => console.log(json))
```

We can go point-free like so:

```js
const parseJson = (response) => response.json()

fetch('https://jsonplaceholder.typicode.com/todos/1')
  .then(parseJson)
  .then(console.log)
```

I've found that `.then(console.log)` in particular surprises people. When you think about it, `console.log` is just a function that takes an arbitrary number of arguments and prints them to the console.

If we wanted to log results in the middle of a promise chain and then continue transforming the result, we could even do the following:

```js
const parseJson = response => response.json();
const logAndPassThrough = (todo) => {
  console.log(todo)
  return todo
};
const isCompleted = (todo) => todo.completed

fetch("https://jsonplaceholder.typicode.com/todos/1")
  .then(response => response.json())
  .then(logAndPassThrough)
  .then(isCompleted)
  .then(console.log)
```

For quick debugging, being able to throw in a logger with minimal keystrokes is pretty great in my opinion.

### Beyond Dot Chaining

These examples are just scratching the surface of how point-free syntax can improve your JavaScript. It really begins to shine when we combine it with currying, partial-application, and function composition.

As a final note, lets revisit our refactored `transformArr` function, which looked like this:

```js
const incr = n => n + 1
const isEven = n => n % 2 === 0
const sum = (acc, n) => acc + n

const transformArr = arr => arr
  .map(incr)
  .filter(isEven)
  .reduce(sum, 0)
```

You'll notice that `incr` is almost exactly identical to `sum` except that it always adds one. We could rewrite these functions like so:

```js
const sum = (a, b) => a + b
const incr = n => sum(1, n)
```

And then we can take it a step further using partial function application.

```js
import partial from 'lodash/partial'

const sum = (a, b) => a + b
const incr = partial(sum, 1)
```

For the sake of time, I've used lodash's [`partial`](https://lodash.com/docs/4.17.11#partial) function to apply a value of `1` to `a` in the function `sum` and then return a new function `b => 1 + b`. You'll notice that `incr` is now also point-free 😎.
