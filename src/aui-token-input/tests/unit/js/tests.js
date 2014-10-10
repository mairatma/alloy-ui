YUI.add('module-tests', function(Y) {

    var suite = new Y.Test.Suite('aui-token-input');

    suite.add(new Y.Test.Case({

        name: 'TokenInput Tests',

        init: function() {
            var tagInput = Y.one('#tags');

            tagInput.plug(Y.Plugin.TokenInput);

            this.tokenInput = tagInput.tokenInput;
        },

        tearDown: function() {
            this.tokenInput.clear();
        },

        'token created on focus change': function() {
            var boundingBox = this.tokenInput.get('boundingBox');

            boundingBox.simulate('focus');

            boundingBox.one('input').val('Liferay');

            Y.one('body').simulate('click');

            this.wait(
                function() {
                    var tokens = this.tokenInput.get('tokens');
                    var token = tokens[0];

                    Y.Assert.areEqual(1, tokens.length);
                    Y.Assert.areEqual('Liferay', token);
                },
            100);
        },

        'token created on enter key': function() {
            var boundingBox = this.tokenInput.get('boundingBox');

            boundingBox.simulate('focus');

            boundingBox.one('input').val('Open Source');

            boundingBox.one('input').simulate('keydown', { keyCode: 13 });

            this.wait(
                function() {
                    var tokens = this.tokenInput.get('tokens');
                    var token = tokens[0];

                    Y.Assert.areEqual(1, tokens.length);
                    Y.Assert.areEqual('Open Source', token);
                },
            100);
        },

        'token is removed on remove click': function() {
            var boundingBox = this.tokenInput.get('boundingBox');

            boundingBox.simulate('focus');

            boundingBox.one('input').val('Liferay');

            Y.one('body').simulate('click');

            this.wait(
                function() {
                    boundingBox.one('.close').simulate('click');

                    var tokens = this.tokenInput.get('tokens');

                    Y.Assert.areEqual(0, tokens.length);
                },
            100);
        }

    }));

    Y.Test.Runner.add(suite);


},'', { requires: [ 'node-event-simulate', 'test', 'aui-token-input' ] });
