/**
 * The Node Scroll Checkpoint Utility - Execute a function whenever you scroll to an element.
 *
 * @module aui-node-checkpoints
 */

var Lang = A.Lang,

    isNumber = Lang.isNumber,

    isBody = function(node) {
        return A.getBody().compareTo(node);
    };

A.Checkpoint = A.Base.create('checkpoint', A.Base, [], {
    /**
     * Lifecycle method, invoked during construction. Sets up attributes
     * and binds events.
     *
     * @method initializer
     */
    initializer: function() {
        var instance = this;

        instance.BODY = A.getBody();

        instance._axis = instance.get('axis');
        instance._callback = instance.get('callback');
        instance._context = instance.get('_context');
        instance._enabled = instance.get('enabled');
        instance._node = instance.get('node');
        instance._offset = instance.get('offset');
        instance._triggerAtTheEnd = instance.get('triggerAtTheEnd');

        instance._scrollEvent = {
            vertical: instance._node.get('scrollTop'),
            horizontal: instance._node.get('scrollLeft')
        };

        instance.bindResizeUI();

        instance.bindScrollUI();

        instance._handles = [instance._resizeHandler, instance._scrollHandler];
    },

    /**
     * Destroy lifecycle method. Invokes destructors for the class hierarchy.
     *
     * @method destroy
     */
    destroy: function() {
        var instance = this;

        A.Array.invoke(instance._handles, 'detach');
    },

    /**
     * Binds refresh checkpoint method to the resize/resize:end events.
     *
     * @method bindResizeUI
     */
    bindResizeUI: function() {
        var instance = this;

        var node = instance._node;

        var refreshFn = A.bind(instance.refresh, instance);

        var resizeHandler;

        if (isBody(node)) {
            resizeHandler = node.on('resize', A.debounce(refreshFn, instance.get('resizeDelay')));
        }
        else {
            resizeHandler = node.on('resize:end', refreshFn);
        }

        instance._resizeHandler = resizeHandler;
    },

    /**
     * Sets up scroll event handlers depending on axis and triggerAtTheEnd.
     *
     * @method bindScrollUI
     */
    bindScrollUI: function() {
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
    },

    /**
     * Disables the node checkpoint.
     *
     * @method disable
     */
    disable: function() {
        var instance = this;

        instance._enabled = false;
    },

    /**
     * Enables the node checkpoint.
     *
     * @method enable
     */
    enable: function() {
        var instance = this;

        instance._enabled = true;

        instance.refresh();
    },

    /**
     * Gets the context associated with the node.
     *
     * @method getContext
     * @return {Object} Context object
     */
    getContext: function() {
        var instance = this;

        return instance._context;
    },

    /**
     * Gets the node being used as the trigger for the checkpoint.
     *
     * @method getNode
     * @return {Node}
     */
    getNode: function() {
        var instance = this;

        return instance._node;
    },

    /**
     * Gets the offset associated with the checkpoint.
     *
     * @method getOffset
     * @return {Number}
     */
    getOffset: function() {
        var instance = this;

        return instance._offset;
    },

    /**
     * Checks if the checkpoint has been reached within
     * the scroll context.
     *
     * @method reachedCheckpoint
     * @return {Boolean}
     */
    reachedCheckpoint: function() {
        var instance = this;

        var scrollPosition = instance._getScrollPosition();

        var triggerPosition = instance._getTriggerPosition();

        return (scrollPosition >= triggerPosition);
    },

    /**
     * Refreshes the trigger position and checks if it has been
     * reached.
     *
     * @method refresh
     */
    refresh: function() {
        var instance = this;

        if (instance._triggerPosition) {
            delete instance._triggerPosition;
        }

        instance._reachedCheckpoint = instance.reachedCheckpoint();
    },

    /**
     * Sets the offset for the node.
     *
     * @method setOffset
     * @param {Number} offset Represents the offset to be used when calculating node position.
     */
    setOffset: function(offset) {
        var instance = this;

        instance._offset = offset;
    },

    /**
     * Checks if the checkpoint node has been crossed.
     *
     * @method _crossed
     * @return {Boolean}
     * @protected
     */
    _crossed: function() {
        var instance = this;

        var reachedCheckpoint = instance.reachedCheckpoint();

        var crossed = (reachedCheckpoint !== instance._reachedCheckpoint);

        instance._reachedCheckpoint = reachedCheckpoint;

        return crossed;
    },

    /**
     * Gets the direction of the scroll vd on the scrollEvent.
     *
     * @method _getEventScrollDirection
     * @return {String}
     * @protected
     */
    _getEventScrollDirection: function() {
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
    },

    /**
     * Gets the latest scroll position based on the axis and
     * scroll event.
     *
     * @method _getScrollPosition
     * @return {Number} Ending position of the scroll event.
     * @protected
     */
    _getScrollPosition: function() {
        var instance = this;

        var scrollEvent = instance._scrollEvent;

        return (instance._axis === 'vertical') ? scrollEvent.scrollTop : scrollEvent.scrollLeft;
    },

    /**
     * Gets the current trigger position.
     *
     * @method _getTriggerPosition
     * @return {Number} Number representing trigger position based on axis.
     * @protected
     */
    _getTriggerPosition: function() {
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
    },

    /**
     * Executes the provided callback method.
     *
     * @method _triggerCallback
     * @protected
     */
    _triggerCallback: function() {
        var instance = this;

        var direction = instance._getEventScrollDirection();

        instance._callback(direction);
    }
}, {
    ATTRS: {
        /**
         * Defines the axis to use.
         *
         * @attribute axis
         * @type {String}
         */
        axis: {
            validator: function(val) {
                return Lang.isString(val) &&
                    (val === 'horizontal' ||
                        val === 'vertical');
            },
            value: 'vertical'
        },

        /**
         * Defines the axis to use.
         *
         * @attribute callback
         * @type {Function}
         */
        callback: {
            validator: Lang.isFunction
        },

        /**
         * Defines the context to use.
         *
         * @attribute _context
         * @type {Context}
         */
        _context: {
            validator: Lang.isObject
        },

        /**
         * Defines if the checkpoint is enabled.
         *
         * @attribute enabled
         * @type {Boolean}
         */
        enabled: {
            value: true
        },

        /**
         * Defines the checkpoint node.
         *
         * @attribute node
         * @type {Node}
         */
        node: {},

        /**
         * Defines the number of milliseconds to debounce the
         * window resize event if the node is the body.
         *
         * @attribute resizeDelay
         * @type {Number}
         */
        resizeDelay: {
            validator: isNumber,
            value: 400
        },

        /**
         * Defines if the checkpoint should trigger at the end.
         *
         * @attribute triggerAtTheEnd
         * @type {Boolean}
         */
        triggerAtTheEnd: {
            value: false
        },

        /**
         * Defines if the checkpoint should trigger at the end.
         *
         * @attribute triggerAtTheEnd
         * @type {Boolean}
         */
        offset: {
            validator: isNumber,
            value: 0
        }
    }
});

/**
 * A base class for `Context`.
 *
 * @class Context
 */
var Context = A.Base.create('context', A.Base, [], {

    /**
     * Lifecycle method, invoked during construction. Sets up attributes
     * and binds events.
     *
     * @method initializer
     */
    initializer: function() {
        var instance = this;

        instance._enabled = instance.get('enabled');
        instance._node = instance.get('node');
        instance._scrollDelay = instance.get('scrollDelay');

        instance.bindUI();
    },

    /**
     * Binds the UI scroll events.
     *
     * @method bindUI
     */
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


    /**
     * Destroy lifecycle method. Invokes destructors for the class hierarchy.
     *
     * @method destroy
     */
    destroy: function() {
        var instance = this;

        A.Array.invoke(instance._handles, 'detach');
    },

    /**
     * Enables the Context.
     *
     * @method enable
     */
    enable: function() {
        var instance = this;

        instance._enabled = true;
    },

    /**
     * Disables the Context.
     *
     * @method disable
     */
    disable: function() {
        var instance = this;

        instance._enabled = false;
    },

    /**
     * Gets the node belonging to the Context.
     *
     * @method getNode
     * @return {Node}
     */
    getNode: function() {
        var instance = this;

        return instance._node;
    }

}, {
    ATTRS: {
        /**
         * Defines if the Context is enabled.
         *
         * @attribute enabled
         * @type {Boolean}
         */
        enabled: {
            validator: Lang.isBoolean,
            value: true
        },

        /**
         * Defines the node that the context represents.
         *
         * @attribute enabled
         * @type {Boolean}
         */
        node: {
            getter: function(val) {
                return A.one(val) || A.getBody();
            }
        },

        /**
         * The number of milliseconds the scroll events are delayed.
         *
         * @attribute scrollDelay
         * @type {Number}
         */
        scrollDelay: {
            validator: isNumber,
            value: 0
        }
    },

    MAP_CONTEXTS: {},

    /**
     * Gets a Context instance based on node or creates a new
     * Context if none exists.
     *
     * @method get
     * @param {Object} options Object containing options for Context.
     * @return {Context}
     * @static
     */
    get: function(options) {
        var instance = this;

        options = options || {};

        var id = A.stamp(options.node);

        var context = Context.getById(id);

        if (!context) {
            context = new Context(options);

            instance.MAP_CONTEXTS[A.stamp(context.get('node'))] = context;
        }

        return context;
    },

    /**
     * Gets a Context instance based on node id.
     *
     * @method getById
     * @param {String} id Id of the node Belonging to the Context.
     * @return {Context}
     * @static
     */
    getById: function(id) {
        var instance = this;

        return instance.MAP_CONTEXTS[id];
    }
});

/**
 * Adds a checkpoint to the current node.  The callback will be executed
 * when the checkpoint is triggered.
 *
 * @method checkpoint
 * @param {Function} callback A function that will be invoked when the checkpoint is triggered.
 * @param {Object} options An object containing options for the checkpoint and context.
 */
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
            else {
                contextOptions = {};
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
    options.node = this;
    options.callback = callback;

    this.nodeCheckpoint = new A.Checkpoint(options);
};

/**
 * Adds a checkpoint to all Nodes in the list.  Duplicates the pattern
 * from 'Y.NodeList.prototype.plug'
 *
 * @method checkpoint
 * @return {NodeList} The instance this method was called on.
 */
A.NodeList.prototype.checkpoint = function() {
    var args = arguments;

    A.NodeList.each(this, function(node) {
        A.Node.prototype.checkpoint.apply(A.one(node), args);
    });

    return this;
};