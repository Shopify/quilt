# frozen_string_literal: true

module Quilt
  class ReactAppGenerator < Rails::Generators::Base
    source_root File.expand_path('templates', __dir__)

    desc "This generator adds a React app."

    def set_javascript_path
      insert_into_file(
        "config/application.rb",
        before: /^  end$/,
      ) { "\n    config.javascript_path = \"ui\"\n" }
    end

    def create_app_file
      copy_file("App.tsx", "app/ui/index.tsx")
    end
  end
end
