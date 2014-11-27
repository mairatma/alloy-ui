function AlloyAlert(config, node) {
  return AlloyAlert.base(this, 'constructor', config, node);
}
lfr.inherits(AlloyAlert, AlloyWidget);

AlloyAlert.ATTRS = {
  bodyContent: {
    value: 'Your message here'
  },

  closeable: {
    value: true
  },

  closeableNode: {
    validator: 'validateCloseableNode_',
    value: null,
    valueFn: 'defaultCloseableNode_'
  },

  destroyOnHide: {
    value: false
  },

  visible: {
    value: true
  }
};

AlloyAlert.ELEMENT_NAME = 'aui-alert';

AlloyAlert.HTML_PARSER = {
  closeableNode: '.close'
};

AlloyAlert.prototype.defaultCloseableNode_ = function() {
  var node = document.createElement('button');
  node.setAttribute('type', 'button');
  node.setAttribute('class', 'close');
  node.innerHTML = 'x';

  return node;
};

AlloyAlert.prototype.init = function() {
  this.on('visibleChange', lfr.bind(this.onVisibleChange_, this));
  this.on('closeableChange', lfr.bind(this.onCloseableChange_, this));
  this.on('closeableNodeChange', lfr.bind(this.onCloseableNodeChange_, this));
};

AlloyAlert.prototype.renderUI = function() {
  this.uiSetCloseable_(this.closeable);
  this.uiSetCloseableNode_(this.closeableNode);
  this.uiSetVisible_(this.visible);
};

AlloyAlert.prototype.onCloseableChange_ = function() {
  this.uiSetCloseable_(this.closeable);
};

AlloyAlert.prototype.onCloseableNodeChange_ = function(event) {
  event.oldVal.remove();
  this.uiSetCloseableNode_(this.closeableNode);
};

AlloyAlert.prototype.onCloseClick_ = function() {
  if (this.closeable) {
    this.visible = false;
  }
};

AlloyAlert.prototype.onVisibleChange_ = function() {
  this.uiSetVisible_(this.visible);
};

AlloyAlert.prototype.uiSetCloseable_ = function(closeable) {
  var dismissableClass = 'alert-dismissable'
  if (closeable) {
    addClass(this.node, dismissableClass);

    if (this.closeableNode) {
      this.closeableNode.removeAttribute('hidden');
    }
  } else {
    removeClass(this.node, dismissableClass);

    if (this.closeableNode) {
      this.closeableNode.setAttribute('hidden', closeable);
    }
  }
};

AlloyAlert.prototype.uiSetCloseableNode_ = function(closeableNode) {
  if (closeableNode) {
    if (!closeableNode.parentElement) {
      this.node.appendChild(closeableNode);
    }

    this.closeableNode.addEventListener('click', lfr.bind(this.onCloseClick_, this));
  }
};

AlloyAlert.prototype.uiSetVisible_ = function(visible) {
  this.node.hidden = !visible;

  if (this.destroyOnHide) {
    this.node.remove();
  }
};

AlloyAlert.prototype.validateCloseableNode_ = function(val) {
  return val instanceof HTMLElement || val === null || val === undefined;
}

function addClass(node, cssClass) {
  node.className += ' ' + cssClass;
}

function removeClass(node, cssClass) {
  var index = node.className.indexOf(cssClass);
  if (index !== -1) {
    node.className = node.className.slice(0, index) + node.className.slice(index + cssClass.length);
  }
}
