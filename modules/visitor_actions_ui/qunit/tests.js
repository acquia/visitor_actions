/**
 * @file visitor_actions_ui.selector.tests.js
 */
module( "Visitor Actions UI element selector tests" );
QUnit.test("selector basics", function( assert ) {
  expect(6);
  var $elem = $('#page');
  var selector = Drupal.utilities.getSelector($elem[0]);
  assert.equal(selector, '#page', 'ID selector matched');
  $elem = $('.myclass');
  selector = Drupal.utilities.getSelector($elem[0]);
  assert.equal(selector, '#page > .ignoreme.myclass', 'Class match produces a unique selector.');
  $elem = $('#ignoremyid');
  selector = Drupal.utilities.getSelector($elem[0], 'ignoremyid');
  assert.equal(selector, '#page > p:first-child + p + p', 'Ignored id not included in selector.');
  $elem = $('#ignoremyid');
  assert.equal($elem.length, 1, 'Ignore id restored');
  $elem = $('.ignoreme');
  selector = Drupal.utilities.getSelector($elem[0], 'ignoremyid', 'ignoreme');
  assert.equal(selector, '#page > .myclass', 'Ignored class name not included in selector.');
  $elem = $('.ignoreme');
  assert.equal($elem.length, 1, 'Ignore class restored');
});
