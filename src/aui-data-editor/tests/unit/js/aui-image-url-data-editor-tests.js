YUI.add('aui-image-url-data-editor-tests', function(Y) {

    var suite = new Y.Test.Suite('aui-image-url-data-editor');

    suite.add(new Y.Test.Case({
        name: 'AUI Image URL Data Editor Unit Tests',

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

        'should set original value on the ui': function() {
            var editor = new Y.ImageURLDataEditor({
                editedValue: 'assets/lfr-soccer-7.jpg',
                originalValue: 'assets/lfr-soccer-7.jpg'
            });

            Y.Assert.areEqual('assets/lfr-soccer-7.jpg', editor.get('node').one('.image-url-data-editor-input-url').get('value'));
            Y.Assert.areEqual('assets/lfr-soccer-7.jpg', editor.get('editedValue'));
        },

        'should preview image on input paste': function() {
            var editor = new Y.ImageURLDataEditor(),
                node = editor.get('node'),
                inputURL = node.one('.image-url-data-editor-input-url');

            editor._onInputPaste();
            this._simulateInputChange(inputURL, 'assets/lfr-soccer-6.jpg', function() {
                editor._paste = true;
                editor.set('loaded', true);
                Y.Assert.isFalse(node.one('.image-url-data-editor-image-content').hasClass('hide'));
                Y.Assert.isTrue(node.one('.image-url-data-editor-input-url-content').hasClass('hide'));
            });
        },

        'should get edited value from the ui': function() {
            var editor = new Y.ImageURLDataEditor({
                    editedValue: 'assets/lfr-soccer-7.jpg',
                    originalValue: 'assets/lfr-soccer-7.jpg'
                }),
                node = editor.get('node');

            this._simulateInputChange(node.one('.image-url-data-editor-input-url'), 'assets/lfr-soccer-6.jpg', function() {
                node.one('.image-url-data-editor-input-url-preview-button').simulate('click');
                Y.Assert.areEqual('assets/lfr-soccer-6.jpg', editor.get('editedValue'));
            });
        },

        'should check if the form is valid': function() {
            var editor = new Y.ImageURLDataEditor();

            Y.Assert.isTrue(editor.isValid());

            editor.set('required', true);
            Y.Assert.isFalse(editor.isValid());

            editor.set('editedValue', '   ');
            Y.Assert.isFalse(editor.isValid());

            editor.set('editedValue', 'assets/lfr-soccer-6.jpg');
            Y.Assert.isTrue(editor.isValid());
        },

        'should preview the image': function() {
            var editor = new Y.ImageURLDataEditor(),
                node = editor.get('node'),
                previewButton = node.one('.image-url-data-editor-input-url-preview-button'),
                URLContent = node.one('.image-url-data-editor-input-url-content'),
                imageContent = node.one('.image-url-data-editor-image-content');

            previewButton.simulate('click');
            Y.Assert.isFalse(URLContent.hasClass('hide'));
            Y.Assert.isTrue(imageContent.hasClass('hide'));

            this._simulateInputChange(node.one('.image-url-data-editor-input-url'), 'assets/lfr-soccer-6.jpg', function() {
                Y.Assert.isFalse(URLContent.hasClass('hide'));
                Y.Assert.isTrue(imageContent.hasClass('hide'));

                setTimeout(function () {
                    previewButton.simulate('click');
                    Y.Assert.isTrue(URLContent.hasClass('hide'));
                    Y.Assert.isFalse(imageContent.hasClass('hide'));
                }, 90);
            });
        },

        'should set and change the image': function() {
            var editor = new Y.ImageURLDataEditor(),
                node = editor.get('node'),
                imageContent = node.one('.image-url-data-editor-image-content'),
                inputURL = node.one('.image-url-data-editor-input-url'),
                URLContent = node.one('.image-url-data-editor-input-url-content');

            this._simulateInputChange(inputURL, 'assets/lfr-soccer-6.jpg', function() {
                node.one('.image-url-data-editor-input-url-preview-button').simulate('click');

                Y.Assert.isTrue(URLContent.hasClass('hide'));
                Y.Assert.isFalse(imageContent.hasClass('hide'));

                node.one('.image-url-data-editor-image-change-button').simulate('click');
                Y.Assert.isFalse(URLContent.hasClass('hide'));
                Y.Assert.isTrue(imageContent.hasClass('hide'));

                this._simulateInputChange(inputURL, 'assets/lfr-soccer-7.jpg', function() {
                    Y.Assert.areEqual('assets/lfr-soccer-7.jpg', editor.get('editedValue'));
                });
            });
        },

        'shouldn\'t add a image when a invalid url is setted': function() {
            var editor = new Y.ImageURLDataEditor(),
                node = editor.get('node'),
                inputURL = node.one('.image-url-data-editor-input-url');

                Y.Assert.isFalse(node.hasClass('has-error'));

            this._simulateInputChange(inputURL, 'assets/lfr-soccer-10.jpg', function() {
                setTimeout(function () {
                    Y.Assert.isTrue(node.hasClass('has-error'));
                }, 90);
            });
        },

        'should check if the image is in cache': function() {
            var editor = new Y.ImageURLDataEditor(),
                image = new Image(),
                node = editor.get('node'),
                inputURL = node.one('.image-url-data-editor-input-url'),
                previewButton = node.one('.image-url-data-editor-input-url-preview-button');

            this._simulateInputChange(inputURL, 'assets/lfr-soccer-6.jpg', function() {
                previewButton.simulate('click');
                node.one('.image-url-data-editor-image-change-button').simulate('click');

                this._simulateInputChange(inputURL, '', function() {
                    image.src = 'assets/lfr-soccer-6.jpg';
                    Y.Assert.isTrue(image.complete);
                });
            });
        },

        'should content be prepared': function() {
            var editor = new Y.ImageURLDataEditor(),
                node = editor.get('node'),
                inputURL = node.one('.image-url-data-editor-input-url'),
                imageContent = node.one('.image-url-data-editor-image-content'),
                URLContent = node.one('.image-url-data-editor-input-url-content');

            this._simulateInputChange(inputURL, 'assets/lfr-soccer-6.jpg', function() {
                node.one('.image-url-data-editor-input-url-preview-button').simulate('click');
                Y.Assert.isFalse(imageContent.hasClass('hide'));
                Y.Assert.isTrue(URLContent.hasClass('hide'));

                editor.prepareContent();
                Y.Assert.isTrue(imageContent.hasClass('hide'));
                Y.Assert.isFalse(URLContent.hasClass('hide'));
            });
        }
    }));

    Y.Test.Runner.add(suite);


},'', { requires: [ 'aui-image-url-data-editor', 'node-event-simulate', 'test' ] });
