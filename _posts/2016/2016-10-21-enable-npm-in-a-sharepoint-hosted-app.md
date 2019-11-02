---
layout: "post"
title: "Enable NPM in a SharePoint Hosted App"
date: "2016-10-21"
description: ""
feature_image: ""
tags: [typescript "visual studio"]
---

In this post, I'll give step-by-step instructions of using Node Package Manager (NPM) in Visual Studio. This will require your environment to be configured for TypeScript. Refer to my previous post of Enabling TypeScript in a SharePoint Hosted App (Add-In).

<!--more-->

## Add Node Package Manager (NPM)

This section will go over the setup and configuration of the Visual Studio project. This will be a continuation of the project created in the previous post.

### Install NPM

If you haven't already installed "NodeJS", you will be required to. Here is the [link](https://nodejs.org) for installation file. Download the latest, and install it using the default settings.

### Add a Package File

NPM uses a package file to assist with the libraries referenced in the project. Refer to the [documentation](https://docs.npmjs.com/files/package.json) for additional details of this file.

#### Add a New Item

[![Add New Item](images/TypeScriptVSSetup/AddNewItem.png)](images/TypeScriptVSSetup/AddNewItem.png)

Right click on the project to add a new item to the root of it.

#### Add the NPM Package File

[![Add NPM Package File](images/TypeScriptVSSetup/AddPackageFile.png)](images/TypeScriptVSSetup/AddPackageFile.png)

Search for "npm" and you should find the "NPM Configuration File" item type. Rename it to "package.json" and click on "Add" to add it to the project.

### Add Dev Dependencies

[![Add Dev Dependencies](images/TypeScriptVSSetup/AddDevDependencies.png)](images/TypeScriptVSSetup/AddDevDependencies.png)

Update the "name" property to match your project name. _(Note - This value cannot contain specific characters. Refer to the documentation for additional details.)_ style="max-width:100%"

I'll add my SP REST library as an example. There is intellisense, which is very helpful. Type in "gd-sprest" and set the value to "\*" or the specific version. Make sure to **save** the file before moving to the next step. Saving the file will automatically install the package. These files will be located under the _"\[CS Project Directory\]\\node-modules"_ directory.

#### Node Modules Directory

[![Node Modules](images/TypeScriptVSSetup/NodeModules.png)](images/TypeScriptVSSetup/NodeModules.png)

If you click on the "Show All Files" option, you can view the "node\_modules" directory and the associated npm packages.

#### Update Packages

[![Update NPM Packages](images/TypeScriptVSSetup/UpdatePackage.png)](images/TypeScriptVSSetup/UpdatePackage.png)

This part is not needed, but more of a reference. If you left-click to the left of the npm packages, a "light-bulb" icon will appear which will provide quick actions.

### Add a TypeScript File

This section is just an example of how to get started. I encourage you to read the [documentation](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) on the TypeScript configuration file. I'll just go over a simple example.

#### Add the App.ts TypeScript File

[![Add TypeScript File](images/TypeScriptVSSetup/AddTypeScriptFile.png)](images/TypeScriptVSSetup/AddTypeScriptFile.png)

Right-click on the "Scripts" folder and add the "App.ts" typescript file. _(Note - This will overwrite the App.js file on save of the associated App.ts file.)_

#### Intellisense

[![SP-REST Intellisense](images/TypeScriptVSSetup/Intellisense.png)](images/TypeScriptVSSetup/Intellisense.png)

The above is an example of the intellisense available in the gd-sprest library. This feature will make it easier to develop client-side against the SharePoint REST api.

#### JavaScript Output

[![JavaScript Output](images/TypeScriptVSSetup/TStoJS.png)](images/TypeScriptVSSetup/TStoJS.png)

After saving the App.ts file, it will automatically compile and overwrite the App.js file.
