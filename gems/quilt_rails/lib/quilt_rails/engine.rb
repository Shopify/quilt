# frozen_string_literal: true

module Quilt
  class Engine < ::Rails::Engine
    isolate_namespace Quilt

    config.quilt = Quilt.configuration

    initializer(:mount_quilt, before: :add_builtin_route) do |app|
      app.routes.append do
        mount(Quilt::Engine, at: '/') unless has_named_route?(:quilt)
      end if config.quilt.mount?
    end
  end
end
