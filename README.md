## About

MkEditorJS is an interactive coding and markdown environment. You can write JavaScript and see it executed, as well as create comprehensive documentation using markdown.

## Overview

Using MkEditorJS you can:

- Click any text or code cell and edit it
- The code is all joined into one file, so if you define a variable in one cell, you can use it in all subsequent cells
- Use the built in `show` function to display any string, number, React component, or anything else. Simply pass the code you want to execute as an argument
- Reorder or delete any cells
- Save all code and documentation to a file on your local machine

## Install

To install and then run the current version, run the command:

```
$ npx mkeditorjs serve
```

## Usage

This code editor has a built in `show()` function. Write any JavaScript code and show the output in the preview window by passing it to `show` as an argument. Make sure to include the following module at the top of your first code cell for proper execution:

```
import { createRoot } from 'react-dom/client';
```

Any code or markdown created is saved into a file called `notebook.js`. You can load this file on startup, or write your changes to a different file, by running:

```
$ npx mkeditorjs serve <filename.js>
```
