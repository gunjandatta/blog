---
layout: "post"
title: "Create a Callout in SharePoint"
date: "2020-02-09"
description: "Code example for creating callouts in SharePoint."
feature_image: ""
tags: ["callout manager"]
---

This post will give an example of creating a callout in SharePoint. The [gd-sprest](https://github.com/gunjandatta/sprest) library was recently updated to include the [SharePoint Callout Manager](https://docs.microsoft.com/en-us/sharepoint/dev/sp-add-ins/highlight-content-and-enhance-the-functionality-of-sharepoint-hosted-sharepoint) helper class, which we will be using for this example.

<!--more-->

### Step 1 - Initialize the Library

We will need to ensure the SharePoint callout manager library is loaded on the page, using the SharePoint Script-On-Demand library.

```ts
import { Helper } from "gd-sprest";

// Load the library
Helper.SP.CalloutManager.init().then(() => {
    // The callout manager library has been loaded.
    // Continue to Step 2
});
```

### Step 2 - Launch Point

To create a callout, we will first need to defint the "launch point", which refers to the html element to apply the callout to. For example, we will locate a custom input element where the value is set to 'Run'.

```ts
let elTarget = document.querySelector("input[value='Run']");
```

### Step 3 - Create the Callout

The callout requires the following properties to be defined:

- ID: _string_
- launchPoint: _HtmlElement_

The _ID_ is required to ensure duplicate entries aren't created. We will use the _createNewIfNecessary_ method to return the existing callout if the unique id already exists.

```ts
let callout = Helper.SP.CalloutManager.createNewIfNecessary({
    ID: "MyUniqueId",
    launchPoint: elTarget,
    title: "Title of Callout",
    content: "<p>This is the content of the callout. The contentElement property can be used to reference an HTML element instead.</p>"
});
```

### Step 4 - Action Menu

The callout has an optional _Action Menu_ which allows you to define one or more buttons. Each action menu will require the click event to be defined, unless it's defined as a menu.

#### Simple Example

```ts
// Create the action
let action1 = Helper.SP.CalloutManager.createAction({
    text: "Simple Example",
    onClickCallback: (event, action) => {
        // Code goes here
    }
});

// Add the action to the callout
callout.addAction(action1);
```

#### Menu Example

```ts
// Create the menu entries
let menuEntries = Helper.SP.CalloutManager.createMenuEntries([
    {
        text: "Menu Item 1",
        onClickCallback: (event, action) => {
            // Code goes here
        }
    },
    {
        text: "Menu Item 2",
        onClickCallback: (event, action) => {
            // Code goes here
        }
    }
]);

// Create the action
let action2 = Helper.SP.CalloutManager.createAction({
    text: "Menu Example",
    menuEntries
});

// Add the action to the callout
callout.addAction(action2);
```

### Demo

![Demo](images/CalloutManager/demo.png)
