---
layout: "post"
title: "Add an Event Receiver using REST"
date: "2016-10-18"
description: ""
feature_image: ""
tags: []
---

In this post, I'll demonstrate how to add an event receiver to a web or list in a SharePoint 2013 (On-Premise) or Online environment. This will be using the REST library I created, which is available on [npm](https://npmjs.com/packages/gd-sprest) and [github](https://github.com/gunjandatta/sprest).

<!--more-->

```
// Get the list, but do not execute a request to the server
var list = new $REST.List("[Name of the List]", false);

// Add the event receiver
var eventReceiver = list.addEventReceiver({
    EventType: $REST.EventReceiverType.ItemAdding,
    ReceiverName: "[Name of the Event]",
    ReceiverUrl: "[Url to the web service]",
    SequenceNumber: 10000
});

```

_Note - The above will execute synchronously. Refer to the library for information on how to do this asynchronously._

The above will add a remote event receiver to the list, but if you need to reference one in the GAC, then you can set the ReceiverAssembly and ReceiverClass properties. Refer to the library's [EventReceiverDefinitionCreationInformation](https://msdn.microsoft.com/en-us/library/office/dn600183.aspx#bk_EventReceiverDefinitionCreationInformation) for a list of all available properties.

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
