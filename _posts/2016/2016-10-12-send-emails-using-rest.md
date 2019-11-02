---
layout: "post"
title: "Send Emails Using REST"
date: "2016-10-12"
description: ""
feature_image: ""
tags: []
---

In this post, I'll demonstrate how to send an email in a SharePoint 2013 (On-Premise) or Online environment. This will be using the REST library I created, which is available on [npm](https://npmjs.com/packages/gd-sprest) and [github](https://github.com/gunjandatta/sprest).

<!--more-->

```
// Send the email
$REST.Email.send({
    To: ["blog@dattabase.com", "anotherEmail@domain.com"],
    From: "emailInOfficeTenant@domain.com",
    Subject: "Email Demo",
    Body: "This is an example of how to send an email using REST."
}).execute();

```

_Note - The library will automatically set the metadata type to "SP.Utilities.EmailProperties"._ _Note - The "To" property can be a string or array of strings. The library will convert it appropriately._

The above will send an email against the following url:

```
https://[SP Web Url]/_api/SP.Utilities.Utility.SendEmail

```

For those not wanting to use the library, the body of the request should be in the following format:

```
{
    'properties': {
        '__metadata': { 'type': 'SP.Utilities.EmailProperties' },
        'From': 'email@domain.com',
        'To': { 'results': ['email1@domain.com', 'email2@domain.com'] },
        'Subject': '[Subject of Email]',
        'Body': '[Body of Email]'
    }
}

```
