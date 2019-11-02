---
layout: "post"
title: "Easy Way to Develop in SharePoint (REST) - Part I"
date: "2016-10-07"
description: ""
feature_image: ""
tags: [rest, gd-sprest]
---

This first post will go over the background and struggles of developing against the SharePoint REST api. Part II will go over the library and how to use it.

<!--more-->

### [View the Wiki for the latest information and how to use it](http://github.com/gunjandatta/sprest/wiki)

### [Link to the Latest Updates in the Framework](https://dattabase.com/blog/sp-rest-framework-updates)

## Background Info

I presented my first library at SharePoint Fest in DC (2016), and rewrote it in typescript recently. I wanted to reduce the amount of code required to interact with SharePoint, so the developer can focus on the UI/UX for the customer/client. The library is available on [npm](https://npmjs.com/packages/gd-sprest) and [github](https://github.com/gunjandatta/sprest).

## What is it?

It basically generates the url based on the object you want (Web, List, Content Type, etc), and uses a mapper class to add the available methods. The library has been developed for SP2013 and Online.

## Benefits

- Generates the REST api url and formats it for app webs automatically.
- Global flag to execute requests on creation, to reduce the number of calls to the server.
- Parent property for easier development.
- PowerShell-Like experience in the browser console. (Synchronous Requests)
- Switch between asynchronous and synchronous requests by the object's property.
- Written in TypeScript with definition file for intellisense.

## SharePoint Dev Struggles

As a SharePoint developer, you should have a running list of SharePoint gotchas that have stuck with you over the years. Most have been going away with the latest releases 2013 onwards. If you are new to SharePoint development, consider yourself lucky. I'll go over some of the development issues that I wanted to address in the library, in regards to the REST api.

### App Web vs SharePoint Web

If you want to access the SharePoint REST api from the web, you would think it's the same, but it's not. Below are examples of getting the web information of site "https://sp2013.dev" from the SharePoint web and from the app web.

#### SharePoint Web

```
https://sp2013.dev/_api/web

```

#### App Web

```
https://[app-domain]/_api/SP.AppContextSite(@target)/web?@target='https://sp2013.dev'

```

This alone would make me NOT want to use the REST api for development, since my code couldn't easily be reused, based on the web it's being executed against.

#### Solution

##### App Web Auto-Detected

The library utilizes the \_spContextPageInfo object, provided by SharePoint, which has a property isAppWeb that is used to generate the url request.

##### Developing Against Host Web

When developing against the SharePoint host web, from the App web, you can simply set the flag of the object or set the global flag:

```
$REST.DefaultRequestToHostWebFl = true;

```

_Note - This flag is false by default._

Setting this flag will automatically target the host web url found in the query string. I've found this useful when needing to copy files from the app web to the host web, for instance. This can all be done from one object.

### Passing Parameters

The next issue we are faced with is how to pass parameters to the REST methods. From my research, there are basically three ways to pass parameters:

1. Passed with the function
2. Passed in the query string
3. Passed in the body of the request
4. Passed in the url and body of the request

#### Passing Data With the Function

An example of this would be the "Apply Theme" method of the web object.

```
$.ajax({
    url: "http://<site url>/_api/web/applytheme(colorpaletteurl='/_catalogstheme/15/palette011.spcolor', fontschemaurl='/_catalogs/theme/15/fontscheme007.spfont', backgroundimageurl='/piclibrary/th.jpg', sharegenerated=true)",
    type: "POST",
    headers: { "X-RequestDigest": <form digest value> },
    success: successHander,
    error: errorHandler
});

```

#### Passing Data in the Query String

An example of this would be the "Apply Web Template" method of the web object.

```
$.ajax({
    url: "http://<site url>/_api/web/applywebtemplate(@v)?@v='blog%230'",
    type: "POST",
    headers: { "X-RequestDigest": <form digest value> },
    success: successHander,
    error: errorHandler
});

```

#### Passing Data in the Body of the Request

An example of this would be creating a field in a list.

```
$.ajax({
    url: "http://<site url>/_api/web/lists(guid'da58632f-faf0-4a78-8219-601720747741')/fields",
    type: "POST",
    data: "{ '__metadata': { 'type': 'SP.Field' }, 'Title': 'Comments', 'FieldTypeKind': 3 }",
    headers: { "X-RequestDigest": <form digest value>, "accept": "application/json; odata=verbose", "content-type": "application/json; odata=verbose", "content-length": <length of body data> },
    success: successHander,
    error: errorHandler
});

```

#### Metadata and Request Types

When developing against the REST api, you will need to know the "Type" of request. It will either be a "GET" or "POST" request. Depending on the type of request, you may need to pass in the "Metadata" type. In general, it's easy to remember, since it's basically the object type ("SP.List" for example). For list items, the name of the list is embedded in the metadata type, so a list named "Team Tasks" will have a metadata type of "SP.Data.Team\_x0020\_tasksListItem".

No developer will be able to remember all of this, and they shouldn't.

#### Solution

The library will automatically take care of the metadata and request types, including the dynamic metadata types for list items.

### Asynchronous vs Synchronous

Let's be clear on this one. I 100% recommend writing asynchronous requests. That being said, as a developer I would also like the option to decide and have the ablity to flip between them.

#### JS Links

JS Links are new to SharePoint 2013, and are VERY useful for customizing list forms and views. The issue with JS Links, is that the override expects you to return the html of the field customization and will not allow asynchronous requests. Now there are many work-arounds, but this can lead to horrible "hacks" as I call them and a lot more code and therefore bugs to be created.

#### Solution

Each object will have a property "asyncFl", which allows you to switch between asynchronous and synchronous calls. The objects created from the request will automatically inherit the parent options.

#### Powershell Like Experience in the Browser

This one is one of my favorites. Since we can make synchronous calls, if you open up the browser's console, you can interact with the site similar to powershell. This has been VERY useful in cases where you do not have access to the server, or need to quickly run a query to get or update data. When developing, I have the console window open to test as I write the code. This will ensure the code written works.

## Conclusion

I hope this gives enough background information to the benefits and use of the library. Refer to Part II for a more indepth look at the library and how to use it.
