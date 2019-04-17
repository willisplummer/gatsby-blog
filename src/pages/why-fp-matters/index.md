---
title: 'Reading Notes: Why Functional Programming Matters'
date: '2018-04-16'
langs: ['en']
spoiler: "My notes from the article by John Hughes from The University of Glasgow"
---


## Intro

- Paper sets out to demonstrate material benefits of functional programming
- FP is a program made up of functions so that its base unit it's just a bunch of language primitives
- Functional Programs contain no assignment statements (immutability) and no side-effects (this one is a little questionable but at the least the side effects are pushed all the way out from the functional core to the imperative shell)
- Beyond laying out the material benefits of FP the author hopes to uncover a definition of FP that is not based on defining what a functional program lacks

## Analogy With Structured Programming

- structured programs are designed modularly
- the negative definition of structured programs as absent of _gotos_ is insufficient - what really matters is that a structured program facilitates programming at scale and can be applied to any language/program
- similar to structured programming FP provides new ways to break down a program: "This is the key to functional programming’s power — it allows improved mod-ularization"

## Gluing Functions Together

- explains how FP conceives of an array as `Nil | Const * (listof *)` — see the [intro to lists section here](http://learnyouahaskell.com/starting-out)
- walks through how from summing a list we can abstract reduce or `foldr` which can be used more generically to reduce any list
- the author uses partial application to demonstrate how we can take foldr and create a number of new functions simply by only passing it the first two arguments so `product` is just `foldr (*) 1` where sum was `foldr (+) 0`
- 
