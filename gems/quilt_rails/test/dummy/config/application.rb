# frozen_string_literal: true

require_relative 'boot'

require 'rails'
# Import specific frameworks we want
require 'action_controller/railtie'
require 'action_mailer/railtie'
require 'active_storage/engine'

Bundler.require(*Rails.groups)
require "quilt_rails"

module Dummy
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    # config.load_defaults 6.0

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.
    config.hosts << "www.example.com"
  end
end
