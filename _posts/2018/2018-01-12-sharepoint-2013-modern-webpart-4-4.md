---
layout: "post"
title: "SharePoint 2013 Modern WebPart (4 of 4)"
date: "2018-01-12"
description: ""
feature_image: ""
tags: []
---

#### Still Working On This One ;)

- [Modern WebPart Overview](https://dattabase.com/blog/sharepoint-2013-modern-webpart)
- [Demo 1 - TypeScript](https://dattabase.com/blog/sharepoint-2013-modern-webpart-1-4)
- [Demo 2 - React](https://dattabase.com/blog/sharepoint-2013-modern-webpart-2-4)
- [Demo 3 - VueJS](https://dattabase.com/blog/sharepoint-2013-modern-webpart-3-4)
- [Demo 4 - AngularJS](https://dattabase.com/blog/sharepoint-2013-modern-webpart-4-4) **(This Post)**

<!--more-->

### Angular WebPart Example

This is the last of four demos giving an overview of creating modern webpart solutions for SharePoint 2013+ environments. The demo code can be found in [github](https://github.com/gunjandatta/demo-wp). The goal of this post is to give an example of using Angular, while creating a similar demo in the [previous post](https://dattabase.com/blog/sharepoint-2013-modern-webpart-3-4) using VueJS. This is the first time I've coded in Angular, which was much more difficult to figure out starting out than VueJS. As much as I wanted to give a minimal example, I'm going to use the anguarl-cli to create the project.

#### Requirements

- [NodeJS](https://nodejs.org/en) - A superset of JavaScript functions. NodeJS allows us to develop code similar to C#, which is compiled into JavaScript.

##### Install Angular CLI

Install the angular cli globally, before moving on.

```
npm i -g @angular/cli

```

### Create the Project

_[Angular](https://angular.io/guide/quickstart) - The angular quickstart guide_

```
ng new demo-wp-angular

```

#### Install Libraries

- [gd-sprest](https://gunjandatta.github.io/sprest) - The library used to create the webpart

```
npm i --save gd-sprest

```

#### Source Code

##### SharePoint Configuration (src/cfg.ts)

Since the react demo included the list configuration, we will leave it out of this demo.
