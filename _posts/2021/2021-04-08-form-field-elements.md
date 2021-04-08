---
layout: "post"
title: "Finding List Form Field Elements"
date: "2021-04-08"
description: "Example on how to get the list form field elements."
feature_image: ""
tags: ["field", "list"]
---

This post will go over how to get the list field elements in a classic form. This can be useful for minor customizations to a form.

<!--more-->

### Find Field Elements

The classic SharePoint list form new/edit pages contain the internal/display field name as a comment. The following code will find the elements based on the comment.

```js
function findFields(el) {
  var fields = {};

  // Parse the child elements
  for(var i=0; i<el.childNodes.length; i++) {
      var node = el.childNodes[i];

      // See if this is a comment
      if(node.nodeType === 8) {
          // Ensure this is a field element
          var data = node.textContent.split('FieldInternalName="');
          if(data.length > 1) {
              var fieldName = data[1].substr(0, data[1].indexOf('"'));
              if(fieldName) { fields[fieldName] = node.parentElement; }
          }
      } else {
          // Search the child node
          Object.assign(fields, findFields(node));
      }
  }

  // Return the fields
  return fields;
}
```

### Demo

#### 1. Access Form Page

![Access New Form](images/FindFormFields/AccessNewForm.png)

#### 2. Edit the Page

![Edit Page](images/FindFormFields/EditNewFormPage.png)

#### 3. Add a New WebPart

![Add WebPart](images/FindFormFields/AddNewWebPart.png)

#### 4. Add a Script Editor WebPart

![Add Script Editor WebPart](images/FindFormFields/AddScriptEditorWebPart.png)

#### 5. Set the JavaScript Code

This example will set the "Start Date" to a static value.

```js
// Wait for the page to be loaded
window.addEventListener("load", function() {
  // Get the fields
  var fields = findFields(document.body);

  // Update the start date
  fields.StartDateAndTime.querySelector("input").value = "1/1/2021";
});
```

![Add JavaScript Code](images/FindFormFields/SetJSCode.png)

#### 6. Create a New Item

![Create New Item](images/FindFormFields/CreateNewItem.png)

#### 7. Validate the Customization

![Validate Customization](images/FindFormFields/ValidateCustomization.png)

### Summary

This is useful for situations where you can't use JSLinks due to the design limitation (Event Content Types) or need to apply minor customizations.

Hope this example helps. Happy Coding!!!