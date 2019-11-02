---
layout: "post"
title: "Disable SharePoint Edit Page Save Notification"
date: "2017-06-15"
description: ""
feature_image: ""
tags: []
---

This post will cover how to bypass the "Save Notification" when editing a SharePoint wiki or webpart page.

<!--more-->

### Overview

I needed to implement this for the [Modern WebPart](https://dattabase.com/blog/sharepoint-2013-modern-webpart) post. The custom configuration was stored in the WebPart's "Content" property. The code example uses JSOM (JavaScript Object-Model) to update the webpart and redirects the user to the current page. When trying to redirect the user, SharePoint will display a "Save Notification" warning the user to save the page. Not only is this notification annoying, but by clicking "OK" to save the page changes it would overwrite the previous version reverting it back to its original state.

### Solution

After searching google for quite some time and finding no answers, I decided to dig into the core SharePoint JavaScript. I found the "unload" event which displays the save notification, and noticed it was controlled by a global variable. The code example below includes a safe check to ensure the global variable exists. Setting this value to true, will bypass the event to display the edit page's save notification.

```
// Disable the save notification
if(SP && SP.Ribbon && SP.Ribbon.PageState && SP.Ribbon.PageState.PageStateHandler) {
    SP.Ribbon.PageState.PageStateHandler.ignoreNextUnload = true;
}

```
