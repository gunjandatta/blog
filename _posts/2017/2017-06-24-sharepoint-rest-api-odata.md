---
layout: "post"
title: "SharePoint REST API OData"
date: "2017-06-24"
description: ""
feature_image: ""
tags: [rest, odata]
---

This post will go over the SharePoint REST API's OData query. For demonstrating how to get the data, we will be using the [gd-sprest](https://gunjandatta.github.io/sprest) library.

<!--more-->

### Overview

The SharePoint REST API allows you to utilize OData requests against the objects. I've generally only seen this used when querying list items to expand the User or Lookup fields. You can actually use the OData query to expand collections of the object as well. This post will give examples of how to query the SharePoint REST API to get an object w/ expanded properties.

### SharePoint REST API

To access the RAW results of a basic request to the web, you add "\[Url\]/\_api/web" to the url. ![Web API](images/OData/web_api.png) _Note - You have to turn off the "Feed Reading View" in IE to view the raw results_

The area at the top shows the collections that are available for the object. Some of them are listed below:
* ContentTypes
* AssociatedMemberGroup
* AssociatedOwnerGroup
* AssociatedVisitorGroup
* CurrentUser
* Fields
* Folders
* Lists
* RoleAssignments
* RoleDefinitions
* SiteUsers
* Webs

To get the "Fields" for the web, the url would be "\[Url\]/\_api/web/fields". ![Fields API](images/OData/fields_api.png)

If you wanted get the web information as well as the fields, this would require two requests to the server. Using JSOM or CSOM code, you can do this with one request to the server. Now that you can expand the collections using OData query, we can accomplish this in one request to the server. For example, if you wanted to get the web information, current user and fields, the request would be "\[Url\]/\_api/web?$expand=CurrentUser,Fields" ![Web OData API](images/OData/web_odata_api.png)

If you look at the top portion, you'll notice that the "Current User" can be expanded containing the current user information ![Current User](images/OData/web_currentuser_info_LI.jpg)

The same goes for the "Fields" property. ![Web Fields](images/OData/web_fields_info.png)

### Developing using the SharePoint REST API

This new information led me to rewriting the intellisense for the [gd-sprest](https://gunjandatta.github.io/sprest) library to support this type of functionality. It's pretty powerful when adding other OData options like "Filter, Select, Top, etc". Using the library, you can execute requests from the browser console window or using TypeScript. Being able to run REST API requests from the browser console will allow you to test your code samples without building and deploying it.

#### Browser Console

The code sample below uses the [gd-sprest](https://gunjandatta.github.io/sprest) library to query the current web and expand the current user and fields properties.

```
var web = (new $REST.Web()).query({ Expand: ["CurrentUser", "Fields"] }).executeAndWait();

```

![Web Console](images/OData/web_console.png)

#### TypeScript

The code sample below is the same as the above, but written in TypeScript. Notice that the library will no longer require you to specify the result type in order to get intellisense.

```
import { Web } from "gd-sprest";

// Get the current web
(new Web())
    // Expand the current user and fields
    .query({
        Expand: ["CurrentUser", "Fields"]
    })
    // Execute the request
    .execute(web => {
        let loginName = web.CurrentUser.LoginName;

        // Parse the fields
        for (let i = 0; i < web.Fields.results.length; i++) {
            let field = web.Fields.results[i];
        }
    });

```

###### Current User Intellisense

![Web Current User](images/OData/web_ts_currentuser.png)

###### Fields Intellisense

![Web Fields](images/OData/web_ts_fields.png)

### Code Examples

#### Files

I've always found it annoying to deal with files and folders in SharePoint. To get a folder, sub-folders and files requires too many requests. Now that we can expand the properties, we can do this all in one request now. This code example will get the root folder of the Site Assets and display the files/folders. The url for this request is: "\[url\]/\_api/lists/getbytitle('Site%20Assets')/RootFolder?$expand=Files,Folders"

```
import { List } from "gd-sprest";

// Get the Site Assets library
(new List("Site Assets"))
    // Get the root folder
    .RootFolder()
    // Expand the sub-folders and files
    .query({
        Expand: ["Files", "Folders"]
    })
    // Execute the request
    .execute(folder => {
        let files = folder.Files.results;
        let subFolders = folder.Folders.results;
    });

```

#### List

Some developers want to query for a list using the static property "EntityTypeName". The example below shows how to execute a request to get a list by it's "EntityTypeName" property, and set the fields for the item collection.

```
import { Web } from "gd-sprest";

// Get the web
(new Web())
    // Get the lists
    .Lists()
    // Filter for the list, and expand the items
    .query({
        Filter: "EntityTypeName eq '[List Entity Type Name]'",
        Expand: ["Items"],
        Select: ["Items/ID", "Items/Title"]
    })
    // Execute the request
    .execute(lists => {
        let list = lists.results[0];

        // Parse the items
        for(let i=0; i<list.Items.results.length; i++) {
            let item = list.Items.results[i];
        }
    });

```

#### List Items

Most of the time, you'll probably be executing a request to get data from a list. Below is an example of expanding the attachments, user/lookup fields and multi-user/lookup fields. For lookup columns, the format is "\[Internal Field Name\]/\[Lookup List Internal Field Name\]", so you can actually pull data from other lookup columns. Since a user field is essentially a lookup field, you can get additional user information, based on internal field names of the user information list. The query for this example will work against large lists, returning items in 500 chunks.

```
import { List } from "gd-sprest";

// Get the list
(new List("[List Name]"))
    // Get the items
    .Items()
    // Expand the item attachments, lookup and user type fields
    // Get all items in 500 chunks
    // Order by the title
    .query({
        Expand: ["AttachmentFiles", "TestLookup", "TestMultiLookup", "TestMultiUser", "TestUser"],
        GetAllItems: true,
        OrderBy: ["Title"],
        Select: ["*", "Attachments", "AttachmentFiles", "TestLookup/ID", "TestLookup/Title", "TestMultiLookup/ID", "TestMultiLookup/Title", "TestMultiUser/ID", "TestMultiUser/Title", "TestUser/ID", "TestUser/Title"],
        Top: 500
    })
    // Execute the request
    .execute(items => {
        // Parse the items
        for(let i=0; i<items.results.length; i++) {
            let item = items.results[i];

            // Parse the item attachments
            for(let j=0; j<item.AttachmentFiles.results.length; j++) {
                let attachment = item.AttachmentFiles.results[j];
                let fileName = attachment.FileName;
                let fileUrl = attachment.ServerRelativeUrl;
            }

            // Single Lookup
            let lookup = item["TestLookup"];
            let lookupId = lookup.ID;
            let lookupValue = lookup.Title;

            // Multi-Lookup
            for(let j=0; j<item["TestMultiLookup"].results.length; j++) {
                let lookup = item["TestMultiLookup"].results[j];
                let lookupId = lookup.ID;
                let lookupValue = lookup.Title;
            }

            // User
            let user = item["TestUser"];
            let userId = user.ID;
            let userName = user.Title;

            // Multi-User
            for(let j=0; j<item["TestMultiUser"].results.length; j++) {
                let user = item["TestMultiUser"].results[j];
                let userId = user.ID;
                let userName = user.Title;
            }
        }
    });

```

#### List Item

I've found it useful to expand the "ParentList" of a list item, in case I needed to pull data from list properties that is not available in the list item object. Most of the REST objects have a "FirstUniqueAncestorSecurableObject" which contains the parent object information, so if there isn't a ParentList or ParentWeb property available, you can try to use that one. Below is an example of getting a list item w/ the parent list available.

```
import { List } from "gd-sprest";

// Get the list
(new List("[List Name]"))
    // Get the item by it's id
    .Items(5)
    // Order by the title
    .query({
        Expand: ["ParentList"]
    })
    // Execute the request
    .execute(item => {
        let list = item.ParentList;
        let listName = list.Title;
    });

```

#### Users in a Security Group

This one can be useful, if you need to figure out the users in a specific security group. This will require you to set the option for "Everyone" to be able to view the members of the group.

```
import { Web } from "gd-sprest";

// Get the web
(new Web())
    // Get the site group called "Admin Group"
    .SiteGroups("Admin Group")
    // Order by the title
    .query({
        Expand: ["Users"]
    })
    // Execute the request
    .execute(group => {
        // Parse the users
        for(let i=0; i<group.Users.results.length; i++) {
            let user = group.Users.results[i];
            let email = user.Email;
            let loginName = user.LoginName;
            let name = user.TItle;
        }
    });

```

#### Web

Below is a code example of the current web and all webs under it.

```
import { Web } from "gd-sprest";

// Get the web
(new Web())
    // Expand the sub-webs
    .query({
        Expand: ["Webs"]
    })
    // Execute the request
    .execute(web => {
        // Parse the webs
        for(let i=0; i<web.Webs.results.length; i++) {
            let subWeb = web.Webs.results[i];
            let title = subWeb.Title;
        }
    });

```
