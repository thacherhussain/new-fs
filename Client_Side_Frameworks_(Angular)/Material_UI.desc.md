## Objectives

- Explain what Material UI is
- Explain why Material UI is important
- Describe Material UI's main layout, navigation, and form components
- Use Material UI to build a React user interface
- Use Inline Styling to modify the look of a React user interface

## What's Material UI?

Material-UI is a framework composed of React components that implement Google's Material Design. Similar to the Materialize CSS framework, it provides a useful skeleton of components that can be easily imported into any existing React application.

### Exercise

Turn to a partner and explain in your own words what the `material-ui` framework is. After about a minute, the instructor will cold-call the class and we'll all discuss.

## Why is Material UI important?

Available through NPM, the `material-ui` package gives developers access to well designed and aesthetically pleasing components. Since it is made for React, the pains of combining two frontend frameworks such as React and Materialize are alleviated. The Materialize framework also has its own data-binding system that changes presentation that often conflicts with React's one-way binding. **Important reminder:** well designed projects are equally important as an application's functionality.

### Exercise

In your notes, write down why `material-ui` is important. Focus on how it differs from the Materialize CSS framework and what issues it solves. We'll discuss as a class when everyone is done writing.

## How do you use Material UI to build a React user interface?

To start off with, in the desired project directory install `material-ui` from NPM.

```shell
npm install --save material-ui
```

Material-UI components use `react-tap-event-plugin` to listen for touch, tap, and click events. This dependency is temporary and will go away once the official React version is released.

```shell
npm install --save react-tap-event-plugin
```

Material-UI components require a theme to be provided. The quickest way to get up and running is by using the `MuiThemeProvider` to inject the theme into your application context.

`app.jsx`

```JavaScript
import App from 'components/app';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

ReactDOM.render(
  <MuiThemeProvider>
    <App />
  </MuiThemeProvider>,
  document.getElementById('app')
);
```

## What are important Material UI Components?

Before we create an app with Material UI, let's get to know its components. There are three types of components that Material UI uses:
1. Layout components
1. Navigation components
1. Data input components

### Layout Components

#### `Paper`

-

#### `Card`

-

#### `GridList`

-

#### `MenuItem`

-

### Navigation Components

#### `Tab` & `Tabs`

-

-

#### `Menu`

-

#### `Drawer`

- 

#### `Toolbar`, `ToolbarGroup`, `ToolbarSeparator`, `ToolbarTitle`

#### `AppBar`

### Data Input Components

#### `TextField`

#### `SelectField`

#### `RadioButton`

#### `Checkbox`

#### `Slider`

#### `DatePicker`

#### `RaisedButton`

Check out the sample app here:

`App.jsx`

```jsx
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import Card from 'material-ui/Card';
import FirstPage from './FirstPage';
import SecondPage from './SecondPage';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Toolbar from 'material-ui/Toolbar';
import {Tabs, Tab} from 'material-ui/Tabs';
import React from 'react';

const App = React.createClass({
  getInitialState(){
    return {
      open: false
    }
  },
  handleToggle(){
    this.setState({open: !this.state.open})
  },
  handleClose(){
    this.setState({open: false})
  },
  render() {
    const stylePaper = {
      padding: '0px',
      margin: '0px'
    };
    return (
      <Paper style={stylePaper}>
        <Toolbar style={{padding: '0', height: '100%', width: '100%'}}>
          <Tabs style={{width: '100%'}}>
            <Tab label="Tab One" value={0} />
            <Tab label="Tab Two" value={1} />
            <Tab label="Tab Three" value={2} />
          </Tabs>
        </Toolbar>
        <FirstPage></FirstPage>
      </Paper>
    )
  }
});
```

`FirstPage.jsx`

```jsx
import Slider from 'material-ui/Slider'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'
import DatePicker from 'material-ui/DatePicker'
import React from 'react'

// const stylesFirstPage = {
//   radioButton: {
//     display: inline
//   }
// }

const FirstPage = React.createClass({
  getInitialState(){
    return {
      sliderValue: 3,
      radioValue: null,
      dateValue: {
        toLocaleDateString(){
          return 'zilch'
        }
      }
    }
  },
  sliderChangeFunc(evt, val){
    this.setState({sliderValue: val})
  },
  radioChangeFunc(evt, val){
    this.setState({radioValue: val})
  },
  dateChangeFunc(ne, date){
    this.setState({dateValue: date})
  },
  render(){
    return <div id="firstPage">
      Use the slider below to answer the following question: on a scale of 1-5, how do you like this page? Current Answer: {this.state.sliderValue}
      <Slider
        min={1}
        max={5}
        step={1}
        defaultValue={this.state.sliderValue}
        onChange={this.sliderChangeFunc}
      />

      Are you excited about answering this question? Current Answer: {this.state.radioValue || 'Nothing yet'}
      {/* How do I separate the RadioButtonGroup into a separate element without breaking it? Ugh, by passing it back up the DOM chain */}
      <RadioButtonGroup name="yesNo" onChange={this.radioChangeFunc}>
        <RadioButton
          value="yes"
          label="Yes"
        />
        <RadioButton
          value="no"
          label="No"
        />
      </RadioButtonGroup>

      This is the latest date selection... Current Answer: {this.state.dateValue.toLocaleDateString()}
      {/* for DatePicker, hintText (or floatingLabelText or id) is necessary to avoid a warning */}
      <DatePicker
        onChange={this.dateChangeFunc}
        hintText={'Pick a date'}
      />

    </div>
  }
})

export default FirstPage
```

## How do you use Ryan Sobol's Brunch application skeleton with Material-UI?

To start off with, create a new project that includes React, Brunch, and Material-UI and installs all of its dependencies.

```shell
brunch new path/to/app --skeleton ryansobol/with-react-material
```

Watch the project for changes and launch an HTTP server.

```shell
npm start
```

Open the application in your default browser.

```shell
open http://localhost:8000/
```

## Inline Styling

- Material UI's styles are baked into it
- Right now, there are 2 ways to change CSS styles for a Material UI component:
  1. Use inline styling
  2. Use CSS styling with `!important` overrides for each property (NOTE: this is not the case for React components in general - you do not need to use `!important` for CSS styles to work)
- Inline styles that target the root element of a component (the all encompassing element, usually a div) use the `style` prop; For nested elements of a component, there are props that end with `Style` (e.g. `iconStyle`, `labelStyle`, etc.).
- For inline styles that take a color value, Material UI has a [list of variables](http://www.material-ui.com/#/customization/colors) that act as more intuitive color names than hex color values. Feel free to use them wherever you otherwise would use a hex color value.

General principles of inline styling:
- Create an object where the object properties correspond to an component's CSS properties
- When you assign a Javascript number primitive to a property (e.g. `{borderRadius: 2}`, NOT `{borderRadius: '2'}`, which uses a string), React automatically registers it as a pixel (`px`) value.
- Replace semi-colons with commas
- For properties, change kebab-case to camelCase
- You can use `props` to customize the object per component instance

## Assignment

## Resources

- [Brunch](http://brunch.io/)
- [Material-UI](http://www.material-ui.com/)
- [React](https://facebook.github.io/react/)