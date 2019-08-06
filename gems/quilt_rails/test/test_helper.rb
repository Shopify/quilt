# frozen_string_literal: true
require 'minitest/autorun'
require 'rails'
require 'mocha/minitest'
require 'quilt_rails'

module Dummy
  class Application < Rails::Application
    config.eager_load = false
  end
end
# Rails.application.initialize!
