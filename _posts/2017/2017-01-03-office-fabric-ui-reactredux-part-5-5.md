---
layout: "post"
title: "Office Fabric UI - React/Redux (Part 5 of 5)"
date: "2017-01-03"
description: ""
feature_image: ""
tags: [fabric-ui, react, add-in]
---

This is the last of five posts going over the Office Fabric UI React library and Redux. The entire project is on [github](https://github.com/gunjandatta/sprest-fabric-react-redux).

<!--more-->

1. [Introduction and Project Creation](https://dattabase.com/blog/office-fabric-ui-reactredux-part-1-5)
2. [Core Configuration/Files](https://dattabase.com/blog/office-fabric-ui-reactredux-part-2-5)
3. [Office UI Fabric Navigation](https://dattabase.com/blog/office-fabric-ui-reactredux-part-3-5)
4. [Office UI Fabric Dialog/Panel](https://dattabase.com/blog/office-fabric-ui-reactredux-part-4-5)
5. Office UI Fabric Details List (This Post)

### Asynchronous Actions

Now that you are comfortable working with React and Redux, we can discuss how to make asynchronous methods. To demonstrate making asynchronous requests, we will simulate loading test data.

#### Redux-Thunk & Redux-Saga

This project is using the redux-thunk plugin for making asynchronous actions, and doesn't require any configuration. Once you become more comfortable with using React and Redux, it's recommended to move to using the redux-saga plugin.

### Office Fabric UI - Details List Example

Adding this component will be similar to the previous post. To add the details list, we will do the following:

1. Create the List component
2. Update the Action Types
3. Create Sample Data
4. Create the List Actions
5. Create the List Actions Handler
6. Update the Navigation component
7. Update the Store to Load the Items

#### Code

The list component will need to interact with the store, so we will need to use the react-redux helper methods to connect it to it.
* Folder: ./src/components/list
* Filename: index.tsx

```
import * as React from "react";
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";
import * as listActions from "../../actions/listActions";
import {
    DetailsList,
    SelectionMode
} from "office-ui-fabric-react";

/**
 * Properties
 */
interface Props {
    actions: any,
    items: Array<any>
}

/**
 * Demo List
 */
class DemoList extends React.Component<Props, any> {
    // Render the list
    render() {
        let {items} = this.props;
        return (
            <DetailsList items={this.props.items} />
        );
    }
}

/**
 * Connections
 */
export default connect(
    /**
     * State to Property Mapper
     */
    (state, ownProps) => {
        return {
            items: state.list.items
        };
    },
    /**
     * Actions Mapper
     */
    (dispatch) => {
        return {
            actions: listActions
        };
    }
)(DemoList);

```

#### Update the Action Types

- Folder: ./src/actions
- Filename: actionTypes.ts We will create a "load" action for the list to query the data asynchronously.

```
const ActionTypes = {
    HideDialog: "HideDialog",
    HidePanel: "HidePanel",
    LoadItems: "LoadItems",
    ShowDialog: "ShowDialog",
    ShowPanel: "ShowPanel"
};

export default ActionTypes;

```

#### Create the Sample Data

- Folder: ./src/data
- Filename: listData.ts It makes sense to create some sample data for this example. I've separated this logic into a separate file, so it can be updated to query real information. This is where you utilize the SharePoint REST api to query a list. _Note - The getItems() method will return a promise to simulate making an asynchronous call._

```
class List {
    // Method to get the list items
    static getItems() {
        /**
         * Code Challenge - Update to query a list using the REST api
         * The github project has the code solution.
         */

        // Return a promise
        return new Promise((resolve, reject) => {
            let requests = [];

            // Parse the items
            for (let item of Data) {
                // Add the item
                requests.push(item);
            }

            // Resolve the promise
            resolve(requests);
        });
    }
}

export default List;

// Test Data
const Data = [
        {
            ID: 1,
            Title: "John Doe",
            EIEMail: "john.doe@company1.com",
            EIAddress: "123 Main St.",
            EICity: "Annandale",
            EIState: "VA",
            EIPostalCode: "20001",
        },
        {
            ID: 2,
            Title: "Jane Smith Doe",
            EIEMail: "jane.s.doe@company2.com",
            EIAddress: "345 Main St.",
            EICity: "Baltimore",
            EIState: "MD",
            EIPostalCode: "20002",
        },
        {
            ID: 3,
            Title: "Edgar Allen Poe",
            EIEMail: "edgar.a.poe@company3.com",
            EIAddress: "123 First St.",
            EICity: "Washington",
            EIState: "DC",
            EIPostalCode: "20003",
        }
];

```

#### Create the List Actions

- Folder: ./src/actions
- Filename: listActions.ts Now that we have the sample data and action types defined, we can create the list action to load the items. The react-thunk plugin requires asynchronous actions to return a function. Once the data is queried, the action will update the application using the dispatch method.

```
import ActionTypes from "./actionTypes";
import List from "../data/listData"

// Action to load the list items
export function loadItems() {
    // Return a dispatch function
    return function(dispatch) {
        // Return a promise
        return List.getItems().then(items => {
            // Load the items
            dispatch({
                type: ActionTypes.LoadItems,
                items
            });
        });
    }
}

```

#### Set the Default State of the List

- Folder: ./src/reducers
- Filename: initialState.ts The items is required for the list component, so we will default them to an empty array.

```
export default {
    items: [],
    showDialog: false,
    showPanel: false
};

```

#### Create the List Actions Handler

- Folder: ./src/reducers
- Filename: listReducer.ts Finally, we create the list reducer to handle the action to load the items. Notice that we aren't creating a copy of the state

```
import ActionTypes from "../actions/actionTypes"
import initalState from "./initialState";

export default function panelReducer(state = initalState, action) {
    switch(action.type) {
            // Handle the load items action
            case ActionTypes.LoadItems:
                // Return the items
                return action.items;

            // Action is not handled by this reducer, return the state
            default:
                    return state;
    }
}

```

#### Update the Root Reducer

- Folder: ./src/reducers
- Filename: index.ts Since we added another reducer, we will need to update the "Root Reducer" and do the following:

1. Add a reference to the list reducer.
2. Add the list reducer to the root reducer, using the combineReducers helper method from redux.

```
import {combineReducers} from "redux";
import dialog from "./dialogReducer";
import list from "./listReducer";
import panel from "./panelReducer";

const rootReducer = combineReducers({
    dialog,
    list,
    panel
});

export default rootReducer;

```

#### Update the Dashboard Component

- Folder: ./src/components/dashboard
- Filename: index.ts

1. Import the list component
2. Render the list under the navigation component

```
import * as React from "react";
import List from "../list";
import Navigation from "../navigation";

/**
 * Dashboard
 */
const Dashboard = () => {
    // Render the component
    return (
        <div>
            <Navigation />
            <List />
        </div>
    );
}

export default Dashboard;

```

#### Update the Store to Load the Items

- Folder: ./src
- Filename: index.tsx All of the hard work is done, but the last part to do is tell the application to load immediately. To do this, we will update the store to execute the asynchronous method to get the items when it's created.

1. Import the list actions.
2. Load the items.

```
import * as React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import configureStore from "./store/configureStore";
import Dashboard from "./components/dashboard";
import * as listActions from "./actions/listActions";

const store = configureStore();
store.dispatch(listActions.loadItems() as any);

render(
    <Provider store={store}>
        <Dashboard />
    </Provider>,
    document.getElementById("app")
);

```

### Test

Use the command prompt and navigate to the root folder of this project, and run the test script to start the webpack development server. After the server is running, goto http://localhost:8080 to view the output.

```
npm run test

```

#### Dashboard

![List](images/ReactRedux/list.png)

### Conclusion

I hope these blog posts are helpful for both the beginner and advanced developers out there. I recommend updating this project to be incorporated in a SharePoint Add-In, that pulls data from a list. The [github](https://github.com/gunjandatta/sprest-fabric-react-redux) project will include an example of incorporating it within a SharePoint Hosted Add-In.
