---
layout: "post"
title: "SPFx WebPart Disappearing"
date: "2023-01-23"
description: "Explains why a SPFx webpart may disappear from the page after saving it."
feature_image: ""
tags: ["spfx webpart"]
---

This post will go over an odd "bug" where SPFx webparts may be removed from the page.

<!--more-->

### Overview of Issue

When adding a webpart to a page and setting its properties, I noticed that it would disappear after refreshing the page. My webpart property was storing a JSON configuration in a multi-line text field property. I was able to save the page, which seemed like the webpart page saved correctly; but after refreshing the page it was removed. When you edit the page, you will see a very helpful message:

```
You cannot edit this page

We're sorry, we encountered an unexpected error. Please refresh the page and try again.
```

I've tried to search on this issue, but was unable to find anything. Further testing pointed my issue to my SPFx webpart properties, so I thought it was my code. It was actually the value I was putting in there. This post will go over the issue by recreating it in a basic "Hello World" solution.

#### Overview of Solution

For those who don't want to read the entire post. You can't mix html and the `[[ ]]` brackets in a text webpart property value.

### Create Solution

For this example, I'm going to use the offical [Hello World](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/build-a-hello-world-web-part) solution from Microsoft. Below are the properties I used:

* Which type of client-side component to create?: **WebPart**
* What is your Web part name?: **TestPropertyBug**
* Which template would you like to use?: **No framework**

#### Update WebPart Properties

The first step is to update the webpart properties. I wanted to test both the single line and multi-line text properties. We will use the default `Description` property for the single line text, but will need to add a multi-line option for this test.

##### Update Strings

Update the following files to add the new `Configuration` webpart property.

**loc/en-us.js**

Add the `ConfigurationFieldLabel` property.

```js
define([], function() {
  return {
    "PropertyPaneDescription": "Description",
    "BasicGroupName": "Group Name",
    "ConfigurationFieldLabel": "Configuration Field",
    "DescriptionFieldLabel": "Description Field",
    "AppLocalEnvironmentSharePoint": "The app is running on your local environment as SharePoint web part",
    "AppLocalEnvironmentTeams": "The app is running on your local environment as Microsoft Teams app",
    "AppSharePointEnvironment": "The app is running on SharePoint page",
    "AppTeamsTabEnvironment": "The app is running in Microsoft Teams"
  }
});
```

**loc/mystrings.d.ts**

Add the `ConfigurationFieldLabel` property.

```ts
declare interface ITestPropertyBugWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  ConfigurationFieldLabel: string;
  DescriptionFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
}

declare module 'TestPropertyBugWebPartStrings' {
  const strings: ITestPropertyBugWebPartStrings;
  export = strings;
}
```

##### Update WebPart Code

In the main webpart code, we will make the following udpates.

**Interface**

Add the `configuration` property to store the new multi-line property value.

```ts
export interface ITestPropertyBugWebPartProps {
  configuration: string;
  description: string;
}
```

**WebPart Property Configuration Pane**

The next step is to add the new `configuration` multi-line property to the configuration.

```ts
protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
  return {
    pages: [
      {
        header: {
          description: strings.PropertyPaneDescription
        },
        groups: [
          {
            groupName: strings.BasicGroupName,
            groupFields: [
              PropertyPaneTextField('description', {
                label: strings.DescriptionFieldLabel
              }),
              PropertyPaneTextField('configuration', {
                label: strings.ConfigurationFieldLabel,
                multiline: true,
                rows: 15
              })
            ]
          }
        ]
      }
    ]
  };
}
```

**Optional**

You don't need to add this option, but if you would like to disable reactive changes add the following code to the file.

```ts
protected get disableReactivePropertyChanges(): boolean { return true; }
```

**Render**

The last step is to update the render method to include the `configuration` property. We will just render the value under the `description` value.

```ts
  public render(): void {
    this.domElement.innerHTML = `
    <section class="${styles.testPropertyBug} ${!!this.context.sdks.microsoftTeams ? styles.teams : ''}">
      <div class="${styles.welcome}">
        <img alt="" src="${this._isDarkTheme ? require('./assets/welcome-dark.png') : require('./assets/welcome-light.png')}" class="${styles.welcomeImage}" />
        <h2>Well done, ${escape(this.context.pageContext.user.displayName)}!</h2>
        <div>${this._environmentMessage}</div>
        <div>Web part property <strong>description</strong>: ${escape(this.properties.description)}</div>
        <div>Web part property <strong>configuration</strong>: ${escape(this.properties.configuration)}</div>
      </div>
      <div>
        <h3>Welcome to SharePoint Framework!</h3>
        <p>
        The SharePoint Framework (SPFx) is a extensibility model for Microsoft Viva, Microsoft Teams and SharePoint. It's the easiest way to extend Microsoft 365 with automatic Single Sign On, automatic hosting and industry standard tooling.
        </p>
        <h4>Learn more about SPFx development:</h4>
          <ul class="${styles.links}">
            <li><a href="https://aka.ms/spfx" target="_blank">SharePoint Framework Overview</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-graph" target="_blank">Use Microsoft Graph in your solution</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-teams" target="_blank">Build for Microsoft Teams using SharePoint Framework</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-viva" target="_blank">Build for Microsoft Viva Connections using SharePoint Framework</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-store" target="_blank">Publish SharePoint Framework applications to the marketplace</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-api" target="_blank">SharePoint Framework API reference</a></li>
            <li><a href="https://aka.ms/m365pnp" target="_blank">Microsoft 365 Developer Community</a></li>
          </ul>
      </div>
    </section>`;
  }
```

#### Test Solution

Update the `config/serve.json` file with your tenant url information, and run `gulp serve` to test out the solution. Below is what you should see:

![Gulp Serve](images/SPFxWebPartPropBug/gulp-serve.png)

#### Deploy to App Catalog

Run the following commands to package the solution.

```
gulp clean --ship
gulp build --ship
gulp bundle --ship
gulp package-solution --ship
```

Once the package is created, upload it to the tenant app catalog and deploy it. To simplify the deployment, I made the solution available to all sites immediately. This will skip the step to "Add an App" to the test site we will use.

#### Test WebPart

Create a modern `Site Page` and publish it for now.

![Create Page](images/SPFxWebPartPropBug/create-page.png)

##### Test Steps

These are the test steps taken for each example.

1. Edit the Page
2. Set the property
3. Click on `Apply` to save the properties
4. Click on `Save as Draft` or `Republish` to save the page and return to `Display` mode
5. Refresh the page (Ctrl+F5)
6. Validate the webpart is still on the page

##### Test Single-Line Issue

**Test 1 - Plain Text - Pass**

```html
This is a test.
```

![Single Test 1](images/SPFxWebPartPropBug/test-single-1.png)

**Test 2 - Use of [[ ]] - Pass**

```html
This is a [[test]].
```

![Single Test 2](images/SPFxWebPartPropBug/test-single-2.png)

**Test 3 - Use of [[ ]] within HTML - Fail**

```html
<p>This is a [[test]].</p>
```

![Single Test 3](images/SPFxWebPartPropBug/test-single-3.png)

When you edit the page, you will see the following error:

![Error Message](images/SPFxWebPartPropBug/error-message.png)

##### Test Multi-Line Issue

**Test 1 - Use of [[ ]] - Pass**

```json
This is a test for storing [[values]] with a bracket around it.
```

![Multi Test 1](images/SPFxWebPartPropBug/test-multi-1.png)

**Test 2 - Use of [[ ]] within Quotes - Pass**

```json
"This is a test for storing [[values]] with a bracket around it."
```

![Multi Test 2](images/SPFxWebPartPropBug/test-multi-2.png)

**Test 3 - Use of [[ ]] within JSON Pass**

```json
{
  "test": "This is a test for storing [[values]] with a bracket around it."
}
```

![Multi Test 3](images/SPFxWebPartPropBug/test-multi-3.png)

**Test 4 - Use of [[ ]] within HTML and JSON - Fail**

```json
{
  "test": "<p>This is a test for storing [[values]] with a bracket around it.</p>"
}
```

![Multi Test 4](images/SPFxWebPartPropBug/test-multi-4.png)

**Test 5 - Use of [ ] within HTML and JSON - Pass**

```json
{
  "test": "<p>This is a test for storing [values] with a bracket around it.</p>"
}
```

![Multi Test 5](images/SPFxWebPartPropBug/test-multi-5.png)

### Summary

The overall bug is when you use double brackets (**[[ ]]**) within **HTML**. If you use single brackets (**[ ]**) within **HTML**, it will work fine. I hope this helps others out who may have run across this issue.