---
layout: "post"
title: "Create a Managed Metadata Field Using REST and JSOM"
date: "2016-09-23"
description: ""
feature_image: ""
tags: [taxonomy, rest, jsom]
---

This topic will go over creating a Managed Metadata Field using REST and JSOM. I will be using REST to create the fields, and JSOM to connect it to a term set. I've seen many examples on the web for connecting fields to a term set, but most of them hard-code GUIDs which isn't helpful, since they are unique to the environment.

<!--more-->

Lets go over the fields to create first. Even though we are technically creating one taxonomy field, we are actually creating two of them. Below is the schema xml of the fields to add.

```
<Field ID="{04630DE4-3EDD-4B8F-8F37-601720351CDC}" Name="MyTaxonomyField_0" StaticName="MyTaxonomyField_0" DisplayName="My Taxonomy Field Value" Type="Note" Hidden="TRUE" />
<Field ID="{DA4BFB17-E27F-43A1-A51B-60172001F484}" Name="MyTaxonomyField" StaticName="MyTaxonomyField" DisplayName="My Taxonomy Field" Type="TaxonomyFieldType" ShowField="Term1033">
        <Customization>
                <ArrayOfProperty>
                        <Property>
                                <Name>TextField</Name>
                                <Value xmlns:q6="http://www.w3.org/2001/XMLSchema" p4:type="q6:string" xmlns:p4="http://www.w3.org/2001/XMLSchema-instance">{04630DE4-3EDD-4B8F-8F37-601720351CDC}</Value>
                        </Property>
                </ArrayOfProperty>
        </Customization>
</Field>

```

**_Note - The hidden note field MUST be created first, since the taxonomy field references it._** **_Note - The LCID will be defaulted to 1033, referring to the "ShowField" property of the taxonomy field._**

The hidden note field is required for the field to work. If the taxonomy field is not connected to the hidden note field, then you will not be able to save a value to it in the list form. Now that we have the schema xml of the fields defined, let's add them to the SharePoint web. I will be using the [gd-sprest](https://gunjandatta.github.io/sprest) library to add the fields. I'll show you an example of creating a field synchronously and asynchronously. It's not required to use the library, so feel free to add the fields however you feel comfortable doing it. This example will assume that you are adding the fields to the root web of the site collection.

#### Asynchronously

```
// Get the web asynchronously, but do not execute a request to the server
$REST.Web()
    // Get the field collection
    .Fields()
    // Add the field using the schema xml
    .createFieldAsXml('[Field Schema XML]]')
    // Execute code after the field is created
    .execute(function(field) {
             // Code to execute after the field is created
    });

```

#### Synchronously

```
// Get the web synchronously, but do not execute a request to the server
var field = $REST.Web()
    // Get the field collection
    .Fields()
    // Add the field using the schema xml
    .createFieldAsXml('[Field Schema XML]]')
    // Execute the request
    .executeAndWait();

```

Now that we have the fields created, we will need to connect it to a term set dynamically. We need to set the field's SSPId property to the term store id, and TermSetId property to the term set id. I wanted to write code to find the term set, for a specific term group, regardless of the term store. The code below will assume that the fields were added to the root web of the site collection.

```
var context = null;
var field = null;
var session = null;
var termGroups = [];
var termSets = null;

// Log errors
var logError = function () {
     // Log the error
     console.error("[Dev] " + arguments[1].get_message());

     // Show an error message
     SP.UI.Notify.addNotification("Error: Failed to connect the Taxonomy Field.");
}

// Method to get the term set
var getTermSet = function () {
     // Get the taxonomy session
     context = SP.ClientContext.get_current();
     session = SP.Taxonomy.TaxonomySession.getTaxonomySession(context);

     // Get the MMS field
     field = context.get_site().get_rootWeb().get_fields().getByInternalNameOrTitle("MyTaxonomyField");
     field = context.castTo(field, SP.Taxonomy.TaxonomyField);

     // Get the term set
     termSets = session.getTermSetsByName("[[Term Set Name]]", 1033);
     context.load(termSets);

     // Execute the request
     context.executeQueryAsync(getTermStore, logError);
};

// Method to get the term store for the target term set
var getTermStore = function () {
     // Parse the term sets
     var enumerator = termSets.getEnumerator();
     while (enumerator.moveNext()) {
          // Get the term set
          var termSet = enumerator.get_current();

          // Get the term group
          var termGroup = termSet.get_group();
          context.load(termGroup);

          // Get the term store
          var termStore = termSet.get_termStore();
          context.load(termStore);

          // Save a reference to this
          termGroups.push({ termGroup: termGroup, termSet: termSet, termStore: termStore });
     }

     // Execute the request
     context.executeQueryAsync(updateFieldSource, logError);
}

// Method to update the field source
var updateFieldSource = function () {
     // Parse the term groups
     for (var i = 0; i < termGroups.length; i++) {
          // See if the term set belongs to the specific term group we are targeting
          if (termGroups[i].termGroup.get_name() == "[[Term Group Name]]") {
               // Set the taxonomy information in the field
               field.set_sspId(termGroups[i].termStore.get_id().toString());
               field.set_termSetId(termGroups[i].termSet.get_id().toString());

               // Update the field
               field.update();

               // Execute the request
               context.executeQueryAsync(function () { promise.resolve(); }, logError);
          }
     }
}

// Ensure the taxonomy class exists, and load the term set
SP.SOD.registerSod("sp.taxonomy.js", SP.Utilities.Utility.getLayoutsPageUrl("sp.taxonomy.js"));
SP.SOD.executeFunc("sp.taxonomy.js", "SP.Taxonomy.TaxonomySession", getTermSet);

```

**_Note - The LCID is defaulted to 1033 for finding the term sets by name._**
