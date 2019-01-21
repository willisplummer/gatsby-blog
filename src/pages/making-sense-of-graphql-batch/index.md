---
title: Making sense of GraphQL Batch
date: '2018-02-02'
langs: ['en']
spoiler: Understanding and solving n+1 queries in ruby-graphql.
---

At work, I've started exploring transitioning us from an JSON API built with the [jsonapi-resources](http://jsonapi-resources.com/) to a new GraphQL endpoint. There are a number of motivations for the switch (speed of iteration both on the front-end and back-end are high on the list) but the top priority is to create a more performant API.

To make our GraphQL API as efficient as possible, I've been following some of the patterns established by my former coworkers at Kickstarter where we were using graphql-batch. I was able to get this working such that the following query went from n+1 queries to just three:

```js
grapqhl{
  users {
    engagements {
      sessions
    }
  }
}
```

In the example above a user has many engagements and an engagement has many sessions.
