function AlloyElement(widgetFn) {
  prototype = {
    created: function() {
        this.widget = new widgetFn({}, this);
    },

    attached: function() {
        this.widget.attached();
    },

    attributeChanged: function(attrName, oldVal, newVal) {
        this.widget.attributeChanged(attrName, oldVal, newVal);
    }
  };

  handleAttributes(prototype, widgetFn.ATTRS);

  Polymer(prototype);
}

function handleAttributes(prototype, attrs) {
  var publish = {};

  for (var attrName in attrs) {
    publish[attrName] = {
      // TODO: Need to deep clone objects and arrays.
      value: attrs[attrName].value,
      reflect: !!attrs[attrName].reflect
    };
  }

  prototype.publish = publish;
}