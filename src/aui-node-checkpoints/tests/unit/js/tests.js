YUI.add('aui-node-checkpoints-tests', function(Y) {

    var suite = new Y.Test.Suite('aui-node-checkpoints');

    suite.add(new Y.Test.Case({
        name: 'Node Checkpoint Tests',

        tearDown: function() {
            if (this.checkpoint) {
                if (Y.Lang.isArray(this.checkpoint)) {
                    Y.Array.invoke(this.checkpoint, 'destroy');
                }
                else {
                    this.checkpoint.destroy();
                }
            }

            window.scrollTo(0, 0);
        },

        'Scroll delay accurately delays callback execution': function() {
            var checkpointNode = Y.one('#delayTrigger'),
                startTime,
                endTime;

            checkpointNode.checkpoint(function() {
                endTime = new Date().getTime();
            },
            {
                scrollDelay: 50
            });

            this.checkpoint = checkpointNode.nodeCheckpoint;

            startTime = new Date().getTime();

            window.scrollTo(0, 2000);

            this.wait(function() {
                Y.Assert.isTrue((endTime - startTime) > 50);
            }, 100);
        },

        'Context options are set correctly': function() {
            var checkpointNode = Y.one('#triggerDisabled'),
                context,
                contextNode = Y.getBody(),
                offset = 50;

            checkpointNode.checkpoint(function() {},
                {
                    context: 'body'
                }
            );

            this.checkpoint = checkpointNode.nodeCheckpoint;

            context = this.checkpoint.getContext();

            this.checkpoint.disable();
            context.disable();

            Y.Assert.isFalse(this.checkpoint._enabled);
            Y.Assert.isFalse(context._enabled);

            this.checkpoint.setOffset(offset);
            this.checkpoint.enable();
            context.enable();

            Y.Assert.isTrue(this.checkpoint._enabled);
            Y.Assert.isTrue(context._enabled);
            Y.Assert.areEqual(this.checkpoint.getOffset(), offset);
            Y.Assert.isTrue(contextNode.compareTo(context.getNode()));
            Y.Assert.isTrue(checkpointNode.compareTo(this.checkpoint.getNode()));
        },

        'triggerAtTheEnd triggers checkpoint at the end': function() {
            var container = Y.one('#triggerAtTheEnd'),
                triggered = false;

            //trigger at the end vertically
            container.checkpoint(
                function() {
                    triggered = true;
                },
                {
                    context: container,
                    triggerAtTheEnd: true
                }
            );

            this.checkpoint = container.nodeCheckpoint;

            container.set('scrollTop', container.get('scrollHeight'));

            this.wait(function() {
                Y.Assert.isTrue(triggered);

                this.checkpoint.destroy();

                triggered = false;

                container.setStyle('whiteSpace', 'nowrap');

                //trigger at the end horizontally
                container.checkpoint(
                    function() {
                        triggered = true;
                    },
                    {
                        axis: 'horizontal',
                        context: container,
                        triggerAtTheEnd: true
                    }
                );

                container.set('scrollLeft', container.get('scrollWidth'));

                this.wait(function() {
                    Y.Assert.isTrue(triggered);
                }, 100);
            }, 100);


        },

        'Checkpoint triggers at a specific node': function() {
            var checkpointNode = Y.one('#triggerAtNode #checkpoint'),
                triggered = false;

            checkpointNode.checkpoint(function() {
                triggered = true;
            });

            this.checkpoint = checkpointNode.nodeCheckpoint;

            window.scrollTo(0, 2000);

            this.wait(function() {
                Y.Assert.isTrue(triggered);
            }, 100);
        },

        'Checkpoint triggers pass correct direction to callback method': function() {
            var checkpointNode = Y.one('#triggerDirection'),
                scrollDirection;

            checkpointNode.setStyle('top', '200px');

            checkpointNode.checkpoint(function(direction) {
                scrollDirection = direction;
            });

            this.checkpoint = checkpointNode.nodeCheckpoint;

            window.scrollTo(0, 3000);

            this.wait(function() {
                Y.Assert.areEqual('down', scrollDirection);

                window.scrollTo(0, 0);

                this.wait(function() {
                    Y.Assert.areEqual('up', scrollDirection);

                    this.checkpoint.destroy();

                    checkpointNode.setStyles(
                        {
                            'top': 0,
                            'left': '2000px'
                        }
                    );

                    checkpointNode.next('.spacer').setStyle('width', '5000px');

                    checkpointNode.checkpoint(function(direction) {
                        scrollDirection = direction;
                    },
                    {
                        axis: 'horizontal'
                    });

                    window.scrollTo(2000, 0);

                    this.wait(function() {
                        Y.Assert.areEqual('right', scrollDirection);

                        window.scrollTo(0, 0);

                        this.wait(function() {
                            Y.Assert.areEqual('left', scrollDirection);
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        },

        'Checkpoint does not fire when disabled': function() {
            var checkpointNode = Y.one('#triggerDisabled'),
                triggered = false;

            checkpointNode.checkpoint(function() {
                triggered = true;
            },
            {
                enabled: false
            });

            this.checkpoint = checkpointNode.nodeCheckpoint;

            window.scrollTo(0, 2000);

            this.wait(function() {
                Y.Assert.isFalse(triggered);

                this.checkpoint.enable();

                window.scrollTo(0, 0);
                window.scrollTo(0, 2000);

                this.wait(function() {
                    Y.Assert.isTrue(triggered);

                    this.checkpoint.disable();

                    triggered = false;

                    window.scrollTo(0, 0);
                    window.scrollTo(0, 2000);

                    Y.Assert.isFalse(triggered);
                }, 100);
            }, 100);
        },

        'Checkpoints can be set on NodeList': function() {
            var triggers = Y.all('#triggerList .checkpoint'),
                checkpoints = [];

            triggers.checkpoint(function() {});

            triggers.each(
                function(node) {
                    Y.Assert.isNotUndefined(node.nodeCheckpoint);

                    checkpoints.push(node.nodeCheckpoint);
                }
            );

            this.checkpoint = checkpoints;
        },

        'Refresh method updates trigger position': function() {
            var checkpointNode = Y.one('#refreshTrigger'),
                checkpointPosition;

            checkpointNode.checkpoint(function() {});

            this.checkpoint = checkpointNode.nodeCheckpoint;

            checkpointPosition = this.checkpoint._getTriggerPosition();

            checkpointNode.setStyle('top', '500px');

            Y.Assert.areEqual(checkpointPosition, this.checkpoint._getTriggerPosition());

            this.checkpoint.refresh();

            Y.Assert.areNotEqual(checkpointPosition, this.checkpoint._getTriggerPosition());
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: ['array-invoke', 'test', 'aui-node-checkpoints']
});