require('../utils/images')
const Prism = require('prismjs')
const TabSwitcher = require('../../components/TabSwitcher')
let aSwitchers

document.addEventListener('DOMContentLoaded', (e) => {
  // get all Tab Switcher containers
  aSwitchers = [].slice.call(document.querySelectorAll('.tabswitcher'))
  aSwitchers.forEach((el, i, arr) => {
    // initialise all Tab Switchers on the page
    arr[i] = new TabSwitcher(el).init()
  })
  // initialise syntax highlighting
  Prism.highlightAll(false, (e) => {
  })
})
