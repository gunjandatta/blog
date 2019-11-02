---
layout: "post"
title: "SharePoint App - Fabric UI and React (Part 2 of 3)"
date: "2016-12-04"
description: ""
feature_image: ""
tags: []
---

This is the second of three posts giving a step-by-step guide of building a SharePoint Hosted Add-In utilizing the Office Fabric UI React framework. It is broken out into three sections: [1\. Configuring the User Interface Project](https://dattabase.com/blog/sharepoint-app-fabric-ui-react-part-1-3) [2\. Configuring the SharePoint Hosted Add-In Project](https://dattabase.com/blog/sharepoint-app-fabric-ui-react-part-2-3) (This Post) [3\. Convert to the SharePoint Framework](https://dattabase.com/blog/sharepoint-app-fabric-ui-react-part-3-3/)

<!--more-->

### Configure the Pre-Build Event

In Visual Studio, right-click the SharePoint Hosted Add-In project, and select the properties. ![View Project Properties](https://dattabase.com/blog/wp-content/uploads/2016/12/ViewProjectProperties.png)

Enter the following into the "Pre-build event command line" box. These commands will copy the required scripts from the UX project to the scripts folder.

```
copy "$(SolutionDir)Demo.FabricReact.UX\node_modules\react\dist\react.min.js" "$(SolutionDir)\Demo.FabricReact.App\Scripts"
copy "$(SolutionDir)Demo.FabricReact.UX\node_modules\react-dom\dist\react-dom.min.js" "$(SolutionDir)\Demo.FabricReact.App\Scripts"
copy "$(SolutionDir)Demo.FabricReact.UX\dist\bundle.js" "$(SolutionDir)\Demo.FabricReact.App\Scripts\App.js"

```

_Note - We are renaming the "bundle.js" file to "App.js, since the Add-In defaults to this script for the landing page."_

Run the build command (Ctrl+Shift+B) to test the commands and copy the files. Display all files, and include them in this project. ![Include Scripts in Project](https://dattabase.com/blog/wp-content/uploads/2016/12/IncludeScripts.png)

### Configure the Default Landing Page

The last step is to update the landing page to display the solution. The things to highlight are: \* React Libraries added in the PlaceHolderAdditionalPageHead \* The PlaceHolderMain html is copied from the "index.html" file of the UX project _Note - You can generate this file in the UX project._

```
<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>
<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" Language="C#" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <!-- SP -->
    <SharePoint:ScriptLink name="sp.js" runat="server" OnDemand="true" LoadAfterUI="true" Localizable="false" />
    <meta name="WebPartPageExpansion" content="full" />

    <!-- CSS -->
    <link rel="Stylesheet" type="text/css" href="../Content/App.css" />

    <!-- JS Libraries -->
    <script type="text/javascript" src="../Scripts/react.min.js"></script>
    <script type="text/javascript" src="../Scripts/react-dom.min.js"></script>
</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    Fabric React Demo
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
        <!-- Element to render the solution to -->
        <div id="main"></div>

        <!-- JS
        <script type="text/javascript" src="../Scripts/App.js"></script>
</asp:Content>

```

### Test the Add-In

Deploy the SharePoint Add-In to SP 2013/Online environment, and view the solution in the main page. ![Demo SP App](https://dattabase.com/blog/wp-content/uploads/2016/12/ViewSPApp.png)

### Conclusion

I hope this post was useful. The [github project](https://github.com/gunjandatta/sprest-fabric-react) for this post has been updated to include examples of the [gd-sprest-react](https://gunjandatta.github.io/react/) library components. The \[last blog post\]([3\. Convert to the SharePoint Framework](https://dattabase.com/blog/sharepoint-app-fabric-ui-react-part-3-3/)) of this series will use this example and convert it to the SPFX project.
