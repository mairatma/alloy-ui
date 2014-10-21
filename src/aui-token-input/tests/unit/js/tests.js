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

        addTokens: function() {
            var tokenInput = this.tokenInput;
            var boundingBox = tokenInput.get('boundingBox');

            tokenInput.add('test1');
            tokenInput.add('test2');
            tokenInput.add('test3');

            return boundingBox.all('.yui3-tokeninput-token');
        },

        'token created on focus change': function() {
            var boundingBox = this.tokenInput.get('boundingBox');

            boundingBox.simulate('focus');

            boundingBox.one('input').val('Liferay');

            Y.one('body').simulate('click');

            this.wait(
                function() {
                    var tokens = this.tokenInput.get('tokens'),
                        token = tokens[0];

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
        },

        'token is removed on backspace and preceding token is focused': function() {
            var tokens = this.addTokens();
            var tokenToDelete = tokens.item(1);
            var tokenToFocus = tokens.item(0);

            tokenToDelete.simulate('keydown', { keyCode: 8 });

            Y.Assert.isTrue(tokenToFocus.compareTo(document.activeElement));
        },

        'token is removed on delete key and following token is focused': function() {
            var tokens = this.addTokens();
            var tokenToDelete = tokens.item(1);
            var tokenToFocus = tokens.item(2);

            tokenToDelete.simulate('keydown', { keyCode: 46 });

            Y.Assert.isTrue(tokenToFocus.compareTo(document.activeElement));
        },

        'arrow keys navigate tokens': function() {
            var tokens = this.addTokens();
            var first = tokens.item(0);
            var second = tokens.item(1);

            first.focus();
            first.simulate('keydown', { keyCode: 39 });

            Y.Assert.isTrue(second.compareTo(document.activeElement));

            second.simulate('keydown', {keyCode: 37 });

            Y.Assert.isTrue(first.compareTo(document.activeElement));

            first.simulate('keydown', { keyCode: 38 });

            Y.Assert.isTrue(first.compareTo(document.activeElement));

            first.simulate('keydown', {keyCode: 40 });

            Y.Assert.isTrue(second.compareTo(document.activeElement));
        }

    }));

    Y.Test.Runner.add(suite);

},'', {
    requires: ['node-event-simulate', 'test', 'aui-token-input']
});