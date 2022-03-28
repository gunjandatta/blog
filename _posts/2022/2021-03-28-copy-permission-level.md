---
layout: "post"
title: "Copy Permission Level"
date: "2022-03-28"
description: "Example on how to copy a permission level."
feature_image: ""
tags: ["permissions"]
---

This post will go over a new helper method for copying permission levels.

<!--more-->

### JSOM

This helper method will utilize JSOM to complete the request. This will require the SP core scripts to be loaded on a modern page. Another helper method `loadSPCore` can be used to complete this.

```ts
import { Helper } from "gd-sprest";

Helper.loadSPCore().done(() => {
  // Core SP scripts are loaded
});
```

### Properties

Below are the properties for this function. The `BasePermission` is the permission level to copy. Utilize the `RemovePermissions` property to exclude from the base permission level being copied. Utilize the `AddPermissions` property to add to the base permission level being copied. The `SPTypes.BasePermissionTypes` enumerator can be used to set these properties.

```ts
{
  // Permissions to add
  AddPermissions?: [number];
  // Description of the permission level
  Description: string;
  // The name of the base permission to copy
  BasePermission: string;
  // The permission order
  Order?: number;
  // The name of the permission level to create
  Name: string;
  // Permissions to not copy over
  RemovePermissions?: [number];
  // The target site collection, current site by default
  WebUrl?: string;
}
```

### Code Examples

**Copy and Remove Permission**
```ts
import { Helper, SPTypes } from "gd-sprest";

// Copy and remove permissions
Helper.copyPermissionLevel({
  BasePermission: "Contribute",
  Name: "Contribute no Delete",
  Description: "Edit permissions - Delete",
  RemovePermissions: [SPTypes.BasePermissionTypes.DeleteListItems]
});
```

**Copy and Add Permission**
```ts
import { Helper, SPTypes } from "gd-sprest";

// Copy and add permissions
Helper.copyPermissionLevel({
  BasePermission: "Contribute",
  Name: "Contribute add Web",
  Description: "Edit permissions + Create Web",
  AddPermissions: [SPTypes.BasePermissionTypes.ManageSubwebs]
});
```

### Summary

If you have any problems/issues with this new method, you can [report an issue here](https://github.com/gunjandatta/sprest/issues). I hope this code example is helpful. Happy Coding!!!