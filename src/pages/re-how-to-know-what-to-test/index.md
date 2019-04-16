---
title: 'Re: How To Know What To Test by Kent C Dodds'
date: '2018-04-16'
langs: ['en']
spoiler: "TDD solves a lot of this"
---

I sometimes find myself a little skeptical of Kent C Dodds' approach to testing React applications, but it can be hard for me to pin down why. I think it relies a little too heavily on integration testing though I do agree with his guiding principal that we should avoid testing implementation details. I think I just disagree about what constitutes an implementation detail at times.

But I've been thinking a lot recently about the purpose that tests serve. I think that we sometimes overlook or take for granted what exactly they're doing for us.

So I appreciate this article that he just posted, [How to know what to test](https://kentcdodds.com/blog/how-to-know-what-to-test). It talks a little about the difference between code coverage and use-case coverage and provides an example of the dangers of missing a use-case in your tests:

given the following function:

```js
function arrayify(maybeArray) {
  if (Array.isArray(maybeArray)) {
    return maybeArray
  } else {
    return [maybeArray].filter(Boolean)
  }
}
```

> "So, as an example for how missing this test can go wrong, someone could come around, see that .filter(Boolean) thing and think: "Huh, that's weird... I wonder if we really need that." So they remove it, and our tests continue to pass, but any code that relied on the falsy behavior is now broken."

> "Key takeaway: Test use cases, not code."

I've been watching a ton of Gary Bernhardt's videos on [Destroy All Software](https://www.destroyallsoftware.com/) recently, and I seeing how he approaches TDD (Test Driven Development) can provide a good contextual framework for how to ensure that you're testing all the usecases.

If he were implementing the `arrayify` function, he'd write a test that said, `when given an array it returns the array` and then implement that piece of code:

```js
const arrayify = (maybeArray) => maybeArray
```

Then he’d write a test that said `when input is not an array it returns an array of the input` and implement the function to meet both use-cases:

```js
const arrayify = (maybeArray) => Array.isArray(maybeArray) ? maybeArray : [maybeArray]
```

At that point if he cared about enforcing that if the function was provided a falsey value, it would return an empty array, he'd write a third test `when given a falsey value it returns an empty array` and implement the function like so:

```js
const arrayify = (maybeArray) => Array.isArray(maybeArray) ? maybeArray : [maybeArray].filter(Boolean)
```

I don't always practice TDD but I think this example reinforces the way that it makes identifying all of the use cases that need to be tested simpler, and it's something that I'm trying to get into the habit of doing more of.
