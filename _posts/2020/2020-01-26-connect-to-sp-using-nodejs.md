---
layout: "post"
title: "Connect to SharePoint using NodeJS"
date: "2020-01-26"
description: "Code example for connecting to SharePoint using NodeJS."
feature_image: ""
tags: ["node js"]
---

This post will give an example of getting data from SharePoint using NodeJS.

<!--more-->

### Libraries

The first thing we will do is get the required libraries. Run

```npm i node-sp-auth request-promise gd-sprest```

to install the required libraries.

- [node-sp-auth](https://github.com/s-KaiNet/node-sp-auth) used to authenticate with SharePoint.
- [request-promise](https://github.com/request/request-promise) used to execute the HTTP request.
- [gd-sprest](https://github.com/gunjandatta/sprest) used to generate the HTTP request format.

#### Import the Libraries

Now that we have the required libraries, we can import them in the script file.

```js
var spauth = require('node-sp-auth');
var request = require('request-promise');
var $REST = require("gd-sprest");

// Code Continues in 'Connect to SharePoint'
```

#### Connect to SharePoint

Now that the libraries are available, we will connect to SharePoint. Refer to the [documentation](https://github.com/s-KaiNet/node-sp-auth) for additional examples of connecting to various environments. We will connect to SPO for this example.

```js
// Log
console.log("Connecting to SPO");

// Connect to SPO
var url = "https://[tenant].sharepoint.com/sites/dev";
spauth.getAuth(url, {
    username: "[SPO Login]",
    password: "[SPO Password]",
    online: true
}).then(options => {
    // Log
    console.log("Connected to SPO");

    // Code Continues in 'Generate the Request'
});
```

#### Generate the Request

This code example will get files stored in the "Site Assets" library's "sprest" sub-folder. We will use the [gd-sprest](https://dattabase.com) $REST library to generate the request information.

##### SharePoint REST API Intellisense

![Intellisense](images/NodeJS/intellisense.png)

The [gd-sprest](https://dattabase.com) library provides the intelliense automatically.

```js
    // Get the web
    var info = $REST.Web(url)
        // Get the 'Site Assets' library
        .Lists("Site Assets")
        // Get the root folder
        .RootFolder()
        // Get the 'sprest' sub-folder
        .Folders("sprest")
        // Get the files in the folder
        .Files()
        // Get the request information
        .getInfo();

    // Code Continues in 'Request Header Information'
```

##### Request Header Information

In order for the request to be successful, we will need to copy the header information from the SP authentiation. We now have all of the information required to make the request.

```js
    // Copy the headers from the SP authentication
    for (var key in options.headers) {
        // Set the header
        info.headers[key] = options.headers[key];
    }

    // Code Continues in 'Execute the Request'
```

#### Execute the Request

We will execute the Get/Post request, based on the type. Refer to the [documentation](https://github.com/request/request-promise) for additional examples of executing requests. The object returned is expected to be a JSON object, so we can easily parse it to a variable. This request will return a collection, so we can easily output the data to the console.

```js
    // Execute the request, based on the method
    request[info.method == "GET" ? "get" : "post"]({
        headers: info.headers,
        url: info.url,
        body: info.data
    }).then(
        // Success
        response => {
            var obj = JSON.parse(response).d;
            if (obj.results && obj.results.length > 0) {
                // Parse the results
                for (var i = 0; i < obj.results.length; i++) {
                    // Log
                    console.log(obj.results[i]);
                }
            } else {
                // Log
                console.log(obj);
            }
        },
        // Error
        error => {
            // Log
            console.log("Error executing the request", error);
        }
    );
```

##### Sample Output

~[Sample Output](images/NodeJS/output.png)