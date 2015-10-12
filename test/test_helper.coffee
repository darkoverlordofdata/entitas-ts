#
#	test_helper - Set up the test environment
#
#
#
#

do () ->



  Object.defineProperties @,

    # Use chai 'should' semantics
    should: value: require('chai').should()

