function AlloyWidget(config, node) {
  AlloyWidget.base(this, 'constructor');

  if (!node) {
    node = document.createElement(this.constructor.ELEMENT_NAME);

    // The new element will already have created a widget for itself,
    // so use it instead of preparing another one.
    node.widget.setAttrs(config);
    return node.widget;
  }

  this.node = node;
  this.config_ = config;

  this.initAttrs_();
  this.setAttrs(this.config_);

  this.init();
}
lfr.inherits(AlloyWidget, lfr.EventEmitter);

AlloyWidget.ATTRS = {};

AlloyWidget.ELEMENT_NAME = 'div';

AlloyWidget.HTML_PARSER = {};

AlloyWidget.prototype.attached = function() {
  if (!this.rendered_) {
    this.initHtmlParser_();

    this.renderUI();
    this.bindUI();

    this.rendered_ = true;
  }
};

AlloyWidget.prototype.attributeChanged = function(attrName, oldVal, newVal) {
    this.emit(attrName + 'Change', {
        oldVal: oldVal,
        newVal: newVal
    });
};

AlloyWidget.prototype.bindUI = function() {};

AlloyWidget.prototype.init = function() {};

AlloyWidget.prototype.initAttrs_ = function() {
  var attrs = this.constructor.ATTRS;

  this.state_ = new AlloyAttributes(attrs, this);

  var attrNames = this.getAttrNames();
  for (var i = 0; i < attrNames.length; i++) {
    this.initAttr_(attrNames[i]);
    this.initAttrNode_(attrNames[i]);
  }
};

AlloyWidget.prototype.initAttr_ = function(name) {
  var self = this;

  Object.defineProperty(this, name, {
    get: function() {
        return self.node[name];
    },

    set: function(val) {
        self.node[name] = val;
    }
  });
};

AlloyWidget.prototype.initAttrNode_ = function(name) {
  var self = this;

  Object.defineProperty(this.node, name + '_', {
    get: function() {
      return self.state_[name];
    },

    set: function(val) {
      if (val !== self.state_[name]) {
        self.state_[name] = val;
      }
    }
  });
};

AlloyWidget.prototype.initHtmlParser_ = function() {
  var parserInfo = this.constructor.HTML_PARSER || {};
  var parserAttrNames = Object.keys(parserInfo);

  for (var i = 0; i < parserAttrNames.length; i++) {
    var name = parserAttrNames[i];
    if (this.state_.hasDefaultValue(name)) {
      if (typeof parserInfo[name] === 'string') {
        var node = this.node.querySelector(parserInfo[name]);
        if (node) {
          this[name] = node;
        }
      }
    }
  }
};

AlloyWidget.prototype.getAttrNames = function() {
  return Object.keys(this.constructor.ATTRS);
};

AlloyWidget.prototype.render = function(container) {
  container.appendChild(this.node);
  return this;
};

AlloyWidget.prototype.renderUI = function() {};

AlloyWidget.prototype.set = function(name, value) {
  // TODO: Need to deep clone objects and arrays.
  this[name] = value;
};

AlloyWidget.prototype.setAttrs = function(config) {
  config = config || {};

  for (var key in config) {
    if (config.hasOwnProperty(key)) {
      this.set(key, config[key]);
    }
  }
};
