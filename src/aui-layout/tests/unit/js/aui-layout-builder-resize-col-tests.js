YUI.add('aui-layout-builder-resize-col-tests', function(Y) {

    var Assert = Y.Assert,
        Content,
        CSS_RESIZE_COL_BREAKPOINT = Y.getClassName('layout', 'builder', 'resize', 'col', 'breakpoint'),
        CSS_RESIZE_COL_DRAGGABLE = Y.getClassName('layout', 'builder', 'resize', 'col', 'draggable'),
        CSS_RESIZE_COL_DRAGGABLE_HANDLE = Y.getClassName('layout', 'builder', 'resize', 'col', 'draggable', 'handle'),
        suite = new Y.Test.Suite('aui-layout-builder-resize-col');

    Content = Y.Base.create('content', Y.Base, [], {}, {
        ATTRS: {
            content: {
                value: 'foo'
            }
        }
    });

    suite.add(new Y.Test.Case({
        name: 'Layout Builder Resize Col Tests',

        setUp: function() {
            this._layoutBuilder = new Y.LayoutBuilder({
                container: Y.one('.container'),
                layout: this._createTestLayout()
            });
        },

        tearDown: function() {
            this._layoutBuilder.destroy();
        },

        /**
         * Creates a layout for testing.
         *
         * @method _createTestLayout
         * @protected
         */
        _createTestLayout: function() {
            return new Y.Layout({
                rows: [
                    new Y.LayoutRow({
                        cols: [
                            new Y.LayoutCol({
                                value: new Content({ content: '3' }),
                                size: 3
                            }),
                            new Y.LayoutCol({
                                value: new Content({ content: '3' }),
                                size: 3
                            }),
                            new Y.LayoutCol({
                                value: new Content({ content: '3' }),
                                size: 3
                            }),
                            new Y.LayoutCol({
                                size: 3,
                                value: new Content({ content: '3' })
                            })
                        ]
                    }),
                    new Y.LayoutRow({
                        cols: [
                            new Y.LayoutCol({
                                size: 6,
                                value: new Content({ content: '6' })
                            }),
                            new Y.LayoutCol({
                                size: 6,
                                value: new Content({ content: '6' })
                            })
                        ]
                    }),
                    new Y.LayoutRow({
                        cols: [
                            new Y.LayoutCol({
                                size: 9,
                                value: new Content({ content: '9' })
                            }),
                            new Y.LayoutCol({
                                size: 3,
                                value: new Content({ content: '3' })
                            })
                        ]
                    }),
                    new Y.LayoutRow({
                        cols: [
                            new Y.LayoutCol({
                                size: 8,
                                value: new Content({ content: '8' })
                            }),
                            new Y.LayoutCol({
                                size: 4,
                                value: new Content({ content: '4' })
                            })
                        ]
                    }),
                    new Y.LayoutRow({
                        cols: [
                            new Y.LayoutCol({
                                value: new Content({ content: '4' }),
                                size: 4
                            }),
                            new Y.LayoutCol({
                                value: new Content({ content: '4' }),
                                size: 4
                            }),
                            new Y.LayoutCol({
                                value: new Content({ content: '4' }),
                                size: 4
                            })
                        ]
                    }),
                    new Y.LayoutRow({
                        cols: [
                            new Y.LayoutCol({
                                value: new Content({ content: '3' }),
                                size: 3
                            }),
                            new Y.LayoutCol({
                                value: new Content({ content: '3' }),
                                size: 3
                            }),
                            new Y.LayoutCol({
                                value: new Content({ content: '6' }),
                                size: 6
                            })
                        ]
                    })
                ]
            });
        },

        /**
         * Returns the visible nodes that match the given selector inside a row.
         *
         * @method _getRowNodes
         * @param {Y.LayoutRow} row
         * @param {String} selector
         * @protected
         */
        _getVisibleRowNodes: function(row, selector) {
            var nodes = row.get('node').all(selector),
                visible = [];

            nodes.each(function(node) {
                if (node.getStyle('display') !== 'none') {
                    visible.push(node);
                }
            });

            return visible;
        },

        /**
         * Simulates dragging the given dragHandle.
         *
         * @param {Y.Test.Case} test
         * @param {Node} dragHandle
         * @param {Array} position
         * @protected
         */
        _simulateDrag: function(test, dragHandle, position) {
            var shim;

            dragHandle.simulate('mousedown');
            test.wait(function() {
                shim = Y.one('.yui3-dd-shim');

                if (position) {
                    if (Y.Lang.isFunction(position)) {
                        position = position();
                    }
                    shim.simulate('mousemove', {
                        clientX: position[0],
                        clientY: position[1]
                    });
                }

                dragHandle.simulate('mouseup');
            }, Y.DD.DDM.get('clickTimeThresh') + 100);
        },

        /**
         * Simulates dragging the given dragHandle to the given breakpoint.
         *
         * @method _simulateDragToBreakpoint
         * @param {Y.Test.Case} test
         * @param {Node} dragHandle
         * @param {Node} breakpoint
         * @protected
         */
        _simulateDragToBreakpoint: function(test, dragHandle, breakpoint) {
            this._simulateDrag(test, dragHandle, function() {
                return [
                    breakpoint.get('region').left,
                    breakpoint.get('region').top
                ];
            });
        },

        'should append drag handlers for all borders that can be dragged': function() {
            var rows = this._layoutBuilder.get('layout').get('rows');

            Assert.areEqual(0, this._getVisibleRowNodes(rows[0], '.' + CSS_RESIZE_COL_DRAGGABLE_HANDLE).length);
            Assert.areEqual(1, this._getVisibleRowNodes(rows[1], '.' + CSS_RESIZE_COL_DRAGGABLE_HANDLE).length);
            Assert.areEqual(1, this._getVisibleRowNodes(rows[2], '.' + CSS_RESIZE_COL_DRAGGABLE_HANDLE).length);
            Assert.areEqual(1, this._getVisibleRowNodes(rows[3], '.' + CSS_RESIZE_COL_DRAGGABLE_HANDLE).length);
            Assert.areEqual(2, this._getVisibleRowNodes(rows[4], '.' + CSS_RESIZE_COL_DRAGGABLE_HANDLE).length);
            Assert.areEqual(1, this._getVisibleRowNodes(rows[5], '.' + CSS_RESIZE_COL_DRAGGABLE_HANDLE).length);
        },

        'should update drag handles when a new layout is set': function() {
            var rows;

            this._layoutBuilder.set('layout', new Y.Layout({rows: [
                new Y.LayoutRow({
                    cols: [
                        new Y.LayoutCol({
                            value: { content: '9' },
                            size: 9
                        }),
                        new Y.LayoutCol({
                            value: { content: '3' },
                            size: 3
                        })
                    ]
                }),
                new Y.LayoutRow({
                    cols: [
                        new Y.LayoutCol({
                            value: { content: '3' },
                            size: 3
                        }),
                        new Y.LayoutCol({
                            value: { content: '6' },
                            size: 6
                        }),
                        new Y.LayoutCol({
                            value: { content: '3' },
                            size: 3
                        })
                    ]
                })
            ]}));
            rows = this._layoutBuilder.get('layout').get('rows');

            Assert.areEqual(1, this._getVisibleRowNodes(rows[0], '.' + CSS_RESIZE_COL_DRAGGABLE_HANDLE).length);
            Assert.areEqual(2, this._getVisibleRowNodes(rows[1], '.' + CSS_RESIZE_COL_DRAGGABLE_HANDLE).length);
        },

        'should update drag handles when they layout rows change': function() {
            var rows;

            this._layoutBuilder.get('layout').addRow(0, new Y.LayoutRow({
                cols: [
                    new Y.LayoutCol({
                        value: { content: '9' },
                        size: 9
                    }),
                    new Y.LayoutCol({
                        value: { content: '3' },
                        size: 3
                    })
                ]
            })),
            rows = this._layoutBuilder.get('layout').get('rows');

            Assert.areEqual(1, this._getVisibleRowNodes(rows[0], '.' + CSS_RESIZE_COL_DRAGGABLE_HANDLE).length);
        },

        'should update drag handles when they layout cols change': function() {
            var row = this._layoutBuilder.get('layout').get('rows')[1];

            row.addCol(0, new Y.LayoutCol({
                value: { content: '1' },
                size: 1
            }));

            Assert.areEqual(2, this._getVisibleRowNodes(row, '.' + CSS_RESIZE_COL_DRAGGABLE_HANDLE).length);
        },

        'should insert layout grid on drag handle\'s click': function() {
            var breakpoints,
                dragHandle,
                row;

            // The second row has 2 columns with size 6 each.
            row = this._layoutBuilder.get('layout').get('rows')[1];
            dragHandle = row.get('node').one('.' + CSS_RESIZE_COL_DRAGGABLE_HANDLE);
            dragHandle.simulate('mousedown');

            breakpoints = this._getVisibleRowNodes(row, '.' + CSS_RESIZE_COL_BREAKPOINT);
            Y.Assert.areEqual(5, breakpoints.length);
            Y.Assert.areEqual(3, breakpoints[0].getData('layout-position'));
            Y.Assert.areEqual(4, breakpoints[1].getData('layout-position'));
            Y.Assert.areEqual(6, breakpoints[2].getData('layout-position'));
            Y.Assert.areEqual(8, breakpoints[3].getData('layout-position'));
            Y.Assert.areEqual(9, breakpoints[4].getData('layout-position'));

            // The fifth row has 3 columns with size 4 each.
            row = this._layoutBuilder.get('layout').get('rows')[4];
            dragHandle = row.get('node').one('.' + CSS_RESIZE_COL_DRAGGABLE_HANDLE);
            dragHandle.simulate('mousedown');

            breakpoints = this._getVisibleRowNodes(row, '.' + CSS_RESIZE_COL_BREAKPOINT);
            Y.Assert.areEqual(2, breakpoints.length);
            Y.Assert.areEqual(3, breakpoints[0].getData('layout-position'));
            Y.Assert.areEqual(4, breakpoints[1].getData('layout-position'));
        },

        'should update layout grid when breakpoints change': function() {
            var breakpoints,
                dragHandle,
                row;

            this._layoutBuilder.set('breakpoints', [5, 7]);

            row = this._layoutBuilder.get('layout').get('rows')[1];
            dragHandle = row.get('node').one('.' + CSS_RESIZE_COL_DRAGGABLE_HANDLE);
            dragHandle.simulate('mousedown');

            breakpoints = this._getVisibleRowNodes(row, '.' + CSS_RESIZE_COL_BREAKPOINT);
            Y.Assert.areEqual(2, breakpoints.length);
            Y.Assert.areEqual(5, breakpoints[0].getData('layout-position'));
            Y.Assert.areEqual(7, breakpoints[1].getData('layout-position'));
        },

        'should not insert layout grid for borders without handles': function() {
            var breakpoints,
                dragHandle,
                row = this._layoutBuilder.get('layout').get('rows')[0];

            dragHandle = row.get('node').one('.' + CSS_RESIZE_COL_DRAGGABLE);
            dragHandle.simulate('mousedown');

            breakpoints = this._getVisibleRowNodes(row, '.' + CSS_RESIZE_COL_BREAKPOINT);
            Y.Assert.areEqual(0, breakpoints.length);
        },

        'should resize columns when dropping handle on breakpoint': function() {
            var breakpoint,
                dragHandle,
                row = this._layoutBuilder.get('layout').get('rows')[1];

            dragHandle = row.get('node').one('.' + CSS_RESIZE_COL_DRAGGABLE_HANDLE);
            breakpoint = row.get('node').one('.' + CSS_RESIZE_COL_BREAKPOINT);
            this._simulateDragToBreakpoint(this, dragHandle, breakpoint);

            dragHandle = row.get('node').one('.' + CSS_RESIZE_COL_DRAGGABLE_HANDLE);
            Y.Assert.areEqual(3, dragHandle.getData('layout-position'));
            Y.Assert.areEqual(3, row.get('cols')[0].get('size'));
            Y.Assert.areEqual(9, row.get('cols')[1].get('size'));
        },

        'should not resize column if handle doesn\'s hit a breakpoint': function() {
            var dragHandle,
                row = this._layoutBuilder.get('layout').get('rows')[1];

            dragHandle = row.get('node').one('.' + CSS_RESIZE_COL_DRAGGABLE_HANDLE);
            this._simulateDrag(this, dragHandle, [10, 10]);

            dragHandle = row.get('node').one('.' + CSS_RESIZE_COL_DRAGGABLE_HANDLE);
            Y.Assert.areEqual(6, dragHandle.getData('layout-position'));
            Y.Assert.areEqual(6, row.get('cols')[0].get('size'));
            Y.Assert.areEqual(6, row.get('cols')[1].get('size'));
        },

        'should not resize column if handle move': function() {
            var dragHandle,
                row = this._layoutBuilder.get('layout').get('rows')[1];

            dragHandle = row.get('node').one('.' + CSS_RESIZE_COL_DRAGGABLE_HANDLE);
            this._simulateDrag(this, dragHandle);

            dragHandle = row.get('node').one('.' + CSS_RESIZE_COL_DRAGGABLE_HANDLE);
            Y.Assert.areEqual(6, dragHandle.getData('layout-position'));
            Y.Assert.areEqual(6, row.get('cols')[0].get('size'));
            Y.Assert.areEqual(6, row.get('cols')[1].get('size'));
        },

        'should not be able to resize col if enableResizeCols is false': function() {
            var rows;

            this._layoutBuilder = new Y.LayoutBuilder({
                container: Y.one('.container'),
                enableResizeCols: false,
                layout: this._createTestLayout()
            });
            rows = this._layoutBuilder.get('layout').get('rows');

            Assert.areEqual(0, this._getVisibleRowNodes(rows[0], '.' + CSS_RESIZE_COL_DRAGGABLE_HANDLE).length);
            Assert.areEqual(0, this._getVisibleRowNodes(rows[1], '.' + CSS_RESIZE_COL_DRAGGABLE_HANDLE).length);
            Assert.areEqual(0, this._getVisibleRowNodes(rows[2], '.' + CSS_RESIZE_COL_DRAGGABLE_HANDLE).length);
            Assert.areEqual(0, this._getVisibleRowNodes(rows[3], '.' + CSS_RESIZE_COL_DRAGGABLE_HANDLE).length);
            Assert.areEqual(0, this._getVisibleRowNodes(rows[4], '.' + CSS_RESIZE_COL_DRAGGABLE_HANDLE).length);
            Assert.areEqual(0, this._getVisibleRowNodes(rows[5], '.' + CSS_RESIZE_COL_DRAGGABLE_HANDLE).length);
        },

        'should update UI when enableResizeCols changes dynamically': function() {
            var rows = this._layoutBuilder.get('layout').get('rows');

            this._layoutBuilder.set('enableResizeCols', false);

            Assert.areEqual(0, this._getVisibleRowNodes(rows[0], '.' + CSS_RESIZE_COL_DRAGGABLE_HANDLE).length);
            Assert.areEqual(0, this._getVisibleRowNodes(rows[1], '.' + CSS_RESIZE_COL_DRAGGABLE_HANDLE).length);
            Assert.areEqual(0, this._getVisibleRowNodes(rows[2], '.' + CSS_RESIZE_COL_DRAGGABLE_HANDLE).length);
            Assert.areEqual(0, this._getVisibleRowNodes(rows[3], '.' + CSS_RESIZE_COL_DRAGGABLE_HANDLE).length);
            Assert.areEqual(0, this._getVisibleRowNodes(rows[4], '.' + CSS_RESIZE_COL_DRAGGABLE_HANDLE).length);
            Assert.areEqual(0, this._getVisibleRowNodes(rows[5], '.' + CSS_RESIZE_COL_DRAGGABLE_HANDLE).length);

            this._layoutBuilder.set('enableResizeCols', true);

            Assert.areEqual(0, this._getVisibleRowNodes(rows[0], '.' + CSS_RESIZE_COL_DRAGGABLE_HANDLE).length);
            Assert.areEqual(1, this._getVisibleRowNodes(rows[1], '.' + CSS_RESIZE_COL_DRAGGABLE_HANDLE).length);
            Assert.areEqual(1, this._getVisibleRowNodes(rows[2], '.' + CSS_RESIZE_COL_DRAGGABLE_HANDLE).length);
            Assert.areEqual(1, this._getVisibleRowNodes(rows[3], '.' + CSS_RESIZE_COL_DRAGGABLE_HANDLE).length);
            Assert.areEqual(2, this._getVisibleRowNodes(rows[4], '.' + CSS_RESIZE_COL_DRAGGABLE_HANDLE).length);
            Assert.areEqual(1, this._getVisibleRowNodes(rows[5], '.' + CSS_RESIZE_COL_DRAGGABLE_HANDLE).length);
        },

        'should resize columns': function() {
            var col,
                dragHandle,
                firstBreakpointLine,
                row = Y.all('.row').item(1);

            col = row.one('.col');
            dragHandle = row.one('.layout-builder-resize-col-draggable-handle');

            Assert.areEqual(6, col.getData('layout-col').get('size'));

            dragHandle.simulate('keypress', { keyCode: 13 });

            firstBreakpointLine = row.one('.layout-builder-resize-col-breakpoint-line');
            firstBreakpointLine.simulate('keypress', { keyCode: 13 });

            col = row.one('.col');

            Assert.areEqual(3, col.getData('layout-col').get('size'));
        },

        'should toggle breakpoints visibility when keypress on draghandle': function() {
            var dragHandle,
                row = Y.all('.row').item(1);

            dragHandle = row.one('.layout-builder-resize-col-draggable-handle');

            Assert.areEqual('none', row.one('.layout-builder-resize-col-breakpoint').getStyle('display'));

            dragHandle.simulate('keypress', { keyCode: 13 });
            Assert.areEqual('block', row.one('.layout-builder-resize-col-breakpoint').getStyle('display'));

            dragHandle.simulate('keypress', { keyCode: 13 });
            Assert.areEqual('none', row.one('.layout-builder-resize-col-breakpoint').getStyle('display'));
        },

        'should not show grid breakpoints when clicking drag handle with a button other than left': function() {
            var dragHandle,
                row = Y.all('.row').item(1);

            dragHandle = row.one('.layout-builder-resize-col-draggable-handle');
            Assert.areEqual('none', row.one('.layout-builder-resize-col-breakpoint').getStyle('display'));

            dragHandle.simulate('mousedown', { button: 1 });
            Assert.areEqual('none', row.one('.layout-builder-resize-col-breakpoint').getStyle('display'));

            dragHandle.simulate('mousedown', { button: 2 });
            Assert.areEqual('none', row.one('.layout-builder-resize-col-breakpoint').getStyle('display'));

            dragHandle.simulate('mousedown', { button: 0 });
            Assert.areEqual('block', row.one('.layout-builder-resize-col-breakpoint').getStyle('display'));
        },

        'should remove resize col feature on smartphones': function() {
            var layout = this._layoutBuilder.get('layout'),
                resizeColDraggable = Y.one('.layout-builder-resize-col-draggable');

            Y.Assert.isNotNull(resizeColDraggable);

            layout._set('isColumnMode', false);

            resizeColDraggable = Y.one('.layout-builder-resize-col-draggable');

            Y.Assert.isNull(resizeColDraggable);
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: ['aui-layout-builder', 'node-event-simulate', 'test']
});
