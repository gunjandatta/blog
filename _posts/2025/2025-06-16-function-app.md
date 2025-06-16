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

1. Access the [Azure Portal](https://portal.azure.com)
2. Select the `Create a resource` option from the home screen
3. Select the `Create` link under `Azure Function`
4. Select the `Consumption` option for the hosting plan

#### Select the Runtime Stack

For this example, we are going to use `PowerShell` to return an array of test data. Fill out the required fields and set the runtime stack to `PowerShell Core`. Review and create the function app.

#### Create Function

Once the function app is created, access it and create the function.

1. Select `HTTP trigger` for the template
2. Set the function name to `GetTestData`
3. Select the `Create` button

#### Set PowerShell Script

Set the `run.ps1` script and save the changes.

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

1. Click on `Test/Run` to test out the function app and ensure it returns data
2. Click on `Get Function URL` and copy the default url for the SPFx solution

![Test Function App](images/SPFxFunctionApp/test-function-app.png)

#### Create SPFx Solution

Next we will create the SPFx solution and have it call the function app. Once we have this working, we will secure the api call.

##### Create Project

Run `yo @microsoft/sharepoint` and set the following properties

* **Solution Name:** spfx-fa-demo
* **Component:** WebPart
* **WebPart Name:** HelloFunctionApp
* **Template:** No framework

##### Update package.json

Update the `package.json` file and add a new script to clean, build, package and generate the `.sppkg` file under the `sharepoint/solution` folder.

```json
"scripts": {
  "build": "gulp bundle",
  "clean": "gulp clean",
  "package": "gulp clean && gulp build --ship && gulp bundle --ship && gulp package-solution --ship",
  "test": "gulp test"
}
```

###### Global Variables

We will use global variables to store the API information. Paste the function app url from the `Test the Function App` step as the value.

```ts
// https://[FUNCTION APP NAME].azurewebsites.net/api/[FUNCTION NAME]?code=[SECRET KEY]
private _uri = "https://fa-spfx-demo.azurewebsites.net/api/GetTestData?code=[SECRET KEY]";
```

###### Update render() Event

Since we are just trying to get the solution to work, we will use the built in `httpClient` component from the SPFx's context. We will need to reference the component, so add the following import statement.

```ts
import { HttpClient } from "@microsoft/sp-http";
```

We will render the test data in a simple html table, after getting the information from the `GetTestData` api call.

```ts
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

###### Remove Unused References/Variables/Functions

The linting rules will require us to clean up the code of unused methods and variables. Before building the solution, we will need to do the following:

1. Remove the default `_getEnvironmentMessage` and `onThemeChanged` methods
2. Comment out the `onInit` method, as we will need to add code to this when we secure the api
3. Remove the unused import statements

#### Test SPFx Solution

1. Run `gulp serve` to test the SPFx solution
2. Access your SharePoint site's workbench `/_layouts/15/workbench.aspx`

#### Fix the CORS Error

The solution will have an error message displayed. Further investigation from the develper console will show a CORS error.

`workbench.aspx:1  Access to fetch at 'https://[FunctionAppURI]' from origin 'https://[tenant].sharepoint.com' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`

1. Access the `Function App`
2. Select `CORS` under the `API` menu
3. Add your tenant url to the `Allowed Origins`
4. Click on `Save`

![Fix CORS](images/SPFxFunctionApp/fix-cors.png)

_Note - This may take a minute or two, but refresh the SPFx test page and you should see the sample test data._

##### Refresh Workbench

Refreshing the workbench page, you will see the test data displayed.

![Test Solution](images/SPFxFunctionApp/test-workbench.png)

### Securing the API

Now that we have the SPFx solution getting data from the Function App, we can now work to securely call it without the secret key being exposed.

#### Configure Authentication

1. Access the `Function App`
2. Select `Authentication` under the `Settings` menu
3. Click on `Add Identity Provider`
4. Select `Microsoft` as the identity provider
5. Select `180 days` for the `Client secret expiration`
6. Update the `Unautenticated requests` property to `HTTP 401 Unauthorized recommended for APIs`
7. Select `Add` to create the application registration

![Add Identity Provider](images/SPFxFunctionApp/add-identity-provider.png)

_Note - The default name of the application registration will be the same as the function app name._

#### View App Registration

Once the identity provider is created, click on the link to take you to the Entra App Registration it created. Select `Expose an api` under the `Manage` menu and note the `Application ID URI` and `Scopes`. A scope was created for `user_impersonation`, which will use the context of the current user to authenticate with Entra. We will need to update the SPFx solution to register this API.

![View App Registration](images/SPFxFunctionApp/view-app-registration.png)

#### Update SPFx Solution

Currently, we are passing the secret key in the query string of the uri to authenticate the request. This isn't recommended, since it's not secured and not supposed to be exposed. We want to use Entra to authenticate the SharePoint user and use their context to call the api.

##### Update config/package-solution.json

We will use the identity provider's application registration to authenticate with Entra AD. Select the `config/package-solution.json` file and add the following under the `solution` property:

```json
"webApiPermissionRequests": [
  {
    "resource": "fa-spfx-demo",
    "scope": "user_impersonation"
  }
]
```

##### Update HTTP Client

To authenticate with Entra AD, we will need to use the `AadHttpClient` component. Update the reference to the http client.

```ts
import { AadHttpClient } from "@microsoft/sp-http";
```

##### Update API References

We will need to update the global variables for the http client. We will set the `_clientUri` reference the application registration's `Application ID URI`. This will allow us to get a token from Entra and pass it in the header for authentication to the function app.

```ts
export default class HelloFunctionAppWebPart extends BaseClientSideWebPart<IHelloFunctionAppWebPartProps> {
  private _client: AadHttpClient;
  private _clientUri = "api://[Application ID URI]";
  private _faUri = "https://[Function App URI]";
}
```

##### Update onInit() Event

Uncomment the `onInit` event and set the code to create the http client. The `onRender` event will reference this to make the api calls.

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

##### Update render() Event

We will need to update the http client in the `render` event to reference the new one.

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

##### Test SPFx Solution

When creating `Web API Permission Requests`, the tenant admin will need to be approved in order for the api call to work. We will need to build and deploy the solution to the app catalog in order for the approval to appear in the SharePoint admin center.

1. Run `npm run package` to build and create the solution
2. Access the app catalog `/sites/appcatalog`
3. Upload the solution file from the `sharepoint/solutions` folder
4. Check the option to make the solution available immediately
   _Note - This skip the steps to add the app to a site before we are able to access the webpart._
5. Click the `Deploy` button to make the webpart available for use
6. Access a site to test the solution
7. Create a site page
8. Add the webpart to the page and republish the page
   _Note - If a popup dialog appears, just ignore it and close it._

##### Approve the API Request

The solution will display an error. Further inspection from the development console, you will notice an error stating that the api hasn't been approved.

1. Access the SharePoint admin center
2. Select `API access` under the `Advanced` menu
3. Select your api for your SPFx solution and click on `Approve`
4. Refresh the test page

![View App Registration](images/SPFxFunctionApp/approve-api-request.png)

_Note - Approving the request will add the api permission to the `SharePoint Online Web Client Extensibility` application registration. This will allow the `getClient` method to work from the `onInit` SPFx event._

##### Fix 403 Forbidden Error

The solution will display an error message. Further inspection from the development console, you will notice a `403 Forbidden` error when calling the function app. SharePoint has a default application that is used for the web api requests. We will need to update the function app to allow requests from the `SharePoint Online Web Client Extensibility` application registration. Complete the following:

1. Access your azure function
2. Click on `Authentication` from the `Settings` menu
3. Update the `Client secret setting name` to `-- Remove value (Do not set client secret) --`
4. Edit the `Identity provider` and change the `Client application requirement` to `Allow requests from specific client applications`
5. Edit the `Allowed client applications`
6. Add the Guid for the `SharePoint Online Web Client Extensibility` application registration: `08e18876-6177-487e-b8b5-cf950c1e598c`
7. Refresh the test page

![Fix 403 Error](images/SPFxFunctionApp/fix-403-error.png)

##### Fix 401 Unauthorized Error

The solution will display the same error message still. Further inspection from the development console, you will now notice a `401 Unauthorized` error. Now that the API is configured to get a token from Entra and pass it to the azure function, we need to modify the function app's authorization level.

1. Access the azure function
2. Click on the `GetTestData` function
3. Select the `Integration` tab
4. Click on the `HTTP (Request)` link under `Trigger and inputs`
5. Update the `Authorization level` to `Anonymous`

![Fix 401 Error](images/SPFxFunctionApp/fix-401-error.png)

_Note - We are already authenticated by Entra, so we don't need an additional layer of authentication._

Refreshing the test page will display the solution.

![View Solution](images/SPFxFunctionApp/view-solution.png)

### Summary

Using Azure Functions will elevate your SPFx solution options. It's very powerful and very useful. I hope this code example was helpful. Happy Coding!!!