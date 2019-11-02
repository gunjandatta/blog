---
layout: "post"
title: "Create Content Types Using JSOM"
date: "2016-09-22"
description: ""
feature_image: ""
tags: []
---

I generally try to use REST to do stuff in SharePoint, but as we all know there are limitations with it. If you are doing research on creating content types NOT inheriting from the default "Item" content type, then you'll have to use SSOM, CSOM or JSOM. Below is a code example of creating a content type inheriting from the "Document" content type.

<!--more-->

This code is assuming that you are going to add a content type to the root web of the site collection. If you are executing this from a SharePoint Hosted App, then the code below will work in both the SharePoint and App webs.

```
// Get the parent 'Document' content type
var context = SP.ClientContext.get_current();
var contentTypes = context.get_site().get_rootWeb().get_contentTypes();
var parentContentType = contentTypes.getById("0x0101");

// Create the custom content type
var ctInfo = new SP.ContentTypeCreationInformation();
ctInfo.set_description("[[The description of the custom content type]]");
ctInfo.set_group("[[The group you want to associate with the content type]]");
ctInfo.set_name("[[The content type name]]");
ctInfo.set_parentContentType(parentContentType);

// Add the content type to the root web of the site collection
contentTypes.add(ctInfo);
context.load(contentTypes);

// Execute the request
context.executeQueryAsync(
     // Success
     function () {
          // Code to execute after the content type is created
     },
     // Error
     function () {
          // Error creating the content type
          console.log("Error: " + arguments[1].get_message());
     }
);

```
