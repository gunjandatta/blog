---
layout: "post"
title: "How to Reference DataTables.net in TypeScript Projects"
date: "2020-03-26"
description: "Code example for referencing the DataTables.net library in TypeScript."
feature_image: ""
tags: ["typescript"]
---

This post will give an example referencing the [DataTables.net](https://datatables.net/) library in TypeScript projects. The [gd-sprest-bs](https://github.com/gunjandatta/sprest-bs) library contains an instance of [jQuery](https://jquery.com/) for the [Bootstrap](https://getbootstrap.com/) library. The DataTables.net library references the jQuery global reference, which is not be available based on how webpack bundles the gd-sprest-bs library. We will need to manually set the jQuery reference in the DataTables.net library.

<!--more-->

### Update the jQuery Reference

The first thing we will do is update the jQuery reference. This only needs to be done once, so I recommend you do it in the main source file. We will check to see if the DataTable plugin doesn't have jQuery defined and set it, otherwise we will update the gd-sprest-bs jQuery reference.

```ts
import * as DataTable from "datatables.net";
import { jQuery } from "gd-sprest-bs";

// See if jQuery is defined in the DataTable lib
if (DataTable.prototype.constructor.$ == undefined) {
    // Set the reference
    DataTable.prototype.constructor.$ = jQuery;
} else {
    // Update this jQuery reference for this library
    window["$REST"].jQuery = DataTable.prototype.constructor.$;
}
```

### How to Use DataTables

To apply the DataTables.net plugin to a table, all you need to do is reference the jQuery library from the gd-sprest-bs library. The DataTables.net plugin has already been applied to it, so the __DataTable__ function is available.

The code example below will create a BootStrap table and apply the datatable plugin to it.

```ts
import { Components, jQuery } from "gd-sprest-bs";

/**
 * Sample code to render a datatable.
 * @param el - The element to render the table to.
 */
export function render(el) {
    // Create a sample table
    let table = Components.Table({
        el,
        columns: [
            { name: "Col1", title: "Column 1" },
            { name: "Col2", title: "Column 2" },
            { name: "Col3", title: "Column 3" },
            { name: "Col4", title: "Column 4" },
            { name: "Col5", title: "Column 5" }
        ],
        rows: [
            { Col1: "Value 1", Col2: "Value 2", Col3: "Value3", Col4: "Value4", Col5: "Value5" },
            { Col1: "Value 1", Col2: "Value 2", Col3: "Value3", Col4: "Value4", Col5: "Value5" },
            { Col1: "Value 1", Col2: "Value 2", Col3: "Value3", Col4: "Value4", Col5: "Value5" },
            { Col1: "Value 1", Col2: "Value 2", Col3: "Value3", Col4: "Value4", Col5: "Value5" },
            { Col1: "Value 1", Col2: "Value 2", Col3: "Value3", Col4: "Value4", Col5: "Value5" },
            { Col1: "Value 1", Col2: "Value 2", Col3: "Value3", Col4: "Value4", Col5: "Value5" }
        ]
    });

    // Apply the datatable plugin
    jQuery(table.el).DataTable();
}
```

#### Demo

![DataTable Example](images/DataTables.net/demo.png)