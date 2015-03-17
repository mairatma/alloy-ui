YUI.add('aui-form-field-media-tests', function(Y) {

    var suite = new Y.Test.Suite('aui-form-field-media');

    suite.add(new Y.Test.Case({
        name: 'Form Field Text Tests',

        tearDown: function() {
            if (this._field) {
                this._field.destroy();
            }
        },

        'should render imageInfo text': function() {
            var fieldNode,
                info;

            this._field = new Y.FormFieldMedia({
                imageInfo: 'copyright'
            });
            fieldNode = this._field.get('content');
            info = fieldNode.one('.form-field-media-info');

            Y.Assert.areEqual('©copyright', info.get('innerHTML'));

            this._field.set('imageInfo', 'info');
            Y.Assert.areEqual('©info', info.get('innerHTML'));
        },

        'should render image': function() {
            var fieldNode,
                image;

            this._field = new Y.FormFieldMedia({
                imageSource: 'assets/lfr-soccer-6.jpg'
            });
            fieldNode = this._field.get('content');
            image = fieldNode.one('.form-field-media-image');

            Y.Assert.isTrue(image.get('src').indexOf('assets/lfr-soccer-6.jpg') > 0);

            this._field.set('imageSource', 'assets/lfr-soccer-7.jpg');
            Y.Assert.isTrue(image.get('src').indexOf('assets/lfr-soccer-7.jpg') > 0);
        }
    }));

    Y.Test.Runner.add(suite);
}, '', {requires: ['aui-form-field-media', 'test']});
