/**
 * The Form Field Media Component
 *
 * @module aui-form-field-media
 */

var CSS_FIELD_MEDIA = A.getClassName('form', 'field', 'media'),
    CSS_FIELD_MEDIA_CONTENT = A.getClassName('form', 'field', 'media', 'content'),
    CSS_FIELD_MEDIA_IMAGE = A.getClassName('form', 'field', 'media', 'image'),
    CSS_FIELD_MEDIA_IMAGE_CONTENT = A.getClassName('form', 'field', 'media', 'image', 'content'),
    CSS_FIELD_MEDIA_INFO = A.getClassName('form', 'field', 'media', 'info');

/**
 * A base class for Form Field Media.
 *
 * @class A.FormFieldMedia
 * @extends A.FormField
 * @param {Object} config Object literal specifying widget configuration
 *     properties.
 * @constructor
 */
A.FormFieldMedia = A.Base.create('form-field-media', A.FormField, [A.FormFieldRequired], {
    TPL_FIELD_CONTENT: '<div class="' + CSS_FIELD_MEDIA_CONTENT + '">' +
        '<div class="' + CSS_FIELD_MEDIA_IMAGE_CONTENT + '">' +
        '<img class="' + CSS_FIELD_MEDIA_IMAGE + '" src=""></img>' +
        '<div class="' + CSS_FIELD_MEDIA_INFO + '"></div></div></div>',

    /**
     * Constructor for the `A.FormFieldMedia`. Lifecycle.
     *
     * @method initializer
     * @protected
     */
    initializer: function() {
        this._uiSetImageInfo(this.get('imageInfo'));
        this._uiSetImageSource(this.get('imageSource'));

        this.after('imageInfoChange', A.bind(this._afterImageInfoChange, this));
        this.after('imageSourceChange', A.bind(this._afterImageSourceChange, this));
    },

    /**
     * Create the DOM structure for the `A.FormFieldMedia`. Lifecycle.
     *
     * @method renderUI
     * @protected
     */
    renderUI: function() {
        var content = this.get('content');

        A.FormFieldMedia.superclass.renderUI.call(this);

        content.addClass(CSS_FIELD_MEDIA);
    },

    /**
     * Fired after the `imageInfo` attribute is set.
     *
     * @method _afterImageInfoChange
     * @protected
     */
    _afterImageInfoChange: function() {
        this._uiSetImageInfo(this.get('imageInfo'));
    },

    /**
     * Fired after the `imageSource` attribute is set.
     *
     * @method _afterImageSourceChange
     * @protected
     */
    _afterImageSourceChange: function() {
        this._uiSetImageSource(this.get('imageSource'));
    },

    /**
     * Updates the ui according to the value of the `imageSource` attribute.
     *
     * @method _uiSetImageSource
     * @param {String} imageSource
     * @protected
     */
    _uiSetImageSource: function(imageSource) {
        this.get('content').one('.' + CSS_FIELD_MEDIA_IMAGE).setAttribute('src', imageSource);
    },

    /**
     * Updates the ui according to the value of the `imageInfo` attribute.
     *
     * @method _uiSetImageInfo
     * @param {String} imageInfo
     * @protected
     */
    _uiSetImageInfo: function(imageInfo) {
        this.get('content').one('.' + CSS_FIELD_MEDIA_INFO).setHTML('&copy;' + imageInfo);
    }
}, {
    /**
     * Static property used to define the default attribute configuration
     * for the `A.FormFieldMedia`.
     *
     * @property ATTRS
     * @type Object
     * @static
     */
    ATTRS: {
        /**
         * Id to reference form data after a form is submitted.
         *
         * @attribute name
         * @default ''
         * @type String
         */
        name: {
            validator: A.Lang.isString,
            value: ''
        },

        /**
         * 
         *
         * @attribute imageSource
         * @default ''
         * @type String
         */
        imageSource: {
            value: ''
        },

        /**
         * 
         *
         * @attribute imageInfo
         * @default ''
         * @type String
         */
        imageInfo: {
            value: ''
        }
    }
});
