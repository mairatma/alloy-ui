/**
 * The Form Builder Field Grid Component
 *
 * @module aui-form-builder
 * @submodule aui-form-builder-field-grid
 */

var CSS_FIELD_GRID = A.getClassName('form', 'builder', 'field', 'grid'),
    CSS_FIELD_GRID_ROWN = A.getClassName('form', 'builder', 'field', 'rown'),
    CSS_FIELD_GRID_ROWN_OPTION = A.getClassName('form', 'builder', 'field', 'rown', 'option'),
    CSS_FIELD_GRID_ROWNS = A.getClassName('form', 'builder', 'field', 'rowns'),
    CSS_FIELD_GRID_COLLUMN = A.getClassName('form', 'builder', 'field', 'collumn'),
    CSS_FIELD_GRID_COLLUMN_OPTION = A.getClassName('form', 'builder', 'field', 'collumn', 'option'),
    CSS_FIELD_GRID_COLLUMNS = A.getClassName('form', 'builder', 'field', 'collumns'),


    TPL_FIELD_GRID_ROWN = '<div class="' + CSS_FIELD_GRID_ROWN_OPTION + '">' +
        '<input class="' + CSS_FIELD_GRID_ROWN + '" type="checkbox"></input>' +
        '<label>{label}</label></div>',
    TPL_FIELD_GRID_COLLUMN = '<div class="' + CSS_FIELD_GRID_COLLUMN_OPTION + '">' +
        '<input class="' + CSS_FIELD_GRID_COLLUMN + '" type="checkbox"></input>' +
        '<label>{label}</label></div>';

/**
 * A base class for Form Builder Field Grid.
 *
 * @class A.FormBuilderFieldGrid
 * @extends A.FormBuilderFieldSentence
 * @param {Object} config Object literal specifying widget configuration
 *     properties.
 * @constructor
 */
A.FormBuilderFieldGrid = A.Base.create('form-builder-field-grid', A.FormBuilderFieldSentence, [], {
    TPL_FIELD_CONTENT: '<div class="form-group">' +
        '<div class="' + CSS_FIELD_GRID_ROWNS + ' form-group"></div>' +
        '<div class="' + CSS_FIELD_GRID_COLLUMNS + ' form-group"></div>' +
        '</div>',

    /**
     * Constructor for the `A.FormBuilderFieldRow`. Lifecycle.
     *
     * @method initializer
     * @protected
     */
    initializer: function() {
        var content = this.get('content');

        content.addClass(CSS_FIELD_GRID);

        this._uiSetRows(this.get('rowns'));
        this._uiSetCollumns(this.get('collumns'));


        this.after({
            rownsChange: this._afterRowsChange,
            collumnsChange: this._afterCollumnsChange
        });
    },

    /**
     * Fired after the `grids` attribute is set.
     *
     * @method _afterRowsChange
     * @protected
     */
    _afterRowsChange: function() {
        this._uiSetRows(this.get('rowns'));
    },

    /**
     * Fired after the `grids` attribute is set.
     *
     * @method _afterCollumnsChange
     * @protected
     */
    _afterCollumnsChange: function() {
        this._uiSetCollumns(this.get('collumns'));
    },

    /**
     * Fills the settings array with the information for this field.
     *
     * @method _fillSettings
     * @override
     * @protected
     */
    _fillSettings: function() {
        A.FormBuilderFieldGrid.superclass._fillSettings.apply(this, arguments);

        this._settings.push(
            {
                attrName: 'rowns',
                editor: new A.OptionsDataEditor({
                    label: 'Rows'
                })
            },
            {
                attrName: 'collumns',
                editor: new A.OptionsDataEditor({
                    label: 'Collumns'
                })
            },
            {
                attrName: 'required',
                editor: new A.BooleanDataEditor({
                    label: 'Required'
                })
            }
        );
    },

    /**
     * Updates the ui according to the value of the `collumns` attribute.
     *
     * @method _uiSetCollumns
     * @param {Array} collumns
     * @protected
     */
    _uiSetCollumns: function(collumns) {
        var collumnsContainer = this.get('content').all('.' + CSS_FIELD_GRID_COLLUMNS),
            optionNode;

        collumnsContainer.empty();
        collumnsContainer.append(A.Node.create('<div>Collumns</div>'));
        A.Array.each(collumns, function(option) {
            optionNode = A.Node.create(A.Lang.sub(TPL_FIELD_GRID_COLLUMN, {
                label: option
            }));
            collumnsContainer.append(optionNode);
        });
    },

    /**
     * Updates the ui according to the value of the `rowns` attribute.
     *
     * @method _uiSetRows
     * @param {Array} rowns
     * @protected
     */
    _uiSetRows: function(rowns) {
        var rownsContainer = this.get('content').all('.' + CSS_FIELD_GRID_ROWNS),
            optionNode;

        rownsContainer.empty();
        rownsContainer.append(A.Node.create('<div>Rows</div>'));
        A.Array.each(rowns, function(option) {
            optionNode = A.Node.create(A.Lang.sub(TPL_FIELD_GRID_ROWN, {
                label: option
            }));
            rownsContainer.append(optionNode);
        });
    }
}, {
    /**
     * Static property used to define the default attribute configuration
     * for the `A.FormBuilderFieldGrid`.
     *
     * @property ATTRS
     * @type Object
     * @static
     */
    ATTRS: {
        /**
         * The rowns that can be chosen.
         *
         * @attribute rowns
         * @default []
         * @type String
         */
        rowns: {
            validator: A.Lang.isArray,
            value: []
        },

        /**
         * The collumns that can be chosen.
         *
         * @attribute collumns
         * @default []
         * @type String
         */
        collumns: {
            validator: A.Lang.isArray,
            value: []
        },

        /**
         * Flag indicating if this field is required.
         *
         * @attribute required
         * @default false
         * @type Boolean
         */
        required: {
            validator: A.Lang.isBoolean,
            value: false
        }
    }
});
