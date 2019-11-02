---
layout: "post"
title: "Detect Page in App Part"
date: "2016-11-14"
description: ""
feature_image: ""
tags: []
---

In this post, I'll go over a simple solution for focusing on the main placeholder content, if the page is detected to be within an App-Part.

<!--more-->

### App Part Properties

Update the "Elements.xml" file and add a custom query string key-value pair to it:

```
    <Content Type="html" Src="~appWebUrl/Pages/Dashboard.aspx?{StandardTokens}&amp;IsAppPart=1" />

```

### JavaScript to Detect App Part

In the javascript source file of the page, App.js is the default one for SharePoint Hosted add-ins, add the following code:

```
// Parse the query string
var qs = document.location.search.substr(1).split('&');
for(var keyValue of qs) {
    // See if this is an app part
    if (keyValue == "IsAppPart=1") {
        // Create a custom style element
        var style = document.createElement("style");
        style.type = "text/css";

        // Only display the main placeholder content
        style.innerHTML = "#s4-ribbonrow, #s4-titlerow, #suiteBarDelta { display: none !important; }";

        // Add this to the header
        document.head.appendChild(style);

        // Break from the loop
        break;
    }
}

```
