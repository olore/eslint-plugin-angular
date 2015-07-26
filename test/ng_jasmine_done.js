//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require('../node_modules/eslint/lib/eslint'),
  ESLintTester = require('eslint-tester');

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest('rules/ng_jasmine_done', {
  valid: [
    {
      code: '\
            it("with then", function (done) { \
              Service.save().then(function () {                                             \
                done();                                                                     \
              });                                                                           \
              $scope.$apply();                                                              \
            });                                                                             \
          '
    },
    {
      code: '\
            it("with catch", function (done) { \
              Service.save().catch(function () {                                            \
                done();                                                                     \
              });                                                                           \
              $scope.$apply();                                                              \
            });                                                                             \
          '
    },
    {
      code: '\
            it("with finally", function (done) { \
              Service.save().finally(function () {                                          \
                done();                                                                     \
              });                                                                           \
              $scope.$apply();                                                              \
            });                                                                             \
          '
    },
    {
      code: '\
            it("with catch, done function can have any name", function (foo) { \
              Service.save().catch(function () {                                        \
                foo();                                                                  \
              });                                                                       \
              $scope.$apply();                                                          \
            });                                                                         \
          '
    },
    {
      code: '\
            it("with then, done function can have any name", function (foo) { \
              Service.save().then(function () {                                         \
                foo();                                                                  \
              });                                                                       \
              $scope.$apply();                                                          \
            });                                                                         \
          '
    },
    {
      code: '\
            it("calls $digest", function (done) { \
              Service.save().then(function () {                                             \
                done();                                                                     \
              });                                                                           \
              $scope.$digest();                                                             \
            });                                                                             \
          '
    },
    {
      code: '\
            it("calls $digest", function (done) { \
              Service.save().then(function () {                                             \
                done();                                                                     \
              });                                                                           \
              httpBackend.flush();                                                          \
            });                                                                             \
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
              $scope.$apply();                                                        \
            });                                                                       \
          ',
      errors: [{message: 'Spec contains a then/catch/finally but doesn\'t execute a done() function'}]
    },
    {
      code: '\
            it("requires a done function when there is a catch", function() {         \
              Service.save().catch(function () {                                      \
                doSomething();                                                        \
              });                                                                     \
              $scope.$apply();                                                        \
            });                                                                       \
          ',
      errors: [{message: 'Spec contains a then/catch/finally but doesn\'t execute a done() function'}]
    },
    {
      code: '\
            it("requires a done function when there is a finally", function() {       \
              Service.save().finally(function () {                                    \
                doSomething();                                                        \
              });                                                                     \
              $scope.$apply();                                                        \
            });                                                                       \
          ',
      errors: [{message: 'Spec contains a then/catch/finally but doesn\'t execute a done() function'}]
    },
    {
      code: '\
            it("should fail because done is called outside the then", function(done) {      \
              Service.save("paperwork").then(function () {                                  \
                somethingThatIsntDone()                                                     \
              });                                                                           \
              done();                                                                       \
              $scope.$apply();                                                              \
            });                                                                             \
          ',
      errors: [{message: 'Spec contains a then/catch/finally but doesn\'t execute a done() function'}]
    },
    {
      code: '\
            it("requires a $apply, $digest or flush()", function(done) {              \
              Service.save("paperwork").then(function() {                             \
                done();                                                               \
              });                                                                     \
            });                                                                       \
          ',
      errors: [{message: 'Spec contains a then/catch/finally but doesn\'t execute $apply(), $digest(), or httpBackend.flush() function'}]
    },
    {
      code: '\
            it("requires a $apply, $digest or flush() AFTER calling done()", function(done) {             \
              httpBackend.flush();                                                    \
              Service.save("paperwork").then(function() {                             \
                done();                                                               \
              });                                                                     \
            });                                                                       \
          ',
      errors: [{message: 'Spec contains a then/catch/finally but doesn\'t execute $apply(), $digest(), or httpBackend.flush() function'}]
    }
  ]
});
