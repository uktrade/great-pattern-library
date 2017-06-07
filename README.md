[![CircleCI](https://circleci.com/gh/uktrade/dit-pattern-library/tree/master.svg?style=svg)](https://circleci.com/gh/uktrade/dit-pattern-library/tree/master)
[![dependencies Status](https://david-dm.org/uktrade/dit-pattern-library/status.svg)](https://david-dm.org/uktrade/dit-pattern-library)
[![devDependencies Status](https://david-dm.org/uktrade/dit-pattern-library/dev-status.svg)](https://david-dm.org/uktrade/dit-pattern-library?type=dev)

# Great Pattern Library
## Overview
This Great Pattern Library (GPL) is a set of shared UI components and patterns used on the great.gov.uk sites.

The main goals of this library are to:

* showcase shared UI components
* give examples of these components in the context of multiple design patterns.

The library should make it easy for developers to reuse these components in other projects.

The Great Pattern Library takes on some of the priciples of [Atomic Design](http://atomicdesign.bradfrost.com/).

### TODO

* find a way to distribute versioned components so that changes can be made in a way that does not break existing sites (i.e. frontend micro-architecture)

### Demo
#### Latest release
A live demo can be seen here: https://dit-styleguide.herokuapp.com/
#### Development
The staging URL for this pattern library can be found here: https://great-pattern-library-staging.cloudapps.digital/

### Installation

    npm install

### Usage
#### Development
    npm run develop

Then in your web browser open this URL:  <http://localhost:5000/>

This command will run ```node index.js``` which runs the express server follwed by the default ```gulp```command.

The default ```gulp``` command does the following:
* builds the frontend assets
* runs browsersync
* rebuilds assets on changes in the source code
* reloads page automatically on changes to the source code.

Browsersync also syncs UI interactions across multiple browsers which helps which cross device testing.


#### Production
    npm run build && npm start

#### Run tests

    npm test

### Designs

1. Signed in state:

![](docs/images/signed-in-state.png)


2. Signed out state:

![](docs/images/signed-out-state.png)
