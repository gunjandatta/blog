---
layout: "post"
title: "SPFx and Function Apps"
date: "2025-06-16"
description: "How to call a function app api from SPFx securely."
feature_image: ""
tags: ["function app"]
---

This post will go over how to call a function app api securely from SPFx.

<!--more-->

### Overview

This blog post will show you how to call an Azure Function API from SPFx securely. We will create a function app, add sample data to return, create the SPFx application and then go over the authentication steps you need to take in order to securely call it.

I will go over all changes you need to make throughout the process to explain what/why a configuration change is needed.

### Initial Setup

First, we will create the function app and spfx solutions, and get them to talk to each other. This will ensure it's working prior to securing the api calls.

#### Create the Function App

Create an Azure Function. For this example, I selected `PowerShell` and created a function called `GetTestData`. Update the `GetTestData` powershell script to return test data.

```ps
using namespace System.Net

# Input bindings are passed in via param block.
param($Request, $TriggerMetadata)

# Write to the Azure Functions log stream.
Write-Host "PowerShell HTTP trigger function processed a request."

# Set the test data
$body = @(
    @{ Id = 1; Title = "Test 1" }
    @{ Id = 2; Title = "Test 2" }
    @{ Id = 3; Title = "Test 3" }
    @{ Id = 4; Title = "Test 4" }
    @{ Id = 5; Title = "Test 5" }
);

# Associate values to output bindings by calling 'Push-OutputBinding'.
Push-OutputBinding -Name Response -Value ([HttpResponseContext]@{
    StatusCode = [HttpStatusCode]::OK
    Body = $body
})
```

#### Test the Function App

Click on `Test/Run` to test out the function app and ensure it returns data. Click on `Get Function URL` and copy the default url for the SPFx solution.

#### Create SPFx Solution

Create an SPFx solution to create a WebPart. Update the `render` function and remove any unused variables/code. Paste the function app url from the previous step as the `_uri` global variable.

```ts
  private _uri = "https://[FUNCTION APP NAME].azurewebsites.net/api/[FUNCTION NAME]?code=[SECRET KEY]";

  public render(): void {
    this.domElement.innerHTML = `Loading the data...`;

    // Call the request
    this.context.httpClient.get(this._uri, HttpClient.configurations.v1)
      .then(resp => {
        return resp.json();
      })
      .then((data: object[]) => {
        this.domElement.innerHTML = `
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        `;

        // Add the data rows
        const elRows = this.domElement.querySelector("tbody") as HTMLElement;
        data.forEach((item: { Id: string; Title: string }) => {
          // Append a row
          elRows.innerHTML += `
            <tr>
              <td>${item.Id}</td>
              <td>${item.Title}</td>
            </tr>  
          `;
        });
      })
      .catch(err => {
        this.domElement.innerHTML = `Error calling the client...`;
        console.error(err);
      })
  }
```

#### Test SPFx Solution

Run `gulp serve` to test the SPFx solution. Access your SharePoint environment's workbench and add your solution to test. You will most likely see `Error calling the client...`. Further inspection of the error from the console shows a `CORS` error.

##### Fixing the CORS Error

From the `Function App`, select `CORS` under the `API` menu. Add your tenant url to the `Allowed Origins` and click on `Save`. This may take a minute or two, but refresh the SPFx test page and you should see the sample test data.

### Securing the API

Now that we have the SPFx solution getting data from the Function App, we can now work to securely call it without the secret key being exposed.

#### Configure Authentication

From the `Function App`, select `Authentication` under the `Settings` menu. Click on `Add Identity Provider` and select `Microsoft` as the identity provider. We will use the default options to create an app registration. The only property we will update is the `Unautenticated requests` to `HTTP 401 Unauthorized recommended for APIs`.

#### View App Registration

Once the identity provider is created, click on the link to take you to the Entra App Registration it created. Select `Expose an api` under the `Manage` menu and note the `Application ID URI` and `Scopes`. A scope was created for `user_impersonation`, which will use the context of the current user to authenticate with Entra. We will need to update the SPFx solution to register this API.

##### Add API Permission Request to SPFx

From the SPFx solution, select the `config/package-solution.json` file and add the following under the `solution` property:

```json
"webApiPermissionRequests": [
  {
    "resource": "[Name of App Registration]",
    "scope": "user_impersonation"
  }
]
```

##### Update Code to Call API

Now that we have registered the external API. We will need to update the code to use the `AADHttpClient`.

###### Global Variables

First, we will update the global variables. The previous step where we viewed the `Expose an api` configuration of the app registration, we will set the `_clientUri` variable to this value. Next, we will set the `_faUri` variable to the function app's uri. We used this prior with the secret key, but we no longer need the secret key value passed to call it so remove this from value.

```ts
import { AadHttpClient } from "@microsoft/sp-http";

export default class HelloFunctionAppWebPart extends BaseClientSideWebPart<IHelloFunctionAppWebPartProps> {
  private _client: AadHttpClient;
  private _clientUri = "api://[Guid of App Registration]";
  private _faUri = "https://[Function App URI]";
}
```

###### Add onInit Event

The `onInit` event will create the client. We will use the `aadHttpClientFactory` variable from the context to get the client. The client will be used to make the API calls.

```ts
protected onInit(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Get the client
    this.context.aadHttpClientFactory.getClient(this._clientUri)
      .then(client => {
        this._client = client;
        resolve();
      })
      .catch(reject);
  });
}
```

###### Update render Event

The `render` event will need to code calling the api to be updated to use the aad client.

```ts
public render(): void {
  this.domElement.innerHTML = `Loading the data...`;

  // Call the request
  this._client.get(this._faUri, AadHttpClient.configurations.v1)
    .then(resp => {
      return resp.json();
    })
    .then((data: object[]) => {
      this.domElement.innerHTML = `
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      `;

      // Add the data rows
      const elRows = this.domElement.querySelector("tbody") as HTMLElement;
      data.forEach((item: { Id: string; Title: string }) => {
        // Append a row
        elRows.innerHTML += `
          <tr>
            <td>${item.Id}</td>
            <td>${item.Title}</td>
          </tr>  
        `;
      });
    })
    .catch(err => {
      this.domElement.innerHTML = `Error calling the client...`;
      console.error(err);
    })
}
```

#### Test SPFx Solution

Since we are requesting a web api permission, we will need to build and add the solution to the app catalog. This is required in order for the tenant administrator to approve the API request. Without approval, you will receive an error stating that the request has not been approved.

##### Update package.json

Update the `package.json` file and run `npm run package` to generate the `.sppkg` file under the `sharepoint/solution` folder.

```json
"scripts": {
  "build": "gulp bundle",
  "clean": "gulp clean",
  "package": "gulp clean && gulp build --ship && gulp bundle --ship && gulp package-solution --ship",
  "test": "gulp test"
}
```

##### Deploy Solution and Approve API Request

Update the global or site app catalog with the `.sppkg` file, then access the SharePoint admin center. Select `API access` under the `Advanced` menu. Select your api for your SPFx solution and click on `Approve`. Approving the request will add the api permission to the `SharePoint Online Web Client Extensibility` application registration. This will allow the `getClient` method to work from the `onInit` SPFx event.

##### Create Page and Test Solution

Create a modern site page and add your SPFx webpart to the page. You will notice a `403 Forbidden` error. We will need to update the function app to allow requests from the `SharePoint Online Web Client Extensibility` application registration. To do this, access your azure function and click on `Authentication` from the `Settings` menu. Edit the `Identity provider` and change the `Client application requirement` to `Allow requests from specific client applications`. Edit the `Allowed client applications` and add the Guid for the `SharePoint Online Web Client Extensibility` application registration: `08e18876-6177-487e-b8b5-cf950c1e598c`

##### Test SPFx Solution

Refreshing the solution page, you will now notice a `401 Unauthorized` error. Now that the API is configured for authentication, we need to modify the Function App's Integration's HTTP Function. Access the `GetTestData` function and select the `Integration` tab. Click on the `HTTP (Request)` link under `Trigger and inputs`. Update the `Authorization level` to `Anonymous`.

Refresh the solution page and you will see the test data.

### Summary

Using Azure Functions will elevate your SPFx solution options. It's very powerful and very useful. I hope this code example was helpful. Happy Coding!!!