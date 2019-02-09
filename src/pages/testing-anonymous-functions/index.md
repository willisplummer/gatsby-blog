---
title: 'Testing Anonymous Functions'
date: '2018-02-09'
langs: ['en']
spoiler: "It's all about extracting and testing in isolation"
---

In my [last post](/point-free-javascript/), I wrote at length about point-free syntax and function composition, but I wanted to break that post down into a few smaller posts to try to re-frame some of the core concepts in more detail. This first one is about anonymous functions in our code, why they're a code smell, and what we can do about them.

Let's revisit the same simple function that accepts an array of numbers, maps over the array, and increments each element by one.

```js
const incrArr = arr => arr.map(n => n + 1)

describe('incrArr', () => {
  it('increments each number in the array', () => {
    expect(incrArr([1, 2, 3]))
      .toEqual([2, 3, 4])
  })
})
```

My main issue with the above code is that we have the anonymous function `n => n + 1` hanging out in there. We test it implicitly in our test of `incrArr`, but without testing it in isolation, it's hard to be confident that it does what we want and as a result, if something in `incrArr` isn't working as expected, we'll also have to look at that anonymous function and see if it's the source of our bug. Basically it increases the surface area of what `incrArr` is responsible for knowing about and testing.

We can fix this with a quick refactor:

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

Sure, it seems pretty benign not to be testing a super simple function like `incr` in isolation, but I've seen countless chains of iterators that just get gnarlier and gnarlier overtime as the business logic changes and becomes more complex.

Imagine for example that our PM comes to us and says, "okay that `incrArr` function is sweet, but can we make it multiply the incremented value by 10 and then return a string that says, 'The value is now x'?"

We'd probably go back to our original function and rewrite it as:

```js
const incrArrMultiplyByTenAndPresentationalize = arr =>
  arr
    .map(n => n + 1)
    .map(n => n * 10)
    .map(n => `The value is now ${n}`)

describe('incrArrMultiplyByTenAndPresentationalize', () => {
  it('increments each number in the array, multiplies it by ten, and then presentationalizes the output', () => {
    expect(incrArrMultiplyByTenAndPresentationalize([1, 2, 3]))
      .toEqual(['The value is now 20', 'The value is now 30', 'The value is now 40'])
  })
})
```
Now, it's a lot harder to reason about what the above function is doing, and if our tests don't pass because of an issue with our multiplication, we'll have to go through each individual `map` call and make sure the anonymous functions are doing what we think they are.

If we pull out our anonymous functions and test them from the start, we'll have a much clearer picture about which part of the code is failing, because that piece's unit tests will also be red.

```js
const incr = n => n + 1

describe('incr', () => {
  it('increments a number by 1', () => {
    expect(incr(5)).toEqual(6)
  })
})

const multiplyByTen = n => n * 10

describe('multiplyByTen', () => {
  it('multiplies a number by 10', () => {
    expect(multiplyByTen(5)).toEqual(50)
  })
})

const presentationalize = n => `The value is now ${n}`

describe('presentationalize', () => {
  it('returns a string that says the value is now the [input]', () => {
    expect(presentationalize(5)).toEqual('The value is now 5')
  })
})

const incrArrMultiplyByTenAndPresentationalize = arr =>
  arr
    .map(n => incr(n))
    .map(n => multiplyByTen(n))
    .map(n => presentationalize(n))


describe('incrArrMultiplyByTenAndPresentationalize', () => {
  it('increments each number in the array, multiplies it by ten, and then presentationalizes the output', () => {
    expect(incrArrMultiplyByTenAndPresentationalize([1, 2, 3]))
      .toEqual(['The value is now 20', 'The value is now 30', 'The value is now 40'])
  })
})
```

This implementation gives us a test for each unit of work that we're performing, the tests are easy to write because each unit does very little, and the names make the `incrArrMultiplyByTenAndPresentationalize` easier to grok. We can take the readability one step further by refactoring to:

```js
const incrArrMultiplyByTenAndPresentationalize = arr =>
  arr
    .map(incr)
    .map(multiplyByTen)
    .map(presentationalize)
```

In this implementation we've gone "[point-free](https://en.wikipedia.org/wiki/Tacit_programming)" by removing the anonymous functions that were wrapping `incr`, `multiplyByTen`, and `presentationalize`. It's called "point-free" because we make no reference to the arguments (the `n`'s) that get passed to our functions by `map`. Instead, we're just saying that `incr`, `multiplyByTen`, and `presentationalize` will implicitly accept all of the arguments passed in by `map`.

It's worth noting that in javascript map actually passes three arguments (the element, its index, and the whole array), so if we passed it a function that took three arguments, we'd have access to them all:

```js
const addValueToIndexAndLengthOfArray = (n, idx, arr) => n + idx + arr.length

const transformArr = arr => arr.map(addValueToIndexAndLengthOfArray)

describe('addValueToIndexAndLengthOfArray', () => {
  it('adds the element, its index, and the length of the array', () => {
    expect(transformArr([1, 2, 3]))
      .toEqual([4, 6, 8])
  })
})
```

At first, losing the `n`'s might feel a little bit confusing, but as you get used to it, the less cluttered syntax will feel easier to read. On top of that, by removing the unneccessary anonymous functions, we're not throwing those unnecessary function calls onto the call stack. It's not a super meaningful performance enhancement, but avoiding unnecessary operations while improving readability is always a win in my book.

Next time, I'll take a look at how we can optimize our data transformations while keeping them easy to test and reason about using function composition.
