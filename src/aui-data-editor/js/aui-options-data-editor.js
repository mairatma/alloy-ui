/**
 * The Options Data Editor Component
 *
 * @module aui-options-data-editor
 */

var CSS_EDITOR = A.getClassName('options', 'data', 'editor'),
    CSS_EDITOR_ADD = A.getClassName('options', 'data', 'editor', 'add'),
    CSS_EDITOR_OPTION = A.getClassName('options', 'data', 'editor', 'option'),
    CSS_EDITOR_OPTION_HANDLE = A.getClassName('options', 'data', 'editor', 'option', 'handle'),
    CSS_EDITOR_OPTION_REMOVE = A.getClassName('options', 'data', 'editor', 'option', 'remove'),
    CSS_EDITOR_OPTION_TEXT = A.getClassName('options', 'data', 'editor', 'option', 'text'),
    CSS_EDITOR_OPTIONS = A.getClassName('options', 'data', 'editor', 'options');

/**
 * A base class for Options Data Editor.
 *
 * @class A.OptionsDataEditor
 * @extends A.DataEditor
 * @param {Object} config Object literal specifying widget configuration
 *     properties.
 * @constructor
 */
A.OptionsDataEditor = A.Base.create('options-data-editor', A.DataEditor, [], {
    TPL_EDITOR: '<div class="' + CSS_EDITOR + '">' +
        '<div class="' + CSS_EDITOR_OPTIONS + '"></div>' +
        '<button class="' + CSS_EDITOR_ADD + '">Add Option</button></div>',
    TPL_EDITOR_OPTION: '<div class="' + CSS_EDITOR_OPTION + '">' +
        '<span class="' + CSS_EDITOR_OPTION_HANDLE + ' glyphicon glyphicon-sort"></span>' +
        '<input class="' + CSS_EDITOR_OPTION_TEXT + ' type="text"" value="{text}"></input>' +
        '<button class="' + CSS_EDITOR_OPTION_REMOVE + '">X</button></div>',

    /**
     * Constructor for the `A.OptionsDataEditor`. Lifecycle.
     *
     * @method initializer
     * @protected
     */
    initializer: function() {
        var node = this.get('node');

        node.one('.' + CSS_EDITOR_ADD).after('click', A.bind(this._afterClickAddButton, this));
        node.delegate('click', A.bind(this._onClickRemoveButton, this), '.' + CSS_EDITOR_OPTION_REMOVE);

        this._setUpDrag();
    },

    /**
     * Fired after the button for adding options is clicked.
     *
     * @method _afterClickAddButton
     * @protected
     */
    _afterClickAddButton: function() {
        var optionsContainer = this.get('node').one('.' + CSS_EDITOR_OPTIONS);

        optionsContainer.append(A.Node.create(A.Lang.sub(this.TPL_EDITOR_OPTION, {
            text: ''
        })));
    },

    /**
     * Gets the edited value of the data from the editor.
     *
     * @method _getEditedValue
     * @protected
     */
    _getEditedValue: function() {
        var editedValue = [],
            options = this.get('node').all('.' + CSS_EDITOR_OPTION);

        options.each(function(optionNode) {
            editedValue.push(optionNode.one('.' + CSS_EDITOR_OPTION_TEXT).get('value'));
        });

        return editedValue;
    },

    /**
     * Fired when a button for removing an option is clicked.
     *
     * @method _onClickRemoveButton
     * @param {EventFacade} event
     * @protected
     */
    _onClickRemoveButton: function(event) {
        var optionNode = event.currentTarget.ancestor('.' + CSS_EDITOR_OPTION);

        optionNode.remove(true);
    },

    /**
     * Fired after the `drag:drag` event is triggered.
     *
     * @method _onDrag
     * @param  {EventFacade} event
     * @protected
     */
    _onDrag: function(event) {
        if (event.target.lastXY[1] < this._lastY) {
            this._draggingUp = true;
        } else {
            this._draggingUp = false;
        }

        this._lastY = event.target.lastXY[1];
    },

    /**
     * Fired after the `drag:over` event is triggered.
     *
     * @method _onDragOver
     * @param  {EventFacade} event
     * @protected
     */
    _onDragOver: function(event) {
        var dragNode = event.drag.get('node'),
            dropNode = event.drop.get('node');

        if (!this._draggingUp) {
            dropNode = dropNode.get('nextSibling');
        }

        event.drop.get('node').get('parentNode').insertBefore(dragNode, dropNode);
        event.drop.sizeShim();
    },

    /**
     * Sets up everything needed for dragging options to different positions.
     *
     * @method _setUpDrag
     * @protected
     */
    _setUpDrag: function() {
        this._delegateDrag = new A.DD.Delegate({
            container: this.get('node'),
            handles: ['.' + CSS_EDITOR_OPTION_HANDLE],
            nodes: '.' + CSS_EDITOR_OPTION,
            target: true
        });
        this._delegateDrag.dd.plug(A.Plugin.DDConstrained, {
            stickY: true
        });
        this._delegateDrag.dd.plug(A.Plugin.DDProxy, {
            cloneNode: true,
            moveOnEnd: false
        });

        this._delegateDrag.after('drag:drag', A.bind(this._onDrag, this));
        this._delegateDrag.after('drag:over', A.bind(this._onDragOver, this));
    },

    /**
     * Updates the ui according to the value of the `value` attribute.
     *
     * @method _uiSetValue
     * @param {Array} value
     * @protected
     */
    _uiSetOriginalValue: function(value) {
        var instance = this,
            optionNode,
            optionsContainer = this.get('node').one('.' + CSS_EDITOR_OPTIONS);

        optionsContainer.empty();
        A.Array.each(value, function(option) {
            optionNode = A.Node.create(A.Lang.sub(instance.TPL_EDITOR_OPTION, {
                text: option
            }));
            optionsContainer.append(optionNode);
        });
    }
}, {
    /**
     * Static property used to define the default attribute configuration
     * for the `A.OptionsDataEditor`.
     *
     * @property ATTRS
     * @type Object
     * @static
     */
    ATTRS: {
        /**
         * The value after edition.
         *
         * @attribute editedValue
         * @default []
         * @type Boolean
         */
        editedValue: {
            getter: '_getEditedValue',
            value: []
        },

        /**
         * The value to be edited.
         *
         * @attribute originalValue
         * @default []
         * @type Array
         */
        originalValue: {
            value: []
        }
    }
});
