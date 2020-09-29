# frozen_string_literal: true
module Quilt
end

require "quilt_rails/version"
require "quilt_rails/logger"
require "quilt_rails/configuration"
require "quilt_rails/react_renderable"
require "quilt_rails/performance"
require "quilt_rails/trusted_ui_server_csrf_strategy"
require "quilt_rails/header_csrf_strategy"

require "quilt_rails/engine"
require "quilt_rails/monkey_patches/active_support_reloader" if Rails.env.development?
