# frozen_string_literal: true

module Quilt
  class ReactAppGenerator < Rails::Generators::Base
    source_root File.expand_path('templates', __dir__)

    desc "This generator adds a React app."

    def set_app_config_javascript_path
      config_path = "config/application.rb"

      unless File.exist?(config_path)
        inject_into_file(
          config_path,
          "\n    config.javascript_path = \"ui\"\n",
          before: /^  end$/,
        )
      end
    end

    def create_app_file
      copy_file("App.tsx", "app/ui/index.tsx")
    end
  end
end
