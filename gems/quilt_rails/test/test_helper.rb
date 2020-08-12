# frozen_string_literal: true

# Configure Rails Environment
ENV["RAILS_ENV"] = "test"

require 'minitest/autorun'
require 'rails'
require 'mocha/minitest'
require 'quilt_rails'
require_relative "./support/generator_test_helpers"

class ActiveSupport::TestCase
  include GeneratorTestHelpers
end
