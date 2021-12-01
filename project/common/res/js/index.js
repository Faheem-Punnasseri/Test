const CLASS = {
  ROOT: 'accordion',
  GROUP: 'accordion__group',
  TOGGLE: 'accordion__toggle',
  PANEL: 'accordion__panel',
  PANEL_EXPANDED: 'accordion__panel_expanded' };


const KEY = {
  ENTER: 13,
  SPACE: 32,
  END: 36,
  HOME: 35,
  UP: 38,
  DOWN: 40 };


/**
               * Force a reflow
               * @param {HTMLElement} el The element whose styles have been changed
               */
const forceReflow = el => void el.offsetHeight;

/**
                                                 * Accordion implementation
                                                 */
class Accordion {
  /**
                  * Construct the Accordion
                  * @param {HTMLElement} root The root node
                  * @param {Object} options The options object
                  * @param {boolean} multiple Allow multiple expanded panels
                  * @param {boolean} moveFocus Handle focus with keyboard keys
                  * @param {boolean} wrapFocus Wrap focus around when using keyboard keys
                  * @param {number} transitionDuration Transition duration in ms
                  */
  constructor(root, options = {}) {
    this._root = root;

    this._toggles = [];
    this._panels = [];
    [].forEach.call(root.children, (group, i) => {
      if (!group.classList.contains(CLASS.GROUP)) {
        return;
      }

      const header = group.children[0];
      if (header == null) {
        return;
      }

      const toggle = header.children[0];
      if (toggle == null || !toggle.classList.contains(CLASS.TOGGLE)) {
        return;
      }

      const panel = group.children[1];
      if (panel == null || !panel.classList.contains(CLASS.PANEL)) {
        return;
      }

      this._toggles.push(toggle);
      this._panels.push(panel);
    });

    this._multiple = !!options.multiple;
    this._wrapFocus = !!options.wrapFocus;
    this._moveFocus = !!options.moveFocus;
    this._transitionDuration = !!options.transitionDuration || 250;

    if (this._multiple) {
      this._expanded = this._panels.map((_, i) => i === 0);
    } else {
      this._active = 0;
    }

    this._isTransitioning = false;

    this._toggles.forEach((toggle, i) => {
      toggle.addEventListener('click', e => {
        this._handleToggle(e, i);
      });
      toggle.addEventListener('keydown', e => {
        this._handleKeyDown(e, i);
      });
    });
  }

  // -------------------------- BEGIN PRIVATE METHODS --------------------------

  /**
   * Collapse the specified panel
   * @param {number} i The index of the panel to be collapsed
   * @return {Promise} A Promise which resolves when the transition is complete
   */
  _collapsePanel(i) {
    return new Promise(resolve => {
      const toggle = this._toggles[i];
      const panel = this._panels[i];

      toggle.setAttribute('aria-expanded', 'false');

      const currentHeight = panel.getBoundingClientRect().height;
      panel.style.height = currentHeight + 'px';
      forceReflow(panel);
      panel.style.height = '0';

      setTimeout(() => {
        panel.style.height = '';
        panel.classList.remove(CLASS.PANEL_EXPANDED);

        resolve();
      }, this._transitionDuration);
    });
  }

  /**
     * Expand the specified panel
     * @param {number} i The index of the panel to be expanded
     * @return {Promise} A Promise which resolves when the transition is complete
     */
  _expandPanel(i) {
    return new Promise(resolve => {
      const toggle = this._toggles[i];
      const panel = this._panels[i];

      toggle.setAttribute('aria-expanded', 'true');

      panel.classList.add(CLASS.PANEL_EXPANDED);
      const targetHeight = panel.getBoundingClientRect().height;
      panel.style.height = '0';
      forceReflow(panel);
      panel.style.height = targetHeight + 'px';

      setTimeout(() => {
        panel.style.height = '';

        resolve();
      }, this._transitionDuration);
    });
  }

  // --------------------------- END PRIVATE METHODS ---------------------------

  // --------------------------- BEGIN EVENT HANDLERS --------------------------

  /**
   * Handle the click event for accordion headers
   * @param {MouseEvent} e The event to be handled
   * @param {number} i The index of the corresponding accordion group
   */
  _handleToggle(e, i) {
    this.togglePanel(i);
  }

  /**
     * Handle the keydown event for accordion headers
     * @param {KeyboardEvent} e The event to be handled
     * @param {number} i The index of the corresponding accordion group
     */
  _handleKeyDown(e, i) {
    const { keyCode } = e;

    if (keyCode == KEY.ENTER || keyCode == KEY.SPACE) {
      e.preventDefault();
      this.togglePanel(i);
    } else if (this._moveFocus) {
      switch (e.keyCode) {
        case KEY.END:
          e.preventDefault();
          this.focusLast();
          break;

        case KEY.HOME:
          e.preventDefault();
          this.focusFirst();
          break;

        case KEY.DOWN:
          e.preventDefault();
          this.focus(i + 1);
          break;

        case KEY.UP:
          e.preventDefault();
          this.focus(i - 1);
          break;}

    }
  }

  // ---------------------------- END EVENT HANDLERS ---------------------------

  // --------------------------- BEGIN PUBLIC METHODS --------------------------
  /**
   * Move focus to the first accordion header
   */
  focusFirst() {
    this._toggles[0].focus();
  }

  /**
     * Move focus to the last accordion header
     */
  focusLast() {
    this._toggles[this._toggles.length - 1].focus();
  }

  /**
     * Move focus to the specified accordion header.
     * @param {number} The index of the header to receive focus
     */
  focus(i) {
    const nToggles = this._toggles.length;
    if ((i < 0 || i >= nToggles) && !this._wrapFocus) {
      return;
    }

    this._toggles[(nToggles + i) % nToggles].focus();
  }

  /**
     * Toggle the specified panel
     * @param {number} The index of the panel to toggle
     */
  togglePanel(i) {
    if (i < 0 || i >= this._panels.length) {
      return;
    }

    if (this._isTransitioning) {
      return;
    }

    if (!this._multiple && this._active == i) {
      return;
    }

    this._isTransitioning = true;

    if (this._multiple) {
      Promise.resolve(this._expanded[i] ?
      this._collapsePanel(i) :
      this._expandPanel(i)).
      then(() => {
        this._expanded[i] = !this._expanded[i];
        this._isTransitioning = false;
      });
    } else {
      Promise.all([
      this._collapsePanel(this._active),
      this._expandPanel(i)]).

      then(() => {
        this._active = i;
        this._isTransitioning = false;
      });
    }
  }

  // ---------------------------- END PUBLIC METHODS ---------------------------
}

[].forEach.call(document.getElementsByClassName('accordion'), accordion => {
  new Accordion(accordion, {
    multiple: !!accordion.dataset.multiple,
    moveFocus: !!accordion.dataset.moveFocus,
    wrapFocus: !!accordion.dataset.wrapFocus });

});