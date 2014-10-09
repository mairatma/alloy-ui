YUI.add('aui-layout-builder-move-row-tests', function(Y) {

    var Assert = Y.Assert,
        container,
        layout,
        suite = new Y.Test.Suite('aui-layout-builder-move-row');

    suite.add(new Y.Test.Case({
        name: 'Layout Builder Move Row Tests',

        setUp: function() {

            layout = new Y.Layout({
                rows: [
                    new Y.LayoutRow({
                        cols: [
                            new Y.LayoutCol({
                                size: 3,
                                value: { content: 'foo' }
                            }),
                            new Y.LayoutCol({
                                size: 3,
                                value: { content: 'foo' }
                            }),
                            new Y.LayoutCol({
                                size: 3,
                                value: { content: 'foo' }
                            }),
                            new Y.LayoutCol({
                                size: 3,
                                value: { content: 'foo' }
                            })
                        ]
                    }),
                    new Y.LayoutRow({
                        cols: [
                            new Y.LayoutCol({
                                size: 4,
                                value: { content: 'foo' }
                            }),
                            new Y.LayoutCol({
                                size: 4,
                                value: { content: 'foo' }
                            }),
                            new Y.LayoutCol({
                                size: 4,
                                value: { content: 'foo' }
                            })
                        ]
                    })
                ]
            });

            this.layoutBuilder = new Y.LayoutBuilder({
                container: Y.one('.container'),
                layout: layout
            });

            container = this.layoutBuilder.get('container');
        },

        tearDown: function() {
            this.layoutBuilder.destroy();
        },

        'should change row\'s position': function() {
            var moveRowButton = container.all('.layout-builder-move-row-button').last(),
                rows = this.layoutBuilder.get('layout').get('rows'),
                target;

            Assert.areEqual(3, rows[1].get('cols').length);

            moveRowButton.simulate('click');

            target = container.one('.layout-builder-move-row-target');
            target.simulate('click');

            rows = this.layoutBuilder.get('layout').get('rows');

            Assert.areEqual(4, rows[1].get('cols').length);
        },

        'should be able to cancel the move action': function() {
            var cancelButton,
                moveRowButton = container.one('.layout-builder-move-row-button'),
                targets;

            moveRowButton.simulate('click');

            targets = container.one('.layout-builder-move-row-target');

            Assert.isNotNull(targets);

            cancelButton = container.one('.layout-builder-move-cancel-targets');
            cancelButton.simulate('click');

            targets = container.one('.layout-builder-move-row-target');

            Assert.isNull(targets);
        },

        'should hide move row button if disable enableAddRows attribute': function() {
            var button = container.one('.layout-builder-move-row-button');

            Assert.isNotNull(button);

            this.layoutBuilder.set('enableMoveRows', false);

            button = container.one('.layout-builder-move-row-button');

            Assert.isNull(button);
        },

        'should disable enableMoveRows attribute when creating the layout builder': function() {
            var button;

            this.layoutBuilder.destroy();

            this.layoutBuilder = new Y.LayoutBuilder({
                container: Y.one('.container'),
                enableMoveRows: false,
                layout: layout
            });

            button = container.one('.layout-builder-move-row-button');

            Assert.isNull(button);
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: ['test', 'aui-layout-builder', 'aui-classnamemanager', 'node-event-simulate']
});
