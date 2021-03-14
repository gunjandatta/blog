---
layout: "post"
title: "No Batch No Problem"
date: "2021-03-13"
description: "Example on how to expand sub-properties of an OData request."
feature_image: ""
tags: ["rest", "odata"]
---

This post will go over how to expand sub-properties of an OData REST API request without using a batch request. This will be useful in SharePoint 2013+ On-Premise environments where the batch request is not available.

<!--more-->

### Demo Example

We will query a document set library with the following information:

* Document Set library named `Doc Set Demo`
* Document Set content type renamed to `Dashboard Item`
* Document Set item created and called `Test`

The folders/files included in this item are:

| **Name** | **Type** | **Path** |
| Document.aspx | File | /Document.aspx |
| Folder | Folder | /Folder |
| Document.aspx | File | /Folder/Document.aspx |
| SubFolder | Folder | /Folder/SubFolder |
| SubDocument.aspx | File | /Folder/SubFolder/Document.aspx |
| SubSubFolder | Folder | /Folder/SubFolder/SubSubFolder |
| SubSubDocument.aspx | File | /Folder/SubFolder/SubSubFolder/Document.aspx |

Our goal is to get all of this information in one request.

### OData Query

The OData query has an `Expand` property that allows you to include collections of an object. Most people are aware of this, but did you know that you can also include sub-sub-properties too? Neither did I until a month ago :-).

```ts
import { List } from "gd-sprest";

// Query the document set demo library
List("Doc Set Demo").Items().query({
    // Filter for only the document set item types
    Filter: "ContentType eq 'Dashboard Item'",
    Expand: [
        "Folder", "Folder/Files", "Folder/Folders/Files", "Folder/Folders/Folders/Files", "Folder/Folders/Folders/Folders/Files"
    ]
}).execute((items) => {
    // Parse the items
    for(let i=0; i<items.results.length; i++) {
        let item = items.results[i];

        // Parse the files
        for(let j=0; j<item.Files.results.length; j++) {
            let file = item.Files.results[j];

            // Code goes here
        }

        // Parse the sub-folder
        for(let j=0; j<item.Files.results.length; j++) {
            let folder = item.Folders.results[j];

            // Code goes here
        }
    }
});
```

### Demo

Below is an example of the request where I've manually expanded the sub-properties.

![Demo Query](images/ODataExpand/demo.png)

### Summary

This can be applied to any of the collections. I recommend that you also utilize the "Select" option to limit what to return to help w/ performance.

Hope this example helps. Happy Coding!!!