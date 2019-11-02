---
layout: "post"
title: "SharePoint 2013 Modern WebPart (2 of 4)"
date: "2018-01-11"
description: ""
feature_image: ""
tags: []
---

- [Modern WebPart Overview](https://dattabase.com/blog/sharepoint-2013-modern-webpart/)
- [Demo 1 - TypeScript](https://dattabase.com/blog/sharepoint-2013-modern-webpart-1-4/)
- [Demo 2 - React](https://dattabase.com/blog/sharepoint-2013-modern-webpart-2-4/) **(This Post)**
- [Demo 3 - VueJS](https://dattabase.com/blog/sharepoint-2013-modern-webpart-3-4/)
- [Demo 4 - AngularJS](https://dattabase.com/blog/sharepoint-2013-modern-webpart-4-4/)

<!--more-->

### React WebPart Example

This is the second of four demos giving an overview of creating modern webpart solutions for SharePoint 2013+ environments. The demo code can be found in [github](https://github.com/gunjandatta/demo-wp). The goal of this post is to give an overview of [gd-sprest-react](https://github.com/gunjandatta/sprest-react) library and expand on the [previous post](https://dattabase.com/blog/sharepoint-2013-modern-webpart-1-4/) to give better code examples using the [React](https://reactjs.org/) framework. This example will be written in TypeScript using the [Office Fabric-UI React](https://dev.office.com/fabric) framework.

#### Requirements

- [NodeJS](https://nodejs.org/en/) - A superset of JavaScript functions. NodeJS allows us to develop code similar to C#, which is compiled into JavaScript.
- [TypeScript](https://www.typescriptlang.org/) - Link to TypeScript for reference.

##### Global Libraries

After installing NodeJS, we will install TypeScript globally. This will allow us to link it to our project, so we don't need this library stored w/in each project.

```
npm i -g typescript

```

#### [SharePoint React Components](https://dattabase.com/blog/sp-react-components/)

The webpart logic originated from the [gd-sprest-react](https://github.com/gunjandatta/sprest-react) library, which is why this post will have many more examples then the rest. The main reason for selecting the [React](https://reactjs.org/) framework, is Microsoft's decision on using React for the [Fabric-UI](https://dev.office.com/fabric) library. The [gd-sprest-react](https://github.com/gunjandatta/sprest-react) library was designed to extend the Fabric-UI components for SharePoint 2013+ environments. _For the latest information, refer to the [wiki](https://github.com/gunjandatta/sprest/wiki/React)_

##### Available Components

There is just too much to go over, so I created a [blog post](https://dattabase.com/blog/sp-react-components/) giving a high level overview of the available components.

### Project

##### Create the NodeJS Project

Using the command-line, create the project folder and initialize the project. This will create the package.json file for the NodeJS project.

```
mkdir demo-wp-react
cd demo-wp-react
npm init --y

```

_Running the 'npm init --y' command will select the default values and create the package.json file._

##### Install the Libraries

- [Babel](https://babeljs.io/) - The babel-core, babel-loader, babel-preset-es2015 & ts-loader are referenced by WebPack to compile the TypeScript code to JavaScript ES2015 standards
- [gd-sprest](https://gunjandatta.github.io/sprest) - The library used to create the webpart
- [gd-sp-webpart](https://github.com/gunjandatta/sp-webpart) - The webpart library
- [React](https://reactjs.org/) - The react library is split up into react and react-dom. For intellisense we will need to download the @types/react & @types/react-dom libraries.
- [SASS](http://sass-lang.com/) - The node-sass, sass-loader, css-loader & style-loader libraries are used to compile SASS to JS.
- [WebPack](https://webpack.js.org/) - Used to compile and bundle the code into a single output file

```
npm i --save gd-sprest gd-sprest-react office-ui-fabric-react react react-dom
npm i --save-dev @types/react @types/react-dom babel-core babel-loader babel-preset-es2015 ts-loader webpack node-sass sass-loader css-loader style-loader

```

_This will download the libraries to the node\_modules folder._

##### Source Code

Create a "src" folder and add the following files

##### SharePoint Configuration (src/cfg.ts)

To stay consistent with the out of the box (OTB) SharePoint experience, we will be using the [gd-sprest](https://gunjandatta.github.io/sprest) library's Helper class to automate the creation of webparts. This configuration file will help us create the list and webpart in SharePoint. I've added a sample method for adding test data.

```
import { Helper, List, SPTypes, Types } from "gd-sprest";

/**
 * Configuration
 */
export const Configuration = {
    // List
    List: Helper.SPConfig({
        ListCfg: [
            {
                // Custom fields for this list
                CustomFields: [
                    {
                        choices: ["Business", "Family", "Personal"],
                        name: "MCCategory",
                        title: "Category",
                        type: Helper.SPCfgFieldType.Choice
                    } as Types.Helper.IFieldInfoChoice,
                    {
                        name: "MCPhoneNumber",
                        title: "Phone Number",
                        type: Helper.SPCfgFieldType.Text
                    }
                ],

                // The list creation information
                ListInformation: {
                    BaseTemplate: SPTypes.ListTemplateType.GenericList,
                    Title: "My Contacts"
                },

                // Update the 'Title' field's display name
                TitleFieldDisplayName: "Full Name",

                // Update the default 'All Items' view
                ViewInformation: [
                    {
                        ViewFields: ["MCCategory", "LinkTitle", "MCPhoneNumber"],
                        ViewName: "All Items",
                        ViewQuery: "<OrderBy><FieldRef Name='MCCategory' /><FieldRef Name='Title' /></OrderBy>"
                    }
                ]
            }
        ]
    }),

    // WebPart
    WebPart: Helper.SPConfig({
        WebPartCfg: [
            {
                FileName: "wpContacts.webpart",
                Group: "Demo",
                XML: `<?xml version="1.0" encoding="utf-8"?>
<webParts>
    <webPart xmlns="http://schemas.microsoft.com/WebPart/v3">
        <metaData>
            <type name="Microsoft.SharePoint.WebPartPages.ScriptEditorWebPart, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" />
            <importErrorMessage>$Resources:core,ImportantErrorMessage;</importErrorMessage>
        </metaData>
        <data>
            <properties>
                <property name="Title" type="string">My Contacts</property>
                <property name="Description" type="string">Demo displaying my contacts.</property>
                <property name="ChromeType" type="chrometype">TitleOnly</property>
                <property name="Content" type="string">
                    &lt;script type="text/javascript" src="/sites/dev/siteassets/demo-react.js"&gt;&lt;/script&gt;
                    &lt;div id="wp-contacts"&gt;&lt;/div&gt;
                    &lt;div id="wp-contactsCfg" style="display:none;"&gt;&lt;/div&gt;
                    &lt;script type="text/javascript"&gt;SP.SOD.executeOrDelayUntilScriptLoaded(function() { new Contacts(); }, 'demo-react.js');&lt;/script&gt;
                </property>
            </properties>
        </data>
    </webPart>
</webParts>`
            }
        ]
    })
};

// Method to add list test data
Configuration.List["addTestData"] = () => {
    // Get the list
    let list = new List("My Contacts");

    // Define the list of names
    let names = [
        "John A. Doe",
        "Jane B. Doe",
        "John C. Doe",
        "Jane D. Doe",
        "John E. Doe",
        "Jane F. Doe",
        "John G. Doe",
        "Jane H. Doe",
        "John I. Doe",
        "Jane J. Doe"
    ];

    // Loop 10 item
    for (let i = 0; i < 10; i++) {
        // Set the category
        let category = "";
        switch (i % 3) {
            case 0:
                category = "Business";
                break;
            case 1:
                category = "Family";
                break;
            case 2:
                category = "Personal";
                break;
        }


        // Add the item
        list.Items().add({
            MCCategory: category,
            MCPhoneNumber: "nnn-nnn-nnnn".replace(/n/g, i.toString()),
            Title: names[i]
        })
            // Execute the request, but wait for the previous request to complete
            .execute((item) => {
                // Log
                console.log("[WP Demo] Test item '" + item["Title"] + "' was created successfully.");
            }, true);
    }

    // Wait for the requests to complete
    list.done(() => {
        // Log
        console.log("[WP Demo] The test data has been added.");
    });
};

```

##### Main (src/index.ts)

The index.ts file will be treated as the "Main" function or "Entry Point" of the component we created. We will import the demo webpart and make it globally available. Next we will use the SharePoint Script-On-Demand (SP SOD) library to notify other scripts that the demo class is loaded. If you refer to the configuration file, and look at the JavaScript, it utilizes the SP SOD library to control when its called.

```
import { WebParts } from "gd-sprest-react";
import { Configuration } from "./cfg";
import { ContactsWebPart } from "./wp";
declare var SP;

/**
 * Contacts Demo
 */
export class Contacts {
    // The configuration for the demo
    static Configuration = Configuration;

    /**
     * Constructor
     */
    constructor() {
        // Create an instance of the contacts webpart
        new WebParts.FabricWebPart({
            cfgElementId: "wp-contactsCfg",
            displayElement: ContactsWebPart,
            editElement: WebParts.WebPartListCfg,
            targetElementId: "wp-contacts",
        });
    }
}

// Set the global variable
window["Contacts"] = Contacts;

// Let SharePoint know the script has been loaded
SP.SOD.notifyScriptLoadedAndExecuteWaitingJobs("demo-react.js");

```

##### Main (src/wp.ts)

The webpart logic will inherit the list webpart type. This will simplify and allow us to focus on the item data to render.

```
import * as React from "react";
import { Types } from "gd-sprest";
import { WebParts } from "gd-sprest-react";

/**
 * Contact Item
 */
export interface IContactItem extends Types.SP.IListItemQueryResult {
    MCCategory: string;
    MCPhoneNumber: string;
    Title: string;
}

/**
 * Contacts WebPart
 */
export class ContactsWebPart extends WebParts.WebPartList {
    // Render item event
    onRenderItem = (item: IContactItem) => {
        // Return the item template
        return (
            <div key={item.Id} className="ms-Grid">
                <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-md4">{item.MCCategory}</div>
                    <div className="ms-Grid-col ms-md4">{item.Title}</div>
                    <div className="ms-Grid-col ms-md4">{item.MCPhoneNumber}</div>
                </div>
            </div>
        );
    }
}

```

#### Compiler Configuration Files

Before we are able to compile the files, we need to update the configuration files.

##### Package (package.json)

Update the "scripts" and the "build" option. This will allow us to type in "npm run build" to compile the code.

```
  "scripts": {
    "build": "webpack"
  }

```

##### TypeScript (tsconfig.json)

The compiler options for TypeScript are straight forward. We are targeting the code in the source (src) folder, and outputing ES5 JavaScript.

```
{
    "compilerOptions": {
        "target": "es5"
    },
    "include": [
        "src/**/*"
    ]
}

```

##### WebPack (webpack.config.js)

```
var path = require('path');
var webpack = require("webpack");

module.exports = {
    // Target the output of the typescript compiler
    context: path.join(__dirname, "src"),

    // File(s) to target
    entry: './index.ts',

    // Output
    output: {
        filename: 'demo-react.js',
        path: path.resolve(__dirname, 'dist')
    },

    // Resolve the file extensions
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
    },

    // Module to define what libraries with the compiler
    module: {
        // Loaders
        loaders: [
            {
                // Target the sass files
                test: /\.s?css?$/,
                // Define the compiler to use
                use: [
                    // Create style nodes from the CommonJS code
                    { loader: "style-loader" },
                    // Translate css to CommonJS
                    { loader: "css-loader" },
                    // Compile sass to css
                    { loader: "sass-loader" }
                ]
            },
            {
                // Target the typescript files
                test: /\.tsx?$/,
                // Exclude the npm libraries
                exclude: /node_modules/,
                // Define the compiler to use
                use: [
                    {
                        // Compile the JSX code to javascript
                        loader: "babel-loader",
                        // Options
                        options: {
                            // Ensure the javascript will work in legacy browsers
                            presets: ["es2015"]
                        }
                    },
                    {
                        // Compile the typescript code to JSX
                        loader: "ts-loader"
                    }
                ]
            }
        ]
    }
};

```

##### Compile the Code

Run 'npm run build' or 'webpack' to compile the code and create the 'demo-react.js' file located in the dist folder.

###### Error Could not load TypeScript

Since we installed TypeScript globally, we can link to it.

```
npm link typescript

```

#### Demo

##### Step 1 - Create Demo Page

1) Upload the file to SharePoint 2) Create a webpart page of your choice 3) Access the page

##### Step 2 - Install the WebPart

1) Press F-12 to access the developer tools 2) Click on the "Console" tab 3) Reference the script - We will use simple javascript to insert a script link into the page. Afterwards, our library will be available.

```
var s = document.createElement("script");
s.src = "/sites/dev/siteassets/demo-react.js";
document.head.appendChild(s);

```

4) Install the list

```
Contacts.Configuration.List.install()

```

_This part may take a little time to initialize, depending on the size of the web._ ![](https://dattabase.com/blog/wp-content/uploads/2018/01/react_install_list.png) 5) Install the webpart

```
Contacts.Configuration.WebPart.install()

```

_This part may take a little time to initialize, depending on the size of the web._ ![](https://dattabase.com/blog/wp-content/uploads/2018/01/react_install_webpart.png)

##### Step 3 - Test

1) Edit the page 2) Click on a webpart zone to add a new webpart 3) From the webpart gallery, select the "Demo - Contacts" group "My Contacts" webpart ![](https://dattabase.com/blog/wp-content/uploads/2018/01/react_add_webpart.png) 4) After the page reloads, click on the "Edit Configuration" 5) Select the "My Contacts" test list we created ![](https://dattabase.com/blog/wp-content/uploads/2018/01/react_select_list.png) 6) Save the webpart 7) Save the page At this point, you should see the webpart title only. This is because we don't have any data in the list, so nothing is being rendered. ![](https://dattabase.com/blog/wp-content/uploads/2018/01/react_display_empty.png)

##### Step 4 - Add Test Data

1) Press F-12 to access the developer tools 2) Click on the "Console" tab 3) Create the test data

```
Contacts.Configuration.List.addTestData()

```

![](https://dattabase.com/blog/wp-content/uploads/2018/01/react_test_data.png) 4) Refresh the page and view the data ![](https://dattabase.com/blog/wp-content/uploads/2018/01/react_display.png)

##### Step 4 - Clean Up

1) Press F-12 to access the developer tools 2) Click on the "Console" tab 3) Uninstall the list and webpart

```
DemoWebPart.Configuration.List.uninstall()
DemoWebPart.Configuration.WebPart.uninstall()

```

_This part may take a little time to initialize, depending on the size of the web._ ![](https://dattabase.com/blog/wp-content/uploads/2018/01/react_uninstall.png)

##### Output Size

One thing to note, is the output file size (uncompressed) is about 3MB. This is due to the output file bundling the react and office fabric-ui libraries. You'll want to pay attention to this as we look at all of the frameworks.

### Conclusion

I hope this post was useful for using the React framework. This [gd-sprest-react](https://github.com/gunjandatta/sprest-react) library was designed to reduce the redundancies and complexities for developing react solutions. In the [next post](https://dattabase.com/blog/sharepoint-2013-modern-webpart-3-4) we will explore VueJS framework.
