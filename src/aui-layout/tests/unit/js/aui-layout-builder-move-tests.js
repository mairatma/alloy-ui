YUI.add('aui-layout-builder-move-tests', function(Y) {

    var Assert = Y.Assert,
        container,
        layout,
        suite = new Y.Test.Suite('aui-layout-builder-move');

    suite.add(new Y.Test.Case({
        name: 'Layout Builder Move Tests',

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
                    }),
                    new Y.LayoutRow({
                        cols: [
                            new Y.LayoutCol({
                                size: 6,
                                value: { content: 'foo' }
                            }),
                            new Y.LayoutCol({
                                size: 6,
                                value: { content: 'foo' }
                            })
                        ]
                    }),
                    new Y.LayoutRow({
                        cols: [
                            new Y.LayoutCol({
                                size: 12,
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

        'should appear cut button when click on move button': function() {
            var cutColButton,
                cutRowButton,
                moveButton = container.one('.layout-builder-move-button'),
                row = layout.get('rows')[0];

            moveButton.simulate('click');

            cutRowButton = container.all('.layout-builder-move-cut-row-button');
            cutColButton = container.all('.layout-builder-move-cut-col-button');

            Assert.areEqual(1, cutRowButton.size());
            Assert.areEqual(row.get('cols').length, cutColButton.size());
        },

        'should change row\'s position': function() {
            var cutButton,
                moveButton = container.all('.layout-builder-move-button').last(),
                rows = this.layoutBuilder.get('layout').get('rows'),
                target;

            Assert.areEqual(3, rows[1].get('cols').length);

            moveButton.simulate('click');

            cutButton = container.one('.layout-builder-move-cut-button');
            cutButton.simulate('click');

            target = container.one('.layout-builder-move-target');
            target.simulate('click');

            rows = this.layoutBuilder.get('layout').get('rows');

            Assert.areEqual(4, rows[1].get('cols').length);
        },

        'should be able to cancel the move action': function() {
            var cutButton,
                cancelButton,
                moveButton = container.one('.layout-builder-move-button');

            moveButton.simulate('click');

            cutButton = container.one('.layout-builder-move-cut-button');

            Assert.isNotNull(cutButton);

            cancelButton = container.one('.layout-builder-move-cancel-targets');
            cancelButton.simulate('click');

            cutButton = container.one('.layout-builder-move-cut-button');

            Assert.isNull(cutButton);
        },

        'should hide move row button if disable enableMove attribute': function() {
            var button = container.one('.layout-builder-move-button');

            Assert.isNotNull(button);

            this.layoutBuilder.set('enableMove', false);

            button = container.one('.layout-builder-move-button');

            Assert.isNull(button);
        },

        'should disable enableMove attribute when creating the layout builder': function() {
            var button;

            this.layoutBuilder.destroy();

            this.layoutBuilder = new Y.LayoutBuilder({
                container: Y.one('.container'),
                enableMove: false,
                layout: layout
            });

            button = container.one('.layout-builder-move-button');

            Assert.isNull(button);
        },

        'should not add cut row button if layout has only one row': function() {
            var button,
                cutRow;

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
                    })
                ]
            });

            this.layoutBuilder.set('layout', layout);

            button = this.layoutBuilder._layoutContainer.one('.layout-builder-move-button');
            button.simulate('click');

            cutRow = this.layoutBuilder._layoutContainer.one('.layout-builder-cut-row-button');

            Assert.isNull(cutRow);
        },

        'should not add cut col button if layout has 1 row and 1 col only': function() {
            var button,
                container = this.layoutBuilder._layoutContainer,
                cutCol;

            layout = new Y.Layout({
                rows: [
                    new Y.LayoutRow({
                        cols: [
                            new Y.LayoutCol({
                                size: 12,
                                value: { content: 'foo' }
                            })
                        ]
                    })
                ]
            });

            this.layoutBuilder.set('layout', layout);

            button = container.one('.layout-builder-move-button');
            button.simulate('click');

            cutCol = container.one('.layout-builder-move-cut-col-button');
            Assert.isNull(cutCol);
        },

        'should not add targets around clicked row': function() {
            var buttons,
                button,
                cutButton,
                rows,
                row0,
                row1;

            buttons = this.layoutBuilder._layoutContainer.all('.layout-builder-move-button');
            button = Y.one(buttons._nodes[1]);
            rows = container.all('.row');
            row0 = Y.one(rows._nodes[0]);
            row1 = Y.one(rows._nodes[1]);

            button.simulate('click');

            cutButton = container.one('.layout-builder-move-cut-button');
            cutButton.simulate('click');

            Assert.isFalse(row0.ancestor().next().hasClass('.layout-builder-move-row-target'));
            Assert.isFalse(row1.ancestor().next().hasClass('.layout-builder-move-row-target'));
        },

        'should not add target before an unmovable row and the row to be moved': function() {
            var cutButton,
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
                            ],
                            movable: false
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
                }),
                moveButton,
                targetArea;

            this.layoutBuilder.set('layout', layout);

            moveButton = container.all('.layout-builder-move-button').last();
            moveButton.simulate('click');

            cutButton = container.one('.layout-builder-move-cut-button');
            cutButton.simulate('click');

            targetArea = container.one('.layout-builder-move-target');

            Assert.areEqual(1, targetArea.getData('position'));
        },

        'should not add target after the row to be moved and the unmovable row': function() {
            var cutButton,
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
                            ],
                            movable: false
                        })
                    ]
                }),
                moveButton,
                targetArea;

            this.layoutBuilder.set('layout', layout);

            moveButton = Y.one(container.all('.layout-builder-move-button')._nodes[1]);
            moveButton.simulate('click');

            cutButton = container.one('.layout-builder-move-cut-button');
            cutButton.simulate('click');

            targetArea = container.one('.layout-builder-move-target');

            Assert.areNotEqual(4, targetArea.getData('position'));
        },

        'should add targets on cols': function() {
            var button,
                buttons,
                buttonCutCol,
                row = container.one('.row');

            buttons = this.layoutBuilder._layoutContainer.all('.layout-builder-move-button');
            button = Y.one(buttons._nodes[0]);

            button.simulate('click');

            buttonCutCol = row.one('.layout-builder-move-cut-col-button');
            buttonCutCol.simulate('click');

            Assert.areEqual(row.all('.col').size() - 1, row.all('.layout-builder-move-target').size());
        },

        'should move col': function() {
            var buttons,
                button,
                col,
                colTarget,
                cutColButton;

            buttons = container.all('.layout-builder-move-button');
            button = buttons.first();

            button.simulate('click');

            col = container.one('.col');
            Assert.areEqual('foo', col.getData('layout-col').get('value').content);

            cutColButton = container.one('.layout-builder-move-cut-col-button');
            cutColButton.simulate('click');

            colTarget = container.one('.layout-builder-move-col-target');
            colTarget.simulate('click');

            col = container.one('.col');
            Assert.isNull(col.getData('layout-col').get('value'));
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: ['test', 'aui-layout-builder', 'aui-classnamemanager', 'node-event-simulate']
});
