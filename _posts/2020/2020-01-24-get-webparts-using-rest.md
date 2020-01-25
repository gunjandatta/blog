---
layout: "post"
title: "Get WebPart Information using REST"
date: "2020-01-24"
description: ""
feature_image: ""
tags: ["webpart"]
---

This post will give an example of getting webpart information for a page, using the REST API. The [gd-sprest](https://github.com/gunjandatta/sprest) library will be used for this example.

<!--more-->

### Get WebParts for a Page

SharePoint pages have a "Limited WebPart Manager" property that can be used to get the webpart information for a specified page.

```ts
import { SPTypes, Web } from "gd-sprest";

// Get the current web
Web()
    // Get the target file
    .getFileByServerRelativeUrl("/sites/dev/sitepages/home.aspx")
    // Get the webpart manager for this page
    // 0 - User
    // 1 - Shared
    .getLimitedWebPartManager(SPTypes.PersonalizationScope.Shared)
    // Get the webparts
    .WebParts()
    // Set the query to include the webpart properties
    .query({
        Expand: ["WebPart/Properties"]
    })
    // Execute the request
    .execute(webparts => {
        // Parse through the webparts
        for(let i=0; i<webparts.results.length; i++) {
            let wp = webparts.results[i].WebPart;
            let wpProperties = wp.Properties;

            // Code goes here
        });
    });
```

#### Sample Output

![2010 Workflow Information](images/GetWebPartInfo/sample_output.png)

#### HTTP Request Information

```
Accept: "application/json;odata=verbose"
Content-Type: "application/json;odata=verbose"
X-HTTP-Method: "POST"
X-RequestDigest: [Request Digest Id]
url: "https://[tenant].sharepoint.com/sites/dev/_api/web/getFileByServerRelativeUrl('/sites/dev/sitepages/home.aspx')/getLimitedWebPartManager(scope=1)/WebParts?$expand=WebPart/Properties"
```