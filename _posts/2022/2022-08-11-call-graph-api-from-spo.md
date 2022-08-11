---
layout: "post"
title: "Call the Graph API from SharePoint Online"
date: "2022-08-11"
description: "Example on how to execute a Graph API request from a SharePoint site running under the user context."
feature_image: ""
tags: ["graph"]
---

This post will go over a new libray component for executing graph api requests from a SharePoint site, running under the context of the current user.

<!--more-->

### Graph API Token

The first step is to request a token in order to execute the Graph API request. This token is required in order to make a GET/POST request.

```ts
import { Graph } from "gd-sprest";

// Get the access token
Graph.getAccessToken().execute(token => {
  // Access Token - Required for the Graph API requests
  token.access_token;

  // Expires On
  token.expires_on;

  // Token ID
  token.id_token;

  // Resource
  token.resource;

  // Scope
  token.scope;

  // Type
  token.token_type;
});
```

#### Requestion Information

The getAccessToken method will take an optional parameter to specify the cloud type. You can utilize the `SPTypes.CloudEnvironment` enumerator to help with this. The HTTP request will look like the following:

```
Accept: "application/json;odata=verbose"
Content-Type: "application/json;odata=verbose"
X-HTTP-Method: "POST"
X-RequestDigest: [Request Digest Id]
url: "https://[tenant].sharepoint.com/sites/[current site]/_api/SP.OAuth.Token/Acquire"
data: { resource: "[cloud environment]" }
```

#### Cloud Environment

The available [cloud environments](https://docs.microsoft.com/en-us/graph/deployments) are listed in the microsoft docs. An enumerator can be used to specify which environment to use. The default is the commercial endpoint `https://graph.microsoft.com`.

#### Security

The request will run under the context of the user logged into SharePoint. The library will automatically set the property `securityEnabledOnly: true` which is passed in the body of the request.

### Graph Requests

The `Graph` library will allow you to specify the following properties:

* access_token (Required) - The access token for the graph api request
* cloud - The cloud environment to use (Default - Commercial)
* requestType - "GET" or "POST" request type (Default - GET)
* url - The graph api url of the request
* version - The graph api version (Default - 1.0)

### Code Examples

**Get Current User Information**
```ts
import { Graph } from "gd-sprest";

// Get the access token
Graph.getAccessToken().execute(token => {
  // Access Token - Required for the Graph API requests
  token.access_token;

  // Get the current user information
  Graph({
    accessToken: token.access_token,
    url: "me"
  }).execute(userInfo => {
    // Code goes here
  });
});
```

**Get Current User Information (US IL-5)**
```ts
import { Graph, SPTypes } from "gd-sprest";

// Get the access token
Graph.getAccessToken(SPTypes.CloudEnvironment.USL5).execute(token => {
  // Access Token - Required for the Graph API requests
  token.access_token;

  // Get the current user information
  Graph({
    accessToken: token.access_token,
    cloud: SPTypes.CloudEnvironment.USL5,
    url: "me"
  }).execute(userInfo => {
    // Code goes here
  });
});
```

#### Requestion Information
The HTTP request information for the above will be:

```
Accept: "application/json;"
Authorization: "Bearer [Access Token]"
Content-Type: "application/json;"
X-HTTP-Method: "GET"
url: "https://[Graph Cloud Endpoint]/[Version]/me"
data: { securityEnabledOnly: true }
```

**Get Current User's Group Information**
```ts
import { Graph } from "gd-sprest";

// Get the access token
Graph.getAccessToken().execute(token => {
  // Access Token - Required for the Graph API requests
  token.access_token;

  // Get the member's groups
  Graph({
    accessToken: token.access_token,
    requestType: "POST",
    url: "me/getMemberGroups"
  }).execute(userInfo => {
    // Code goes here
  });
});
```

**Get Current User's Group Information (US IL-5)**
```ts
import { Graph, SPTypes } from "gd-sprest";

// Get the access token
Graph.getAccessToken(SPTypes.CloudEnvironment.USL5).execute(token => {
  // Access Token - Required for the Graph API requests
  token.access_token;

  // Get the member's groups
  Graph({
    accessToken: token.access_token,
    cloud: SPTypes.CloudEnvironment.USL5,
    requestType: "POST",
    url: "me/getMemberGroups"
  }).execute(userInfo => {
    // Code goes here
  });
});
```

#### Requestion Information
The HTTP request information for the above will be:

```
Accept: "application/json;"
Authorization: "Bearer [Access Token]"
Content-Type: "application/json;"
X-HTTP-Method: "POST"
url: "https://[Graph Cloud Endpoint]/[Version]/me/getMemberGroups"
data: { securityEnabledOnly: true }
```

**Get Root Site**
```ts
import { Graph } from "gd-sprest";

// Get the access token
Graph.getAccessToken().execute(token => {
  // Access Token - Required for the Graph API requests
  token.access_token;

  // Get the root site
  Graph({
    accessToken: token.access_token,
    requestType: "POST",
    url: "sites/root"
  }).execute(rootSite => {
    // Code goes here
  });
});
```

**Get Root Site (US IL-5)**
```ts
import { Graph, SPTypes } from "gd-sprest";

// Get the access token
Graph.getAccessToken(SPTypes.CloudEnvironment.USL5).execute(token => {
  // Access Token - Required for the Graph API requests
  token.access_token;

  // Get the root site
  Graph({
    accessToken: token.access_token,
    cloud: SPTypes.CloudEnvironment.USL5,
    requestType: "POST",
    url: "sites/root"
  })
});
```

#### Requestion Information
The HTTP request information for the above will be:

```
Accept: "application/json;"
Authorization: "Bearer [Access Token]"
Content-Type: "application/json;"
X-HTTP-Method: "POST"
url: "https://[Graph Cloud Endpoint]/[Version]/sites/root"
data: { securityEnabledOnly: true }
```

### Summary

If you have any problems/issues with this new method, you can [report an issue here](https://github.com/gunjandatta/sprest/issues). I hope these code example are helpful. Happy Coding!!!