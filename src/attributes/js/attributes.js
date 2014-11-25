function AlloyAttributes(attrsConfig, context) {
  AlloyWidget.base(this, 'constructor');

  this.attrConfigs_ = attrsConfig;
  this.context_ = context || this;
  this.addAttrs();
}

lfr.inherits(AlloyAttributes, lfr.EventEmitter);

AlloyAttributes.prototype.addAttrs = function() {
  this.attrValues_ = {};
  this.defaultValues_ = {};

  for (var key in this.attrConfigs_) {
    if (this.attrConfigs_.hasOwnProperty(key)) {
      this.addAttr(key);
    }
  }
};

AlloyAttributes.prototype.addAttr = function(name) {
  var self = this;

  Object.defineProperty(this, name, {
    get: function() {
      return self.getAttr_(name);
    },

    set: function(val) {
      var oldVal = self.attrValues_[name];
      self.setAttr_(name, val);

      if (self.attrValues_[name] !== oldVal) {
        self.emit('attributeChange', {
          attrName: name,
          oldVal: oldVal,
          newVal: self.attrValues_[name]
        });
      }
    }
  });

  if (this.attrConfigs_[name].valueFn) {
    this[name] = this.callFn_(this.attrConfigs_[name].valueFn);
  } else {
    this[name] = this.attrConfigs_[name].value;
  }
  this.defaultValues_[name] = true;
}

AlloyAttributes.prototype.getAttr_ = function(name) {
  var config = this.attrConfigs_[name];
  var val = this.attrValues_[name]

  if (config.getter) {
    val = config.getter.call(this.context_, val);
  }

  return val;
}

AlloyAttributes.prototype.hasDefaultValue = function(name) {
  return this.defaultValues_[name];
};

AlloyAttributes.prototype.callFn_ = function(fn) {
  var args = Array.prototype.slice.call(arguments, 1);

  if (typeof fn === 'string') {
    return this.context_[fn].apply(this.context_, args);
  } else {
    return fn.apply(this.context_, args);
  }
}

AlloyAttributes.prototype.setAttr_ = function(name, val) {
  var config = this.attrConfigs_[name];

  if (config.validator && !this.callFn_(config.validator, val)) {
    return;
  }

  if (config.setter) {
    val = this.callFn_(config.setter, val);
  }

  this.attrValues_[name] = val;
  this.defaultValues_[name] = false;
}
