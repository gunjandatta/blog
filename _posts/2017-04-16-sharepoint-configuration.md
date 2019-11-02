---
layout: "post"
title: "SharePoint Configuration"
date: "2017-04-16"
description: ""
feature_image: ""
tags: []
---

This post will go over a new feature in the [gd-sprest](https://gunjandatta.github.io/sprest) library. This feature will help automate the creation and removal of SharePoint web components, specifically the Field, Content Type, List and User Custom Actions. Refer to the [SharePoint Scripts Starter Project](http://dattabase.com/sharepoint-scripts-starter-project/) blog post for additional details of using this feature, this post just goes over the feature.

<!--more-->

### Overview

This new feature in the [gd-sprest](https://gunjandatta.github.io/sprest) library allows the developer to add and remove web components, defined by a configuration file. Since the library works on its own, these configurations can be made through the console window. The goal of this feature is to give an easy way to create and remove solution assets through a configuration file.

### Configuration File

The SPConfig helper class takes an input of the SharePoint configuration. The available methods are \* install - Create all components. \* installByType - Create component(s) by the specified configuration type. \* installContentType - Create a specific content type in the configuration. \* installList - Create a specific list in the configuration. \* installSiteCustomAction - Create a specific site custom action in the configuration. \* installWebCustomAction - Create a specific site custom action in the configuration. \* uninstall - Remove all components. \* uninstallByType - Remove component(s) by the specified configuration type. \* uninstallContentType - Create a specific content type in the configuration. \* uninstallList - Create a specific list in the configuration. \* uninstallSiteCustomAction - Create a specific site custom action in the configuration. \* uninstallWebCustomAction - Create a specific site custom action in the configuration.

#### Configuration Properties

###### Content Type Configuration

The content type configuration type contains an array of content type information objects.

```
[
    {
        ContentType?: IContentType,
        JSLink?: string,
        Name: string,
        ParentName?: string
    }
]

```

_Note - This feature is still being developed to add the field references._

###### Custom Action Configuration

The custom action configuration type contains an array of user custom action creation information objects for both the Site and Web.

```
{
    Site: [
        { User Custom Action Creation Information }
    ],
    Web: [
        { User Custom Action Creation Information }
    ]
}

```

###### Field Configuration

The field configuration is an array of field information objects. The field information contains the internal name and schema xml definition. The field property is populated by the internal methods.

```
[
    {
        Field?: IField,
        Name: string,
        SchemaXml: string
    }
]

```

###### List Configuration

The list configuration is an array of list information objects.

```
[
    ContentTypes?: Array<ISPCfgContenTypeInfo>, // To Be Developed
    CustomFields?: Array<ISPCfgFieldInfo>,
    ListInformation: IListCreationInformation,
    TitleFieldDisplayName?: string,
    ViewInformation?: Array<ISPCfgViewInfo>
]

```

\*\* Content Type Information \*\* \* ContentType - The content type object. \* JSLink - The content type JSLink url. \* Name - The name of the content type. \* ParentName - The content type name to inherit from. (Default - Item)

\*\* View Information \*\* \* JSLink - The JSLink property of the view. \* ViewFields - An array of internal field names. \* ViewName - The view to create or update. \* ViewQuery - The view query.

###### WebPart Configuration

The webpart configuration is an array of webpart information objects.

```
[
    {
        File?: IFile,
        FileName: string,
        XML: string
    }
]

```

### Example Configuration File

This example configuration file comes from a [prev blog post](http://dattabase.com/sharepoint-scripts-starter-project/). Refer to [this post](http://dattabase.com/sharepoint-scripts-starter-project/) for a full break down of the configuration file and how to deploy it.

```
import {Helper, SPTypes} from "gd-sprest";

/**
 * Test Project Configuration
 */
export const TestProjectCfg = new Helper.SPConfig({
    /**
     * User Custom Actions
     */
    CustomActionCfg: {
        Web: [
            {
                Description: "Adds a link in the suitebar to the test list.",
                Location: "ScriptLink",
                Name: "GD_TestProject",
                ScriptSrc: "~site/siteassets/dev/testProject.js",
                Title: "Test Project"
            },
            {
                Description: "Adds a reference to the fabric ui styles.",
                Location: "ScriptLink",
                Name: "Office_Fabric-UI",
                ScriptBlock: "document.head.innerHTML += \"<link rel='stylesheet' href='https://static2.sharepointonline.com/files/fabric/office-ui-fabric-core/4.1.0/css/fabric.min.css'>\";",
                Title: "Office Fabric-UI"
            }
        ]
    },

    /**
     * List
     */
    ListCfg: [
        {
            CustomFields: [
                {
                    Name: "TPCategory",
                    SchemaXml: '<Field ID="" Name="TPCategory" StaticName="TPCategory" DisplayName="Link Category" Type="Choice"><CHOICES><CHOICE>Cat 1</CHOICE><CHOICE>Cat 2</CHOICE><CHOICE>Cat 3</CHOICE><CHOICE>Cat 4</CHOICE></CHOICES></Field>'
                },
                {
                    Name: "TPLink",
                    SchemaXml: '<Field ID="" Name="TPLink" StaticName="TPLink" DisplayName="Link URL" Type="URL" />'
                }
            ],
            ListInformation: {
                BaseTemplate: SPTypes.ListTemplateType.GenericList,
                Description: "Datasource for the test project.",
                Title: "Test Project"
            },
            TitleFieldDisplayName: "Link Name",
            ViewInformation: [
                // All Items
                {
                    ViewFields: ["Title", "TPCategory", "TPLink"],
                    ViewName: "All Items",
                    ViewQuery: "<OrderBy><FieldRef Name='TPCategory' /><FieldRef Name='Title' /></OrderBy>"
                },
                // My View
                {
                    JSLink: "~site/siteassets/dev/testProject_jslink.js",
                    ViewFields: ["Title", "TPCategory", "TPLink"],
                    ViewName: "My View"
                }
            ]
        }
    ],

    /**
     * Web Parts
     */
    WebPartCfg: [
        {
            FileName: "aaa_test.webpart",
            XML: `<?xml version="1.0" encoding="utf-8"?>
<webParts>
    <webPart xmlns="http://schemas.microsoft.com/WebPart/v3">
        <metaData>
            <type name="Microsoft.SharePoint.WebPartPages.ScriptEditorWebPart, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" />
            <importErrorMessage>$Resources:core,ImportantErrorMessage;</importErrorMessage>
        </metaData>
        <data>
            <properties>
                <property name="Title" type="string">AAA Test</property>
                <property name="Description" type="string">Demo of creating a custom webpart.</property>
                <property name="ChromeType" type="chrometype">None</property>
                <property name="Content" type="string">
                    &lt;div id="wp_testProject" /&gt;
                    &lt;script type="text/javascript" src="~site/siteassets/dev/testProject.js"&gt;&lt;/script&gt;
                </property>
            </properties>
        </data>
    </webPart>
</webParts>`
        }
    ]
});

```

### Conclusion

Below is a small list of many things you can do with this feature. I hope this feature makes life easier for creating SharePoint solutions. \* Apply branding using user custom actions \* Apply custom suite bar or top ribbon links using user custom actions \* Create custom ribbon components using user custom actions \* Create custom site actions using user custom actions \* Create/Remove dev assets for faster development \* Create standard fields and content types to a site collection or web \* Apply standard lists to a site collection or web \* Easily apply upgrades to existing solutions by using multiple SharePoint Configuration objects
