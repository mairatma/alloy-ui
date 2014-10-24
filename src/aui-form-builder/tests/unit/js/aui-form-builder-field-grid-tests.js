YUI.add('aui-form-builder-field-grid-tests', function(Y) {

    var suite = new Y.Test.Suite('aui-form-builder-field-grid');

    suite.add(new Y.Test.Case({
        name: 'Form Builder Field Grid Tests',

        tearDown: function() {
            if (this._field) {
                this._field.destroy();
            }
        },

        /**
         * Creates a field instance.
         *
         * @method _createField
         * @protected
         */
        _createField: function() {
            this._field = new Y.FormBuilderFieldGrid();
            Y.one('#container').append(this._field.get('content'));
        },

        'should be able to edit rowns and collumns': function() {
            var settings = Y.one('#settings');

            this._createField();
            this._field.renderSettingsPanel(settings);

            settings.all('input[type="checkbox"]').item(0).set('checked', true);

            settings.all('.options-data-editor-add').item(0).simulate('click');
            settings.all('.options-data-editor-option').item(0).one('input').set('value', 'Row 1');
            settings.all('.options-data-editor-add').item(1).simulate('click');
            settings.all('.options-data-editor-option').item(1).one('input').set('value', 'Col 1');

            this._field.saveSettings();

            Y.Assert.isTrue(this._field.get('required'));
            Y.Assert.areEqual('Row 1', this._field.get('rowns')[0]);
            Y.Assert.areEqual('Col 1', this._field.get('collumns')[0]);
        },

        'should render correctly': function() {
            this._createField();

            this._field.set('rowns', ['Row1', 'Row2']);
            Y.Assert.areEqual(
                2,
                this._field.get('content').all('.form-builder-field-rown-option').size()
            );

            this._field.set('collumns', ['Col1', 'Col2', 'Col3']);
            Y.Assert.areEqual(
                3,
                this._field.get('content').all('.form-builder-field-collumn-option').size()
            );
        }
    }));

    Y.Test.Runner.add(suite);
}, '', {
    requires: ['aui-form-builder-field-grid', 'node-event-simulate', 'test']
});
