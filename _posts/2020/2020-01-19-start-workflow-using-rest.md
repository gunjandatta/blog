---
layout: "post"
title: "Start a Workflow using REST"
date: "2020-01-19"
description: ""
feature_image: ""
tags: ["workflow"]
---

This post will give an example of starting a SharePoint workflow using the REST API. The [gd-sprest](https://github.com/gunjandatta/sprest) library was recently updated to include the SharePoint Workflow REST API endpoints. We will be using this library for this example, but will also provide the raw HTTP request information.

<!--more-->

### 2010 vs 2013 Workflows

The REST API _only_ supports the ability to start a SharePoint 2013 workflow. In order to start a 2013 workflow using the REST API, you will need to get the _Subscription Id_ of the workflow, and the list item id of the target item to run the workflow against.

#### Getting the Workflow Information

The workflow information for 2010 and 2013 types are stored in different locations.

##### 2010 List Workflow

The workflow information will be found in the list's WorkflowAssociations property.

```ts
import { List } from "gd-sprest";

// Get the target list's workflow information
List("Workflow Test").WorkflowAssociations().execute(workflows => {
    // Parse the workflows
    for(let i=0; i<workflows.results.length; i++) {
        let workflow = workflows.results[i];
    }
});
```

###### Sample Output
![2010 Workflow Information](images/StartWorkflow/wf2010info.png)

##### 2013 List Workflow

The workflow information will be found in the Workflow REST API endpoint.

```ts
import { List, WorkflowSubscriptionService } from "gd-sprest";

// Get the list information
List("Workflow Test").execute(list => {
    // Get the workflows for this list
    WorkflowSubscriptionService().enumerateSubscriptionsByList(list.Id).execute(workflows => {
        // Parse the workflows
        for(let i=0; i<workflows.results.length; i++) {
            let workflow = workflows.results[i];

            // The subscription id will be needed to start the workflow
            let subscriptionId = workflow.Id;
        }
    });
});
```

###### Sample Output
![2013 Workflow Information](images/StartWorkflow/wf2013info.png)

##### HTTP Request Information

###### Get List Information
```
Accept: "application/json;odata=verbose"
Content-Type: "application/json;odata=verbose"
X-HTTP-Method: "GET"
X-RequestDigest: [Request Digest Id]
url: "https://[tenant].sharepoint.com/sites/dev/_api/web/lists/getByTitle('Workflow Test')"
```

###### Get Workflow Information
```
Accept: "application/json;odata=verbose"
Content-Type: "application/json;odata=verbose"
X-HTTP-Method: "POST"
X-RequestDigest: [Request Digest Id]
url: "https://[tenant].sharepoint.com/sites/dev/_api/SP.WorkflowServices.WorkflowSubscriptionService.Current/enumerateSubscriptionsByList(listId='854aebf3-64bd-43d7-aae2-601720829806')"
```

#### Start the 2013 Workflow

The Workflow REST API endpoint has a method to start workflows.

```ts
import { WorkflowInstanceService } from "gd-sprest";

// Following the previous example
// wfSubscriptionId - The workflow Id property found in the previous step
// itemId - The item id to execute the workflow on

// Start the workflow
WorkflowInstanceService().startWorkflowOnListItemBySubscriptionId(wfSubscriptionId, itemId).execute(
    // Workflow started
    req => {},
    // Workflow did not start
    err => {}
);
```

##### HTTP Request Information

###### Start Workflow
```
Accept: "application/json;odata=verbose"
Content-Type: "application/json;odata=verbose"
X-HTTP-Method: "POST"
X-RequestDigest: [Request Digest Id]
url: "https://[tenant].sharepoint.com/sites/dev/_api/SP.WorkflowServices.WorkflowInstanceService.Current/startWorkflowOnListItemBySubscriptionId(subscriptionId='9c149201-f403-478c-9eca-601720829806', itemId=2)"
```
