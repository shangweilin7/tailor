class Tailor {
  constructor({ dom, width, height }) {
    this.dom = dom;
    this.width = width;
    this.height = height;
    this.tailoredKeepHeight = Array.from(this.dom.querySelectorAll(':scope > div:not(.tailored-wrapper)')).map(function(node) {
      return node.offsetHeight;
    }).reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    });
    this.tailoredWrapper = this.dom.querySelector('.tailored-wrapper');
    this.tailoredNodes = this.dom.querySelectorAll('.tailored-node');
    this.ragNodes = [];
    this.tailoredLastNodes = this.dom.querySelectorAll('.tailored-last');
    this.unusedHeight = this.height - (this.dom.offsetHeight - this.tailoredWrapper.offsetHeight);
  }

  run() {
    this.#createFixedSizeTailor();
    this.tailoredNodes.forEach((tailoredNode) => {
      if (this.nodeOffsetBottom(tailoredNode) <= this.unusedHeight) { return; }

      this.ragNodes.push(tailoredNode);
      tailoredNode.remove();
    }.bind(this));
    if (this.ragNodes.length > 0) { this.#createNodeTailorByRagNodes(); }
  }

  #createFixedSizeTailor() {
    const fixedSizeTailor = document.createElement('div');
    fixedSizeTailor.className = 'fixed-size-tailor';
    fixedSizeTailor.style.width = `${this.width}px`;
    fixedSizeTailor.style.height = `${this.height}px`;
    this.dom.parentNode.insertBefore(fixedSizeTailor, this.dom);
    fixedSizeTailor.appendChild(this.dom);
  }

  #createNodeTailorByRagNodes() {
    const newNodeTailor = this.dom.cloneNode(true),
          newTailoredNodes = newNodeTailor.querySelector('.tailored-wrapper');
    newTailoredNodes.querySelectorAll('.tailored-node').forEach((tailoredNode) => {
      tailoredNode.remove();
    });
    if (this.tailoredLastNodes.length > 0) {
      this.tailoredLastNodes.forEach((node) => { node.remove(); });
    }
    if (this.dom.querySelector('.tailored-first')) {
      newNodeTailor.querySelectorAll('.tailored-first').forEach((node) => { node.remove(); })
    }
    this.ragNodes.forEach((node) => { newTailoredNodes.appendChild(node); });
    this.dom.parentNode.parentNode.appendChild(newNodeTailor);
    new NodeTailor({ dom: newNodeTailor, width: this.width, height: this.height });
  }

  #nodeOffsetBottom(node) {
    return node.offsetTop - this.tailoredWrapper.offsetTop + node.offsetHeight;
  }
}
