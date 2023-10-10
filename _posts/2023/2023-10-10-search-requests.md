---
layout: "post"
title: "Search Requests > 500"
date: "2023-10-10"
description: "Explains how to get search results past the max 500 returned."
feature_image: ""
tags: ["search"]
---

This post will go over a new helper method for making search requests with a result greater than 500.

<!--more-->

### Overview of Issue

The max results the SharePoint REST Search query can have is 500. The `PrimaryQueryResult.RelevantResults.TotalRows` value will determine if there are more results available.

#### Overview of Solution

You need to compare the total rows returned with the number of rows in the table itself. If the total rows is greater than what was returned, then you need to make another request and set the `StartRow` property for the next set of results.

### Code Samples

This code example will give an example of getting all of the site collections the user has access to.

#### Code Example (Helper Method)

This code example will use a new method for the `Search` module in the `gd-sprest` library. The helper method will default to the max results (500) and to use batch requests by default. These values can be customized through the properties.

```ts
import { Search, Types } from "gd-sprest";

// Site Information
interface ISiteInfo {
  Id?: string;
  Title?: string;
  Url?: string;
}

// Processes the results
function processResults(sites: Array<ISiteInfo>, results: Types.Microsoft.Office.Server.Search.REST.SearchResult) {
  // Parse the results
  for(let i=0; i<results.PrimaryQueryResult.RelevantResults.RowCount; i++) {
    let row = results.PrimaryQueryResult.RelevantResults.Table.Rows.results[i];
    let siteInfo:ISiteInfo = {};

    // Parse the cells
    for(let j=0; j<row.Cells.results.length; j++) {
      let cell = row.Cells.results[j];

      // Set the values
      switch(cell.Key) {
        case "SPSiteUrl":
          siteInfo.Url = cell.Value;
          break;
        case "Title":
          siteInfo.Title = cell.Value;
          break;
        case "WebId":
          siteInfo.Id = cell.Value;
          break;
      }
    }

    // Append the site
    sites.push(siteInfo);
  }
}

// Get all of the sites the user has access to
export function searchAllSites():PromiseLike<Array<ISiteInfo>> {
  // Return a promise
  return new Promise((resolve, reject) => {
    let sites:Array<ISiteInfo> = [];

    // Search for site collections
    Search.postQuery({
      // The search query (Row limit will be defaulted to 500)
      query: {
        Querytext: "contentclass=sts_site",
        TrimDuplicates: true,
        SelectProperties: {
          results: [
            "Title", "SPSiteUrl", "WebId"
          ]
        }
      },
      // We will process each request as they are completed
      onQueryCompleted: results => {
        // Process the results
        processResults(sites, results);
      }
    }).then(results => {
      // The results have been processed, so we can just resolve the request
      resolve(sites);
    });
  });
}
```

#### Code Example (Full Logic)

This will not use the helper method, but will explain what you would need to do in order to get all of the search results.

```ts
import { Search, Types } from "gd-sprest";

// Site Information
interface ISiteInfo {
  Id?: string;
  Title?: string;
  Url?: string;
}

// Processes the results
function processResults(sites: Array<ISiteInfo>, results: Types.Microsoft.Office.Server.Search.REST.SearchResult) {
  // Parse the results
  for(let i=0; i<results.PrimaryQueryResult.RelevantResults.RowCount; i++) {
    let row = results.PrimaryQueryResult.RelevantResults.Table.Rows.results[i];
    let siteInfo:ISiteInfo = {};

    // Parse the cells
    for(let j=0; j<row.Cells.results.length; j++) {
      let cell = row.Cells.results[j];

      // Set the values
      switch(cell.Key) {
        case "SPSiteUrl":
          siteInfo.Url = cell.Value;
          break;
        case "Title":
          siteInfo.Title = cell.Value;
          break;
        case "WebId":
          siteInfo.Id = cell.Value;
          break;
      }
    }

    // Append the site
    sites.push(siteInfo);
  }
}

// Get all of the sites the user has access to
export function searchAllSites():PromiseLike<Array<ISiteInfo>> {
  // Return a promise
  return new Promise((resolve, reject) => {
    // Search for site collections
    Search().postquery({
      Querytext: "contentclass=sts_site",
      RowLimit: 500,
      TrimDuplicates: true,
      SelectProperties: {
        results: [
          "Title", "SPSiteUrl", "WebId"
        ]
      }
    }).execute(results => {
      let sites:Array<ISiteInfo> = [];

      // Process the results
      processResults(sites, results.postquery);

      // See if more items exist
      if(results.postquery.PrimaryQueryResult.RelevantResults.TotalRows > sites.length) {
        let search = Search();
        let totalPages = Math.ceil(results.postquery.PrimaryQueryResult.RelevantResults.TotalRows / 500);

        // Parse the # of required requests
        for(let i=1; i<totalPages; i++) {
          // Create the batch request
          search.postquery({
            Querytext: "contentclass=sts_site",
            RowLimit: 500,
            StartRow: i*500,
            TrimDuplicates: true,
            SelectProperties: {
              results: [
                "Title", "SPSiteUrl", "WebId"
              ]
            }
          }).batch(results => {
            // Process the results
            processResults(sites, results.postquery);
          }, i%100); // Limit the # of requests to 100 per batch
        }

        // Execute the requests
        search.execute(() => {
          // Resolve the request
          resolve(sites);
        });
      } else {
        // Resolve the request
        resolve(sites);
      }
    });
  });
}
```

### Summary

I highly recommend the search api. It's very powerful and very useful. I hope this code example was helpful. Happy Coding!!!