/**
 * @file visitor_actions_ui.selector.js
 */
(function ($, Drupal) {
  Drupal.utilities = Drupal.utilities || {};

  /**
   * Determines the unique selector for an element.
   *
   * @param element
   *   A DOM element to find the selector for.
   * @param ignoreId
   *   An ID that should not be used when generating the selector.  Can be a
   *   string for an exact match, or a regular expression object.
   * @param ignoreClasses
   *   Classes that should be ignored when generating the selector.  Can be a
   *   string for exact match (space delimited for multiple classes) or a regular
   *   expression object that returns a match for each class name.
   *   *-processed classes are ignored automatically.
   */
  Drupal.utilities.getSelector = Drupal.utilities.getSelector || function (element, ignoreId, ignoreClasses) {

    /**
     * Utility function to test if a string value empty.
     *
     * @param stringValue
     *   String value to test
     * @returns {boolean}
     *   True if not empty, false if null or empty.
     */
    function notEmpty(stringValue) {
      return (stringValue != null ? stringValue.length : void 0) > 0;
    };

    /**
     * Determines the element selector for a child element based on element
     * name.

     * @param element
     *   The element to use for determination
     * @returns string
     *   The selector string to use
     */
    function nthChild(element) {
      if (element == null || element.ownerDocument == null || element === document || element === document.body || element === document.head) {
        return "";
      }
      var parent = element.parentNode || null;
      if (parent) {
        var nthStack = [];
        var num = parent.childNodes.length;
        for (var i = 0; i < num; i++) {
          var nthName = parent.childNodes[i].nodeName.toLowerCase();
          if (nthName === "#text") {
            continue;
          }
          nthStack.push(nthName);
          if (parent.childNodes[i] === element) {
            if (nthStack.length > 1) {
              nthStack[0] += ":first-child";
            }
            return nthStack.join(" + ");
          }
        }
      }
      return element.nodeName.toLowerCase();
    }

    /**
     * Removes any attributes that should be ignored for an element.
     *
     * @param element
     *   A DOM element to manipulate.
     * @param ignoreId
     *   An ID that should not be used.  Can be a string for an exact match, or a
     *   regular expression object.
     * @param ignoreClasses
     *   Classes that should be ignored.  Can be a string for exact match (space
     *   delimited for multiple classes) or a regular expression object.
     *   *-processed classes are ignored automatically.
     * @return an array with 2 keys
     *   1 - any removed id
     *   2 - the list of removed classes (space delimited)
     */
    function removeIgnoreAttributes(element, ignoreId, ignoreClasses) {
      var tempId = '',
        tempClasses,
        temp = '',
        matches = '',
        autoIgnoreMatches = '',
        ignoreId = typeof ignoreId === 'undefined' ? '' : ignoreId,
        ignoreClasses = typeof ignoreClasses === 'undefined' ? '' : ignoreClasses,
        ignoreAutoClasses = /([a-zA-Z0-9-_]*-processed )|([a-zA-Z0-9-_]*-processed$)/ig;

      // Convert the ignoreID  and ignoreClasses to regular expressions if only
      // strings passed in.
      if (typeof ignoreId === 'string' && notEmpty(ignoreId)) {
        ignoreId = new RegExp('^' + ignoreId + '$', i);
      }
      if (typeof ignoreClasses === 'string' && notEmpty(ignoreClasses)) {
        temp = ignoreClasses.split(' ');
        ignoreClasses = '';
        for (var i=0; i<temp.length; i++) {
          ignoreClasses += '(' + temp[i] + ')';
          if (i < (temp.length-1)) {
            ignoreClasses += '|';
          }
        }
        ignoreClasses = new RegExp(ignoreClasses);
      }
      // Pull out any ids to be ignored.
      if (ignoreId instanceof RegExp && notEmpty(element.id) && ignoreId.test(element.id)) {
        tempId = element.id;
        element.id = '';
      }
      // Remove any classes to be ignored.
      if (ignoreClasses instanceof RegExp) {
        matches = element.className.match(ignoreClasses);
      }
      autoIgnoreMatches = element.className.match(ignoreAutoClasses);
      // Remove any visitorActionsUI classes or *-processed classes.
      tempClasses = matches instanceof Array ? matches.join(' ') : '';
      tempClasses += ' ' + autoIgnoreMatches instanceof Array ? matches.join(' ') : '';
      $(element).removeClass(tempClasses);
      return [tempId, tempClasses];
    }

    /**
     * Restore any removed classes or ids to the element.
     *
     * @param element
     *   A DOM element to be restored.
     * @param restoreId
     *   The id attributes for the element.
     * @param restoreClasses
     *   Any classes to be restored.
     * @return
     *   The updated DOM element for chaining.
     */
    function restoreIgnoredAttributes(element, restoreId, restoreClasses) {
      if (restoreId.length) {
        element.id = restoreId;
      }
      $(element).addClass(restoreClasses);
      return element;
    }

    var removed = removeIgnoreAttributes(element, ignoreId, ignoreClasses);
    var removedId = removed[0];
    var removedClasses = removed[1];

    var hasId = notEmpty(element.id),
      hasClass = notEmpty(element.className),
      isElement = element.nodeType === 1,
      isRoot = element.parentNode === element.ownerDocument,
      hasParent = element.parentNode != null,
      selector = '';

    if (!isRoot && isElement) {
      if (hasId) {
        selector = '#' + element.id;
      } else if (hasClass) {
        selector = "." + element.className.split(" ").join(".").replace(/\.$/, '');
      } else {
        selector = nthChild(element);
      }
    }

    restoreIgnoredAttributes(element, removedId, removedClasses);
    if (hasId) {
      return selector;
    } else if (hasParent) {
      return Drupal.utilities.getSelector(element.parentNode, ignoreId, ignoreClasses) + " > " + selector;
    }
    return selector;
  }
}(jQuery, Drupal));
