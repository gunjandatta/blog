---
layout: "post"
title: "SharePoint REST Framework Updates"
date: "2017-02-04"
description: ""
feature_image: ""
tags: []
---

This post will go over the latest changes to the gd-sprest project. This framework is used to develop against the SharePoint 2013/Online REST api. It's available at [github](http://gunjandatta.github.io/sprest) and [npm](https://www.npmjs.com/package/gd-sprest).

<!--more-->

### NodeJS

I'm happy to say that the library now works with NodeJS, where you can import modules and not have to add a reference to the definition file for intellisense. The target version for NodeJS integration is v1.2, but I recommend to get the latest for all bug fixes and utilities.

#### TypeScript Code Example

This code example gives an example of querying a list for a specified item.

```
import {List, Types} from "gd-sprest";

    // Method to get the item Information
    private getItemInfo(itemId) {
        // Return a promise
        return new Promise((resolve, reject) => {
            // See if we already queried for this item
            if(this._items[itemId]) {
                // Resolve the request
                resolve(this._items[itemId]);
            } else {
                // Get the list
                (new List(this._listName))
                    // Get the item
                    .Items(itemId)
                    // Execute the request
                    .execute((item) => {
                        // Save a reference to the item
                        this._items[itemId] = item;

                        // Resolve the promise
                        resolve(item);
                    });
            }
        });
    }

```

### Helper Functions

The helper functions have been split out to App and JSLink. As we add other helper methods they can easily be organized here.

#### App Helper

Functions related to copying files and creating folder structures from the app web to the host web. Cleanup methods for removing files and folders are available too.

#### JSLink Helper

I recently wrote a [blog post](http://dattabase.com/js-links/) on JSLinks which has an overview of the JSLink helper methods.
