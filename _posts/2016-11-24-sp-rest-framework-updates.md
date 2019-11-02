---
layout: "post"
title: "SP REST Framework Updates"
date: "2016-11-24"
description: ""
feature_image: ""
tags: []
---

This post will go over the latest changes to the gd-sprest project. This framework is used to develop against the SharePoint 2013/Online REST api. It's available at [github](http://gunjandatta.github.io/sprest) and [npm](https://www.npmjs.com/package/gd-sprest).

<!--more-->

### Removed Methods

#### next()

The "next()" method, which previously allowed you to chain events has been removed. This feature still exists, but is part of the "execute()" method.

### New/Updated Methods

#### done()

The "done()" method will wait for all requests to complete before executing the callback method. It takes the following input parameters: \* callback - The callback is a function type, which is executed after the request completes.

#### execute()

The "execute()" method has been updated. It takes the following input parameters: \* callback - The callback is a function type, which is executed after the request completes. \* waitFl - The wait flag is a booean type, which will wait for the previous request to complete before executing the current request.

#### executeAndWait()

The "executeAndWait()" method will execute the request synchronously, and return the requested object. This method would most likely be used in the console browser, for a "PowerShell-Like" experience.

### Full Control of Request Execution Order

A new feature of the framework is the ability to have full control of the request execution order. Since the requests execute asynchronously, we are forced to write additional code to handle dependent calls. The "executeMethod()" has a new "waitFl" flag, which allows the developer to indicate this request must execute after the previous requests have completed. If the optional "callback" method returns a promise, then the request will wait for it to complete before executing the next request. To better explain this, refer to the figure shown below for the "execute()" method logic.

#### execute() Method Logic

[![Execute Method](http://dattabase.com/wp-content/uploads/2016/11/executeMethod.png)](http://dattabase.com/wp-content/uploads/2016/11/executeMethod.png)

#### Server-Side Code Comparison

The new features allows for less code required to interact with SharePoint. I recommend taking a look at the [helper.ts](https://github.com/gunjandatta/sprest/blob/master/src/helper.ts) method for more advanced examples of using the library. Below is a simple example of creating a list in SSOM (Server-Side Object Model) vs this framework.

##### Server-Side Code Example

[![Server Side Code Example](http://dattabase.com/wp-content/uploads/2016/11/SSOMvsSPREST_1.png)](http://dattabase.com/wp-content/uploads/2016/11/SSOMvsSPREST_1.png)

##### TypeScript Code Example

[![TypeScript Code Example](http://dattabase.com/wp-content/uploads/2016/11/SSOMvsSPREST_2.png)](http://dattabase.com/wp-content/uploads/2016/11/SSOMvsSPREST_2.png)

### Conclusion

The goal of this framework was to give a "Server-Side" like experience, so I'm very happy with the result. I hope this framework saves people time and headache when interacting w/ SharePoint.
