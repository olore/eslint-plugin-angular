module.exports = function (context) {

  'use strict';

  function isIt(node) {
    return node.callee && node.callee.name === 'it';
  }

  function getDoneFnName(node) {
    if (node.arguments.length === 2) { // 'it' should always have 2 args, 2nd one being the function for the test
      // TODO: unless people are getting too fancy on me
      var fe = node.arguments[1];
      if (fe.type === 'FunctionExpression') {
        if (fe.params && fe.params[0]) {
          return fe.params[0].name;
        }
      }
    }
  }

  var withinIt = false;
  var withinThenOrCatchOrFinally = false;
  var calledDoneFn = false;
  var doneFnName;

  function reset() {
    withinIt = false;
    withinThenOrCatchOrFinally = false;
    calledDoneFn = false;
    doneFnName = undefined;
  }

  return {

    'Identifier': function (node) {
      if (node.name === 'then' ||
          node.name === 'catch' ||
          node.name === 'finally') {
        withinThenOrCatchOrFinally = true;
        console.log('IN a then');
      } else {

        if (withinThenOrCatchOrFinally) {
          if (node.name === doneFnName) {
            calledDoneFn = true;
          }
        }
      }
    },

    'CallExpression:exit': function (node) {
      //console.log('CE EXIT', node);
      if (isIt(node)) {
        console.log('exiting an it');
        if (!calledDoneFn) {
          context.report(node, 'Spec contains a then/catch/finally but doesn\'t execute a done() function');
        }
      }

      if (node.callee && node.callee.property) {
        if (node.callee.property.name === 'then') {
          console.log('exiting a THEN');
          withinThenOrCatchOrFinally = false;
        }
      }

    },

    'CallExpression': function (node) {
      var runningTests = context.getFilename() === '<input>';

      if (runningTests || context.getFilename().indexOf('-spec.js') > 0) {

        if (isIt(node)) {
          console.log('entered an it');
          reset();
          withinIt = true;
          doneFnName = getDoneFnName(node);

          //TODO: requires a $digest, $apply or flush
          //TODO: handle then/catch/finally in a beforeEach/afterEach
          //TODO: add a description in the README file

        } else {
          if (withinIt && withinThenOrCatchOrFinally) {
            if (node.callee && node.callee.name) {
              if (node.callee.name == doneFnName) {
                console.log('Called done function');
                calledDoneFn = true;
              }
            }
          }
        }
      }
    }
  };
};
