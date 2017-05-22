/* global Element */
if (window.Element && !Element.prototype.closest) {
  Element.prototype.closest =
  function (s) {
    let i
    let matches = (this.document || this.ownerDocument).querySelectorAll(s)
    let el = this
    do {
      i = matches.length
      while (--i >= 0 && matches.item(i) !== el) {}
    } while ((i < 0) && (el = el.parentElement))
    return el
  }
}
