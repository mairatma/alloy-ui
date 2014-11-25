function AlloyWidget(config, node) {
  AlloyWidget.base(this, 'constructor');

  if (!node) {
    node = document.createElement(this.constructor.ELEMENT_NAME);

    if (node.widget) {
      // If the node was created immediately, it will already have created
      // and prepared a widget for itself, so let's use it instead or preparing
      // another.
      node.widget.setAttrs(config);
      return node.widget;
    }

    node.widget = this;
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

AlloyWidget.prototype.bindUI = function() {};

AlloyWidget.prototype.created = function() {
  var attrNames = this.getAttrNames();

  for (var i = 0; i < attrNames.length; i++) {
    this.initAttrNode_(attrNames[i]);
  }

  this.isCreated_ = true;
};

AlloyWidget.prototype.init = function() {};

AlloyWidget.prototype.initAttrs_ = function() {
  var attrs = this.constructor.ATTRS;

  this.state_ = new AlloyAttributes(attrs, this);
  this.state_.on('attributeChange', lfr.bind(this.onAttributeChange_, this));

  var attrNames = this.getAttrNames();
  for (var i = 0; i < attrNames.length; i++) {
    this.initAttr_(attrNames[i]);
  }
};

AlloyWidget.prototype.initAttr_ = function(name) {
  var self = this;

  Object.defineProperty(this, name, {
    get: function() {
      if (self.isCreated_) {
        // Gets the node's property directly so it will run its getter code
        // as well.
        return self.node[name];
      } else {
        return self.state_[name];
      }
    },

    set: function(val) {
      if (self.isCreated_) {
        // Sets the node's property directly so it may notify about changes.
        self.node[name] = val;
      } else {
        self.state_[name] = val;
      }
    }
  });
};

AlloyWidget.prototype.initAttrNode_ = function(name) {
  var self = this;

  if (!this.state_.hasDefaultValue(name)) {
    // If this the current value is not the default, set it here now so the
    // change can reflect in the node's attributes.
    this.node[name] = this[name];
  }

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

AlloyWidget.prototype.onAttributeChange_ = function(event) {
  this.emit(event.attrName + 'Change', {
    oldVal: event.oldVal,
    newVal: event.newVal
  });
};

AlloyWidget.prototype.ready = function() {
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
