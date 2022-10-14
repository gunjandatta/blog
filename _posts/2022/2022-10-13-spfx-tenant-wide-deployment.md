---
layout: "post"
title: "SPFx Tenant-Wide Deployment in SharePoint 2019"
date: "2022-10-13"
description: "Thoughts on a work-around for deploying SPFx extensions to a Web Application."
feature_image: ""
tags: ["spfx"]
---

This post will go a work-around for SPFx extensions deployed across all site collections within a SharePoint 2019 On-Premise web application.

_From the community feedback, I created a [code walkthrough](https://dattabase.com/examples/#spfx-banner) to further go over this blog post:_

<!--more-->

### SPFx Tenant-Wide Deployments

SharePoint Online has the ability to deploy SPFx solutions across the tenant, but SharePoint 2019 only supports the ability for SPFx **webparts** to be deployed globally. Refer to [this link](https://github.com/SharePoint/sp-dev-docs/issues/3590) for additional details on this, it's the best one I've been able to find that explains what is going on.

### SPFx Features

By default, the SPFx feature is scoped to the web. This file is generated during the packaging of the SPFx solution, so there is no way to modify the scope of the feature to be `Site` or `WebApplication`. Even if we could, I bet this wouldn't work. Ideally, it would be nice to be allowed to configure the scope of the feature to better target an entire site collection or web application for on-premise deployments.

### Work-Around

The work-around I came up with, is to create an empty SharePoint 2019 solution using Visual Studio. 

#### Step 1 - Deploy SPFx Extension

1) Develop your SPFx extension for 2019. [Code Example](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/extensions/get-started/build-a-hello-world-extension)

2) Deploy the solution to the app catalog

At this point, we have an app in the catalog that is deployed. When the app is deployed, this will add the SPFx solution assets to the `Client Side Assets` hidden library.

#### Step 2 - Create WSP Solution

1) Create a new Visual Studio project

2) Select the option to `Deploy as a farm solution`

3) Add a new item to the project

4) Select `Empty Element` as the item type

5) Copy the "Elements.xml" from the SPFx solution (sharepoint/assets/elements.xml) CustomAction element to this new elements file

6) Open the `Features` and ensure the element is included in the feature

7) Set the scope of the feature to be `WebApplication`

8) Save and package the wsp

9) Install the wsp

```powershell
Add-SPSolution -LiteralPath C:\code\banner\bannerwebapp.wsp

Install-SPSolution -Identity {Solution GUID} -GACDeployment
```

#### Validation

1) Access Cental Administration and click on `System Settings`

2) Click on `Manage farm solutions`

3) Validate the solution has a status of `Deployed`

If the solution hasn't been deployed, click on the feature and click on `Deploy` to deploy it.

4) Access a site in the web application

5) From a modern page, press `Ctrl+F12` to access the developer dashboard, assuming you have used the built-in logging

6) From a modern page, access the developer tools and validate that the solution is being loaded

### Summary

I hope this work-around is helpful. Happy Coding!!!