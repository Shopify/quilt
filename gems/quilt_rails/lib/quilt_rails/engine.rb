# frozen_string_literal: true

module Quilt
  class Engine < ::Rails::Engine
    isolate_namespace Quilt
  end
end

module Quilt
  class Railtie < Rails::Railtie
  end
end
