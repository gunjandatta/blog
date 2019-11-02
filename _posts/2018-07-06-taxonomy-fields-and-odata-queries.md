---
layout: "post"
title: "Taxonomy Fields and OData Queries"
date: "2018-07-06"
description: ""
feature_image: ""
tags: []
---

This post will go over taxonomy fields and OData queries in SharePoint. These are generally difficult to do, based on the field's value containing the ID of the term instead of the value.

<!--more-->

### MMS Hidden Fields

When a taxonomy field is added to a list, a couple hidden fields are added as well.

#### Hidden Value Field

A hidden note field will be added with an internal field name of _\[Internal Field Name\]\_0_. This hidden field contains the term value. This field can be easily queried as part of the OData request.

##### OData Query

This code example will use the [gd-sprest](https://gunjandatta.github.io) core library to execute requests to the REST api. After we get the results, we will update the field value's "Label" property from the term id to its label.

```
import { List } from "gd-sprest";

// Get the list
(new List("[My List Name]"))
  // Get the Items
    .Items()
    // Include the hidden value field
    .query({
      Select: ["*", "MMSInternalFieldName", "MMSInternalFieldName_0"]
    })
    // Execute the request
    .execute(items => {
      // Parse the items
        for(let i=0; i<items.results.length; i++) {
          let item = items.results[i];

            // See if an MMS value exists
            let mmsValue = item["MMSInternalFieldName"];
            let termValue = item["MMSInternalFieldName_0"];
            if(mmsValue && termValue) {
              // Replace the label with the value
                item["MMSInternalFieldName"].Label = termValue.split("|")[0];
            }
        }
    });

```

#### Hidden TaxCatchAll Field

The hidden TaxCatchAll field is contains the term's id and value for all MMS fields in the list.

### Querying Taxonomy Fields

The only way to query a Taxonomy field is by using a CAML query. If you try to filter on the field or hidden value field in an OData request, you will see an error denying the request due to the field type. The TaxCatchAll field can be used for filtering by a term's id or label.

#### OData Query

This code example will use the [gd-sprest](https://gunjandatta.github.io) core library to execute requests to the REST api. This code example will display how to filter by the term's id or label. After we get the filtered results, we will update the field value's "Label" property from the term id to its label.

```
import { List } from "gd-sprest";

// Get the list
(new List("[My List Name]"))
  // Get the Items
    .Items()
    // Include the hidden value field
    .query({
        Filter: "TaxCatchAll/IdForTerm eq '[Term ID]' or TaxCatchAll/Term eq '[Term Label]'",
        Expand: ["TaxCatchAll"],
      Select: ["*", "TaxCatchAll/Id", "TaxCatchAll/Term", "MMSInternalFieldName"]
    })
    // Execute the request
    .execute(items => {
      // Parse the items
        for(let i=0; i<items.results.length; i++) {
          let item = items.results[i];
            let mmsValues = item["TaxCatchAll"];

            // See if an MMS value exists
            let mmsValue = item["MMSInternalFieldName"];
            if(mmsValue) {
              // Parse the mms values
                for(let j=0; j<mmsValues.results.length; j++) {
                  let wssId = mmsValues.results[j].Id;

                    // See if this is the target field value
                    if(wssId == item["MMSInternalFieldName"].WssId) {
                      // Set the value
                        item["MMSInternalFieldName"].Label = mmsValues[j].Term;

                        // Break from the loop
                        break;
                    }
                }
            }
        }
    });

```
