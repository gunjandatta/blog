---
layout: "post"
title: "Add an Event Receiver using REST"
date: "2016-10-18"
description: ""
feature_image: ""
tags: [event receiver, rest]
---

In this post, I'll demonstrate how to add an event receiver to a web or list in a SharePoint 2013 (On-Premise) or Online environment. This will be using the REST library I created, which is available on [npm](https://npmjs.com/packages/gd-sprest) and [github](https://github.com/gunjandatta/sprest).

<!--more-->

### Adding an Event Receiver

```
// Get the list, but do not execute a request to the server
var list = new $REST.List("[Name of the List]");

// Add the event receiver
var eventReceiver = list.addEventReceiver({
    EventType: $REST.SPTypes.EventReceiverType.ItemAdding,
    ReceiverName: "[Name of the Event]",
    ReceiverUrl: "[Url to the web service]",
    SequenceNumber: 10000
}).execute(
    // Success
    function(er) {
        // The event receiver was added successfully
    },

    // Error
    function(ex) {
        // The event receiver was not added
        // See the ex for the response
    }
);
```

The above will add a remote event receiver to the list, but if you need to reference one in the GAC then you can set the ReceiverAssembly and ReceiverClass properties. Refer to the library's [EventReceiverDefinitionCreationInformation](https://msdn.microsoft.com/en-us/library/office/dn600183.aspx#bk_EventReceiverDefinitionCreationInformation) for a list of all available properties.

The same method exists for the web object as well. If you do not wish to use the library, the request will be executed against the following url:

```
https://[SP Web Url]/_api/web/lists/getByTitle('[Name of the List]')/eventreceivers
```

The body of the request should be in the following format:

```
{
    '__metadatatype': { 'type': 'SP.EventReceiverDefinition' },
    EventType: 1,
    ReceiverName: "[Name of the Event]",
    ReceiverUrl: "[Url to the web service]",
    SequenceNumber: 10000
}
```

### Removing an Event Receiver

```
// Get the list, but do not execute a request to the server
var list = new $REST.List("[Name of the List]");

// Remove the event receiver
list.EventReceivers("[Guid]").delete().execute(
    // Success
    function() {
        // The event receiver was removed successfully
    },

    // Error
    function(ex) {
        // The event receiver was not removed
        // See the ex for the response
    }
);
```

The above will remove a remote event receiver from a list. We will reference the event receiver by it's GUID. If you do not know the GUID, you can get all the event receivers and parse the results to find the target event receiver by it's name. Once you have it, you can use the `delete` method to remove the event receiver.

To execute this outside of the library, you can execute a POST request shown below:

```
https://[SP Web Url]/_api/web/lists/getByTitle('[Name of the List]')/eventreceivers('[GUID of Event Receiver]')/deleteObject
```