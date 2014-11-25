function AlloyCard(config, node) {
  return AlloyCard.base(this, 'constructor', config, node);
}
lfr.inherits(AlloyCard, AlloyWidget);

AlloyCard.ATTRS = {
  person: {
    value: {
      name: 'Maira Bello',
      picture: 'http://clipart-finder.com/data/preview/15-cute_girl.png'
    }
  },

  text: {
    getter: function(val) {
      return val + ' Yeah!';
    },
    setter: function(val) {
      return val + '!!!';
    },
    validator: function(val) {
      return typeof val === 'string';
    },
    value: 'I have talent',
    reflect: true
  },

  visible: {
    value: true,
    reflect: true
  }
};

AlloyCard.ELEMENT_NAME = 'aui-card';

AlloyCard.prototype.init = function() {
  this.on('visibleChange', lfr.bind(this.onVisibleChange_, this));
};

AlloyCard.prototype.renderUI = function() {
  console.log('renderUI');
};

AlloyCard.prototype.onVisibleChange_ = function() {
  this.node.hidden = !this.visible;
};
