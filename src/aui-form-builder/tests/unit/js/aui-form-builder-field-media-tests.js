YUI.add('aui-form-builder-field-media-tests', function(Y) {

    var suite = new Y.Test.Suite('aui-form-builder-field-media');

    suite.add(new Y.Test.Case({
        name: 'Form Builder Field Text Tests',

        tearDown: function() {
            if (this._field) {
                this._field.destroy();
            }
        },

        /**
         * Simulates a `valuechange` event for the given input.
         *
         * @method _simulateInputChange
         * @param {Node} input The input node to simulate the event for.
         * @param {String} text The text that should be set as the input's final value.
         * @param {Function} callback The function to be called when the simulation is
         *   done.
         * @protected
         */
        _simulateInputChange: function(input, text, callback) {
            input.simulate('keydown');
            input.set('value', text);
            input.simulate('keydown');

            this.wait(callback, Y.ValueChange.POLL_INTERVAL);
        },

        'should be able to edit settings': function() {
            var instance = this,
                container = Y.one('#container'),
                inputs;

            this._field = new Y.FormBuilderFieldMedia();
            this._field.renderSettingsPanel(container);

            inputs = container.all('input[type="text"]');
            this._simulateInputChange(inputs.item(2), 'copyright', function() {
                instance._simulateInputChange(container.one('.image-url-data-editor-input-url'), 'assets/lfr-soccer-7.jpg', function() {
                    instance._field.saveSettings();

                    Y.Assert.areEqual('copyright', instance._field.get('imageInfo'));
                    Y.Assert.areEqual('assets/lfr-soccer-7.jpg', instance._field.get('imageSource'));
                });
            });
        }
    }));

    Y.Test.Runner.add(suite);
}, '', {
    requires: ['aui-form-builder-field-media', 'node-event-simulate', 'test']
});