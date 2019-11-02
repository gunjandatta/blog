---
layout: "post"
title: "Taxonomy Term Set To JavaScript Object"
date: "2017-12-16"
description: ""
feature_image: ""
tags: []
---

This post will give a code example of reading a taxonomy term set and converting it into a JavaScript object. This code example will be written in TypeScript, since we can define an interface for better intellisense. Refer to the [github](https://github.com/gunjandatta/sp-taxonomy) project for the source code.

<!--more-->

### Interfaces

The interfaces will stop the guess work of what properties exist in custom variables.

```
interface ITermInfo {
    description: string;
    id: string;
    name: string;
    path: Array<string>;
    props: {
        Prop1: string;
        Prop2: string;
        Prop3: string;
    }
}

interface ITermSet {
    info: ITermInfo;
        parent: ITermSet;
}

```

### Code Example

Not every SharePoint page loads the taxonomy script, but we can use the SP.SOD (SharePoint Script On Demand) to load it. The main code should wrap the method to load the terms.

```
// Required to build
declare var SP;

// Return a promise
return new Promise((resolve, reject) => {
        // Ensure the utility class exists
        if (SP.Utilities && SP.Utilities.Utility) {
                // Ensure the taxonomy script is loaded
                SP.SOD.registerSod("sp.taxonomy.js", SP.Utilities.Utility.getLayoutsPageUrl("sp.taxonomy.js"));
                SP.SOD.executeFunc("sp.taxonomy.js", "SP.Taxonomy.TaxonomySession", () => {
                        // Load the terms
                        loadTerms(termGroupName).then(termSet => {
                                // Resolve the promise
                                resolve(termSet);
                        });
                });
        } else {
                // Load the utility class
                SP.SOD.executeFunc("sp.js", "sp.Utilities.Utility", () => {
                        // Get the term set
                        TermSet(termGroupName).then(termSet => {
                                // Resolve the promise
                                resolve(termSet);
                        });
                });
        }
});

```

#### Load the Terms

I like to provide code examples with the least amount of "hard-coded" values, so this code example will read from the default site collection term store and get the term group by the inputed value.

```
// Method to load the terms
let loadTerms = (termGroupName: string): PromiseLike<ITermSet> => {
        // Return a promise
        return new Promise((resolve, reject) => {
                // Get the taxonomy session
                let context = SP.ClientContext.get_current();
                let session = SP.Taxonomy.TaxonomySession.getTaxonomySession(context);

                // Get the term group from the default site collection term store
                let termGroup = session.getDefaultSiteCollectionTermStore().getSiteCollectionGroup(context.get_site());
                let terms = termGroup.get_termSets().getByName(termGroupName).getAllTerms();

                // Load the terms and execute the request
                context.load(terms, "Include(CustomProperties, Description, Id, Name, PathOfTerm)");
                context.executeQueryAsync(
                        // Success
                        () => {
                                // Get the term information
                                let termInfo = getTermInfo(terms);

                                // Convert the term information into an object, and resolve the promise
                                resolve(convertToObject(termInfo));
                        },
                        // Error
                        (ex, msg) => {
                                // Log the error
                                console.log("Error getting the terms: " + msg.get_message());
                        }
                );
        });
}

```

#### Get the Term Information

```
// Method to get the term information
let getTermInfo = (terms) => {
        let termInformation: Array<ITermInfo> = [];

        // Parse the terms
        let enumerator = terms.getEnumerator();
        while (enumerator.moveNext()) {
                let term = enumerator.get_current();

                // Add the term information
                termInformation.push({
                        description: term.get_description(),
                        id: term.get_id().toString(),
                        name: term.get_name(),
                        path: term.get_pathOfTerm().split(";"),
                        props: term.get_customProperties()
                });
        }

        // Sort the terms
        termInformation.sort((a, b) => {
                if (a < b) { return -1; }
                if (a > b) { return 1; }
                return 0;
        });

        // Return the term information
        return termInformation;
}

```

#### Convert To Object

```
// Method to convert the term information into an object
let convertToObject = (termInformation: Array<ITermInfo>): ITermSet => {
        let termSet = {} as ITermSet;

        // Parse the terms
        for (let i = 0; i < termInformation.length; i++) {
                let term = termInformation[i];

                // Add the term to the term set
                addTermToSet(termSet, term, term.path);
        }

        // Return the term set
        return termSet;
}

// Method to add a term to the term set object
let addTermToSet = (termSet: ITermSet, termInfo: ITermInfo, path: Array<string>) => {
        let term = termSet;
        let termName = "";

        // Loop for each path
        while (path.length > 0) {
                // Ensure the term exists
                termName = path[0];
                if (term[termName] == null) { term[termName] = {}; }

                // Set the term
                let parent = term;
                term = term[termName];

                // Set the parent
                term.parent = parent;

                // Remove the term from the path
                path.splice(0, 1);
        }

        // Set the term information
        term.info = termInfo;
}

```

### Demo

#### Term Store

The term store contains a test term set called "TestManagedMetadata". We will get this term set for this demo. ![](http://dattabase.com/wp-content/uploads/2017/12/TermStore.png)

#### JavaScript Object

After loading the script, we will run the command which will return a promise. I added some code to set the global variable to the term set. ![](http://dattabase.com/wp-content/uploads/2017/12/TermSetObject.png)
