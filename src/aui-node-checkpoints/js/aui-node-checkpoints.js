/**
 * The Node Scroll Checkpoint Utility - Execute a function whenever you scroll to an element.
 *
 * @module aui-node-checkpoints
 */

var BODY = A.getBody();

var MAP_CONTEXTS = {};

var isBody = function(node) {
    return (node === BODY);
};

var Checkpoint = function() {
    this.init.apply(this, arguments);
};

Checkpoint.DEFAULTS = {
    axis: 'vertical',
    enabled: true,
    triggerAtTheEnd: false,
    offset: 0
};

Checkpoint.prototype.init = function(node, callback, options) {
    var instance = this;

    A.mix(options, Checkpoint.DEFAULTS);

    instance._axis = options.axis;
    instance._callback = callback;
    instance._context = options._context;
    instance._enabled = options.enabled;
    instance._node = node;
    instance._offset = options.offset;
    instance._triggerAtTheEnd = options.triggerAtTheEnd;

    instance._scrollEvent = {
        vertical: node.get('scrollTop'),
        horizontal: node.get('scrollLeft')
    };

    instance.bindResizeUI();

    instance.bindScrollUI();

    instance._handles = [instance._resizeHandler, instance._scrollHandler];
};

Checkpoint.prototype.bindResizeUI = function() {
    var instance = this;

    var node = instance._node;

    var refreshFn = A.bind(instance.refresh, instance);

    var resizeHandler;

    if (isBody(node)) {
        resizeHandler = node.on('resize', A.debounce(refreshFn, 400));
    }
    else {
        resizeHandler = node.on('resize:end', refreshFn);
    }

    instance._resizeHandler = resizeHandler;
};

Checkpoint.prototype.bindScrollUI = function() {
    var instance = this;

    var scrollHandler;

    if (instance._triggerAtTheEnd) {
        scrollHandler = instance._context.on(
            (instance._axis === 'vertical') ? 'scrollToBottom' : 'scrollToRight',
            function(event) {
                if (instance._enabled) {
                    instance._scrollEvent = event;

                    instance._triggerCallback();
                }
            },
            instance
        );
    }
    else {
        instance._reachedCheckpoint = instance.reachedCheckpoint();

        scrollHandler = instance._context.on(
            'scroll',
            function(event) {
                if (instance._enabled) {
                    instance._scrollEvent = event;

                    if (instance._crossed()) {
                        instance._triggerCallback();
                    }
                }
            },
            instance
        );
    }

    instance._scrollHandler = scrollHandler;
};

Checkpoint.prototype._crossed = function() {
    var instance = this;

    var reachedCheckpoint = instance.reachedCheckpoint();

    var crossed = (reachedCheckpoint !== instance._reachedCheckpoint);

    instance._reachedCheckpoint = reachedCheckpoint;

    return crossed;
};

Checkpoint.prototype._getEventScrollDirection = function() {
    var instance = this;

    var scrollEvent = instance._scrollEvent;

    var direction;

    if (scrollEvent.isScrollDown) {
        direction = 'down';
    }
    else if (scrollEvent.isScrollLeft) {
        direction = 'left';
    }
    else if (scrollEvent.isScrollRight) {
        direction = 'right';
    }
    else if (scrollEvent.isScrollUp) {
        direction = 'up';
    }

    return direction;
};

Checkpoint.prototype.destroy = function() {
    var instance = this;

    A.Array.invoke(instance._handles, 'detach');
};

Checkpoint.prototype.disable = function() {
    var instance = this;

    instance._enabled = false;
};

Checkpoint.prototype.enable = function() {
    var instance = this;

    instance._enabled = true;

    instance.refresh();
};

Checkpoint.prototype.getContext = function() {
    var instance = this;

    return instance._context;
};

Checkpoint.prototype.getNode = function() {
    var instance = this;

    return instance._node;
};

Checkpoint.prototype.getOffset = function() {
    var instance = this;

    return instance._offset;
};

Checkpoint.prototype.reachedCheckpoint = function() {
    var instance = this;

    var scrollPosition = instance._getScrollPosition();

    var triggerPosition = instance._getTriggerPosition();

    return (scrollPosition >= triggerPosition);
};

Checkpoint.prototype.refresh = function() {
    var instance = this;

    if (instance._triggerPosition) {
        delete instance._triggerPosition;
    }

    instance._reachedCheckpoint = instance.reachedCheckpoint();
};

Checkpoint.prototype.setOffset = function(offset) {
    var instance = this;

    instance._offset = offset;
};

Checkpoint.prototype._getScrollPosition = function() {
    var instance = this;

    var scrollEvent = instance._scrollEvent;

    return (instance._axis === 'vertical') ? scrollEvent.scrollTop : scrollEvent.scrollLeft;
};

Checkpoint.prototype._getTriggerPosition = function() {
    var instance = this;

    var triggerPosition = instance._triggerPosition;

    if (!triggerPosition) {
        var offsetEdgeNameByAxis = (instance._axis === 'vertical') ? 'offsetTop' : 'offsetLeft';

        var offset = instance._node.get(offsetEdgeNameByAxis);

        var contextNode = instance._context.getNode();

        var contextNodeOffset = isBody(contextNode) ? 0 : contextNode.get(offsetEdgeNameByAxis);

        var optionalOffset = instance._offset;

        triggerPosition = offset - contextNodeOffset - optionalOffset;

        instance._triggerPosition = triggerPosition;
    }

    return triggerPosition;
};

Checkpoint.prototype._triggerCallback = function() {
    var instance = this;

    var direction = instance._getEventScrollDirection();

    instance._callback(direction);
};

var Context = function(config) {
    Context.superclass.constructor.apply(this, arguments);
};

Context.get = function(options) {
    options = options || {};

    options = A.mix(options, Context.DEFAULTS);

    var id = A.stamp(options.node);

    var context = Context.getById(id);

    if (!context) {
        context = new Context(options);

        MAP_CONTEXTS[id] = context;
    }

    return context;
};

Context.getById = function(id) {
    return MAP_CONTEXTS[id];
};

Context.DEFAULTS = {
    enabled: true,
    node: BODY,
    scrollDelay: 0
};

A.extend(
    Context,
    A.Base, {
        init: function(options) {
            var instance = this;

            instance._enabled = options.enabled;
            instance._node = options.node;
            instance._offset = {};
            instance._scrollDelay = options.scrollDelay;

            instance.bindUI();
        },

        bindUI: function() {
            var instance = this;

            var node = instance._node;

            node.plug(
                A.Plugin.ScrollInfo, {
                    scrollDelay: instance._scrollDelay
                }
            );

            var scrollHandler = node.scrollInfo.on(
                'scroll',
                function(event) {
                    if (instance._enabled) {
                        instance.fire('scroll', event);
                    }
                },
                instance
            );

            var scrollBottomHandler = node.scrollInfo.on(
                'scrollToBottom',
                function(event) {
                    if (instance._enabled) {
                        instance.fire('scrollToBottom', event);
                    }
                },
                instance
            );

            var scrollRightHandler = node.scrollInfo.on(
                'scrollToRight',
                function(event) {
                    if (instance._enabled) {
                        instance.fire('scrollToRight', event);
                    }
                },
                instance
            );

            instance._handles = [scrollHandler, scrollBottomHandler, scrollRightHandler];
        },

        destroy: function() {
            var instance = this;

            A.Array.invoke(instance._handles, 'detach');
        },

        enable: function() {
            var instance = this;

            instance._enabled = true;
        },

        disable: function() {
            var instance = this;

            instance._enabled = false;
        },

        getNode: function() {
            var instance = this;

            return instance._node;
        }
    }
);

A.Node.prototype.checkpoint = function(callback, options) {
    options = options || {};

    var context = options._context;

    if (!context) {
        var contextOptions = options.context;

        if (contextOptions) {
            var contextNode = A.one(contextOptions);

            if (contextNode) {
                contextOptions = {
                    node: contextNode
                };
            }

            if (options.scrollDelay) {
                contextOptions.scrollDelay = options.scrollDelay;
            }

        }
        else if (options.scrollDelay) {
            contextOptions = {
                scrollDelay: options.scrollDelay
            };
        }

        context = Context.get(contextOptions);
    }

    options._context = context;

    this.nodeCheckpoint = new Checkpoint(this, callback, options);
};

// Duplicate the pattern from `Y.NodeList.prototype.plug`
A.NodeList.prototype.checkpoint = function() {
    var args = arguments;

    A.NodeList.each(this, function(node) {
        A.Node.prototype.checkpoint.apply(A.one(node), args);
    });

    return this;
};

A.Node.Checkpoint = Checkpoint;