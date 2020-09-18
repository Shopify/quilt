# frozen_string_literal: true

module Quilt
  class ReactSetupGenerator < Rails::Generators::Base
    source_root File.expand_path('templates', __dir__)
    class_option :skip_yarn, type: :boolean, default: false

    desc "This generator adds a React app."

    def install_js_dependencies
      return if options.skip_yarn?

      say("Installing react and types dependencies")
      system("yarn add "\
        "typescript@~3.8.0 "\
        "react@~16.11.0 "\
        "react-dom@~16.11.0 "\
        "@types/react@~16.9.0 "\
        "@types/react-dom@~16.9.0 ")
    end

    def create_tsconfig
      copy_file("tsconfig.json")
    end
  end
end
