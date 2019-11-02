---
layout: "post"
title: "SharePoint People Picker REST API"
date: "2017-04-27"
description: ""
feature_image: ""
tags: []
---

This post will cover the people picker api available in the SharePoint 2013+ environments.

<!--more-->

### Overview

The SharePoint REST API has a people picker endpoint, which is pretty powerful. I haven't found much documentation, but here is the research I have. There are two available methods which take the same query parameters.: \* clientPeoplePickerSearchUser(queryParameters) \* clientPeoplePickerResolveUser(queryParameters)

#### Client People Picker Query Parameters

- **AllowEmailAddresses** - Allows valid email address to be resolved and used as values.
- **AllowMultipleEntities** - Enabled for multiple user or group entities.
- **AllUrlZones** - Searches across all url zones for a particular web application.
- **EnabledClaimProviders**
- **ForceClaims**
- **MaximumEntitySuggestions** _(Required)_ - The maximum number of entities to return.
- **PrincipalSource** - The principal sources to search.
    
    - **All (15)** - Search all principal sources.
    - **MembershipProvider (4)** - Search the current membership provider.
    - **None (0)** - Search no principal sources.
    - **RoleProvider (8)** - Search the current role provider.
    - **UserInfoList (1)** - Search the user information list.
    - **Windows (2)** - Search active directory.
- **PrincipalType** - The principal types to return.
    
    - **All (15)** - Return all entity types.
    - **DistributionList (2)** - Return distribution list entity types.
    - **None (0)** - Return no principal types.
    - **SecurityGroup (4)** - Return security group entity types.
    - **SharePointGroup (8)** - Return sharepoint group entity types.
    - **User (1)** - Return user entity types.
- **QueryString** - The search term.
- **Required**
- **SharePointGroupID** - The SharePoint group id to limit the search to.
- **UrlZone** - The url zone to search within a particular web application.
    
    - **Custom (3)** - Search the custom zone.
    - **Default (0)** - Search the default zone.
    - **Extranet (4)** - Search the extranet zone.
    - **Internet (2)** - Search the internet zone.
    - **Intranet (1)** - Search the intranet zone.
- **UrlZoneSpecified**
- **Web** - _Required if you are limiting your search to a SharePoint group_
- **WebApplicationID** - The web application to limit the search to.

#### [Principal Type](https://msdn.microsoft.com/en-us/library/microsoft.sharepoint.client.utilities.principaltype.aspx?f=255&MSPPError=-2147217396)

A great tip by Paul Tavares about the principal type value. It supports multiple flags by using bitwise. Setting the value to 13 or 1101 in binary, which translates as flags 1, 4, & 8 true set to true and flag 2 set to false. These flags relates to the Principal Type "User", "SecurityGroup" and "SharePointGroup" flags to be selected.

### React Component

The [gd-sprest-react](https://github.com/gunjandatta/sprest/wiki/React) library contains SharePoint components, including a [people picker](https://github.com/gunjandatta/sprest/wiki/React-People-Picker) component.

### Demo

I will be using the [gd-sprest](https://gunjandatta.github.io/sprest) framework to demonstrate the execution of the calls. For this example, I have the library referenced on the page and am using the browser's console window to execute the available methods.

#### clientPeoplePickerSearchUser

For this example, I'm searching for myself in a SharePoint Online environment. This will target the "Display Name" of the user.

###### JS Code:

```
$REST.PeoplePicker().clientPeoplePickerSearchUser({
    MaximumEntitySuggestions: 10,
    PrincipalSource: 15,
    PrincipalType: 15,
    QueryString: "Gunjan Datta"
}).executeAndWait();

```

###### Request

For those who don't want to use the library, the request is a POST. The query parameters are passed in the body of the request:

```
{
    "queryParams": {
        "__metadata": {
            "type": "SP.UI.ApplicationPages.ClientPeoplePickerQueryParameters"
        },
        "MaximumEntitySuggestions":10,
        "PrincipalSource":15,
        "PrincipalType":15,
        "QueryString":"Gunjan Datta"
    }
}

```

###### Output

The output of the query returned the correct user account. ![](http://dattabase.com/wp-content/uploads/2017/04/searchUser.png)

#### clientPeoplePickerResolveUser

For this example, I'm resolving a user by their email address.

###### JS Code:

```
$REST.PeoplePicker().clientPeoplePickerResolveUser({
    AllowEmailAddresses: true,
    MaximumEntitySuggestions: 10,
    PrincipalSource: 15,
    PrincipalType: 15,
    QueryString: "me@dattabase.com"
}).executeAndWait();

```

###### Request

For those who don't want to use the library, the request is a POST. The query parameters are passed in the body of the request:

```
{
    "queryParams": {
        "__metadata": {
            "type": "SP.UI.ApplicationPages.ClientPeoplePickerQueryParameters"
        },
        "AllowEmailAddresses":true,
        "MaximumEntitySuggestions":10,
        "PrincipalSource":15,
        "PrincipalType":15,
        "QueryString":"me@dattabase.com"
    }
}

```

###### Output

The output of the query returned the correct user account. ![](http://dattabase.com/wp-content/uploads/2017/04/resolveUser.png)
