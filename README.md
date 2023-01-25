# Afar

Afar - stands for **Async Functions As Reducers**. 

> Background: I maintain the [`csar`](https://www.npmjs.com/package/csar) library and I wanted to give it more structure and make it a bit more granular. So, I renamed it and made this monorepo for all things around this type of state management. This is the successor for `csar`.

This is an [`nx`](https://nx.dev) monorepo that ships a few state management related libraries.

## The concept

Redux methodology in general looks down on using async functions as reducers, and for good reason. But I (and some people I work with) thought - "What if we go ahead and use them anyway?". We just wanted a quick non-redux solution using `useReducer` but with async capabilities, when we started. It quickly evolved to - 

- What if we could dispatch from within the reducer so orchestration doesn't need another library and that way a pattern instead now?
- We have problems with stale state. What if we only support `getState()` style function instead of a static reference to `state` in a reducer?
- We have problems with separating "orchestration" type actions using internal dispatch versus "UI" actions. What if we could provide a method to have a subset of actions available instead of all actions?
- We have a problem dealing with external async operations within the async reducers - what if we had a helper for that?

and so on..

So, now we have something that looks like reinvented wheel but it feels more like magnetic levitation propulsion more than a wheel. It is a weird different way of managing state. And we think it will be useful for you sometimes - especially when tiny payload is important to you.

## TODO

- [] Contributing guide
- [] Tests the `@afar/state` library
- [] Set up the docs site
