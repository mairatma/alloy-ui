/**
 * The Form Builder Field Base Component
 *
 * @module aui-form-builder
 * @submodule aui-form-builder-field-base
 */

var CSS_FIELD = A.getClassName('form', 'builder', 'field'),
    CSS_FIELD_CONFIGURATION = A.getClassName('form', 'builder', 'field', 'configuration'),
    CSS_FIELD_CONTENT = A.getClassName('form', 'builder', 'field', 'content'),
    CSS_FIELD_CONTENT_TOOLBAR = A.getClassName('form', 'builder', 'field', 'content', 'toolbar'),
    CSS_FIELD_MOVE_BUTTON = A.getClassName('form', 'builder', 'field', 'move', 'button'),
    CSS_FIELD_MOVE_TARGET = A.getClassName('form', 'builder', 'field', 'move', 'target'),
    CSS_FIELD_NESTED = A.getClassName('form', 'builder', 'field', 'nested'),
    CSS_FIELD_OVERLAY = A.getClassName('form', 'builder', 'field', 'overlay'),
    CSS_FIELD_TOOLBAR = A.getClassName('form', 'builder', 'field', 'toolbar'),
    CSS_FIELD_TOOLBAR_CLOSE = A.getClassName('form', 'builder', 'field', 'toolbar', 'close'),
    CSS_FIELD_TOOLBAR_EDIT = A.getClassName('form', 'builder', 'field', 'toolbar', 'edit'),
    CSS_FIELD_TOOLBAR_REMOVE = A.getClassName('form', 'builder', 'field', 'toolbar', 'remove'),
    CSS_HIDE = A.getClassName('hide'),

    TPL_FIELD = '<div class="' + CSS_FIELD + '">' +
        '<div class="' + CSS_FIELD_CONTENT_TOOLBAR + '">' +
        '<div class="' + CSS_FIELD_CONTENT + '"></div>' +
        '<div class="' + CSS_FIELD_MOVE_BUTTON + ' layout-builder-move-cut-button"></div>' +
        '<div class="btn-group ' + CSS_FIELD_TOOLBAR + ' hide">' +
        '<button class="btn btn-default ' + CSS_FIELD_TOOLBAR_EDIT + '"><span class="glyphicon glyphicon-wrench"></span></button>' +
        '<button class="btn btn-default ' + CSS_FIELD_TOOLBAR_REMOVE + '"><span class="glyphicon glyphicon-trash"></span></button>' +
        '<button class="btn btn-default ' + CSS_FIELD_TOOLBAR_CLOSE + '"><span class="glyphicon glyphicon-remove"></span></button>' +
        '</div></div>' +
        '<div class="' + CSS_FIELD_NESTED + '"></div>' +
        '<div class="' + CSS_FIELD_OVERLAY + '"></div>' +
        '</div>',
    TPL_FIELD_CONFIGURATION = '<button class="btn btn-default ' + CSS_FIELD_CONFIGURATION + ' hide">' +
        '<span class="glyphicon glyphicon-cog"></span>' +
        '</button>',
    TPL_FIELD_MOVE_TARGET = '<button class="' + CSS_FIELD_MOVE_TARGET +
        ' layout-builder-move-target layout-builder-move-col-target btn btn-default">' +
        'Paste as subquestion</button>';

/**
 * A base class for Form Builder Field Base. All form builder fields should
 * extend from this.
 *
 * @class A.FormBuilderFieldBase
 * @extends A.Base
 * @param {Object} config Object literal specifying widget configuration
 *     properties.
 * @constructor
 */
A.FormBuilderFieldBase = A.Base.create('form-builder-field-base', A.Base, [], {

    /**
     * Constructor for the `A.FormBuilderFieldBase` component. Lifecycle.
     *
     * @method initializer
     * @protected
     */
    initializer: function() {
        var content = this.get('content');

        if (!A.UA.mobile) {
            this._configurationButton = A.Node.create(TPL_FIELD_CONFIGURATION);
            content.one('.' + CSS_FIELD_CONTENT_TOOLBAR).append(this._configurationButton);
        }

        content.setData('field-instance', this);

        this._fieldEventHandles = [
            this.after('nestedFieldsChange', this._afterNestedFieldsChange),
            content.on('clickoutside', this._onClickOutsideField, this)
        ];

        this._uiSetNestedFields(this.get('nestedFields'));
    },

    /**
     * Destructor lifecycle implementation for the `A.FormBuilderFieldBase` class.
     * Lifecycle.
     *
     * @method destructor
     * @protected
     */
    destructor: function() {
        this.get('content').remove(true);

        (new A.EventHandle(this._fieldEventHandles)).detach();
    },

    /**
     * Checks if the toolbar node is visible.
     *
     * @method isToolbarVisible
     * @return {Boolean}
     */
    isToolbarVisible: function() {
        return !this.get('content').one('.' + CSS_FIELD_TOOLBAR).hasClass(CSS_HIDE);
    },

    /**
     * Removes the given field from this field's nested list.
     *
     * @method removeNestedField
     * @param {A.FormBuilderFieldBase} field
     */
    removeNestedField: function(field) {
        var index,
            nestedFields = this.get('nestedFields');

        index = A.Array.indexOf(nestedFields, field);
        if (index !== -1) {
            nestedFields.splice(index, 1);
        }

        this.set('nestedFields', nestedFields);
    },

    /**
     * Renders the settings panel.
     *
     * @method renderSettingsPanel
     * @param {Node} container The container where the panel should be rendered.
     */
    renderSettingsPanel: function(container) {
        var i,
            settings = this._getSettings();

        for (i = 0; i < settings.length; i++) {
            settings[i].editor.set('originalValue', this.get(settings[i].attrName));
            container.append(settings[i].editor.get('node'));
        }
    },

    /**
     * Toggles the configuration button of Form Field Base by adding or
     * removing the active class name.
     *
     * @method toggleConfigurationButton
     * @param {Boolean}
     */
    toggleConfigurationButton: function(visible) {
        this._toggleConfigurationButton(visible);
    },

    /**
     * Toggles the Toolbar of Form Field Base by adding or removing the active
     * class name.
     *
     * @method toggleToolbar
     * @param {Boolean}
     */
    toggleToolbar: function(visible) {
        this._toggleToolbar(visible);
        this._toggleConfigurationButton(!visible);
    },

    /**
     * Saves the edited settings.
     *
     * @method saveSettings
     */
    saveSettings: function() {
        var i,
            settings = this._getSettings();

        for (i = 0; i < settings.length; i++) {
            this.set(settings[i].attrName, settings[i].editor.get('editedValue'));
        }
    },

    /**
     * Fired after the `nestedFields` attribute is set.
     *
     * @method _afterNestedFieldsChange
     * @protected
     */
    _afterNestedFieldsChange: function() {
        this._uiSetNestedFields(this.get('nestedFields'));
    },

    /**
     * Creates a move target node.
     *
     * @method _createMoveTarget
     * @param {Number} position The position where the moved field will be added
     *   if this is the chosen target.
     * @return {Node}
     * @protected
     */
    _createMoveTarget: function(position) {
        var targetNode = A.Node.create(TPL_FIELD_MOVE_TARGET);
        targetNode.setData('nested-field-index', position);
        targetNode.setData('nested-field-parent', this);

        return targetNode;
    },

    /**
     * Fills the settings array with the information for this field.
     * Subclasses should override this.
     *
     * @method _fillSettings
     * @protected
     */
    _fillSettings: function() {
        throw new Error('Subclasses should override _fillSettings');
    },

    /**
     * Gets the list of settings for this field. Safer then calling the property
     * directly, as this will lazy load the settings if they're not ready yet.
     * Each setting should be an object with the following keys: attrName and
     * editor.
     *
     * @method _getSettings
     * @return {Array}
     * @protected
     */
    _getSettings: function() {
        if (!this._settings) {
            this._fillSettings();
        }

        return this._settings;
    },

    /**
     * Fires when there's a click outside of the Form Builder Field.
     *
     * @method _onClickOutsideField
     * @protected
     */
    _onClickOutsideField: function() {
        this._toggleToolbar(false);
    },

    /**
     * Toggles the Configuration Button of Form Field Base by adding or
     * removing the active class name.
     *
     * @method _toggleConfigurationButton
     * @param {Boolean}
     * @protected
     */
    _toggleConfigurationButton: function(visible) {
        if (this._configurationButton) {
            this._configurationButton.toggleClass(CSS_HIDE, !visible);
        }
    },

    /**
     * Toggles the Toolbar of Form Field Base by adding or removing the active class name.
     *
     * @method _toggleToolbar
     * @param {Boolean}
     * @protected
     */
    _toggleToolbar: function(visible) {
        this.get('content').one('.' + CSS_FIELD_TOOLBAR).toggleClass(CSS_HIDE, !visible);
    },

    /**
     * Updates the UI according to the value of the `nestedFields` attribute.
     *
     * @method _uiSetNestedFields
     * @param  {Array} nestedFields
     * @protected
     */
    _uiSetNestedFields: function(nestedFields) {
        var instance = this,
            nestedFieldsNode = this.get('content').one('.' + CSS_FIELD_NESTED);

        nestedFieldsNode.empty();
        nestedFieldsNode.append(this._createMoveTarget(0));
        A.Array.each(nestedFields, function(nestedField, index) {
            nestedFieldsNode.append(nestedField.get('content'));
            nestedFieldsNode.append(instance._createMoveTarget(index + 1));
        });
    },

    /**
     * Validates the value being set to the `nestedFields` attribute.
     *
     * @method _validateNestedFields
     * @param {Array} val
     * @protected
     */
    _validateNestedFields: function(val) {
        var i;

        if (!A.Lang.isArray(val)) {
            return false;
        }

        for (i = 0; i < val.length; i++) {
            if (!A.instanceOf(val[i], A.FormBuilderFieldBase)) {
                return false;
            }
        }

        return true;
    }
}, {
    /**
     * Static property used to define the default attribute configuration
     * for the `A.FormBuilderFieldBase`.
     *
     * @property ATTRS
     * @type Object
     * @static
     */
    ATTRS: {

        /**
         * Node containing the contents of this field.
         *
         * @attribute content
         * @type Node
         */
        content: {
            validator: function(val) {
                return A.instanceOf(val, A.Node);
            },
            valueFn: function() {
                return A.Node.create(TPL_FIELD);
            },
            writeOnce: 'initOnly'
        },

        /**
         * The fields that are nested inside this field.
         *
         * @attribute nestedFields
         * @default []
         * @type Array
         */
        nestedFields: {
            validator: '_validateNestedFields',
            value: []
        }
    }
});
