//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require('../node_modules/eslint/lib/eslint'),
  ESLintTester = require('eslint-tester');

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest('rules/ng_karma_done', {
  valid: [
    {
      code: '\
            it("with then", function (done) { \
              Service.save().then(function () {                                             \
                done();                                                                     \
              });                                                                           \
            });                                                                             \
          '
    },
    {
      code: '\
            it("with catch", function (done) { \
              Service.save().catch(function () {                                            \
                done();                                                                     \
              });                                                                           \
            });                                                                             \
          '
    },
    {
      code: '\
            it("with finally", function (done) { \
              Service.save().finally(function () {                                          \
                done();                                                                     \
              });                                                                           \
            });                                                                             \
          '
    },
    {
      code: '\
              it("with catch, done function can have any name", function (foo) { \
                Service.save().catch(function () {                                        \
                  foo();                                                                  \
                });                                                                       \
              });                                                                         \
            '
    },
    {
      code: '\
              it("with then, done function can have any name", function (foo) { \
                Service.save().then(function () {                                         \
                  foo();                                                                  \
                });                                                                       \
              });                                                                         \
            '
    }

  ],

  invalid: [
    {
      code: '\
          it("requires a done function when there is a then", function() {          \
            Service.save("paperwork").then(function () {                            \
              doSomething();                                                        \
            });                                                                     \
          });                                                                       \
        ',
      errors: [{message: 'Spec contains a then/catch/finally but doesn\'t define a done() function'}]
    },
    {
      code: '\
          it("requires a done function when there is a catch", function() {         \
            Service.save().catch(function () {                                      \
              doSomething();                                                        \
            });                                                                     \
          });                                                                       \
        ',
      errors: [{message: 'Spec contains a then/catch/finally but doesn\'t define a done() function'}]
    },
    {
      code: '\
          it("requires a done function when there is a finally", function() {       \
            Service.save().finally(function () {                                    \
              doSomething();                                                        \
            });                                                                     \
          });                                                                       \
        ',
      errors: [{message: 'Spec contains a then/catch/finally but doesn\'t define a done() function'}]
    //},
    //{
    //  code: '\
    //      it("should fail because done is called outside the then", function(done) {       \
    //        Service.save("paperwork").then(function () {                            \
    //        });                                                                     \
    //        done();                                                        \
    //      });                                                                       \
    //    ',
    //  errors: [{message: 'Spec contains a then/catch that doesn\'t call the done callback'}]


    }
  ]
});
