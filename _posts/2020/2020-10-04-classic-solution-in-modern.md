---
layout: "post"
title: "How to Surface a Classic Solution in a Modern Page"
date: "2020-10-04"
description: "Example on how to surface a classic HTML/JS/CSS solution in a modern page or teams tab."
feature_image: ""
tags: ["classic", "modern"]
---

This post will go over how to surface a classic SharePoint HTML/JS/CSS solution in a modern page or teams tab.

<!--more-->

We will use the [VueJS Basic Dashboard](https://github.com/gunjandatta/sp-dashboard-vue/wiki) example from the [Code Examples](https://dattabase.com/examples/) page to surface in a modern page and teams tab.

### Minimal App Page

We will use the [minimal app page](https://dattabase.com/blog/minimal-page-for-sharepoint-app-parts) for app parts to render our custom HTML/CSS/JS solution to. Microsoft hasn't announced Add-In solutions being deprecated, so this solution should work long term. This solution will not work on sites that have [Custom Scripts](https://docs.microsoft.com/en-us/sharepoint/allow-or-prevent-custom-script) disabled.

#### Dashboard Example

The VueJS dashboard example uses a content editor webpart which references an index.html.

##### index.html
```html
<!-- The element to render the solution to -->
<div id="sp-dashboard" class="bs"></div>

<!-- Reference the solution script -->
<script src="./sp-dashboard-vue.js"></script>
```

We will copy the [minimal app page](https://dattabase.com/blog/minimal-page-for-sharepoint-app-parts) to a new file called app.aspx, and add the index.html contents to it. This file will need to be uploaded to the same folder containing the solution, based on the script source file references.

![Upload Files](images/ClassicSolutionsInModern/upload-files.png)

##### app.aspx
```html
<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>
<%@ Page Language="C#" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<!-- Required to be used in an App Part -->
<WebPartPages:AllowFraming runat="server" />

<html>
    <head>
        <title>VueJS Dashboard</title>
        <meta name="WebPartPageExpansion" content="full" />

        <!-- Required for the SP.UI.ModalDialog -->
        <link rel="stylesheet" type="text/css" href="/_layouts/15/1033/styles/Themable/corev15.css">
    </head>
    <body>
        <form runat="server">
            <!-- Required to make posts to SP -->
            <SharePoint:FormDigest runat="server" />

            <!-- SharePoint References -->
            <SharePoint:ScriptLink Name="MicrosoftAjax.js" runat="server" Defer="False" Localizable="false" />
            <SharePoint:ScriptLink Name="sp.core.js" runat="server" Defer="False" Localizable="false" />
            <SharePoint:ScriptLink Name="sp.js" runat="server" Defer="True" Localizable="false" />

            <!-- The element to render the solution to -->
            <div id="sp-dashboard" class="bs"></div>

            <!-- Reference the solution script -->
            <script src="./sp-dashboard-vue.js"></script>
        </form>
    </body>
</html>
```

##### View Dashboard

Click on the **app.aspx** page to view the solution.

![Test File](images/ClassicSolutionsInModern/test-app.png)

##### Create Modern Page

Create a new modern page and add the embed webpart to the page.

![Create Modern Page](images/ClassicSolutionsInModern/create-modern-page.png)

##### Reference app.aspx

Set the absolute url of the solution in the webpart properties.

![Reference App](images/ClassicSolutionsInModern/reference-app.png)

##### View Modern Page

Save or publish the page to view the solution.

![View Modern Page](images/ClassicSolutionsInModern/view-modern-page.png)

##### Known Issues

The css may need to be adjusted for the modern page.

#### Surface to Teams

##### Add Teams Tab
In teams, add a "SharePoint" tab to a channel.

![Add Teams Tab](images/ClassicSolutionsInModern/add-sharepoint-tab.png)

Next, click on the **Add page or list from any SharePoint site** link to reference the page by its url.

![Add SharePoint Page](images/ClassicSolutionsInModern/add-sharepoint-page.png)

##### Reference the App

This will not work, but I wanted to show you what will happen if you try to reference a non-modern SharePoint page.

![Reference App in Teams](images/ClassicSolutionsInModern/reference-app-in-teams.png)

##### Reference the Modern Page

Updating the url to the modern page we created in the previous step will work.

![View Teams Tab](images/ClassicSolutionsInModern/view-teams-tab.png)

##### Known Issues

The css will need to be adjusted for a teams tab.