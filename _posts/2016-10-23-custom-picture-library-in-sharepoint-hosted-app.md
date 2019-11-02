---
layout: "post"
title: "Custom Picture Library in SharePoint Hosted App"
date: "2016-10-23"
description: ""
feature_image: ""
tags: []
---

This post will go over adding a custom picture library to a SharePoint Hosted app.

<!--more-->

### Create the Project

[![Create the VS Project](http://dattabase.com/wp-content/uploads/2016/10/CreateProject.png)](http://dattabase.com/wp-content/uploads/2016/10/CreateProject.png)

Set the SharePoint url to deploy the project to, and select "SharePoint Hosted" as the type.

### Add a New Project Item

[![Add New List](http://dattabase.com/wp-content/uploads/2016/10/AddNewList.png)](http://dattabase.com/wp-content/uploads/2016/10/AddNewList.png)

Create a new folder called "Lists" at the root of the project. Right-click and add a new item to it.

#### Add a New List

[![Add New Project Item](http://dattabase.com/wp-content/uploads/2016/10/AddNewItem-1.png)](http://dattabase.com/wp-content/uploads/2016/10/AddNewItem.png)

Select the "List" item type, and name the list accordingly. This demo will use "PictureLibrary" as the list name.

#### List Configuration

[![New List Configuration](http://dattabase.com/wp-content/uploads/2016/10/AddNewListConfiguration.png)](http://dattabase.com/wp-content/uploads/2016/10/AddNewListConfiguration.png)

Select the **Document Library** as the list template.

### Update Template Files

This section will update the list template files. Since we created a "Document Library", we'll need to remove and replace them with the "Picture Library" template files. I've included a link to the OTB picture library template files, found in the 15 hive folder. Download the files [**here**](http://dattabase.com/wp-content/uploads/2016/10/PictureLibrary.zip).

#### Remove List Template Files

[![Delete Template Files](http://dattabase.com/wp-content/uploads/2016/10/DeleteFiles.png)](http://dattabase.com/wp-content/uploads/2016/10/DeleteFiles.png)

Select the list template files, and delete all of them, except for the **Elements.xml** and **Schema.xml** files.

### Add Picture Library Template Files

[![Add Picture Library Template Files](http://dattabase.com/wp-content/uploads/2016/10/AddPictureLibraryTemplateFiles.png)](http://dattabase.com/wp-content/uploads/2016/10/AddPictureLibraryTemplateFiles.png)

From the [**provided files**](http://dattabase.com/wp-content/uploads/2016/10/PictureLibrary.zip), add them all except for the **Schema.xml** file to the list template folder.

#### Update Template Files Deployment Type

[![Update Deployment Type](http://dattabase.com/wp-content/uploads/2016/10/UpdateFileDeploymentTypes.png)](http://dattabase.com/wp-content/uploads/2016/10/UpdateFileDeploymentTypes.png)

Left-click on each new template file, and in the "Properties" pane update the "Deployment Type" to **ElementFile**.

### Update List Type

This section will update the list template type from a "Document Library" to a "Picture Library".

#### Update Schema.xml

[![Update List Schema](http://dattabase.com/wp-content/uploads/2016/10/ReplaceListSchemaMetaData.png)](http://dattabase.com/wp-content/uploads/2016/10/ReplaceListSchemaMetaData.png)

Open the "Schema.xml" file, and remove the "MetaData". From the picture library OTB template files, open the associated "Schema.xml" and copy the "MetaData" to the new file.

#### Update List Template Properties

In the "Schema.xml" file, replace the "EnableContentTypes" property with the following properties. If you compare the document library list template properties with the picture library, these are the differences.

```
ThumbnailSize="160" WebImageWidth="640" WebImageHeight="480"

```

##### Original Value

[![List Schema Original Properties](http://dattabase.com/wp-content/uploads/2016/10/ListSchemaOrigProperties.png)](http://dattabase.com/wp-content/uploads/2016/10/ListSchemaOrigProperties.png)

##### New Value

[![Update List Properties](http://dattabase.com/wp-content/uploads/2016/10/ListSchemaProperties.png)](http://dattabase.com/wp-content/uploads/2016/10/ListSchemaProperties.png)

#### Update Content Type

[![Update Content Type](http://dattabase.com/wp-content/uploads/2016/10/UpdateContentType.png)](http://dattabase.com/wp-content/uploads/2016/10/UpdateContentType.png)

Using the "Create GUID" tool in visual studio, generate a new one and append it to the picture library's. Replace **ContentTypeRef** with **Content Type**. Next add the field links to the content type. Now that we have the Schema.xml updated, you can add your custom fields under the "Fields" tags and add the corresponding field links to this content type. Make sure **not** to include the ContentTypeRef, as shown in the image.

```
          <FieldRef ID="{8c0d0aac-9b76-4951-927a-2490abe13c0b}" Name="PreviewOnForm" />
          <FieldRef ID="{c53a03f3-f930-4ef2-b166-e0f2210c13c0}" Name="FileType" />
          <FieldRef ID="{922551b8-c7e0-46a6-b7e3-3cf02917f68a}" Name="ImageSize" />
          <FieldRef ID="{fa564e0f-0c70-4ab9-b863-0177e6ddd247}" Name="Title" />
          <FieldRef ID="{7e68a0f9-af76-404c-9613-6f82bc6dc28c}" Name="ImageWidth" />
          <FieldRef ID="{1944c034-d61b-42af-aa84-647f2e74ca70}" Name="ImageHeight" />
          <FieldRef ID="{a5d2f824-bc53-422e-87fd-765939d863a5}" Name="ImageCreateDate" />
          <FieldRef ID="{9da97a8a-1da5-4a77-98d3-4bc10456e700}" Name="Description" />
          <FieldRef ID="{1f43cd21-53c5-44c5-8675-b8bb86083244}" Name="ThumbnailExists" />
          <FieldRef ID="{3ca8efcd-96e8-414f-ba90-4c8c4a8bfef8}" Name="PreviewExists" />
          <FieldRef ID="{f39d44af-d3f3-4ae6-b43f-ac7330b5e9bd}" Name="AlternateThumbnailUrl" />
          <FieldRef ID="{b9e6f3ae-5632-4b13-b636-9d1a2bd67120}" Name="EncodedAbsThumbnailUrl" />
          <FieldRef ID="{a1ca0063-779f-49f9-999c-a4a2e3645b07}" Name="EncodedAbsWebImgUrl" />
          <FieldRef ID="{7ebf72ca-a307-4c18-9e5b-9d89e1dae74f}" Name="SelectedFlag" />
          <FieldRef ID="{76d1cc87-56de-432c-8a2a-16e5ba5331b3}" Name="NameOrTitle" />
          <FieldRef ID="{de1baa4b-2117-473b-aa0c-4d824034142d}" Name="RequiredField" />
          <FieldRef ID="{b66e9b50-a28e-469b-b1a0-af0e45486874}" Name="Keywords" />
          <FieldRef ID="{ac7bb138-02dc-40eb-b07a-84c15575b6e9}" Name="Thumbnail" />
          <FieldRef ID="{bd716b26-546d-43f2-b229-62699581fa9f}" Name="Preview" />

```

#### Update List Template Elements.xml

[![Update List Template Elements.xml](http://dattabase.com/wp-content/uploads/2016/10/UpdateElements.png)](http://dattabase.com/wp-content/uploads/2016/10/UpdateElements)

Open the "Element.xml" file under the list template folder, and update the "Type" to **109**, which is the "Picture Library" list template type.

#### Update List Instance Elements.xml

[![Update List Instance Elements.xml](http://dattabase.com/wp-content/uploads/2016/10/UpdateListInstance.png)](http://dattabase.com/wp-content/uploads/2016/10/UpdateListInstance.png)

Open the "Elements.xml" file under the list instance folder, and update the "Type" to **109**, which is the "Picture Library" list template type.
