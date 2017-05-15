const TabSwitcher = require('../../components/TabSwitcher')
let aSwitchers

document.addEventListener('DOMContentLoaded', (e) => {
  console.log('home!')
  aSwitchers = [].slice.call(document.querySelectorAll('.tabswitcher'))
  console.log(aSwitchers)
  aSwitchers.forEach((el, i, arr) => {
    arr[i] = new TabSwitcher(el).init()
  })
  console.log(aSwitchers)
})
