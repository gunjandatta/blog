---
layout: "post"
title: "SharePoint Calendar Event Callout"
date: "2017-02-04"
description: ""
feature_image: ""
tags: []
---

This post will go over a simple customization for SharePoint 2013/Online calendars, to display a callout for each event displayed in a calendar. Refer to the [github project](https://github.com/gunjandatta/sp-event-callout) to see the code.

<!--more-->

### Library Overview

This section will go over the code for the library. To see the library in action, do the following: 1. Download the [library](https://github.com/gunjandatta/sp-event-callout/blob/master/dist/sp-event-callout.js) 2. Upload the library to a SharePoint Library (Example: "/SiteAssets/SPEventCallout/sp-event-callout.js") 3. Create a calendar or go to an existing calendar. (Example: "My Calendar") 4. Edit the page 5. Add a Script Editor webpart 6. Add the following code to the Script Editor

```
<script type="text/javascript" src="/SiteAssets/SPEventCallout/sp-event-callout.js"></script>
<script type="text/javascript">
    new SPEventCallout("My Calendar");
</script>

```

#### Attaching to Calendar Render Event

The SP.UI.ApplicationPages.Calendar.js file can be referenced for additional events you can attach to. This post will use the onItemsSucceed event to attach a SharePoint Callout control to them. This method will get called each time the calendar is re-rendered. Switching between Month/Week/Day views is an example of the calendar being re-rendered. The code shown below displays how we overload the event and call the "attachCalloutsToEvents" method after the items are rendered.

```
            // Wait for the calendar script to be loaded
            ExecuteOrDelayUntilScriptLoaded(() => {
                let _this_ = this;

                // Overload the onItemsSucceed event
                this._onItemsSucceed = SP.UI.ApplicationPages.CalendarStateHandler.prototype.onItemsSucceed;
                SP.UI.ApplicationPages.CalendarStateHandler.prototype.onItemsSucceed = function($p0, $p1) {
                    // Call the base
                    _this_._onItemsSucceed.call(this, $p0, $p1);

                    // Attach the callouts to the calendar events
                    _this_.attachCalloutsToEvents();
                };

                // Attach the callouts to the calendar events
                this.attachCalloutsToEvents();
            }, "SP.UI.ApplicationPages.Calendar.js");

```

#### Attaching Callouts to Events

The attachCalloutsToEvents method displays how to create a callout component. First we query for all the events using the "ms-acal-item" class, and create a callout for each one using the item id as the unique identifier. We will store them in an array, in order to control when to show/hide them. The callout will be displayed while hovering over the event, so we will add "mouseover" and "mouseout" event listeners to show/hide the callout.

```
    // Method to attach callouts to the events
    private attachCalloutsToEvents() {
        // Clear the callouts
        this._callouts = [];

        // Parse the calendar events
        let calEvents = <any>document.querySelectorAll(".ms-acal-item");
        for(let calEvent of calEvents) {
            // Add hover events
            calEvent.addEventListener("mouseover", this.hoverOverEvent);
            calEvent.addEventListener("mouseout", this.hoverOutEvent);

            // Get the item id for this event
            let link = calEvent.querySelector("a");
            let itemId = link ? link.href.substr(link.href.indexOf("ID=") + 3) : 0;

            // Create the callout options
            let calloutOptions = new CalloutOptions();
            calloutOptions.content = "<div>Loading the Event Information...</div>";
            calloutOptions.ID = itemId;
            calloutOptions.launchPoint = calEvent;
            calloutOptions.title = calEvent.title;

            // Remove the default hover text
            calEvent.removeAttribute("title");

            // Create the callout
            this._callouts[itemId] = CalloutManager.createNew(calloutOptions);
        }
    }

```

_Refer to [MSDN](https://msdn.microsoft.com/en-us/library/office/dn135236.aspx) for additional information on SharePoint Callout Control._

#### Displaying the Callout

The code shown below goes over getting the item information when hovering over an event. The key part to take away is how we can can customize the callout element after it's created. We get the list item asynchronously, so this will come in handly after we get the item.

```
    // The hover over event
    private hoverOverEvent = (ev) => {
        // Get the item id for this event
        let link = ev.currentTarget.querySelector("a");
        let itemId = link ? link.href.substr(link.href.indexOf("ID=") + 3) : 0;
        if(itemId > 0 && itemId != this._currentItemId) {
            // Set the current item id
            this._currentItemId = itemId;

            // Get the callout
            let callout = this._callouts[this._currentItemId];

            // Get the item
            this.getItemInfo(this._currentItemId).then((item) => {
                let content = "";

                // Get the content element
                let elContent = callout.getContentElement().querySelector(".js-callout-body");

                // Parse the fields to display
                for(let field of this._fields) {
                    let title = field;
                    let value = item[field];

                    // See if this is a date/time field
                    if(field == "EndDate" || field == "EventDate") {
                        // Convert the date field
                        value = (new Date(value)).toString();

                        // Set the title
                        title = field == "EndDate" ? "End Date" : "Start Date";
                    }

                    // Update the content
                    content += "<div><strong>" + title + ": </strong>" + value + "</div>";
                }

                // Update the content element
                elContent.innerHTML = content;
            });

            // Open the callout
            callout.open();
        }
    }

```

#### Closing the Callout

The code shown below demonstrates how to close the callout.

```
    // The hover out event
    private hoverOutEvent = () => {
        // Get the callout
        let callout = this._callouts[this._currentItemId];
        if(callout) {
            // Close the callout w/ animation
            callout.close(true);
        }

        // Clear the current item id
        this._currentItemId = 0;
    }

```

#### Getting the Event Information

The code to get the list item is using the [gd-sprest](https://gunjandatta.github.io/sprest) library to get the item. To ensure we don't make redundant calls, we will store the item in an array, so we minimize the requests to the server.

```
    // Method to get the item Information
    private getItemInfo(itemId) {
        // Return a promise
        return new Promise((resolve, reject) => {
            // See if we already queried for this item
            if(this._items[itemId]) {
                // Resolve the request
                resolve(this._items[itemId]);
            } else {
                // Get the list
                List(this._listName)
                    // Get the item
                    .Items(itemId)
                    // Execute the request
                    .execute((item) => {
                        // Save a reference to the item
                        this._items[itemId] = item;

                        // Resolve the promise
                        resolve(item);
                    });
            }
        });
    }

```

### Demo

![](https://dattabase.com/blog/wp-content/uploads/2017/02/callout.png)
