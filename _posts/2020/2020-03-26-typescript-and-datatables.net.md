---
layout: "post"
title: "How to Reference DataTables.net in TypeScript Projects"
date: "2020-03-26"
description: "Code example for referencing the DataTables.net library in TypeScript."
feature_image: ""
tags: ["typescript"]
---

This post will give an example referencing the [DataTables.net](https://datatables.net/) library in TypeScript projects. The [gd-sprest-bs](https://github.com/gunjandatta/sprest) library contains an instance of [jQuery](https://jquery.com/) for the [Bootstrap](https://getbootstrap.com/) library. The DataTables.net library references the jQuery global reference, which is not be available based on how webpack bundles the gd-sprest-bs library. We will need to manually set the jQuery reference in the DataTables.net library.

<!--more-->

### Manually Reference jQuery Library

The first thing we will do is update the DataTables.net internal reference to jQuery. This only needs to be done once, so I recommend you do it in the main source file.

```ts
import { jQuery } from "gd-sprest-bs";
import * as DataTables from "datatables.net";

// Set the jQuery reference for the plugin
DataTables.prototype.constructor.$ = jQuery;
```

### How to Use DataTables

To apply the DataTables.net plugin to a table, all you need to do is reference the jQuery library from the gd-sprest-bs library. The DataTables.net plugin has already been applied to it, so the __DataTable__ function is available.

```ts
import { jQuery } from "gd-sprest-bs";

// Sample Code
export function render() {
    // Get the element to render to
    let el = document.querySelector("#dt");
    if (el) {
        // Apply the DataTable plugin to the table
        jQuery("#dt").DataTable();
    }
}
```