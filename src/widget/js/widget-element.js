function AlloyElement(widgetFn) {
  prototype = {
    created: function() {
      if (!this.widget) {
        this.widget = new widgetFn({}, this);
      }

      this.widget.created();
    },

    ready: function() {
      this.widget.ready();
    },

    attached: function() {
      this.widget.attached();
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