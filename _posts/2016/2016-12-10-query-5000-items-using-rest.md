---
layout: "post"
title: "Query >5000 Items using REST"
date: "2016-12-10"
description: ""
feature_image: ""
tags: [large list, rest]
---

From this [blog post](http://sympmarc.com/2016/11/30/25696) by Marc Anderson, I incorporated the logic in the gd-sprest framework available on [github](https://github.com/gunjandatta/sprest) and [npm](https://www.npmjs.com/package/gd-sprest).

<!--more-->

### Query >5000 Items Solution

When executing SharePoint lists for items, REST has a limit of 5000 items. The data response has a "\_\_next" property containing the url for the next batch of results.

### Do Not Use This By Default

From Marc's post, I wanted to reiterate his warning:

"NOW, before a bunch of people get all angry at me about this, the Stan Lee rule applies here. If you have tens of thousands of items and you decide to load them all, don’t blame me if it takes a while. All those request can take a lot of time. This also isn’t just a get of of jail free card. I’m posilutely certain that if we misuse this all over the place, the data police at Microsoft will shut us down."

### Demo Project

I created a SharePoint Hosted Add-In project on my [github](https://github.com/gunjandatta/sprest-large-list) site to demonstrate getting all results using the OData query. The list contains 6000 items with the Title format: "Title \[Item ID\]". ![Demo](https://github.com/gunjandatta/sprest-large-list/raw/master/Dev.LargeListExample/Images/demo.png)

### How to Get All the Results

The framework will not recursively get all items by default. This feature is ONLY available when using the "query" OData method for asynchronous requests. I've provided documentation [here](https://github.com/gunjandatta/sprest/wiki/OData-Query). Notice that we are requesting the top 5000 items. If we do not specify the max amount, then SharePoint will return 100 items by default. This will result in (6000/100) = 60 requests to the server, instead of (6000/5000) = 1.2 (rounded up) 2 requests to the server.

```
// Get the list
(new $REST.List("Dev"))
    // Get the list items
    .Items()
    // Query for the top 5000 items
    .query({ Top: 5000, GetAllItems: true })
    // Execute the request
    .execute(function (items) {
            // Code goes here...
    });

```

### How to Get Next Set of Results

If you do not use the OData query, the gd-sprest framework will include a "next()" method if the "\_\_next" property is present. Executing this method will retrieve the next set of results.

#### Query the List Items

```
// Get the list
var items = (new $REST.List("Dev"))
    // Get the list items
    .Items()
    // Execute and wait for the request to complete
    .executeAndWait();

```

_Note - This example will use synchronous requests to demonstrate, but it's recommend to use asynchronous requests._ ![Get Items](images/LargeList/getItems.png)

#### Validate First Set of Results

By default the number of results returned is 100. Looking at the first item, we verify that it's "Test 1". ![Validate First Set of Results](images/LargeList/validateFirstSetOfResults.png)

#### Query the Next Set of Results

Executing the "next" method, we get the next set of results.

```
// Get the next set of items
var nextSet = items.next().executeAndWait();

```

![Get Next Set of Results](images/LargeList/getNextSetOfResults.png)

#### Validate Next Set of Results

We can validate the first item in the results to be "Test 101". ![Validate Next Set of Results](images/LargeList/validateNextSetOfResults.png)

### Threshold Limits

When working with large lists and REST, filtering the results **MUST** be done on indexed fields. I updated the github example to include two additional fields:

1) Choice (Non-Indexed Fields) 2) Indexed Choice (Indexed Field)

#### Query Example 1

```
// Get the list
(new $REST.List("Dev"))
        // Get the list items
        .Items()
        // Query for the top 5000 items
        .query({ Top: 5000, GetAllItems: true, Filter: "Choice eq 'Choice 0'" })
        // Execute the request
        .execute(function (items) {
                console.log("Done: " + items.results.length);
        });

```

Executing the code above will result in an error from the server:

##### The attempted operation is prohibited because it exceeds the list view threshold enforced by the administrator.

![](images/LargeList/testFilterOnNonIndexedField.png)

#### Query Example 2

```
// Get the list
(new $REST.List("Dev"))
        // Get the list items
        .Items()
        // Query for the top 5000 items
        .query({ Top: 5000, GetAllItems: true, Filter: "FilteredChoice eq 'Choice 0'" })
        // Execute the request
        .execute(function (items) {
                console.log("Done: " + items.results.length);
        });

```

Executing the code above will result return the expected results: ![](images/LargeList/testFilterOnIndexedField.png)
