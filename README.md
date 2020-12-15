# AndyH-AutoComplete

This is a simple Auto Complete component written in Vue JS.

![ScreenShot](https://raw.github.com/andy3471/andyh-autocomplete/master/docs/img/autocomplete-default.jpg)

## Install

Install with NPM with:

    npm install andyh-autocomplete

Import the component into your Vue App:

    import AndyHAutoComplete from 'andyh-autocomplete'
    ...

    export default {
        ...
        components: {
            'auto-complete': AndyHAutoComplete
        }
    }

Use the Component with:

    <auto-complete></auto-complete>

## Data Binding

You can use the Date Picker with V-model to your own data

    <auto-complete v-model="text"></auto-complete>

## Props

### URL (Required)

You must define where to fetch the results from. The component will append the text input to the URL, so for example:

    <auto-complete :url="https://somewebsite.com/object/"></auto-complete>

Would query the URL https://somewebsite.com/object/apples, if you have 'apples' typed in the search. This is what populates the dropdown list of search options. This server should return an array of search results, formatted in JSON.

### Name (Optional)

You can give the input a name with the name prop

    <auto-complete :name="FruitSearch"></auto-complete>

### ID (Optional)

You can give the input an ID with the ID prop

    <auto-complete :id="FruitSearch"></auto-complete>

### Placeholder (Optional)

You can define the placeholder text with the placeholder prop

    <auto-complete :placeholder="Search for a type of fruit"></auto-complete>

### Classes (Optional)

You can define additional classes to the textbox, to add styling with the Classes prop

    <auto-complete :classes="form-control"></auto-complete>

### Required (Optional)

You can define the input as required with the required prop.

    <auto-complete :required="true"></auto-complete>


## Setting the accent color

You can set the accent color with the following prop

    <auto-complete :color="#fec107"></auto-complete>