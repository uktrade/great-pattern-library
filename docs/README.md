[![CircleCI](https://circleci.com/gh/uktrade/great-pattern-library/tree/master.svg?style=svg)](https://circleci.com/gh/uktrade/great-pattern-library/tree/master)
[![dependencies Status](https://david-dm.org/uktrade/great-pattern-library/status.svg)](https://david-dm.org/uktrade/great-pattern-library)
[![devDependencies Status](https://david-dm.org/uktrade/great-pattern-library/dev-status.svg)](https://david-dm.org/uktrade/great-pattern-library?type=dev)

# Great Pattern Library
This Great Pattern Library (GPL) is a set of shared UI components and patterns used on the great.gov.uk sites.

The main goals of this library are to:

* showcase shared UI components
* give examples of these components in the context of multiple design patterns.

The library should make it easy for developers to reuse these components in other projects.

The Great Pattern Library takes on some of the priciples of [Atomic Design](http://atomicdesign.bradfrost.com/).

## TODO

- [ ] find a way to distribute versioned components so that changes can be made in a way that does not break existing sites (i.e. frontend micro-architecture)
- [ ] document release procedure
### Other teams backend
* IIGB - Node (Nunjucks)
* SSO - Python
* ExOpps - Ruby (HAML)
* ExRed - Python

## Demo
* Latest release: http://styleguide.uktrade.io/
* Staging (in dev): https://great-pattern-library-staging.herokuapp.com/
* Legacy (version 0.1.3): https://old-great-pattern-library.herokuapp.com/

## Installation

    npm install

## Usage
### Development
    npm run develop

Then in your web browser open this URL:  <http://localhost:5000/>

This command will run ```node index.js``` which runs the express server follwed by the default ```gulp```command.

The default ```gulp``` command does the following:
* builds the frontend assets
* runs browsersync
* rebuilds assets on changes in the source code
* reloads page automatically on changes to the source code.

Browsersync also syncs UI interactions across multiple browsers which helps which cross device testing.


### Production
    npm run build && npm start

### Run tests

    npm test

## Releases
This project uses the GitFlow branching strategy for git.

A description of the GitFlow strategy can be found here:

[https://www.atlassian.com/git/tutorials/comparing-workflows#gitflow-workflow](https://www.atlassian.com/git/tutorials/comparing-workflows#gitflow-workflow)

### Changelog
The log of changes for each release can be found in the [CHANGELOG.md](./CHANGELOG.md) file.

### Procedure
#### New feature
1. ```feature``` branch is created (from the ```develop``` branch) to carry out the work to complete the feature
2. A github pull request (PR) is created when the ```feature``` is ready to considered for merging back into the ```develop``` before code review.
3. Once the feature passes the code review and is approved the developer is able to merge their feature back into the ```develop``` branch.

#### Full release
1. When ready to make a new release (end of each sprint) create a release branch from the develop branch (i.e. ```release/1.0.1```) to begin the release process.
2. Inside the release branch add/amend documentation where necessary (including the [README.md](./README.md) and [CHANGELOG.md](./CHANGELOG.md) files).
3. Submit the release branch to a UAT environment for user testing to begin.
4. Once the release has passed user testing. The release branch can be merged into the master branch.
5. From the master branch both; update the version of the package.json file, and add a git tag with the release version number (```npm version``` command).
6. Update the [CHANGELOG.md](./CHANGELOG.md) file to reflect the new version (being sure that there is a new 'unreleased section' for the next release)



## Designs

1. Signed in state:

![](./images/signed-in-state.png)


2. Signed out state:

![](./images/signed-out-state.png)
