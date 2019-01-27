---
title: 'Clean Up Your JavaScript By Going Point-Free'
date: '2018-01-31'
langs: ['en']
spoiler: 'A primer on point-free syntax in JavaScript'
---

I've tried to show [point-free style](https://en.wikipedia.org/wiki/Tacit_programming) (AKA _tacit programming_) to coworkers a few times and have always found myself surprised at how difficult it is to articulate.

A generic definition of point-free is that it's when a function is defined without mentioning its arguments _(or 'points')_. On its own, that definition's probably not very helpful, but after considering a few examples things should make more sense.

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

In this implementation we've taken the call to `incr` point-free, because we're not defining the arguments that get passed to it. Instead, we're just saying that `incr` will implicitly accept all of the arguments passed in by `map`.

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

### Beyond Method Chaining

These examples are just scratching the surface of how point-free syntax can improve your JavaScript. It really begins to shine when we combine it with currying, partial function application, and function composition.

If we revisit `incrArr`, we can take it to another level of point-free syntax:

```js
// before:
// const incrArr = arr => arr.map(incr)

const map = fn => arr => arr.map(fn)
const incr = n => n + 1

const incrArr = map(incr)
```

Now, `incrArr` is entirely point-free. It makes no reference to the arguments that it takes. If this refactor seems too extreme, you definitely don't have to go beyond eliminating your anonymous functions. The benefit of this approach, though, is that we are able to define new functions simply by composing the functions that we already have.

To see function composition in action, lets revisit our refactored `transformArr` function and apply these same strategies. As a reminder, we left it looking like this:

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
const sum = (a, b) => a + b
const incr = sum.bind(null, 1)
```

I've used `bind` to apply a value of `1` to `a` in the function `sum`. This will return a new function `n => sum(1, n)`, which is identical to how we had previously defined `incr`, but you'll notice that `incr` is now point-free 😎.

It's worth noting that the use of bind for partial-application is [generally discouraged](https://hackernoon.com/partial-application-of-functions-dbe7d9b80760) when writing functional JavaScript, because it gives you the ability to define context (also known as _this_) via that first `null` argument. Instead, you should probably use something like [lodash's partial function](https://lodash.com/docs/4.17.11#partial).

If we take our refactor to its logical conclusion, we arrive at something like this:

```js
// utils
const map = fn => arr => arr.map(fn)
const filter = pred => arr => arr.filter(pred)
const reduce = (fn, acc) => arr => arr.reduce(fn, acc)
const compose3 = (fn3, fn2, fn1) => x => fn3(fn2(fn1(x)))

// number fns
const sum = (a, b) => a + b
const incr = sum.bind(null, 1)
const isEven = n => n % 2 === 0

// array transformations
const incrementNumbers = map(incr)
const removeOdds = filter(isEven)
const sumNumbers = reduce(sum, 0)

const transformArr = compose3(sumNumbers, removeOdds, incrementNumbers);
```

This final example looks like a lot more code than what we started with, but if you consider that the utils are most likely functions that you'd import from a library like `lodash` and that the number functions are entirely reusable utils that you'd define once and use across your application, you can see how you're really starting to build up a toolbelt of testable and composable functions while refactoring your code in a more functional style.
