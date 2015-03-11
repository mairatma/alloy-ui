/**
 * The Data Editor Component
 *
 * @module aui-data-editor
 */

var CSS_EDITOR = A.getClassName('data', 'editor'),
    CSS_EDITOR_CONTENT_INNER = A.getClassName('data', 'editor', 'content', 'inner'),

    TPL_EDITOR = '<div class="' + CSS_EDITOR + '"><label></label>' +
        '<div class="' + CSS_EDITOR_CONTENT_INNER + '"></div>' +
        '</div>';

/**
 * A base class for Data Editor. All data editors should extend from this.
 *
 * @class A.DataEditor
 * @extends A.Base
 * @param {Object} config Object literal specifying widget configuration
 *     properties.
 * @constructor
 */
A.DataEditor = A.Base.create('data-editor', A.Base, [], {
    TPL_EDITOR_CONTENT: '<div></div>',

    /**
     * Constructor for the `A.DataEditor`. Lifecycle.
     *
     * @method initializer
     * @protected
     */
    initializer: function() {
        var node = this.get('node');

        node.one('.' + CSS_EDITOR_CONTENT_INNER).setHTML(this.TPL_EDITOR_CONTENT);

        this._uiSetOriginalValue(this.get('originalValue'));
        this._uiSetLabel(this.get('label'));
        this._uiSetVisible(this.get('visible'));

        this.after({
            originalValueChange: this._afterOriginalValueChange,
            labelChange: this._afterLabelChange,
            visibleChange: this._afterVisibleChange
        });
    },

    /**
     * Destructor lifecycle implementation for the `A.DataEditor` class.
     * Lifecycle.
     *
     * @method destructor
     * @protected
     */
    destructor: function() {
        this.get('node').remove(true);
    },

    /**
     * Updates the editor's UI to display the given value.
     * This should be overridden by subclasses.
     *
     * @method updateUiWithValue
     */
    updateUiWithValue: function() {
        throw new Error('Subclasses should override updateUiWithValue');
    },

    /**
     * Fired after the `label` attribute is set.
     *
     * @method _afterLabelChange
     * @protected
     */
    _afterLabelChange: function() {
        this._uiSetLabel(this.get('label'));
    },

    /**
     * Fired after the `originalValue` attribute is set.
     *
     * @method _afterOriginalValueChange
     * @protected
     */
    _afterOriginalValueChange: function() {
        this._uiSetOriginalValue(this.get('originalValue'));
    },

    /**
     * Fired after the `visible` attribute is set.
     *
     * @method _afterVisibleChange
     * @protected
     */
    _afterVisibleChange: function() {
        this._uiSetVisible(this.get('visible'));
    },

    /**
     * Updates the ui according to the value of the `label` attribute.
     *
     * @method _uiSetLabel
     * @param {String} label
     * @protected
     */
    _uiSetLabel: function(label) {
        return this.get('node').one('label').set('text', label);
    },

    /**
     * Updates the ui according to the value of the `originalValue` attribute.
     *
     * @method _uiSetOriginalValue
     * @protected
     */
    _uiSetOriginalValue: function(originalValue) {
        this.updateUiWithValue(originalValue);
    },

    /**
     * Updates the ui according to the value of the `visible` attribute.
     *
     * @method _uiSetVisible
     * @param visible
     * @protected
     */
    _uiSetVisible: function(visible) {
        if (visible) {
            this.get('node').show();
        }
        else {
            this.get('node').hide();
        }
    }
}, {
    /**
     * Static property used to define the default attribute configuration
     * for the `A.DataEditor`.
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
         * @default null
         * @type *
         */
        editedValue: {
            value: null
        },

        /**
         * The label to be used by this boolean editor.
         *
         * @attribute label
         * @default ''
         * @type String
         */
        label: {
            value: ''
        },

        /**
         * The node where the editor UI is rendered.
         *
         * @attribute node
         * @type Node
         */
        node: {
            readOnly: true,
            valueFn: function() {
                return A.Node.create(TPL_EDITOR);
            }
        },

        /**
         * The value to be edited.
         *
         * @attribute originalValue
         * @default null
         * @type *
         */
        originalValue: {
            value: null
        },

        /**
         * Determines if `DataEditor` is visible or not.
         *
         * @attribute visible
         * @default false
         * @type Boolean
         */
        visible: {
            validator: A.Lang.isBoolean,
            value: true
        }
    }
});
