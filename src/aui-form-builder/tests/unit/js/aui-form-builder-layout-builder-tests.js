YUI.add('aui-form-builder-layout-builder-tests', function(Y) {

    var desktopDefaultSize = 1500,
        suite = new Y.Test.Suite('aui-form-builder-layout-builder'),
        windowNode = Y.one(Y.config.win);

    suite.add(new Y.Test.Case({
        name: 'AUI Form Builder Layout Builder Unit Tests',

        init: function() {
            // Set the width to a big value so all layout buil
            // guaranteed to be turned on.
            this._originalWidth = windowNode.get('innerWidth');
        },

        setUp: function() {
            windowNode.set('innerWidth', desktopDefaultSize);
        },

        destroy: function() {
            Y.one(Y.config.win).set('innerWidth', this._originalWidth);
        },

        tearDown: function() {
            if (this._formBuilder) {
                this._formBuilder.destroy();
            }
        },

        _createFormBuilder: function(config, skipRender) {
            this._formBuilder = new Y.FormBuilder(Y.merge({
                layout: new Y.Layout({
                    rows: [
                        new Y.LayoutRow({
                            cols: [
                                new Y.LayoutCol({
                                    movableContent: true,
                                    size: 4,
                                    value: new Y.FormBuilderFieldSentence({
                                        help: 'My Help',
                                        nestedFields: [
                                            new Y.FormBuilderFieldText({
                                                help: 'First nested field',
                                                title: 'Nested Field 1'
                                            }),
                                            new Y.FormBuilderFieldText({
                                                help: 'Second nested field',
                                                title: 'Nested Field 2'
                                            })
                                        ],
                                        title: 'My Title'
                                    })
                                }),
                                new Y.LayoutCol({
                                    size: 4
                                }),
                                new Y.LayoutCol({
                                    size: 4,
                                    value: new Y.FormBuilderFieldSentence({
                                        title: 'Another Field'
                                    })
                                })
                            ]
                        })
                    ]
                })
            }, config));

            if (!skipRender) {
                this._formBuilder.render('#container');
            }
        },

        _openToolbar: function(fieldNode) {
            fieldNode = fieldNode || Y.one('.form-builder-field-content-toolbar');

            if (Y.UA.mobile) {
                Y.one('.form-builder-field-content').simulate('click');
            } else {
                fieldNode.simulate('mouseover');
                fieldNode.one('.form-builder-field-toolbar-toggle').simulate('click');
            }
        },

        'should put add page break in the same container of add row button': function() {
            var layout;

            this._createFormBuilder({
                mode: Y.FormBuilder.MODES.LAYOUT
            });

            layout = this._formBuilder.get('layout');
            Y.Assert.areEqual(2, Y.one('.layout-builder-add-row-area').get('children').size());

            if (Y.UA.ie === 8) {
                // Can't simulate a resize on IE8's window object, so
                // calling the function directly here.
                layout._handleResponsive(Y.one(Y.config.win).get('innerWidth'));
            }
            else {
                // 500 is lower than responsive breakpoint
                Y.one(Y.config.win).set('innerWidth', 500);
                Y.one(Y.config.win).simulate('resize');
            }

            this.wait(function() {
                Y.Assert.isNull(Y.one('.layout-builder-add-row-area'));

                Y.one(Y.config.win).set('innerWidth', desktopDefaultSize);
                Y.one(Y.config.win).simulate('resize');

                this.wait(function() {
                    Y.Assert.areEqual(2, Y.one('.layout-builder-add-row-area').get('children').size());
                }, Y.config.windowResizeDelay || 100);
            }, Y.config.windowResizeDelay || 100);
        },

        'should the row height adjust on form builder mode change': function() {
            var height;

            this._createFormBuilder();

            height = Y.all('.layout-row-container-row').item(1).getStyle('height');
            this._formBuilder.set('mode', Y.FormBuilder.MODES.LAYOUT);
            Y.Assert.isTrue(parseInt(Y.all('.layout-row-container-row').item(1).getStyle('height')) > parseInt(height));

            height = Y.all('.layout-row-container-row').item(1).getStyle('height');
            this._formBuilder.set('mode', Y.FormBuilder.MODES.REGULAR);
            Y.Assert.isFalse(parseInt(Y.all('.layout-row-container-row').item(1).getStyle('height')) > parseInt(height));
        },

        'should be able to add rows on both regular and layout mode': function() {
            var button;

            this._createFormBuilder();

            button = this._formBuilder.get('contentBox').one('.layout-builder-add-row-area');
            Y.Assert.isNotNull(button);
            Y.Assert.areNotEqual('none', button.getStyle('display'));

            this._formBuilder.set('mode', Y.FormBuilder.MODES.LAYOUT);
            button = this._formBuilder.get('contentBox').one('.layout-builder-add-row-area');
            Y.Assert.isNotNull(button);
            Y.Assert.areNotEqual('none', button.getStyle('display'));
        },

        'should only be able to remove rows on layout mode': function() {
            var button;

            this._createFormBuilder();

            button = this._formBuilder.get('contentBox').one('.layout-builder-remove-row-button');
            Y.Assert.isNull(button);

            this._formBuilder.set('mode', Y.FormBuilder.MODES.LAYOUT);
            button = this._formBuilder.get('contentBox').one('.layout-builder-remove-row-button');
            Y.Assert.isNotNull(button);
            Y.Assert.areNotEqual('none', button.getStyle('display'));
        },

        'should be able to add cols on both regular and layout mode': function() {
            var button;

            this._createFormBuilder();

            button = this._formBuilder.get('contentBox').one('.layout-builder-add-col');
            Y.Assert.isNotNull(button);

            this._formBuilder.set('mode', Y.FormBuilder.MODES.LAYOUT);
            button = this._formBuilder.get('contentBox').one('.layout-builder-add-col');
            Y.Assert.isNotNull(button);
        },

        'should not be able to remove cols on regular mode': function() {
            var button;

            this._createFormBuilder();

            button = this._formBuilder.get('contentBox').one('.layout-builder-remove-col-button');
            Y.Assert.isNull(button);

            this._formBuilder.set('mode', Y.FormBuilder.MODES.LAYOUT);
            button = this._formBuilder.get('contentBox').one('.layout-builder-remove-col-button');
            Y.Assert.isNotNull(button);
        },

        'should not be able to move rows on regular mode': function() {
            var button,
                contentBox;

            this._createFormBuilder();

            contentBox = this._formBuilder.get('contentBox');

            button = contentBox.one('.layout-builder-move-cut-row-button');
            Y.Assert.isNull(button);

            this._formBuilder.set('mode', Y.FormBuilder.MODES.LAYOUT);
            button = contentBox.one('.layout-builder-move-cut-row-button');
            Y.Assert.isNotNull(button);
        },

        'should be able to move cols on regular mode': function() {
            this._createFormBuilder();

            this._toolbar = new Y.FormBuilderFieldToolbar({
                formBuilder: this._formBuilder
            });

            this._openToolbar();
            Y.all('.form-builder-field-toolbar-item').item(2).simulate('click');

            Y.Assert.isNotNull(Y.one('.form-builder-field-move-target'));

            this._openToolbar();
            Y.all('.form-builder-field-toolbar-item').item(2).simulate('click');

            Y.Assert.isNull(Y.one('.form-builder-choose-col-move .form-builder-field-move-target'));
        },

        'should be able to resize cols on both regular and layout mode': function() {
            var draggable;

            this._createFormBuilder();

            draggable = this._formBuilder.get('contentBox').one('.layout-builder-resize-col-draggable');
            Y.Assert.isNotNull(draggable);

            this._formBuilder.set('mode', Y.FormBuilder.MODES.LAYOUT);
            draggable = this._formBuilder.get('contentBox').one('.layout-builder-resize-col-draggable');
            Y.Assert.isNotNull(draggable);
        },

        'should add/remove css class when on/off layout mode': function() {
            this._createFormBuilder();

            Y.Assert.isFalse(this._formBuilder.get('boundingBox').hasClass('form-builder-layout-mode'));

            this._formBuilder.set('mode', Y.FormBuilder.MODES.LAYOUT);
            Y.Assert.isTrue(this._formBuilder.get('boundingBox').hasClass('form-builder-layout-mode'));

            this._formBuilder.set('mode', Y.FormBuilder.MODES.REGULAR);
            Y.Assert.isFalse(this._formBuilder.get('boundingBox').hasClass('form-builder-layout-mode'));
        },

        'should update layout when it changes': function() {
            var rowNodes;

            this._createFormBuilder();

            rowNodes = this._formBuilder.get('contentBox').all('.layout-row');
            Y.Assert.areEqual(2, rowNodes.size());

            this._formBuilder.set('layout', new Y.Layout());
            rowNodes = this._formBuilder.get('contentBox').all('.layout-row');
            Y.Assert.areEqual(1, rowNodes.size());
        },

        'should not break if changing mode and layout before rendering': function() {
            var button;

            this._createFormBuilder({}, true);

            this._formBuilder.set('mode', Y.FormBuilder.MODES.LAYOUT);
            this._formBuilder.set('mode', Y.FormBuilder.MODES.REGULAR);
            this._formBuilder.set('mode', Y.FormBuilder.MODES.LAYOUT);

            this._formBuilder.set('layout', new Y.Layout());

            button = this._formBuilder.get('contentBox').one('.layout-builder-remove-row-button');
            Y.Assert.isNull(button);
        },

        'should update with new attributes after rendering': function() {
            var rowNodes;

            this._createFormBuilder({}, true);

            this._formBuilder.set('mode', Y.FormBuilder.MODES.LAYOUT);
            this._formBuilder.set('layout', new Y.Layout({
                rows: [
                    new Y.LayoutRow(),
                    new Y.LayoutRow()
                ]
            }));

            this._formBuilder.render('#container');
            rowNodes = this._formBuilder.get('contentBox').all('.layout-row');
            Y.Assert.areEqual(3, rowNodes.size());

            Y.Assert.isTrue(this._formBuilder.get('boundingBox').hasClass('form-builder-layout-mode'));
        },

        'should show valid field move targets for root field': function() {
            var moveItem,
                row,
                rowNode,
                visibleTargets;

            this._createFormBuilder({
                mode: Y.FormBuilder.MODES.REGULAR
            });

            this._toolbar = this._formBuilder._fieldToolbar;
            this._openToolbar();

            moveItem = this._toolbar._toolbar.one('.glyphicon-move').ancestor();

            row = this._formBuilder.get('layout').get('rows')[1];
            rowNode = row.get('node');

            moveItem.simulate('click');
            visibleTargets = rowNode.all('.form-builder-field-move-target').filter(function(node) {
                return node.getStyle('visibility') !== 'hidden';
            });
            Y.Assert.areEqual(2, visibleTargets.size());

            moveItem.simulate('click');
            visibleTargets = rowNode.all('.form-builder-field-move-target').filter(function(node) {
                return node.getStyle('display') !== 'none';
            });
            Y.Assert.areEqual(0, visibleTargets.size());
        },

        'should show valid field move targets for nested field': function() {
            var moveItem,
                row,
                rowNode,
                visibleTargets;

            this._createFormBuilder({
                mode: Y.FormBuilder.MODES.REGULAR
            });

            this._toolbar = this._formBuilder._fieldToolbar;

            this._openToolbar(Y.all('.form-builder-field-content-toolbar').item(1));

            moveItem = this._toolbar._toolbar.one('.glyphicon-move').ancestor();

            row = this._formBuilder.get('layout').get('rows')[1];
            rowNode = row.get('node');

            moveItem.simulate('click');
            visibleTargets = rowNode.all('.form-builder-field-move-target').filter(function(node) {
                return node.getStyle('visibility') !== 'hidden';
            });
            Y.Assert.areEqual(4, visibleTargets.size());

            moveItem.simulate('click');
            visibleTargets = rowNode.all('.form-builder-field-move-target').filter(function(node) {
                return node.getStyle('display') !== 'none';
            });
            Y.Assert.areEqual(0, visibleTargets.size());
        },

        'should allow moving the whole field to another column': function() {
            var col,
                cols,
                field,
                moveItem,
                row;

            this._createFormBuilder({
                mode: Y.FormBuilder.MODES.REGULAR
            });

            this._toolbar = this._formBuilder._fieldToolbar;

            this._openToolbar();

            moveItem = this._toolbar._toolbar.one('.glyphicon-move').ancestor();

            row = this._formBuilder.get('layout').get('rows')[1];
            cols = row.get('cols');
            field = cols[0].get('value');

            moveItem.simulate('click');
            cols[1].get('node').one('.layout-builder-move-col-target').simulate('click');

            col = row.get('cols')[0];
            Y.Assert.areNotEqual(field, col.get('value'));
            Y.Assert.isFalse(col.get('movableContent'));

            col = row.get('cols')[1];
            Y.Assert.areEqual(field, col.get('value'));
            Y.Assert.isTrue(col.get('movableContent'));
        },

        'should allow moving fields inside other fields': function() {
            var cols,
                field,
                row;

            this._createFormBuilder({
                mode: Y.FormBuilder.MODES.REGULAR
            });

            this._toolbar = this._formBuilder._fieldToolbar;

            this._openToolbar(Y.all('.form-builder-field-content-toolbar').item(1));

            row = this._formBuilder.get('layout').get('rows')[1];
            cols = row.get('cols');
            field = cols[0].get('value').get('nestedFields')[0];

            this._toolbar._toolbar.one('.glyphicon-move').ancestor().simulate('click');

            cols[2].get('node').one('.layout-builder-move-col-target').simulate('click');

            Y.Assert.areEqual(1, cols[0].get('value').get('nestedFields').length);
            Y.Assert.areNotEqual(field, cols[0].get('value').get('nestedFields')[0]);

            Y.Assert.areEqual(1, cols[2].get('value').get('nestedFields').length);
            Y.Assert.areEqual(field, cols[2].get('value').get('nestedFields')[0]);
        },

        'should resizing the row when move a nested field to another col': function() {
            var cols,
                field,
                heightAfterMode,
                heightBeforeMode,
                row;

            this._createFormBuilder({
                mode: Y.FormBuilder.MODES.REGULAR
            });

            this._toolbar = this._formBuilder._fieldToolbar;

            this._openToolbar(Y.all('.form-builder-field-content-toolbar').item(1));

            row = this._formBuilder.get('layout').get('rows')[1];
            cols = row.get('cols');
            field = cols[0].get('value').get('nestedFields')[0];

            heightAfterMode = Y.all('.layout-row-container-row').item(1).getStyle('height');

            this._toolbar._toolbar.one('.glyphicon-move').ancestor().simulate('click');

            cols[2].get('node').one('.layout-builder-move-col-target').simulate('click');

            heightBeforeMode = Y.all('.layout-row-container-row').item(1).getStyle('height');

            Y.Assert.areEqual(1, cols[0].get('value').get('nestedFields').length);
            Y.Assert.areNotEqual(field, cols[0].get('value').get('nestedFields')[0]);

            Y.Assert.areEqual(1, cols[2].get('value').get('nestedFields').length);
            Y.Assert.areEqual(field, cols[2].get('value').get('nestedFields')[0]);
        },

        'should not have move item if col\'s content is not movable': function() {
            this._createFormBuilder({
                mode: Y.FormBuilder.MODES.REGULAR
            });

            this._formBuilder.get('layout').get('rows')[1].get('cols')[0].set('movableContent', false);

            this._toolbar = this._formBuilder._fieldToolbar;
            this._openToolbar();

            Y.Assert.areEqual(5, this._toolbar.get('items').length);
            Y.Assert.areEqual(4, Y.all('.form-builder-field-toolbar-item:not(.hidden)').size());
        },

        'should not have move target if col\'s content is not movable': function() {
            var moveItem,
                row,
                rowNode,
                visibleTargets;

            this._createFormBuilder();

            this._formBuilder.get('layout').get('rows')[1].get('cols')[2].set('movableContent', false);

            this._openToolbar();

            moveItem = Y.one('.glyphicon-move').ancestor();
            moveItem.simulate('click');

            row = this._formBuilder.get('layout').get('rows')[1];
            rowNode = row.get('node');

            visibleTargets = rowNode.all('.form-builder-field-move-target').filter(function(node) {
                return node.getStyle('visibility') !== 'hidden' && node.getStyle('display') !== 'none';
            });
            Y.Assert.areEqual(1, visibleTargets.size());
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: [
        'aui-form-builder',
        'aui-form-builder-field-sentence',
        'aui-form-builder-field-text',
        'node-event-simulate',
        'test'
    ],
    test: function(Y) {
        return Y.UA.ie === 0 || Y.UA.ie > 8;
    }
});
