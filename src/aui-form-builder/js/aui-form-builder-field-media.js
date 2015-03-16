/**
 * The Form Builder Field Media Component
 *
 * @module aui-form-builder
 * @submodule aui-form-builder-field-media
 */

/**
 * A base class for Form Builder Field Media.
 *
 * @class A.FormBuilderFieldMedia
 * @extends A.FormFieldMedia
 * @uses A.FormBuilderFieldBase
 * @param {Object} config Object literal specifying widget configuration
 *     properties.
 * @constructor
 */
A.FormBuilderFieldMedia = A.Base.create('form-builder-field-media', A.FormFieldMedia, [A.FormBuilderFieldBase], {
    SETTINGS_DIVIDER_POSITION: 2,

    /**
     * Constructor for the `A.FormFieldMedia`. Lifecycle.
     *
     * @method initializer
     * @protected
     */
    initializer: function() {
        var i = 0,
            settings = this._getSettings();

        for (i = 0; i < settings.length; i++) {
            if (settings[i].attrName === 'imageSource') {
                settings[i].editor.after('loadedChange', A.bind(this._afterLoadedChange, this));
            }
        }
    },

    /**
     * Fires after `loaded` attribute from Image URL Editor be changed.
     *
     * @method _afterLoadedChange
     * @param {CustomEvent} event The fired event
     * @protected
     */
    _afterLoadedChange: function(event) {
        if (event.newVal) {
            this.fire('status', {
                ready: true
            });
        }
        else {
            this.fire('status', {
                ready: false
            });
        }
    },

    /**
     * Fills the settings array with the information for this field.
     *
     * @method _fillSettings
     * @override
     * @protected
     */
    _fillSettings: function() {
        this._settings.push(
            {
                attrName: 'imageInfo',
                editor: new A.TextDataEditor({
                    label: 'Add copyright, source or subtitle.'
                })
            },
            {
                attrName: 'imageSource',
                editor: new A.ImageURLDataEditor({
                    label: 'Add URL',
                    required: true
                })
            }
        );
    }
});
