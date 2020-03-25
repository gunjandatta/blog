---
layout: "post"
title: "Create Content Types in SharePoint"
date: "2020-03-24"
description: "Code example for creating content types in SharePoint."
feature_image: ""
tags: ["content type"]
---

This post will give an example of creating content types in SharePoint. The [gd-sprest](https://github.com/gunjandatta/sprest) library will use the [SharePoint Configuration](https://dattabase.com/topics/sp-cfg/) helper class to create the content types. The gd-sprest SharePoint [Code Examples](https://dattabase.com/examples/) all utilize a configuration file for its SharePoint assets. This post will focus on the configuration file for creating site and list content types.

<!--more-->

### Configuration File

The first thing we will do is reference the 'Helper' component from the [gd-sprest](https://github.com/gunjandatta/sprest) library.

```ts
import { Helper } from "gd-sprest";

/**
 * Configuration
 */
export const Configuration = Helper.SPConfig({
    // Configuration goes here
});
```

### Example 1: Site Content Type

This example will demonstrate how to create a site content type. By default, the content type inherit from the _Item_ type. To specify a different type, set the _ParentName_ property to the content type to inherit from. The parent content type _MUST_ exist in the current or root web.

```ts
import { Helper } from "gd-sprest";

/**
 * Configuration
 */
export const Configuration = Helper.SPConfig({
    ContentTypes: [
        { Name: "Custom CT", Group: "_Dev", Description: "Sample" },
        { Name: "Doc CT", Group: "_Dev", Description: "Sample", ParentName: "Document" },
        { Name: "DocSet CT", Group: "_Dev", Description: "Sample", ParentName: "Document Set" }
    ]
});
```

#### Create the Content Types

![Create Content Types](images/CreateContentTypes/createSiteCTs.png)

#### Validate the Content Types

![Validate Content Types](images/CreateContentTypes/validateSiteCTs.png)

### Example 2: List Content Type

This code example will demonstrate how to create content types in a list. This method will only work for content types that inherit from the _Item_ type. The content type field references must exist in the list.

```ts
import { Helper } from "gd-sprest";

/**
 * Configuration
 */
export const Configuration = Helper.SPConfig({
    ListCfg: [{
        ListInformation: { Title: "Dev Lib", BaseTemplate: SPTypes.ListTemplateType.GenericList },
        ContentTypes: [
            { Name: "Item", FieldRefs: ["Title", "Field1"] },
            { Name: "Custom CT", FieldRefs: ["Title", "Field1", "Field2", "Field3"] },
            { Name: "Another CT", FieldRefs: ["Title", "Field1", "Field2", "Field3", "Field4", "Field5"] }
        ],
        CustomFields: [
            { name: "Field1", title: "Field 1", type: Helper.SPCfgFieldType.Text },
            { name: "Field2", title: "Field 2", type: Helper.SPCfgFieldType.Text },
            { name: "Field3", title: "Field 3", type: Helper.SPCfgFieldType.Text },
            { name: "Field4", title: "Field 4", type: Helper.SPCfgFieldType.Text },
            { name: "Field5", title: "Field 5", type: Helper.SPCfgFieldType.Text }
        ]
    }]
});
```

#### Demo

#### Create the Content Types

![Create Content Types](images/CreateContentTypes/createListCTs.png)

#### Validate the Content Types

![Validate Content Types](images/CreateContentTypes/validateListCTs.png)

### Example 3: List Document Content Type

The last example will demonstrate how to create content types in a list, that do not inherit from the _Item_ content type. The parent content type _MUST_ exist in the current web.

```ts
import { Helper } from "gd-sprest";

/**
 * Configuration
 */
export const Configuration = Helper.SPConfig({
    ContentTypes: [
        { Name: "Doc CT 1", ParentName: "Document", Group: "_Dev", Description: "Sample" },
        { Name: "Doc CT 2", ParentName: "Document", Group: "_Dev", Description: "Sample" },
        { Name: "Doc CT 3", ParentName: "Document", Group: "_Dev", Description: "Sample" }
    ],
    ListCfg: [{
        ListInformation: { Title: "Dev Lib", BaseTemplate: Helper.SPTypes.ListTemplateType.DocumentLibrary },
        ContentTypes: [
            { Name: "Doc CT 1", ParentName: "Doc CT 1", FieldRefs: ["FileLeafRef", "Title", "Field1"] },
            { Name: "Doc CT 2", ParentName: "Doc CT 2", FieldRefs: ["FileLeafRef", "Title", "Field1", "Field2", "Field3"] },
            { Name: "Doc CT 3", ParentName: "Doc CT 3", FieldRefs: ["FileLeafRef", "Title", "Field1", "Field2", "Field3", "Field4", "Field5"] }
        ],
        CustomFields: [
            { name: "Field1", title: "Field 1", type: Helper.SPCfgFieldType.Text },
            { name: "Field2", title: "Field 2", type: Helper.SPCfgFieldType.Text },
            { name: "Field3", title: "Field 3", type: Helper.SPCfgFieldType.Text },
            { name: "Field4", title: "Field 4", type: Helper.SPCfgFieldType.Text },
            { name: "Field5", title: "Field 5", type: Helper.SPCfgFieldType.Text }
        ]
    }]
});
```

#### Demo

#### Create the Content Types

![Create Content Types](images/CreateContentTypes/createListDocCTs.png)

#### Validate the Parent Content Types

![Validate Content Types](images/CreateContentTypes/validateListDocParentCTs.png)

#### Validate the List Content Types

![Validate Content Types](images/CreateContentTypes/validateListDocCTs.png)