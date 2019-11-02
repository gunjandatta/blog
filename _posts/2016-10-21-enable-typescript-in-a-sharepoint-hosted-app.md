---
layout: "post"
title: "Enable TypeScript in a SharePoint Hosted App"
date: "2016-10-21"
description: ""
feature_image: ""
tags: []
---

In this post, I'll give step-by-step instructions of including TypeScript in Visual Studio. This will be a pre-req for my next post of using NPM in a SharePoint Hosted App (Add-In).

<!--more-->

## Enable TypeScript in Visual Studio

This section will go over the setup and configuration of the Visual Studio project.

### Download and Install TypeScript for VS 2015

If you haven't already installed "TypeScript for Visual Studio", you will be required to. As 2015 is the latest at the moment, here is the [link](https://www.microsoft.com/en-us/download/details.aspx?id=48593) for the installation file. Install it taking the default settings.

### Create a SharePoint Hosted App (Add-In)

[![Create VS Project](http://dattabase.com/wp-content/uploads/2016/10/CreateVSProject-300x209.png)](http://dattabase.com/wp-content/uploads/2016/10/CreateVSProject.png)

Clicking on "Next", select the Add-In type and set the url to the SharePoint site to deploy to. For this demo, I've selected to create a "SharePoint Hosted" Add-In.

### Update the VS Project File

#### Unload the Project

[![Unload VS Project](http://dattabase.com/wp-content/uploads/2016/10/UnloadProject-282x300.png)](http://dattabase.com/wp-content/uploads/2016/10/UnloadProject.png)

Right-click on the project and select the option to unload it.

#### Edit the Project File

[![Edit VS Project File](http://dattabase.com/wp-content/uploads/2016/10/EditProjectFile.png)](http://dattabase.com/wp-content/uploads/2016/10/EditProjectFile.png)

Right-click on the project and select the option to edit the \[Project Name\].csproj file.

#### Add the TypeScript Reference

[![Update Project File](http://dattabase.com/wp-content/uploads/2016/10/UpdateCSProjFile-300x59.png)](http://dattabase.com/wp-content/uploads/2016/10/UpdateCSProjFile.png)

Scroll to the bottom of the file, and add the following to the project file:

```
  <PropertyGroup>
    <TypeScriptSourceMap>true</TypeScriptSourceMap>
  </PropertyGroup>
  <Import Project="$(MSBuildExtensionsPath32)\Microsoft\VisualStudio\v$(VisualStudioVersion)\TypeScript\Microsoft.TypeScript.targets" />

```

#### Reload the Project

[![Reload VS Project](http://dattabase.com/wp-content/uploads/2016/10/ReloadProject-300x154.png)](http://dattabase.com/wp-content/uploads/2016/10/ReloadProject.png)

Right-click on the project and select the option to reload it. Check out the next post for steps on using NPM in the Visual Studio project.
