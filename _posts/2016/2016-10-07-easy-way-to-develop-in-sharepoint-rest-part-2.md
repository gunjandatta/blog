---
layout: "post"
title: "Easy Way to Develop in SharePoint (REST) - Part II"
date: "2016-10-07"
description: ""
feature_image: ""
tags: [rest, gd-sprest]
---

I'll highlight the benefits, but if you want background information, then refer to the previous post. This post will go over the REST library and how it can be used to minimize the amount of code required with interacting with SharePoint. The library is available on [npm](https://npmjs.com/packages/gd-sprest) and [github](https://github.com/gunjandatta/sprest).

<!--more-->

### [Link to the Latest Updates in the Framework](https://dattabase.com/blog/sp-rest-framework-updates)

## Benefits

- Generates the REST api url and formats it for app webs automatically.
- Global flag to execute requests on creation, to reduce the number of calls to the server.
- Parent property for easier development.
- PowerShell-Like experience in the browser console. (Synchronous Requests)
- Switch between asynchronous and synchronous requests by the object's property.
- Written in TypeScript with definition file for intellisense.

## Intellisense

This is probably the most important one, the abililty to have all the properties and methods available in TypeScript. ![Intellisense](https://raw.githubusercontent.com/gunjandatta/sprest/master/images/intellisense.png)

## Developing Against the Host Web From the App Web

A global flag is used to determine if an app web request should execute against the host web or current web. Refer to the documentation on github/npm for additional details on interacting w/ other webs.

```
$REST.DefaultRequestToHostWebFl = true;

```

_Note - This flag is false by default_

If set to true, the request will use the "SPHostUrl" query string parameter. This flag can be used to flip back and forth between requests. I've found this useful when needing to copy files between the app web and the host web.

## Object Constructors

### Target Information

The target information consists of the following properties: \* asyncFl - Flag to determine if the request should executes asynchronously or synchronously. \* bufferFl - Flag to determine if the output of the request is a file stream. \* callback - Required for asynchronous request. Executed after execution. \* data - Template used for passing the method parameters in the body of the request. \* defaultToWebFl - Flag to determine if the url should default to the current web url, site url otherwise. \* method - The request method type. \* endpoint - The api endpoint. \* url - The server relative site/web url to execute the request against.

_Note - In general, you won't have to use this input parameter_

### PowerShell-Like Experience

Since the library can be executed synchronously, the user can execute commands in the browser's console window and interact with the SharePoint site in a command-line interface.

_Note - The commands will execute under the security of the current user._ _Note - SharePoint online may reject synchronous requests. It's better to use asynchronous requests._

### OData Queries

Each collection will have a generic "query" method with the input of the OData query operations. The oData object consists of the following properties: \* Expand - A collection of strings representing the field names to expand. \* Filter - A string representing the filter to apply. \* OrderBy - A collection of strings representing the fields to order by. \* QueryString - A read-only property representing the query string value of the oData object. \* Select - A collection of strings representing the field names to select. \* Skip - The number of objects to skip. \* Top - The maximum number of objects to return.

## Asynchronous and Synchronous Requests

### Asynchronous/Synchronous requests

All availabe objects having an api entry point, will have the following constructors \[Object\] and \[Object\]\_Async.

#### Asynchronous Examples

_**Get the Current Web**_

```
// Get the current web
(new Web_Async())
    // Execute the request
    .execute(function(web) {
        // Code to execute after the request completes
    });

```

_**Create a List**_

```
// This will create the web object
(new $REST.Web_Async())
    // Get the list collection
    .Lists()
    // Add the list
    .add({
        BaseTemplate: 100,
        Description: "This is an example of creating a list.",
        Title: "Test"
    })
    // Execute the request
    .execute(function(list) {
        // Additional code to execute after creating the list
    });

```

#### Synchronous Examples

_**Get the Current Web**_

```
var web = (new $REST.Web()).execute();

```

_**Create a List**_

```
// This will create the web object
var list = (new $REST.Web())
    // Get the list collection
    .Lists()
    // Add the list
    .add({
        BaseTemplate: 100,
        Description: "This is an example of creating a list.",
        Title: "Test"
    })
    // Execute the request
    .execute();

// Additional code to execute after creating the list

```

### Ability to Switch Between Modes

The "asyncFl" property can be set to true/false to flip between the two request types.

_Note - My recommendation is to execute asynchronous requests, but like the ability to choose._

## Examples

The point of this library is to reduce the amount of code required when interacting with SharePoint. If you want a content type, list or list items, I really just wanted to the ability to get this information in one line of code. Here are some examples I believe you will find useful. Refer to the documentation on github/npm for a full list of examples.

### OData Query

#### Query List Item Collection

```
// Get the 'Dev' list
(new $REST.List_Async("Dev"))
    // Get the item collection
    .Items()
    // Query for my items, expanding the created by information
    .query({
            Select: ["Title", "Author/Id", "Author/Title"],
            Expand: ["Author"],
            Filter: ["AuthorId eq 11"]
    })
    // Execute code after the request is complete
    .execute(function(items) {
            // Code goes here
    });

```

### List

#### Asynchronous

```
// Get the list
(new $REST.List_Async("[List Display Name]"))
    // Execute the request
    .execute(function(list) {
        // Additional code goes here
    });

```

#### Synchronous

```
var list = new $REST.List("[List Display Name]");

```

### List Items

#### All Items

```
// Get the list
(new $REST.List_Async("[List Display Name]"))
    // Get the item collection
    .Items()
    // Execute the request
    .execute(function(items) {
        // Additional code goes here
    });

```

#### OData Query

```
// Get the list
(new $REST.List_Async("[List Display Name]"))
    // Get the item collection
    .Items()
    // Query the collection
    .query({
        // OData Settings go here
    })
    // Execute the request
    .execute(function(items) {
        // Additional code goes here
    });

```

#### CAML

```
// Get the list
(new $REST.List_Async("[List Display Name]"))
    // Get the items by CAML query
    .getItemsByQuery("<Query>...</Query>")
    // Execute the request
    .execute(function(items) {
        // Additional code goes here
    });

// Get the list
(new $REST.List_Async("[List Display Name]"))
    // Get the items by CAML view query
    .getItems("<View>...</View>")
    // Execute the request
    .execute(function(items) {
        // Additional code goes here
    });

```

### List Item

#### Update

```
// Get the list
(new $REST.List_Async("[List Display Name]"))
    // Get the item by id
    .Items([Item Id])
    // Execute the request
    .execute(function(item) {
        // Make a synchronous request
        item.asyncFl = false;

        // Update the item
        item.update({
            // The item properties to update
            Title: "New Title"
        }).execute();
    });

```

_Note - I wanted to show the ability to switch between asynchronous and synchronous requests._ _Note - The update can take multiple parameters, based on the fields you want to update._

### Content Type

#### Web

```
// Get the web
(new $REST.Web())
    // Get the content type collection
    .ContentTypes()
    // Get the content type by its name
    .getByName("[Content Type Name]")
    // Execute the request
    .execute(function(ct) {
        // Additional code goes here
    });

```

#### List

```
// Get the list
(new $REST.List("[Name of the List]"))
    // Get the content type collection
    .ContentTypes()
    // Get the content type by its name
    .getByName("[ListT"[Name of the List]"ype Name]")
    // Execute the request
    .execute(function(ct) {
        // Additional code goes here
    });

```

### Field

#### Web

```
// Get the web
(new $REST.Web())
    // Get the field
    .Fields("[Field Internal Name or Title]")
    // Execute the request
    .execute(function(field) {
        // Additional code goes here
    });

```

#### List

```
// Get the list
(new $REST.List("[Name of the List]"))
    // Get the field
    .Fields("[Field Internal Name or Title]")
    // Execute the request
    .execute(function(field) {
        // Additional code goes here
    });

```

### Fields

#### Web

```
// Get the web
(new $REST.Web())
    // Get the field collection
    .Fields()
    // Execute the request
    .execute(function(fields) {
        // Additional code goes here
    });

```

#### List

```
// Get the list
(new $REST.List("[Name of the List]"))
    // Get the field collection
    .Fields()
    // Execute the request
    .execute(function(fields) {
        // Additional code goes here
    });

```

### File

#### Web

```
// Get the web
(new $REST.Web())
    // Search the root folder for a field
    .RootFolder("default.aspx")
    // Execute the request
    .execute(function(file) {
        // Additional code goes here
    });

```

#### List/Library

```
// Get the 'Documents' library
(new $REST.List("Documents"))
    // Get the root folder
    .RootFolder()
    // Get the 'Forms' sub-folder
    .Folders("forms")
    // Get the 'Edit' form
    .Files("editform.aspx")
    // Execute the request
    .execute(function(file) {
        // Additional code goes here
    });

```

## Conclusion

I hope the above examples are helpful and make life easier for SharePoint developers. The above examples are not ALL the options for interacting with SharePoint. I wanted to give examples of how you can utilize the library and ensure it was flexible to handle whatever you need to do.

Please report bugs/issues on github.
