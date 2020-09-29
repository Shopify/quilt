# frozen_string_literal: true

# Configure Rails Environment
ENV["RAILS_ENV"] = "test"

require 'minitest/autorun'
require 'rails'
require 'mocha/minitest'
require 'quilt_rails'
require 'active_support/testing/deprecation'
require_relative "./support/generator_test_helpers"

Quilt.configuration.logger = Logger.new(nil)

class ActiveSupport::TestCase
  include GeneratorTestHelpers
  include ActiveSupport::Testing::Deprecation
end
