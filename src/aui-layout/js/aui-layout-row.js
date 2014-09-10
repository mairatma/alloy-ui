/**
 * The Layout Row Component
 *
 * @module aui-layout-row
 */

var ROW_TEMPLATE = '<div class="row">';

/**
 * A base class for Layout Row.
 *
 * @class A.LayoutRow
 * @extends Base
 * @param {Object} config Object literal specifying layout configuration
 *     properties.
 * @constructor
 */
A.LayoutRow = A.Base.create('layout-row', A.Base, [], {

    /**
     * Renders row template
     *
     * @method getContent
     * @return {Node} Row template rendered with columns inside
     */
    getContent: function() {
        var cols = this.get('cols'),
            row = A.Node.create(ROW_TEMPLATE);

        row.setData('layout-row', this);

        A.each(cols, function(col) {
            row.append(col.getContent());
        });

        return row;
    },

    getSize: function() {
        var cols = this.get('cols'),
            size;

        size = A.Array.reduce(cols, 0, function(prev, current) {
            prev = prev + current.get('size');
            return prev;
        });

        return size;
    }
}, {

    /**
     * Static property used to define the default attribute
     * configuration for the Layout Row.
     *
     * @property ATTRS
     * @type Object
     * @static
     */
    ATTRS: {

        /**
         * Array containing `A.LayoutCol` objects
         *
         * @attribute cols
         * @type {Array}
         */
        cols: {
            validator: A.Lang.isArray
        }
    }
});
