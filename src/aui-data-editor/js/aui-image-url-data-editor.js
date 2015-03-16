/**
 * The Image URL Data Editor Component
 *
 * @module aui-image-url-data-editor
 */

var CSS_IMAGE_URL_DATA_EDITOR = A.getClassName('image', 'url', 'data', 'editor'),
    CSS_IMAGE_URL_DATA_EDITOR_BUTTON =
        A.getClassName('image', 'url', 'data', 'editor', 'button'),
    CSS_IMAGE_URL_DATA_EDITOR_IMAGE =
    A.getClassName('image', 'url', 'data', 'editor', 'image'),
    CSS_IMAGE_URL_DATA_EDITOR_IMAGE_CONTENT =
        A.getClassName('image', 'url', 'data', 'editor', 'image', 'content'),
    CSS_IMAGE_URL_DATA_EDITOR_IMAGE_CHANGE_BUTTON =
        A.getClassName('image', 'url', 'data', 'editor', 'image', 'change', 'button'),
    CSS_IMAGE_URL_DATA_EDITOR_INPUT_URL =
        A.getClassName('image', 'url', 'data', 'editor', 'input', 'url'),
    CSS_IMAGE_URL_DATA_EDITOR_INPUT_URL_CONTENT =
        A.getClassName('image', 'url', 'data', 'editor', 'input', 'url', 'content'),
    CSS_IMAGE_URL_DATA_EDITOR_INPUT_URL_PREVIEW_BUTTON =
        A.getClassName('image', 'url', 'data', 'editor', 'input', 'url', 'preview', 'button'),
    CSS_IMAGE_URL_DATA_EDITOR_LOADING_ICON =
        A.getClassName('image', 'url', 'data', 'editor', 'loading', 'icon'),
    CSS_IMAGE_URL_DATA_EDITOR_PREVIEW =
        A.getClassName('image', 'url', 'data', 'editor', 'preview');

/**
 * A base class for Image URL Data Editor.
 *
 * @class A.ImageURLDataEditor
 * @extends A.DataEditor
 * @param {Object} config Object literal specifying widget configuration
 *     properties.
 * @constructor
 */
A.ImageURLDataEditor = A.Base.create('image-url-data-editor', A.DataEditor, [], {
    TPL_EDITOR_CONTENT: '<div class="' + CSS_IMAGE_URL_DATA_EDITOR + '">' +
        '<div class=' + CSS_IMAGE_URL_DATA_EDITOR_INPUT_URL_CONTENT + '>' +
        '<textarea class="' + CSS_IMAGE_URL_DATA_EDITOR_INPUT_URL +
        ' form-control" rows="3" placeholder="Paste URL here."></textarea>' +
        '<button class="btn btn-default ' + CSS_IMAGE_URL_DATA_EDITOR_BUTTON + ' ' +
            CSS_IMAGE_URL_DATA_EDITOR_INPUT_URL_PREVIEW_BUTTON + ' ' +
            CSS_IMAGE_URL_DATA_EDITOR_PREVIEW + '">' +
        '</button>' +
        '</div>' +
        '<div class="hide ' + CSS_IMAGE_URL_DATA_EDITOR_IMAGE_CONTENT + '">' +
        '<img class="' + CSS_IMAGE_URL_DATA_EDITOR_IMAGE + '" src=""></img>' +
        '<button class="btn btn-default ' + CSS_IMAGE_URL_DATA_EDITOR_BUTTON + ' ' +
            CSS_IMAGE_URL_DATA_EDITOR_IMAGE_CHANGE_BUTTON + '">Change</button>' +
        '</div>' +
        '</div>',

    /**
     * Constructor for the `A.ImageURLDataEditor`. Lifecycle.
     *
     * @method initializer
     * @protected
     */
    initializer: function() {
        var changeButton,
            image,
            inputURL,
            node = this.get('node'),
            previewButton;

        changeButton = node.one('.' + CSS_IMAGE_URL_DATA_EDITOR_IMAGE_CHANGE_BUTTON);
        image = node.one('.' + CSS_IMAGE_URL_DATA_EDITOR_IMAGE);
        inputURL = node.one('.' + CSS_IMAGE_URL_DATA_EDITOR_INPUT_URL);
        previewButton = node.one('.' + CSS_IMAGE_URL_DATA_EDITOR_INPUT_URL_PREVIEW_BUTTON);

        this._uiSetEditedValue(this.get('editedValue'));

        inputURL.on('valuechange', A.bind(this._onValueChange, this));
        inputURL.on('paste', A.bind(this._onInputPaste, this));

        previewButton.on('click', A.bind(this._onPreviewClicked, this));
        changeButton.on('click', A.bind(this._onChangeClicked, this));

        image.on('load', A.bind(this._onImageLoad, this));
        image.on('error', A.bind(this._onImageError, this));

        this.after('editedValueChange', A.bind(this._afterEditedValueChange, this));
        this.after('loadedChange', A.bind(this._afterLoadedChange, this));
    },

    /**
     * Returns `true` if this edited value has no elements.
     *
     * @method isEmpty
     * @return {Boolean}
     */
    isEmpty: function() {
        return !A.Lang.trim(this.get('editedValue'));
    },

    /**
     * If the Image URL Data Editor has a String on image field this will return true.
     *
     * @method isValid
     * @return {Boolean}
     */
    isValid: function() {

        if (A.ImageURLDataEditor.superclass.isValid.call(this)) {
            return A.Lang.isString(this.get('editedValue'));
        }

        return false;
    },

    /**
     * Prepare data editor content before being edited.
     *
     * @method prepareContent
     */
    prepareContent: function() {
        this._setImageVisibility(false);
    },

    /**
     * Fired after the `editedValue` attribute is set.
     *
     * @method _afterEditedValueChange
     * @protected
     */
    _afterEditedValueChange: function() {
        this._uiSetEditedValue(this.get('editedValue'));
    },

    /**
     * Fired after the `loaded` attribute is set.
     *
     * @method _afterLoadedChange
     * @param {EventFacade} event
     * @protected
     */
    _afterLoadedChange: function(event) {
        if (event.newVal && this._paste) {
            this._previewImage();

            this._paste = false;
        }
    },

    /**
     * Check if the setted image is in cache.
     *
     * @method _isCached
     * @protected
     */
    _isCached: function() {
        var image = this.get('node').one('.' + CSS_IMAGE_URL_DATA_EDITOR_IMAGE);

        return image.get('complete') && ((image.get('width') + image.get('height')) > 0);
    },

    /**
     * Fired when the change button is clicked.
     *
     * @method _onChangeClicked
     * @protected
     */
    _onChangeClicked: function() {
        this._setImageVisibility(false);
    },

    /**
     * Fired when there is a error on image load process.
     *
     * @method _onImageError
     * @protected
     */
    _onImageError: function() {
        var node = this.get('node');

        this._setLoadIconVisibility(false);

        if (this.get('editedValue')) {
            node.addClass('has-error');
        }

        this._paste = false;
    },

    /**
     * Fired when an image has finished loading.
     *
     * @method _onImageLoad
     * @protected
     */
    _onImageLoad: function() {
        this._setLoadIconVisibility(false);
        this.set('loaded', true);
    },

    /**
     * Fired when a content is pasted on url's input.
     *
     * @method _onInputPaste
     * @protected
     */
    _onInputPaste: function() {
        this._paste = true;
    },

    /**
     * Fired when the preview button is clicked.
     *
     * @method _onPreviewClicked
     * @protected
     */
    _onPreviewClicked: function() {
        if (this.get('loaded')) {
            this._previewImage();
        }
    },

    /**
     * Fired when the input's value changes.
     *
     * @method _onValueChange
     * @protected
     */
    _onValueChange: function() {
        var inputValue,
            node = this.get('node');

        inputValue = node.one('.' + CSS_IMAGE_URL_DATA_EDITOR_INPUT_URL).get('value');

        node.removeClass('has-error');
        this.set('loaded', false);
        this.set('editedValue', inputValue);
    },

    /**
     * Preview the image loaded and hide URL input.
     *
     * @method _previewImage
     * @protected
     */
    _previewImage: function() {
        this._setImageVisibility(true);
    },

    /**
     * Updates the ui according to the value of the `editedValue` attribute.
     *
     * @method _uiSetEditedValue
     * @param {String} editedValue
     * @protected
     */
    _uiSetEditedValue: function(editedValue) {
        this.get('node').one('.' + CSS_IMAGE_URL_DATA_EDITOR_INPUT_URL).set('value', editedValue);
        this._setImageSource();
    },

    /**
     * Set url argument as source of the image tag.
     *
     * @method _setImageSource
     * @protected
     */
    _setImageSource: function() {
        var node = this.get('node');

        node.one('.' + CSS_IMAGE_URL_DATA_EDITOR_IMAGE).setAttribute('src', 
            node.one('.' + CSS_IMAGE_URL_DATA_EDITOR_INPUT_URL).get('value'));

        this._setLoadIconVisibility(true);

        if (this._isCached()) {
            this.set('loaded', true);
        }
    },

    /**
     * Set Image Content and URL input visibility.
     *
     * @method _setImageVisibility
     * @param {Boolean} visible
     * @protected
     */
    _setImageVisibility: function(visible) {
        var node = this.get('node');

        if (visible) {
            node.one('.' + CSS_IMAGE_URL_DATA_EDITOR_INPUT_URL_CONTENT).addClass('hide');
            node.one('.' + CSS_IMAGE_URL_DATA_EDITOR_IMAGE_CONTENT).removeClass('hide');
        }
        else {
            node.one('.' + CSS_IMAGE_URL_DATA_EDITOR_INPUT_URL_CONTENT).removeClass('hide');
            node.one('.' + CSS_IMAGE_URL_DATA_EDITOR_IMAGE_CONTENT).addClass('hide');
        }
    },

    /**
     * Set Load Icon and Preview button visibility.
     *
     * @method _setLoadIconVisibility
     * @param {Boolean} visible
     * @protected
     */
    _setLoadIconVisibility: function(visible) {
        var previewButton = this.get('node').one('.' +
            CSS_IMAGE_URL_DATA_EDITOR_INPUT_URL_PREVIEW_BUTTON);

        if (visible) {
            previewButton.removeClass(CSS_IMAGE_URL_DATA_EDITOR_PREVIEW);
            previewButton.addClass(CSS_IMAGE_URL_DATA_EDITOR_LOADING_ICON);
        }
        else {
            previewButton.addClass(CSS_IMAGE_URL_DATA_EDITOR_PREVIEW);
            previewButton.removeClass(CSS_IMAGE_URL_DATA_EDITOR_LOADING_ICON);
        }
    }
}, {
    /**
     * Static property used to define the default attribute configuration
     * for the `A.ImageURLDataEditor`.
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
         * @default ''
         * @type String
         */
        editedValue: {
            value: ''
        },

        /**
         * Determines if a image is loaded or not.
         *
         * @attribute loaded
         * @readOnly
         * @type Boolean
         */
        loaded: {
            validator: A.Lang.isBoolean
        },

        /**
         * The value to be edited.
         *
         * @attribute originalValue
         * @default ''
         * @type String
         */
        originalValue: {
            value: ''
        }
    }
});
