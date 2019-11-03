---
layout: "post"
title: "Tasks List Not Connecting to Project Summary WebPart"
date: "2018-02-06"
description: ""
feature_image: ""
tags: [list]
---

### The Issue

A SharePoint 2013 tasks list created through code was not connecting to the Out-of-the-Box (OTB) [Project Summary](https://support.office.com/en-us/article/view-tasks-and-events-in-the-project-summary-web-part-03ce0b76-3e4e-4991-ad73-d745c889a2f2) webpart.

<!--more-->

### Background Information

We created a task list through code using the REST api. This is fairly simple to do with the [gd-sprest](https://gunjandatta.github.io) library, refer to [this page](https://gunjandatta.github.io/topics/automation) for additional details. Regardless of the library you use to create a list, you must set the list creation information. The minimum information you need to provide is the title of the list and the list template type. Refer to [this page](https://gunjandatta.github.io/api/list) for a list of the template types.

_The Tasks list template is **107**_

### Solution

When clicking on the link to "Create a Task List", provided by the project summary webpart, I noticed the template type was set to **171**. This template was unknown to me, since I'm used to only dealing with **10x** list template types. When looking this up, the template being referenced is **TasksWithTimelineAndHierarchy**. I updated the solution to create a list using **171**, and the project summary webpart was now connecting to it.

When creating a tasks list via code for SharePoint 2013, make sure to use template 171 if you want the list to work with the "Project Summary" webpart.
