---
layout: "post"
title: "Trigger a Flow from JavaScript"
date: "2023-01-11"
description: "Explains how to trigger a flow from JavaScript (JS)."
feature_image: ""
tags: ["flow"]
---

This post will give an overview of how to trigger a flow from JavaScript.

<!--more-->

### Flow & SharePoint Development

Splitting out the buisness logic and utilizing Flow to run dynamically or by code has always been on my TODO list. This approach will help customers/clients maintain solutions easily through Flow, instead of relying on a developer for code updates.

This code walkthrough will create a flow for a list to send a notification to the user in the item's value. Next we will demonstrate how to trigger this flow against the item using JavaScript from SharePoint.

### Create the Flow

The section will create a list and create/configure a flow.

_Note - This approach will work against a list or library._

#### Step 1 - Create the List

Create a list to execute this flow against.

![Create List](images/CallFlowFromJS/create-list.png)

Next, add a user field that we will reference in the notification.

![Add User Field](images/CallFlowFromJS/add-user-field.png)

#### Step 2 - Create Flow

Access Power Automate and create a new "Instant Cloud" flow, and click on the "Skip" option in the next window.

![Create Flow](images/CallFlowFromJS/create-flow.png)

Name the flow and select the `SharePoint` trigger `For a Selected Item`.

![Add Trigger](images/CallFlowFromJS/add-trigger.png)

#### Step 3 - Implement the Flow

Type in the site address and select the list from the drop down.

![Set List](images/CallFlowFromJS/set-list-info.png)

Since this flow is triggered manually, we will need to get the item properties.

![Get Item](images/CallFlowFromJS/get-item.png)

The last step is to add the step for sending an email. This is just an example, so it will just send the `Title` information to the user selected.

![Send Email](images/CallFlowFromJS/send-email.png)

_Note - Don't forget to save your flow._

### Create the JavaScript

This section will go over the code to execute the flow. I will trigger this from the browser console, but will provide the typescript code example at the end of this post.

#### Step 1 - Reference the [gd-sprest](https://dattabase.com) Library

We will use the [gd-sprest](https://dattabase.com/getting-started/) library to interact with the SharePoint REST API. A [previous post](https://dattabase.com/blog/call-graph-api-from-spo) goes over Graph API calls from SharePoint Online. We will utilize the `getAccessToken` method to authenticate with Flow.

From the browser console, reference the library.

`var s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/gd-sprest/7.3.6/gd-sprest.min.js"; document.head.appendChild(s);`

![Reference Library](images/CallFlowFromJS/reference-library.png)

Create a test item for the flow and note the item id of it. We will send this item id in a later step.

![Create Item](images/CallFlowFromJS/create-item.png)

#### Step 2 - Get the Flow Token

Next, we will need to authenticate with Power Automate in order to run the flow. We will utilize the `getAccessToken` method from the `Graph` component to authenticate with Flow. I recently updated the `SPTypes` enumerator with this new value.

`var auth = $REST.Graph.getAccessToken($REST.SPTypes.CloudEnvironment.Flow).executeAndWait();`

![Get Token](images/CallFlowFromJS/get-token.png)

The `auth` variable will contain the access token we will need to trigger the flow.

#### Step 3 - Get the Flow Instance

Next, we will get the flow instance. This will ensure the user has access to it, and to get the information required to run the flow.

_Note - The guid of the flow can be found in the URL of the Power Automate._

`var flow = $REST.List("Flow Demo").syncFlowInstance("b1870a02-7095-429e-9346-0fef1e28f88e").executeAndWait();`

The flow information is stored as a JSON string, so we will extract the information by parsing it.

`var flowInfo = JSON.parse(flow.SynchronizationData);`

![Get Flow](images/CallFlowFromJS/get-flow.png)

#### Step 4 - Run the Flow

Now that we have the access token and flow information, we can now trigger it by making a `POST` call.

**Create the Header**

```js
var headers = new Headers();
headers.append("Accept", "application/json");
headers.append("Content-Type", "application/json");
headers.append("authorization", "Bearer " + auth.access_token);
```

_Note - We will reference the access token from Step 1._

**Flow Parameters**

The flow will require some parameters about the item id. For this example, it's a new list so the first item I create will be `1`.

```js
var body = JSON.stringify({
    rows: [{
        entity: {
            ID: 1
        }
    }]
});
```

**Trigger Flow**

We will send a POST request to trigger the flow.

`fetch(flowInfo.properties.flowTriggerUri, { method: "POST", headers: headers, body: body});`

![Run Flow](images/CallFlowFromJS/run-flow.png)

#### Step 5 - Validate the Run

Refresh the Flow's page to view the last run times.

![Validate Run](images/CallFlowFromJS/validate-run.png)

### Code Example

This class will contain a static method for executing a flow. You will need to pass in the list name, item id and flow id. The web url parameter is optional.

```ts
import { Graph, SPTypes, Web } from "gd-sprest"; // Or gd-sprest-bs library

export class RunFlow() {
    // Executes a flow
    static execute(listName:string, itemId: number, flowId: string, webUrl?:string):PromiseLike<void> {
        // Return a promise
        return new Promise((resolve, reject) => {
            // Get the access token
            this.getAccessToken().then(access_token => {
                // Get the flow information
                this.getFlow(listName, flowId, webUrl).then(flowInfo => {
                    // Trigger the flow
                    this.triggerFlow(itemId, access_token, flowInfo).then(resolve, reject);
                }, reject);
            }, reject);
        });
    }

    // Gets the access token
    private static getAccessToken():PromiseLike<string> {
        // Return a promise
        return new Promise((resolve, reject) => {
            // Execute a request to flow
            Graph.getAccessToken(SPTypes.CloudEnvironment.Flow).execute(auth => {
                // Resolve the request
                resolve(auth.access_token);
            }, reject);
        });
    }

    // Gets the flow
    private static getFlow(listName:string, flowId: string, webUrl?:string):PromiseLike<any> {
        // Return a promise
        return new Promise((resolve, reject) => {
            // Get the flow for the list
            Web(webUrl).Lists(listName).syncFlowInstance(flowId).execute(flowInfo => {
                // Resolve the request
                resolve(JSON.parse(flowInfo.SynchronizationData));
            }, reject);
        });
    }

    // Trigger the flow
    private static triggerFlow(itemId: number, access_token: string, flowInfo: any) {
        // Create the xml http request
        let xhr = new XMLHttpRequest();
        xhr.open("POST", flowInfo.properties.flowTriggerUri, true);

        // Set the headers
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("authorization", "Bearer " + access_token);

        // Set the body
        let body = JSON.stringify({
            rows: [{
                entity: {
                    ID: itemId
                }
            }]
        });

        // Set the state change event
        xhr.onreadystatechange = () => {
            // See if the request has finished
            if (this.xhr.readyState == 4) {
                // Resolve the request
                resolve();
            }
        }

        // Execute the request
        xhr.send(body);
    }
}
```

### Summary

I hope you find this code example helpful. Happy Coding!!!