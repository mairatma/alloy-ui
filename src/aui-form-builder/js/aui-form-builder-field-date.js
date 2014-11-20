/**
 * The Form Builder Field Date Component
 *
 * @module aui-form-builder
 * @submodule aui-form-builder-field-date
 */

var CSS_FIELD_DATE = A.getClassName('form', 'builder', 'field', 'date'),
    CSS_FIELD_DATE_FROM = A.getClassName('form', 'builder', 'field', 'date', 'from'),
    CSS_FIELD_DATE_FROM_DATE = A.getClassName('form', 'builder', 'field', 'date', 'from', 'date'),
    CSS_FIELD_DATE_FROM_LABEL = A.getClassName('form', 'builder', 'field', 'date', 'from', 'label'),
    CSS_FIELD_DATE_FROM_TIME = A.getClassName('form', 'builder', 'field', 'date', 'from', 'time'),
    CSS_FIELD_DATE_INPUT = A.getClassName('form', 'builder', 'field', 'date', 'input'),
    CSS_FIELD_DATE_INPUT_TIME = A.getClassName('form', 'builder', 'field', 'date', 'input', 'time'),
    CSS_FIELD_DATE_TO = A.getClassName('form', 'builder', 'field', 'date', 'to'),
    CSS_FIELD_DATE_TO_DATE = A.getClassName('form', 'builder', 'field', 'date', 'to', 'date'),
    CSS_FIELD_DATE_TO_ENABLED = A.getClassName('form', 'builder', 'field', 'date', 'to', 'enabled'),
    CSS_FIELD_DATE_TO_LABEL = A.getClassName('form', 'builder', 'field', 'date', 'to', 'label'),
    CSS_FIELD_DATE_TO_TIME = A.getClassName('form', 'builder', 'field', 'date', 'to', 'time'),
    CSS_CHECKED_CONTENT_DATE = A.getClassName('checked', 'content', 'date'),
    CSS_CHECKED_CONTENT_TIME = A.getClassName('checked', 'content', 'time'),
    CSS_UNCHECKED_CONTENT_DATE = A.getClassName('unchecked', 'content', 'date'),
    CSS_UNCHECKED_CONTENT_TIME = A.getClassName('unchecked', 'content', 'time'),

    TPL_CHECKED_CONTENT_DATE = '<div class="' + CSS_CHECKED_CONTENT_DATE + '"> Month | Day | Year </div>',
    TPL_CHECKED_CONTENT_TIME = '<div class="' + CSS_CHECKED_CONTENT_TIME + '"> Hour | Min | AM/PM </div>',
    TPL_UNCHECKED_CONTENT_DATE = '<div class="' + CSS_UNCHECKED_CONTENT_DATE + '"> Month | Day </div>',
    TPL_UNCHECKED_CONTENT_TIME = '<div class="' + CSS_UNCHECKED_CONTENT_TIME + '">Include Time?</div>';

/**
 * A base class for Form Builder Field Date.
 *
 * @class A.FormBuilderFieldDate
 * @extends A.FormBuilderFieldSentence
 * @param {Object} config Object literal specifying widget configuration
 *     properties.
 * @constructor
 */
A.FormBuilderFieldDate = A.Base.create('form-builder-field-date', A.FormBuilderFieldSentence, [], {
    TPL_FIELD_CONTENT: '<div class="' + CSS_FIELD_DATE + '">' +
        '<div class="' + CSS_FIELD_DATE_FROM + '">' +
        '<div class="' + CSS_FIELD_DATE_FROM_LABEL + '">From</div>' +
        '<div class="' + CSS_FIELD_DATE_FROM_DATE + ' ' + CSS_FIELD_DATE_INPUT + '"></div>' +
        '<div class="' + CSS_FIELD_DATE_FROM_TIME + ' ' + CSS_FIELD_DATE_INPUT_TIME + '"></div></div>' +
        '<div class="' + CSS_FIELD_DATE_TO + '">' +
        '<div class="' + CSS_FIELD_DATE_TO_LABEL + '">To</div>' +
        '<div class="' + CSS_FIELD_DATE_TO_DATE + ' ' + CSS_FIELD_DATE_INPUT + '"></div>' +
        '<div class="' + CSS_FIELD_DATE_TO_TIME + ' ' + CSS_FIELD_DATE_INPUT_TIME + '"></div></div>' +
        '</div>',

    /**
     * Constructor for the `A.FormBuilderFieldDate`. Lifecycle.
     *
     * @method initializer
     * @protected
     */
    initializer: function() {
        var content = this.get('content');

        content.addClass(CSS_FIELD_DATE);

        this._uiSetYearToggleFrom(this.get('yearToggleFrom'));
        this._uiSetTimeToggleFrom(this.get('timeToggleFrom'));
        this._uiSetToggleInterval(this.get('toggleInterval'));
        this._uiSetYearToggleTo(this.get('yearToggleTo'));
        this._uiSetTimeToggleTo(this.get('timeToggleTo'));

        this.after({
            yearToggleFromChange: this._afterYearToggleFromChange,
            toggleIntervalChange: this._afterToggleIntervalChange,
            timeToggleFromChange: this._afterTimeToggleFromChange,
            yearToggleToChange: this._afterYearToggleToChange,
            timeToggleToChange: this._afterTimeToggleToChange
        });
    },

    /**
     * Fired after the `BooleanFromTo` checkbox is set.
     *
     * @method _afterBooleanFromToChange
     * @param {Object} booleanYearToggleFrom
     * @param {Object} booleanYearToggleTo
     * @param {Object} booleanTimeToggleFrom
     * @param {Object} booleanTimeToggleTo
     * @param {CustomEvent} event The fired event
     * @protected
     */
    _afterBooleanFromToChange: function (booleanYearToggleFrom, booleanYearToggleTo, booleanTimeToggleFrom, booleanTimeToggleTo, event) {
        booleanYearToggleTo.set('visible', event.newVal);
        booleanTimeToggleTo.set('visible', event.newVal);

        booleanYearToggleTo.updateUiWithValue(booleanYearToggleFrom.get('editedValue'));
        booleanTimeToggleTo.updateUiWithValue(booleanTimeToggleFrom.get('editedValue'));
    },

    /**
     * Fired after the `timeToggleFrom` attribute is set.
     *
     * @method _afterTimeToggleFromChange
     * @protected
     */
    _afterTimeToggleFromChange: function() {
        this._uiSetTimeToggleFrom(this.get('timeToggleFrom'));
    },

    /**
     * Fired after the `timeToggleTo` attribute is set.
     *
     * @method _afterTimeToggleToChange
     * @protected
     */
    _afterTimeToggleToChange: function() {
        this._uiSetTimeToggleTo(this.get('timeToggleTo'));
    },

    /**
     * Fired after the `toggleInterval` attribute is set.
     *
     * @method _afterToggleIntervalChange
     * @protected
     */
    _afterToggleIntervalChange: function() {
        this._uiSetToggleInterval(this.get('toggleInterval'));
    },

    /**
     * Fired after the `yearToggleFrom` attribute is set.
     *
     * @method _afterYearToggleFromChange
     * @protected
     */
    _afterYearToggleFromChange: function() {
        this._uiSetYearToggleFrom(this.get('yearToggleFrom'));
    },

    /**
     * Fired after the `yearToggleTo` attribute is set.
     *
     * @method _afterYearToggleToChange
     * @protected
     */
    _afterYearToggleToChange: function() {
        this._uiSetYearToggleTo(this.get('yearToggleTo'));
    },

    /**
     * Fills the settings array with the information for this field.
     *
     * @method _fillSettings
     * @override
     * @protected
     */
    _fillSettings: function() {
        var booleanYearToggleFrom,
            booleanTimeToggleFrom,
            booleanFromTo,
            booleanYearToggleTo,
            booleanTimeToggleTo;

        booleanYearToggleFrom = new A.BooleanDataEditor({
            checkedContent: TPL_CHECKED_CONTENT_DATE,
            uncheckedContent: TPL_UNCHECKED_CONTENT_DATE,
            innerLabelLeft: 'Year',
            innerLabelRight: 'Year'
        });

        booleanTimeToggleFrom = new A.BooleanDataEditor({
            checkedContent: TPL_CHECKED_CONTENT_TIME,
            uncheckedContent: TPL_UNCHECKED_CONTENT_TIME,
            innerLabelRight: 'No'
        });

        booleanFromTo = new A.BooleanDataEditor({
            label: 'Enable "From/To" Format',
            innerLabelRight: 'No'
        });

        booleanYearToggleTo = new A.BooleanDataEditor({
            checkedContent: TPL_CHECKED_CONTENT_DATE,
            uncheckedContent: TPL_UNCHECKED_CONTENT_DATE,
            visible: false,
            innerLabelLeft: 'Year',
            innerLabelRight: 'Year'
        });

        booleanTimeToggleTo = new A.BooleanDataEditor({
            checkedContent: TPL_CHECKED_CONTENT_TIME,
            uncheckedContent: TPL_UNCHECKED_CONTENT_TIME,
            visible: false,
            innerLabelRight: 'No'
        });

        booleanFromTo.after('editedValueChange', A.bind(
            this._afterBooleanFromToChange,
            this,
            booleanYearToggleFrom,
            booleanYearToggleTo,
            booleanTimeToggleFrom,
            booleanTimeToggleTo
        ));

        this._settings.push(
            {
                attrName: 'required',
                editor: new A.BooleanDataEditor({
                    label: 'Required'
                })
            },
            {
                attrName: 'yearToggleFrom',
                editor: booleanYearToggleFrom
            },
            {
                attrName: 'timeToggleFrom',
                editor: booleanTimeToggleFrom
            },
            {
                attrName: 'toggleInterval',
                editor: booleanFromTo
            },
            {
                attrName: 'yearToggleTo',
                editor: booleanYearToggleTo
            },
            {
                attrName: 'timeToggleTo',
                editor: booleanTimeToggleTo
            }
        );
    },

    /**
     * Updates the ui according to the value of the `timeToggleFrom` attribute.
     *
     * @method _uiSetTimeToggleFrom
     * @param {Boolean} timeToggleFrom
     * @protected
     */
    _uiSetTimeToggleFrom: function(timeToggleFrom) {
        var timeContainer = this.get('content').one('.' + CSS_FIELD_DATE_FROM_TIME);

        timeContainer.toggleView(timeToggleFrom);
    },

    /**
     * Updates the ui according to the value of the `timeToggleTo` attribute.
     *
     * @method _uiSetTimeToggleTo
     * @param {Boolean} timeToggleTo
     * @protected
     */
    _uiSetTimeToggleTo: function(timeToggleTo) {
        var timeContainer = this.get('content').one('.' + CSS_FIELD_DATE_TO_TIME);

        timeContainer.toggleView(timeToggleTo);
    },

    /**
     * Updates the ui according to the value of the `toggleInterval` attribute.
     *
     * @method _uiSetToggleInterval
     * @param {Boolean} toggleInterval
     * @protected
     */
    _uiSetToggleInterval: function(toggleInterval) {
        this.get('content').toggleClass(CSS_FIELD_DATE_TO_ENABLED, toggleInterval);
    },

    /**
     * Updates the ui according to the value of the `yearToggleFrom` attribute.
     *
     * @method _uiSetYearToggleFrom
     * @param {Boolean} yearToggleFrom
     * @protected
     */
    _uiSetYearToggleFrom: function(yearToggleFrom) {
        var dateContainer = this.get('content').one('.' + CSS_FIELD_DATE_FROM_DATE);

        dateContainer.toggleClass('year', yearToggleFrom);
    },

    /**
     * Updates the ui according to the value of the `yearToggleTo` attribute.
     *
     * @method _uiSetYearToggleTo
     * @param {Boolean} yearToggleTo
     * @protected
     */
    _uiSetYearToggleTo: function(yearToggleTo) {
        var dateContainer = this.get('content').one('.' + CSS_FIELD_DATE_TO_DATE);

        dateContainer.toggleClass('year', yearToggleTo);
    }
}, {
    /**
     * Static property used to define the default attribute configuration
     * for the `A.FormBuilderFieldDate`.
     *
     * @property ATTRS
     * @type Object
     * @static
     */
    ATTRS: {
        /**
         * Flag indicating if this field is required.
         *
         * @attribute required
         * @default false
         * @type {Boolean}
         */
        required: {
            validator: A.Lang.isBoolean,
            value: false
        },

        /**
         * Flag indicating if the start date will use time.
         *
         * @attribute timeToggleFrom
         * @default false
         * @type {Boolean}
         */
        timeToggleFrom: {
            validator: A.Lang.isBoolean,
            value: false
        },

        /**
         * Flag indicating if the end date will use time.
         *
         * @attribute timeToggleTo
         * @default false
         * @type {Boolean}
         */
        timeToggleTo: {
            validator: A.Lang.isBoolean,
            value: false
        },

        /**
         * Flag indicating if there will be a end date.
         *
         * @attribute toggleInterval
         * @default false
         * @type {Boolean}
         */
        toggleInterval: {
            validator: A.Lang.isBoolean,
            value: false
        },

        /**
         * Flag indicating if the start date will use year.
         *
         * @attribute yearToggleFrom
         * @default false
         * @type {Boolean}
         */
        yearToggleFrom: {
            validator: A.Lang.isBoolean,
            value: false
        },

        /**
         * Flag indicating if the end date will use year.
         *
         * @attribute yearToggleTo
         * @default false
         * @type {Boolean}
         */
        yearToggleTo: {
            validator: A.Lang.isBoolean,
            value: false
        }
    }
});
