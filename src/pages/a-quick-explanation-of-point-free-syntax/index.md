---
title: 'A quick explanation of point-free syntax'
date: '2018-01-31'
langs: ['en']
spoiler: 'Sometimes you can just pass your function in!'
---

New blogs are intimidating, so I figured I'd start with a straightforward post trying to explain in my own words what point-free syntax is and how it works. I've tried to articulate point-free to coworkers a few times and always found myself surprised at how difficult it is, so it seemed like a prime candidate for blogging.

Lets look at an example and then convert it to the point-free style. We want to write a function that when given an array of numbers, maps over the array and increments each number by one. We also want to test that function. Here's the code:

_(As a quick note, I'll be writing all my tests using [jest](https://jestjs.io/)'s syntax.)_

```js
const incrArr = (arr) => arr.map((number) => number + 1)

describe('incrArr', () => {
  it('increments each number in the array', () => {
    const arr = [1, 2, 3];

    expect(incrArr(arr)).toEqual([2, 3, 4])
  })
})
```

**Result**: ✅ tests pass!

Pretty straight foward, right? Now, lets say that we want to unit-test the anonymous function passed to map to increment each element of the array. We can rewrite the above to be:

```js
const incr = (number) => number + 1

describe('incr', () => {
  it('increments a number by 1', () => {
    expect(incr(5)).toEqual(6)
  })
})

const incrArr = (arr) => arr.map((number) => incr(number))

describe('incrArr', () => {
  it('increments each number in the array', () => {
    const arr = [1, 2, 3];

    expect(incrArr(arr)).toEqual([2, 3, 4])
  })
})
```

**Result**: ✅ tests pass!

This is what I see a lot of people do, and it's fine, but there's an untested anonymous function connecting `map` and `incr`. We can improve it by refactoring to:

```js
const incrArr = (arr) => arr.map(incr)
```
**Result**: ✅ tests pass!

This final change is called point-free style because we're not defining the arguments that get passed to `incr`. Instead, we're just saying that `incr` will accept all of the arguments passed in by `map`.

At first, I found this syntax to be a little confusing because you can't see what arguments `map` is passing to `incr`, but once you're used to it, it's even easier to reason about. Particularly in longer function chains.

Consider the following:

```js
const incr = (number) => number + 1

const isEven = (number) => number % 2 === 0

const sum = (acc, number) => acc + number

const transformArr = (arr) => arr
  .map(incr)
  .filter(isEven)
  .reduce(sum, 0)
```

without point-free, we'd end up writing something like this:

```js
const transformArr = (arr) => arr
  .map(n => incr(n))
  .filter(n => isEven(n))
  .reduce((acc, n) => sum(acc, n), 0)
```

or worse:

```js
const transformArr = (arr) => arr
  .map(n => n + 1)
  .filter(n => n % 2 === 0)
  .reduce((acc, n) => acc + n, 0)
```

Hopefully, it's pretty clear that writing point-free code when it's convenient to do so will encourage you to write small unit-testable functions and then compose them together instead of relying on long chains of anonymous functions.

Another great candidate for point-free syntax is in promise chains. For example:

```js
fetch('https://jsonplaceholder.typicode.com/todos/1')
  .then(response => response.json())
  .then(json => console.log(json))
```

In the above example, we could do something like this

```js
const parseJson = (response) => response.json()

fetch('https://jsonplaceholder.typicode.com/todos/1')
  .then(parseJson)
  .then(console.log)
```

I've found that `.then(console.log)` in particular surprises people but when you think about it, it's just a function that takes an arbitray number of arguments and prints them to the console. If we wanted to log results in the middle of promise chain we could even do the following:

```js
const parseJson = response => response.json();
const logAndPassthrough = (todo) => {
  console.log(todo);
  return todo;
};
const isCompleted = (todo) => todo.completed

fetch("https://jsonplaceholder.typicode.com/todos/1")
  .then(response => response.json())
  .then(logAndPassthrough)
  .then(isCompleted)
  .then(console.log)
```

For quick debugging, being able to throw in a logger with minimal keystrokes is pretty great IMO.


