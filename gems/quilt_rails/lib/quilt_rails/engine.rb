# frozen_string_literal: true

module Quilt
  class Engine < ::Rails::Engine
    isolate_namespace Quilt

    config.quilt = Quilt.configuration

    initializer(:initialize_quilt_logger, after: :initialize_logger) do
      config.quilt.logger = ::Rails.logger
    end

    initializer(:mount_quilt, before: :add_builtin_route) do |app|
      if config.quilt.mount?
        app.routes.append do
          mount(Quilt::Engine, at: '/') unless has_named_route?(:quilt)
        end
      end
    end
  end
end
