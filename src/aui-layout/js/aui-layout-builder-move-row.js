/**
 * The Layout Move Row Component
 *
 * @module aui-layout-move-row
 */

var CSS_MOVE_CANCEL_BUTTON = A.getClassName('layout', 'builder', 'move', 'cancel', 'targets'),
    CSS_MOVE_ROW_BUTTON = A.getClassName('layout', 'builder', 'move', 'row', 'button'),
    CSS_MOVE_ROW_TARGET = A.getClassName('layout', 'builder', 'move', 'row', 'target'),
    TPL_MOVE_ROW_BUTTON = '<button type="button" class="btn btn-default btn-xs ' + CSS_MOVE_ROW_BUTTON + '">' +
        '<span class="glyphicon glyphicon-sort"></span> Move Row</button>',
    TPL_MOVE_ROW_TARGET = '<div class="' + CSS_MOVE_ROW_TARGET + ' row">Move Row</div>';

/**
 * A base class for Layout Move Row.
 *
 * @class A.LayoutBuilderMoveRow
 * @param {Object} config Object literal specifying layout configuration
 *     properties.
 */
function LayoutBuilderMoveRow() {}

LayoutBuilderMoveRow.prototype = {

    /**
     * Row that will be moved.
     *
     * @property _rowToBeMoved
     * @type {Node}
     * @protected
     */
    _rowToBeMoved: null,

    /**
     * Construction logic executed during instantiation.
     * Lifecycle.
     *
     * @method initializer
     * @protected
     */
    initializer: function() {
        this._eventHandles.push(
            this.after('enableMoveRowsChange', A.bind(this._afterEnableMoveRowsChange, this)),
            this.after('layout:rowsChange', A.bind(this._afterMoveRowRowsChange, this)),
            this.after('layoutChange', A.bind(this._afterMoveRowLayoutChange, this))
        );

        this._uiSetEnableMoveRows(this.get('enableMoveRows'));
    },

    /**
     * Destructor implementation for the `A.LayoutBuilderMoveRow` class. Lifecycle.
     *
     * @method destructor
     * @protected
     */
    destructor: function() {
        this._unbindMoveRowEvents();
    },

    /**
     * Fired after `layout` attribute changes.
     *
     * @method _afterMoveRowLayoutChange
     * @protected
     */
    _afterMoveRowLayoutChange: function() {
        this._uiSetEnableMoveRows(this.get('enableMoveRows'));
    },

    /**
     * Fired after `rows` attribute changes.
     *
     * @method _afterMoveRowRowsChange
     * @protected
     */
    _afterMoveRowRowsChange: function() {
        console.log('move rows change event');
        this._uiSetEnableMoveRows(this.get('enableMoveRows'));
    },

    /**
     * Fired after the `enableMoveRows` attribute changes.
     *
     * @method _afterEnableMoveRowsChange
     * @protected
     */
    _afterEnableMoveRowsChange: function() {
        this._uiSetEnableMoveRows(this.get('enableMoveRows'));
    },

    /**
     * Appends one move row button before each row.
     *
     * @method _appendMoveButtonToRows
     * @protected
     */
    _appendMoveButtonToRows: function() {
        var layoutContainer = this._layoutContainer,
            moveRowButton,
            rows = layoutContainer.all('.row');

        rows.each(function(row) {
            moveRowButton = A.Node.create(TPL_MOVE_ROW_BUTTON);
            moveRowButton.setData('layout-row', row.getData('layout-row'));
            layoutContainer.insertBefore(moveRowButton, row);
        });
    },

    /**
     * Binds the necessary events for the functionality of moving rows from layout.
     *
     * @method _bindMoveRowEvents
     * @protected
     */
    _bindMoveRowEvents: function() {
        var container = this.get('container');

        this._moveRowsEventHandles = [
            container.delegate('click', A.bind(this._onMouseClickMoveRowEvent, this), '.' + CSS_MOVE_ROW_BUTTON + ', .' + CSS_MOVE_CANCEL_BUTTON),
            this._layoutContainer.delegate('click', A.bind(this._onClickOnMoveTarget, this), '.' + CSS_MOVE_ROW_TARGET)
        ];
    },

    /**
     * Change button text to cancel and add cancel class.
     *
     * @method _changeButtonToCancel
     * @protected
     */
    _changeButtonToCancel: function() {
        var container = this._layoutContainer,
            buttons = container.all('.' + CSS_MOVE_ROW_BUTTON);

        A.Array.invoke(buttons, 'set', 'text', 'Cancel');
        A.Array.invoke(buttons, 'addClass', CSS_MOVE_CANCEL_BUTTON);
        A.Array.invoke(buttons, 'removeClass', CSS_MOVE_ROW_BUTTON);
    },

    /**
     * Change button text to move and add move class.
     *
     * @method _changeButtonToMove
     * @protected
     */
    _changeButtonToMove: function() {
        var container = this._layoutContainer,
            buttons = container.all('.' + CSS_MOVE_CANCEL_BUTTON);

        A.Array.invoke(buttons, 'set', 'text', 'Move Row');
        A.Array.invoke(buttons, 'addClass', CSS_MOVE_ROW_BUTTON);
        A.Array.invoke(buttons, 'removeClass', CSS_MOVE_CANCEL_BUTTON);
    },

    /**
     * Create target area to move the row.
     *
     * @method _createTargetArea
     * @protected
     */
    _createTargetArea: function() {
        var container = this._layoutContainer,
            rows = this._layoutContainer.all('.row'),
            target = A.Node.create(TPL_MOVE_ROW_TARGET);

        target.setData('position', 0);

        container.prepend(target);

        rows.each(function(row, index) {
            target = A.Node.create(TPL_MOVE_ROW_TARGET);
            target.setData('position', index + 1);
            container.insertBefore(target, row.next());
        });
    },

    /**
     * Fires when click on target area.
     *
     * @method _onClickOnMoveTarget
     * @param {EventFacade} event
     * @protected
     */
    _onClickOnMoveTarget: function(event) {
        var layout = this.get('layout'),
            target = event.target;

        this._removeTargetArea();
        this._unbindMoveRowEvents();

        layout.moveRow(this._rowToBeMoved, target.getData('position'));

        this._uiSetEnableMoveRows(this.get('enableMoveRows'));
    },

    /**
     * Fires after click on move row button.
     *
     * @method _onMouseClickMoveRowEvent
     * @param {EventFacade} event
     * @protected
     */
    _onMouseClickMoveRowEvent: function(event) {
        var moveRowButton = event.target;

        this._rowToBeMoved = moveRowButton.getData('layout-row');

        if (moveRowButton.hasClass(CSS_MOVE_ROW_BUTTON)) {
            this._createTargetArea();
            this._changeButtonToCancel();
        }
        else {
            this._removeTargetArea();
            this._changeButtonToMove();
        }
    },

    /**
     * Removes all target area.
     *
     * @method _removeTargetArea
     * @protected
     */
    _removeTargetArea: function() {
        this._layoutContainer.all('.' + CSS_MOVE_ROW_TARGET).remove();
    },

    /**
     * Removes all move row buttons.
     *
     * @method _removeButtonFromRows
     * @protected
     */
    _removeButtonFromRows: function() {
        this.get('container').all('.' + CSS_MOVE_ROW_BUTTON).remove();
    },

    /**
     * Updates the UI according to the value of the `enableMoveRows` attribute.
     *
     * @method _uiSetEnableMoveRows
     * @param {Boolean} enableMoveRows
     * @protected
     */
    _uiSetEnableMoveRows: function(enableMoveRows) {
        if (enableMoveRows) {
            this._appendMoveButtonToRows();
            this._bindMoveRowEvents();
        }
        else {
            this._removeButtonFromRows();
            this._unbindMoveRowEvents();
        }
    },

    /**
     * Unbinds the events related to the functionality of moving rows from layout.
     *
     * @method _unbindMoveRowEvents
     * @protected
     */
    _unbindMoveRowEvents: function() {
        if (this._moveRowsEventHandles) {
            (new A.EventHandle(this._moveRowsEventHandles)).detach();
        }
    }
};

/**
 * Static property used to define the default attribute configuration for the
 * `A.LayoutBuilderMoveRow`.
 *
 * @property ATTRS
 * @type {Object}
 * @static
 */
LayoutBuilderMoveRow.ATTRS = {
    /**
     * Flag indicating if the feature of moving rows from layout is
     * enabled or not.
     *
     * @attribute enableMoveRows
     * @default true
     * @type {Boolean}
     */
    enableMoveRows: {
        validator: A.Lang.isBoolean,
        value: true
    }
};

A.LayoutBuilderMoveRow = LayoutBuilderMoveRow;
