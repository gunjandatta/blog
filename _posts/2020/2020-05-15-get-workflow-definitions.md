---
layout: "post"
title: "How to Get Workflow Definitions Using the REST API"
date: "2020-05-15"
description: "Code example for referencing published and unpublished SharePoint 2010/2013 workflow definitions using the SharePoint REST API."
feature_image: ""
tags: ["workflows"]
---

This post will give an example of getting all 2010 and 2013 workflow definitions, using the [gd-sprest](https://github.com/gunjandatta/sprest) library to interact with the REST API.

<!--more-->

### Overview of Demo Environment

For this code example, I will create 8 total workflows:

* List Workflows
    * 2010 Published
    * 2010 Un-Published
    * 2013 Published
    * 2013 Un-Published

* Site Workflows
    * 2010 Published
    * 2010 Un-Published
    * 2013 Published
    * 2013 Un-Published

What the workflows do are irrelevent, since our goal is to identify the using the REST API.

#### List Workflows (Published)

![List Workflows](images/WorkflowDefinitions/list-wfs.png)


#### All Workflows

![All Workflows](images/WorkflowDefinitions/all-wfs.png)

### Reference Library

Reference the [Getting Started](http://dattabase.com/getting-started/) link for additional information about the library. We will first need to reference it, so in the console tab of the browser enter the following to load the library.

```js
var s = document.createElement("script"); s.src = "https://unpkg.com/gd-sprest/dist/gd-sprest.min.js"; document.head.appendChild(s);
```

_The SharePoint page will need to be classic, not modern in order for the requests to work. This is due to the _spPageContextInfo variable no longer available in modern pages._

### 2010 Workflow Definitions

We will first review how to get the 2010 workflows.

#### Workflows List

In SharePoint Designer, you are able to view the Workflows and its files through the "All Files" navigation. Notice that only the 2010 workflows are displayed, and they include the unpublished workflows. The `WorkflowAssociations` property of the `Web` or `List` object can also be used to get the associated workflow information, but this will be for published workflows only.

![2010 Workflow Files](images/WorkflowDefinitions/2010-wf-files.png)

##### 1. Get the `Workflows` List Items

These files can be found in the "Workflows" list. The first step will be to read the items in the workflows list.

```js
// Get the items
$REST.List("Workflows").Items().execute(function(items) {
    // Parse the items
    for(var i=0; i<items.results.length; i++) {
        var item = items.results[i];

        // Get the associated file
        item.File().execute(file => {
            // Analyze the file
            analyze2010File(file);
        });
    }
});
```

##### 2. Get the Files

The 3 files that will be available are:

* .xoml
* .xoml.wfconfig.xml
* .xsn

We are interested in the `.xoml.wfconfig.xml` file, which contains the workflow definition.

```js
function analyze2010File(file) {
    // See if this is the target file
    if(/.xoml.wfconfig.xml$/.test(file.Name)) {
        // Read the file
        file.content().execute(function(content) {
            // Convert the buffer to a string
            var wfDefinition = (new TextDecoder("utf-8")).decode(content);

            // Parse the xml
            var xmlDoc = (new DOMParser()).parseFromString(wfDefinition, "text/xml");

            // Analyze the workflow definition
            analyze2010Workflow(xmlDoc);
        });
    }
}
```

##### 3. Determine Status

Now that we have the definition information, we can validate that it's published.

```js
function analyze2010Workflow(xmlDoc) {
    // Get the template
    var template = xmlDoc.querySelector("Template");
    if(template) {
        // Read the workflow information
        var wfBaseId = template.getAttribute("BaseID").replace(/^{|}$/g, '').toLowerCase();
        var wfName = template.getAttribute("Name");
        var wfScope = template.getAttribute("Category");
        var wfPublished = template.getAttribute("Draft") == "false" ? true : false;

        // Default the enabled flag, we will determine this next
        var wfEnabled = false;

        // See if there is an association and we are targeting a list
        var association = xmlDoc.querySelector("Association");
        if(association && wfScope == "List") {
            // Get the associated list
            $REST.Web().Lists().getById(association.getAttribute("ListID"))
                // Include the workflow associations
                .query({
                    Expand: ["WorkflowAssociations"]
                }).execute(list => {
                    // Parse the workflows association w/ this list
                    for(var i=0; i<list.WorkflowAssociations.results.length; i++) {
                        var wf = list.WorkflowAssociations.results[i];

                        // See if this is the target workflow
                        if(wf.BaseId.toLowerCase() == wfBaseId) {
                            // Set the enabled flag
                            wfEnabled = wf.Enabled;

                            // Compare the name
                            if(wf.Name == wfName) { break; }
                        }
                    }

                    // Log
                    console.log("Workflow was found in the associated list.", wfName, wfScope, wfPublished, wfEnabled);
                }
            );
        }
        // Else, this is a site workflow
        else {
            // Get the workflow associations for the web
            $REST.Web().WorkflowAssociations().execute(function(workflows) {
                // Parse the workflows association w/ this web
                for(var i=0; i<workflows.results.length; i++) {
                    var wf = workflows.results[i];

                    // See if this is the target workflow
                    if(wf.BaseId.toLowerCase() == wfBaseId) {
                        // Set the enabled flag
                        wfEnabled = wf.Enabled;

                        // Compare the name
                        if(wf.Name == wfName) { break; }
                    }
                }

                // Log
                console.log("Workflow was found in the associated site.", wfName, wfScope, wfPublished, wfEnabled);
            });
        }
    }
}
```

##### 4. Run Code

Now that we have the code completed, we will run it in the console browser. Paste the above functions first, prior to running the main function in step 1.

![2010 Workflow Demo](images/WorkflowDefinitions/2010-wf-demo.png)

### 2013 Workflow Definitions

In a similar method, we will now get the 2013 workflows.

#### wfSvc List

There is a hidden `wfSvc` list that will contain the files shown above from SharePoint Designer.

##### 1. Get the Active Workflows

The first step is to get the active workflows from the REST endpoint.

```js
$REST.WorkflowSubscriptionService().enumerateSubscriptions().execute(function(workflows) {
    var activeWorkflows = {};

    // Parse the active workflows
    for(var i=0; i<workflows.results.length; i++) {
        var workflow = workflows.results[i];

        // Add the workflow
        activeWorkflows[workflow.Name] = workflow;
    }

    // Read the wfsvc list
    readWFSvcList(activeWorkflows);
});
```

##### 2. Get the `wfSvc` List Items

We will add the logic for getting the workflow items from the hidden list.

```js
function readWFSvcList(activeWorkflows) {
    // Get the items
    $REST.List("wfSvc").Items().execute(function(items) {
        // Parse the items
        for(var i=0; i<items.results.length; i++) {
            var item = items.results[i];

            // Analyze the item
            analyze2013Item(activeWorkflows, item);
        }
    });
}
```

##### 3. Get the Files

We are interested in the `.xaml` file, which contains the workflow definition.

```js
function analyze2013Item(activeWorkflows, wfInfo) {
    // Get the associated file
    wfInfo.File().execute(file => {
        // See if this is the target file
        if(/.xaml$/.test(file.Name)) {
            // Read the file
            file.content().execute(function(content) {
                // Convert the buffer to a string
                var wfDefinition = (new TextDecoder("utf-8")).decode(content);

                // Parse the xml
                var xmlDoc = (new DOMParser()).parseFromString(wfDefinition, "text/xml");

                // Analyze the workflow definition
                analyze2013Workflow(activeWorkflows, xmlDoc, wfInfo);
            });
        }
    });
}
```

##### 4. Determine Status

The REST API has an endpoint for getting the 2013 Workflow for a list or web. We can use this to help determine the workflow state.

```js
function analyze2013Workflow(activeWorkflows, xmlDoc, wfInfo) {
    // Get the activity
    var activity = xmlDoc.querySelector("Activity");
    if(activity) {
        // Get the workflow information
        var wfName = wfInfo["WSDisplayName"];
        var wfEnabled = wfInfo["WSEnabled"] ? true : false;
        var wfPublished = wfInfo["WSPublishState"] == 3;
        var wfScope = "";

        // Get the active workflow
        var workflow = activeWorkflows[wfName];
        if(workflow) {
            var wfListId = null;
            var wfListName = null;
            var wfWebUri = null;

            // Parse the properties
            for(var i=0; i<workflow.PropertyDefinitions.results.length; i++) {
                var prop = workflow.PropertyDefinitions.results[i];

                switch(prop.Key) {
                    case "WSEnabled":
                        wfEnabled = prop.Value.toLowerCase() == "true" ? true : false;
                        break;

                    case "Microsoft.SharePoint.ActivationProperties.ListId":
                        wfListId = prop.Value;
                        break;

                    case "Microsoft.SharePoint.ActivationProperties.ListName":
                        wfListName = prop.Value;
                        break;

                    case "CurrentWebUri":
                        wfWebUri = prop.Value;
                        break;
                }
            }

            // Set the scope
            wfScope = wfListId ? "List" : "Site";

            // See if this is associated w/ a list
            if(wfListId) {
                // Log
                console.log("Workflow was found associated to a list.", wfName, wfScope, wfPublished, wfEnabled);
            } else {
                // Log
                console.log("Workflow was found associated to a site.", wfName, wfScope, wfPublished, wfEnabled);
            }
        } else {
            // Log
            console.log("Workflow was found.", wfName, wfScope, wfPublished, wfEnabled);
        }
    }
}
```

##### 5. Run Code

Now that we have the code completed, we will run it in the console browser. Paste the above functions first, prior to running the main function in step 1.

![2013 Workflow Demo](images/WorkflowDefinitions/2013-wf-demo.png)
