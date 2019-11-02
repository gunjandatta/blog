---
layout: "post"
title: "Office Fabric UI - React/Redux (Part 2 of 5)"
date: "2017-01-02"
description: ""
feature_image: ""
tags: []
---

This is the second of five posts going over the Office Fabric UI React library and Redux. The entire project is on [github](https://github.com/gunjandatta/sprest-fabric-react-redux).

<!--more-->

1. [Introduction and Project Creation](https://dattabase.com/blog/office-fabric-ui-reactredux-part-1-5/)
2. Core Configuration/Files (This Post)
3. [Office UI Fabric Dialog](https://dattabase.com/blog/office-fabric-ui-reactredux-part-3-5/)
4. [Office UI Fabric Panel](https://dattabase.com/blog/office-fabric-ui-reactredux-part-4-5/)
5. [Office UI Fabric Details List](https://dattabase.com/blog/office-fabric-ui-reactredux-part-5-5/)

### Folder Structure

The folder structure of the project will be: \* actions - The available actions for the application. \* components - The application components. \* data - The data source for the components. \* reducers - Handlers for the actions. \* store - The redux store.

### File Structure

The file structure of the core project files will be: \* src/actions/actionTypes.ts - Enumerator to store the available actions. \* src/actions/\[name\]Actions.ts - Available actions for the \[name\] component/module. \* src/components/\[name\] - Application components. \* src/data/\[name\]Data.ts - CRUD operations for the \[name\] component/module. \* src/reducers/index.ts - The root reducer, to reference the available reducers. \* src/reducers/initialState.ts - The default values of the application states. \* src/reducers/\[name\]Reducer.ts - Handler for the \[name\]Actions.js functions. \* src/store/configureStore.ts - The redux store. \* src/index.tsx - The javascript entry point of the application. \* index.html - The html entry point of the application.

### Entry Points

#### index.html

The base html of the project.

```
<html>
    <head>
        <title>Office Fabric UI React/Redux Demo</title>
    </head>
    <body>
        <div id="app"></div>
        <script src="./dist/bundle.js"></script>
    </body>
</html>

```

#### index.tsx

##### Imported Libraries

- \[react\] React - The react library.
- \[react-dom\] render - Method to render the component to the DOM.
- \[react-redux\] Provider - Attaches the store to the react container components.
- configureStore - Method to create/configure the store.

```
import * as React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import configureStore from "./store/configureStore";

const store = configureStore();

render(
    <Provider store={store}>
        {/* TO DO - Create the dashboard component */}
    </Provider>,
    document.getElementById("app")
);

```

### Configure the Store

The store will contain the component states, and is the first thing we will setup. \* Folder: ./src/store \* Filename: configureStore.ts

#### Code

##### Imported Libraries

- \[redux\] createStore - Method to create the store.
- \[redux\] applyMiddleware - Method to add redux plugins.
- rootReducers - Reference to the available reducers in the application.
- \[redux-thunk\] - The redux-thunk plugin.

```
import {createStore, applyMiddleware} from "redux";
import rootReducer from "../reducers";
import thunk from "redux-thunk";

export default function configureStore(initialState?:any) {
    return createStore(
        rootReducer,
        initialState,
        applyMiddleware(thunk)
    );
}

```

#### rootReducer

The rootReducer is a reference to the available reducers in the application. This will be the next thing to setup.

### Create Default Values for the Application States

Since the store contains the available states of the application, the default values will be defined and referenced by various reducers. \* Folder: ./src/reducers \* Filename: initialState.js

#### Code

```
export default {
    /* TO DO - Define default state values */
};

```

### Configure the Reducers

The rootReducers is referenced by the store for all available reducers. \* Folder: ./src/reducers \* Filename: index.ts

#### Code

##### Imported Libraries

\[redux\] combineReducers - Method to combine the available reducers.

```
import {combineReducers} from "redux";

const rootReducer = combineReducers({
    /* TO DO - Create reducers */
});

export default rootReducer;

```

#### Template \[name\]Reducer.ts

```
import ActionTypes from "../actions/actionTypes"
import initalState from "./initialState";

export default function [name]Reducer(state = initalState.[Name], action) {
        // Check the requested action
    switch(action.type) {
                // See if this action is handled by this reducer
        case ActionTypes.[ActionType]:
                        // Return a copy of the state
                        return Object.assign(
                            {},
                            state,
                            // The updated state
                            { [key]: action.[key] }
                        );

                // Return the state if this reducer doesn't handle the requested action
        default:
            return state;
    }
}

```

### Configure the Actions

Since we haven't created anything, there really isn't much setup required for actions other than the actionTypes enumerator. This is recommended to reduce "developer error" when typing in "static" values. \* Folder: ./src/actions \* Filename: actionTypes.ts

#### Code

```
const ActionTypes = {
    /* TO DO - Define Actions */
};

export default ActionTypes;

```

#### Templates

##### Synchronous Actions

```
import ActionTypes from "./actionTypes";

export function [action]() {
    return {
        type: ActionTypes.[Action],
        // The data to return
        [data]
    };
}

```

##### Asynchronous Actions

```
import ActionTypes from "./actionTypes";
import [Name] from "../data/[name]Data";

export function [action]() {
    // Return the dispatch function
    return function(dispatch) {
        // Execute the asynchronouse method
        return [Name].get().then(data => {
            dispatch({
                type: ActionTypes.[Action],
                // The data to return
                data
            });
        });
    }
}

```

### Conclusion

This ends part two of the blog post. The next post will go create the navigation and dialog components of the application.
