---
layout: "post"
title: "Office Fabric React List Example"
date: "2016-12-18"
description: ""
feature_image: ""
tags: [fabric-ui, react, add-in]
---

This post will go over updates to my [Office Fabric UI SharePoint Hosted Add-In using the React Framework](https://dattabase.com/blog/office-fabric-react-sharepoint-hosted-add) blog post.

<!--more-->

### New List Example

Since we are working in SharePoint, it would be ideal to give an example of using the Office Fabric React Framework to display list data. Instead of giving a generic code example, I wanted to give an example for developing SharePoint 2013 Add-Ins more efficiently. Our main bottleneck in SharePoint development is the environment itself, which has been removed based on the configuration of the solution. Refer to a [previous blog](https://dattabase.com/blog/sharepoint-app-fabric-ui-react-part-1-3) post for additional details. This section will go over the data source of the list, and how to configure it with test data.

#### Test vs SharePoint Data

The folder and file structure of the various demos in the project contain similar file names, listed below. The file we will target is the "data.tsx" file, which will contain the methods interacting with the list data source.

- demo.tsx - This is the main file of the component
- data.tsx - (Optional) This is the data source of the component

#### Data File

##### Detecting SharePoint Environment vs Localhost

The data file has a static "get" method which returns the list data. A property "IsSPOnline" is available to determine if the code is being executed online or not. I'm using my [SP REST Framework](https://gunjandatta.github.io/sprest), which is referenced in the default page of the SharePoint Hosted Add-In project only. Having this knowledge, we can determine if we are in the local development or SharePoint environment, as shown below in the code example.

```
private static get IsSPOnline(): boolean { return window.hasOwnProperty("$REST"); }

```

##### Test Data vs List Data

Now that we are able to detect which environment (SharePoint or Development) we are in, the get method will return the list or test data based on the "IsSPOnline" property.

```
static get(): PromiseLike<IData[]> {
        // Return a promise
        return new Promise((resolve, reject) => {
                // See if the $REST library exists
                if (this.IsSPOnline) {
                        // Get the list
                        (new $REST.List("Locations"))
                                // Get the items
                                .Items()
                                // Query the data
                                .query({
                                        GetAllItems: true,
                                        OrderBy: ["State", "County", "Title"],
                                        Top: 500
                                })
                                // Execute the request
                                .execute((items: $REST.Types.IListItems) => {
                                        let data: IData[] = [];

                                        // Parse the items
                                        for (let item of items.results) {
                                                // Add the item to the data array
                                                data.push({
                                                        Title: item["Title"],
                                                        County: item["County"],
                                                        State: item["State"]
                                                });
                                        }

                                        // Resolve the request
                                        resolve(data);
                                });
                } else {
                        // Resolve the request with test data
                        resolve(TestData);
                }
        });
}

```

#### Demo

##### Demo Page

![List Demo](images/OfficeUIFabricReact/List.png)

##### View Item Dialog

![View Item Dialog](images/OfficeUIFabricReact/ViewItemDialog.png)

##### New Item Panel

![New Item Panel](images/OfficeUIFabricReact/NewItemPanel.png)
