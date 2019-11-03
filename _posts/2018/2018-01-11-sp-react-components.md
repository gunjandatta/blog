---
layout: "post"
title: "SharePoint React Components"
date: "2018-01-11"
description: ""
feature_image: ""
tags: [react, gd-sprest]
---

##### [Field](https://github.com/gunjandatta/sprest/wiki/React-Field)

The field component is designed to generate a field, based on the configuration defined in SharePoint. The list and internal field names are required, but the web url can be specified if the list is not currently on the current web. This component is meant to be used for creating custom forms, but I recommend using the ItemForm component instead.

<!--more-->

###### Supported Types

- Attachments
- Boolean
- Choice
- Date
- Date/Time
- Lookup
- Managed Metadata
- Multi-Choice
- Multi-User
- Note (Plain Text)
- Number
- Text
- Url
- User

###### Code Example

```
import * as React from "react";
import { Field } from "gd-sprest-react";

class MyForm extends React.Component<null, null> {
    // Render the component
    render() {
        return (
            <div>
                <Field
                    listName="Site Assets"
                    name="Title"
                />
            </div>
        )
    }
}

```

##### [Item Form](https://github.com/gunjandatta/sprest/wiki/React-Item-Form)

The item form component is designed to generate an item form for a list. This component has many properties and events to handle simple and complex customizations. Some important properties and events to note. Refer to the [wiki](https://github.com/gunjandatta/sprest/wiki/React-Item-Form) for additional information.

###### Attachment

- Properties
    
    - saveAttachments - To include attachments, simply set the "showAttachments" property to "true"
- Events
    
    - onAttachmentAdded - Event triggered when an attachment is added
    - onAttachmentClick - Event triggered when an attachment is clicked
    - onAttachmentRender - Event to override the rendering of an attachment
    - onRenderAttachments - Event to override the rendering of the attachments

###### Form Control Modes

- 1 - Display
- 2 - Edit
- 3 - New

###### Field

- Properties
    
    - excludeFields - An array of internal field names, to exclude from the form
    - fields - An array of field information, used to determine the fields to render
        
        - _If empty, the default fields from the default content type will determine the fields to display_
    - readOnlyFields - An array of internal field names, to be rendered in "Display" mode regardless of the form type
- Events
    
    - onFieldRender - Event to override the rendering of a, fieldMethods

###### Item

- Properties
    
    - item - The item object containing the field data
    - query - The OData query, used when refreshing the item
- Events
    
    - onRender - Event to override the fields being rendered

###### Global Variables & Methods

- Properties
    
    - AttachmentField - Reference to the attachment field
    - ControlMode - Reference to the form's control mode
    - FormFields - Reference to the form fields
    - ItemQuery - Reference to the item query
    - List - Reference to the list
- Methods
    
    - getFormValues() - Method to get the item form values
    - refresh() - Method to refresh the form
    - save() - Method to save the form
    - update(itemValues) - Method to update item

###### Code Example

```
import * as React from "react";
import { ItemForm } from "gd-sprest-react";
import { PrimaryButton } from "office-ui-fabric-react";
declare var SP;

export class MyForm extends React.Component<null, null> {
    private _form:ItemForm = null;

    // Render the component
    render() {
        return (
            <div>
                <ItemForm
                    listName="Site Assets"
                    ref={form => { this._form = form; }}
                />
                <PrimaryButton
                    text="Save"
                    onClick={this.saveForm}
                />
            </div>
        )
    }

    // Method to save the form
    private saveForm = (ev: React.MouseEvent<HtmlButtonElement>) => {
        // Prevent postback
        ev.preventDefault();

        // Show a saving dialog
        SP.SOD.execute("sp.ui.dialog.js", "SP.UI.ModalDialog.showWaitScreenWithNoClose", "Saving the Item", "This dialog will close after the item is saved");

        // Save the form
        this._form.save().then(item => {
            // Close the save dialog
            SP.SOD.execute("sp.ui.dialog.js", "SP.UI.ModalDialog.commonDialogClose");
        });
    }
}

```

##### [Panel](https://github.com/gunjandatta/sprest/wiki/React-Panel)

The panel component extends the fabric panel component and adds common methods. \* hide() - Method to hide the panel \* show() - Method to show the panel

###### Code Example

```
import * as React from "react";
import { Panel } from "gd-sprest-react";
import { PrimaryButton } from "office-ui-fabric-react";

class MyPanel extends React.Component<null, null> {
    let _panel:Panel = null;

    // Render the component
    render() {
        return (
            <div>
                <Panel headerText="My Panel" ref={panel => { this._panel = panel; }}>
                                    <p>My Panel</p>
                </Panel>
                <PrimaryButton
                    text="Show Panel"
                    onClick={this.showPanel}
                />
            </div>
        )
    }

    // Method to show the panel
    private showPanel = (ev: React.MouseEvent<HtmlButtonElement>) => {
        // Prevent postback
        ev.preventDefault();

        // Show the panel
        this._panel.show();
    }
}

```

##### [People Picker](https://github.com/gunjandatta/sprest/wiki/React-People-Picker)

By default, the people picker component will search the user information list. This is much better from a performance standpoint, and satisfies most requests to filter out users who haven't visited the site. Clicking on the "Show All" option will search all principal sources.

###### Code Example

```
import * as React from "react";
import { SPPeoplePicker } from "gd-sprest-react";
import { PrimaryButton } from "office-ui-fabric-react";

class MyClass extends React.Component<null, null> {
    private _spPicker: SPPeoplePicker = null;

    // Render the component
    render() {
        return (
            <div>
                <SPPeoplePicker
                    allowGroups={false}
                    allowMultiple={false}
                    ref={picker => { this._spPicker = picker; }}
                />
                <PrimaryButton
                    text="Show User"
                    onClick={this.showUser}
                />
            </div>
        )
    }

    // Method to show the selected user
    private showUser = (ev: React.MouseEvent<HtmlButtonElement>) => {
        // Prevent postback
        ev.preventDefault();

        // Get the selected user
        let user = this._spPicker.state.personas[0];
        if(user) {
            // Display the email address
            alert(user.secondaryText);
        }
    }
}

```

##### [WebPart](https://github.com/gunjandatta/sprest/wiki/React-WebPart)

The webpart component has been designed to work in SharePoint 2013 publishing, webpart and wiki pages. The key reason to use this webpart, is to store a custom configuration required to render the component. This can make development a lot easier/flexible, and removes the need to hard-code specific values like the list and web urls. Refer to the [wiki](https://github.com/gunjandatta/sprest/wiki/React-WebPart) for additional details of the webpart components.

###### Properties & Events

- Properties
    
    - cfgElementId - The target element id to store the configuration element
    - displayElement - The react component to render when the page is being displayed
    - editElement - The react component to render when the page is being edited
    - elementId - The target element id to render the webpart to
    - helpProps - The help link rendered when the page is being edited. This will add a link next to the "Edit Snippet" link in the Script Editor webpart
        
        - title - The help link title
        - url - The help link url
- Events
    
    - onPostRender - Event triggered after the display/edit element is rendered
    - onRenderDisplay - Event triggered when rendering the display element. Use this in place of the "displayElement".
    - onRenderEdit - Event triggered when rendering the edit element. Use this in place of the "editElement".

###### WebPart Types

- Configuration - The base component for the edit element. This will render a button and panel.
    
    - List Configuration - Renders a web url and list drop down for the user to select from
    - Field Configuration - Extends the list configuration and adds a field picker
    - Search Configuration - Extends the field configuration and filters the field picker for the supported types
- List - The base component for the display element, used to render list data
- Search - The base component for the display element, used to render list data with a search included
- Tabs - The base component for rendering the webparts within a zone in tabs

###### Code Example

```
import { WebPart, WebPartTabs } from "gd-sprest-react";

export class TabsWebPart {
    constructor() {
        // Create an instance of the webpart
        new WebPart({
            displayElement: WebPartTabs,
            targetElementId: "wp-tabs"
        });
    }
}

```
