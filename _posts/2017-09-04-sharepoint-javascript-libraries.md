---
layout: "post"
title: "SharePoint JavaScript Libraries"
date: "2017-09-04"
description: ""
feature_image: ""
tags: []
---

I'm constantly googling for this information, since the core SharePoint javascript methods are pretty useful. This post will be added to, so check back for updates.

<!--more-->

### Reference

The script reference is an issue that is overlooked. These libraries may not be loaded by default in certain pages. So to be safe, I recommend using the SharePoint On-Demand (SP.SOD) library to ensure the associated script is loaded. The "execute" method is pretty useful, since we can execute the method in one line.

### Modal Dialog

The modal dialog is really useful for showing data in a popup dialog. Below are the available methods for this class. _[Microsoft Reference](https://msdn.microsoft.com/en-us/library/office/ff410259(v=office.14).aspx)_

#### JavaScript

```
Format
SP.SOD.execute("sp.ui.dialog.js", "SP.UI.ModalDialog.[Method]", [Method Properties])

// Example 1 - Show a Page
SP.SOD.execute("sp.ui.dialog.js", "SP.UI.ModalDialog.showModalDialog", {
    showMaximized: true,
    title: "Modial Dialog Title",
    url: "Page to load"
});

// Example 2 - Show a loading panel
SP.SOD.execute("sp.ui.dialog.js", "SP.UI.ModalDialog.showWaitScreenWithNoClose", "Saving the Item", "This dialog will close after the request completes.");

// Example 3 - Close the dialog
SP.SOD.execute("sp.ui.dialog.js", "SP.UI.ModalDialog.commonModalDialogClose");

```

#### Methods

- **close** - Closes the most recently opened modal dialog with the specified dialog result.
    
    - dialogResult: SP.UI.DialogResult - One of the enumeration values that specifies the result of the modal dialog.
- **commonModalDialogClose** - Closes the most recently opened modal dialog with the specified dialog result and return value.
    
    - dialogResult: SP.UI.DialogResult - One of the enumeration values specifying the result of the modal dialog.
    - returnVal: Object - The return value of the modal dialog.
- **commonModalDialogOpen** - Displays a modal dialog with the specified URL, options, callback function, and arguments.
    
    - url: String - The URL of the page to be shown in the modal dialog.
    - options: Object - The options to create the modal dialog.
    - callback: function pointer - The callback function that runs when the modal dialog is closed.
    - args: Object - The arguments to the modal dialog.
- **ModalDialog** - This member is reserved for internal use and is not intended to be used directly from your code.
    
    - options: The modal dialog options
        
        - title: A string that contains the title of the dialog.
        - url: A string that contains the URL of the page that appears in the dialog. If both url and html are specified, url takes precedence. Either url or html must be specified.
        - html: A string that contains the HTML of the page that appears in the dialog. If both html and url are specified, url takes precedence. Either url or html must be specified.
        - x: An integer value that specifies the x-offset of the dialog. This value works like the CSS left value.
        - y: An integer value that specifies the y-offset of the dialog. This value works like the CSS top value.
        - width: An integer value that specifies the width of the dialog. If width is not specified, the width of the dialog is autosized by default. If autosize is false, the width of the dialog is set to 768 pixels.
        - height: An integer value that specifies the height of the dialog. If height is not specified, the height of the dialog is autosized by default. If autosize is false, the dialog height is set to 576 pixels.
        - allowMaximize: A Boolean value that specifies whether the dialog can be maximized. true if the Maximize button is shown; otherwise, false.
        - showMaximized: A Boolean value that specifies whether the dialog opens in a maximized state. true the dialog opens maximized. Otherwise, the dialog is opened at the requested sized if specified; otherwise, the default size, if specified; otherwise, the autosized size.
        - showClose: A Boolean value that specifies whether the Close button appears on the dialog.
        - autoSize: A Boolean value that specifies whether the dialog platform handles dialog sizing.
        - dialogReturnValueCallback: A function pointer that specifies the return callback function. The function takes two parameters, a dialogResult of type SP.UI.DialogResult Enumeration and a returnValue of type object that contains any data returned by the dialog.
        - args: An object that contains data that are passed to the dialog.
- **OpenPopUpPage** - Displays a modal dialog with the specified URL, callback function, width, and height.
    
    - url: String - The URL of the page to be shown in the modal dialog. callback: function pointer - The callback function that runs when the modal dialog is closed. width: int - The width of the modal dialog. height: int - The height of the modal dialog.
- **RefreshPage** - Refreshes the parent page of the modal dialog when the dialog is closed by clicking OK.
    
    - dialogResult: SP.UI.DialogResult - The result of the modal dialog.
- **showModalDialog** - Displays a modal dialog with specified dialog options.
    
    - options: The modal dialog options.
- **ShowPopupDialog** - Displays a modal dialog using the page at the specified URL.
    
    - url: String - The URL of the page to be shown in the modal dialog.
- **showWaitScreenSize** - Displays a wait screen dialog that has a Cancel button using the specified parameters.
    
    - title: String - The title of the wait screen dialog.
    - message: String - The message that is shown in the wait screen dialog.
    - callbackFunc: function pointer - The callback function that runs when the wait screen dialog is closed.
    - height: int - The height of the wait screen dialog.
    - width: int - The width of the wait screen dialog.
- **showWaitScreenWithNoClose** - Displays a wait screen dialog that does not have a Cancel button using the specified parameters.
    
    - title: String - The title of the wait screen dialog.
    - message: String - The message that is shown in the wait screen dialog. int - The height of the wait screen dialog.
    - width: int - The width of the wait screen dialog.

### Notify

The notify library comes in handy when you want to display a temporary message to the user. _[Microsoft Reference](https://msdn.microsoft.com/en-us/library/office/ff408137(v=office.14).aspx)_

#### JavaScript

```
Format
SP.SOD.execute("sp.js", "SP.UI.Notify.[Method]", [Method Properties])

// Example 1 - Show a notification
SP.SOD.execute("sp.js", "SP.UI.Notify.addNotification", "This is the notification.", false);

// Example 2 - Remove a notification
SP.SOD.execute("sp.js", "SP.UI.Notify.removeNotification", "[notification id]");

```

#### Methods

- **addNotification** - Adds a notification to the page.
    
    - strHtml - The message inside the notification.
    - bSticky - Specifies whether the notification stays on the page until removed.
- **Notify** - Creates a notify object.
- **removeNotification** - Removes the specified notification from the page.
    
    - nid - The notification to remove from the page.

### Status

The status library comes in useful when you want to add a message to the bar under the navigation. _[Microsoft Reference](https://msdn.microsoft.com/en-us/library/office/ff407795(v=office.14).aspx)_

#### JavaScript

```
Format
SP.SOD.execute("sp.js", "SP.UI.Status.[Method]", [Method Properties])

// Example 1 - Show a status
var statusId = SP.SOD.execute("sp.js", "SP.UI.Status.addStatus", "Title", "<h3>This is the message</h3>");

// Example 2 - Udpate a status color
SP.SOD.execute("sp.js", "SP.UI.Status.setStatusPriColor", statusId, "green");

// Example 3 - Close all status messages
SP.SOD.execute("sp.js", "SP.UI.Status.removeAllStatus");

```

#### Methods

- **addStatus** - Adds a status message to the page.
    
    - strTitle - The title of the status message.
    - strHtml - The contents of the status message.
    - atBegining - Specifies whether the status message will appear at the beginning of the list.
- **appendStatus** - Appends text to an existing status message.
    
    - sid - The ID of the status message.
    - strTitle - The title of the status message.
    - strHtml - The contents of the status message.
- **removeAllStatus** - Removes all status messages from the page.
    
    - hide - Specifies that the status messages should be hidden.
- **removeStatus** - Removes the specified status message.
    
    - sid - The ID of the status message to remove.
- **setStatusPriColor** - Sets the priority color of the specified status message.
    
    - sid - The ID of the status message.
    - strColor - The color to set for the status message. The following table lists the values and their priority.
        
        - red - Very important
        - yellow - Important
        - green - Success
        - blue - Information
- **Status** - Creates a status message.
- **updateStatus** - Updates the specified status message.
    
    - sid - The ID of the status to update.
    - strHtml - The new status message.
