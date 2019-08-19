# frozen_string_literal: true

# Configure Rails Environment
ENV["RAILS_ENV"] = "test"

require_relative "../test/dummy/config/environment"

require 'minitest/autorun'
require 'rails'
require 'mocha/minitest'
require 'quilt_rails'
