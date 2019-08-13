module Quilt
  class Engine < ::Rails::Engine
    isolate_namespace QuiltRails
  end
end