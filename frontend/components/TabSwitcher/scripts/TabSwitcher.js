const {extend} = require('lodash')
const EventEmitter = require('eventemitter3')
const DOM_EL_CONTAINER = '.tabswitcher'
const CSS_CONTAINER = DOM_EL_CONTAINER.replace('.', '')
const CSS_CONTAINER_INITIALISED = `${CSS_CONTAINER}--initialised`
const CSS_BTN = `${CSS_CONTAINER}__btn`
const CSS_BTN_ACTIVE = `${CSS_BTN}--active`
const CSS_PANE = `${CSS_CONTAINER}__pane`
const CSS_PANE_ACTIVE = `${CSS_PANE}--active`
const DATA_ATTR_PANE = 'data-tabswitcher-pane'
const state = ['example', 'markup']
const nodeListToArray = function (nodeList) {
  return [].slice.call(nodeList)
}
function TabSwitcher (container = document.querySelector(DOM_EL_CONTAINER)) {
  // initialise EventEmitter
  EventEmitter.call(this)
  this.domEl = container
  this.domElPanes = nodeListToArray(container.querySelectorAll(`.${CSS_PANE}`))
  this.activePane = state[0]
}

TabSwitcher.prototype = extend(EventEmitter.prototype, {
  onTabClick: function (e) {
    let {target} = e
    if (target.classList.contains(CSS_BTN) || target.closest(CSS_BTN)) {
      let nextActivePane = target.getAttribute(DATA_ATTR_PANE)
      if (state.indexOf(nextActivePane) < 0) {
        throw new Error(`unhandled TabSwitcher state: ${nextActivePane}`)
      }
      this.activePane = nextActivePane
      this.emit('tabchange', {activePane: this.activePane})
    }
  },
  setActivePane: function () {
    this.domElPanes.forEach((el, i) => {
      let btn = this.domEl.querySelector(`.${CSS_BTN}[${DATA_ATTR_PANE}=${el.getAttribute(DATA_ATTR_PANE)}]`)
      if (el.getAttribute(DATA_ATTR_PANE) === this.activePane) {
        el.classList.add(CSS_PANE_ACTIVE)
        btn.classList.add(CSS_BTN_ACTIVE)
      } else {
        el.classList.remove(CSS_PANE_ACTIVE)
        btn.classList.remove(CSS_BTN_ACTIVE)
      }
    })
  },
  init: function () {
    this.domEl.addEventListener('click', this.onTabClick.bind(this))
    this.domEl.classList.add(CSS_CONTAINER_INITIALISED)
    this.on('tabchange', function (e) {
      this.setActivePane(e.activePane)
    }.bind(this))
    // set display
    this.setActivePane()
    return this
  }
})

module.exports = TabSwitcher
