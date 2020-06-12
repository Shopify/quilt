# frozen_string_literal: true

module Quilt
  class ReactSetupGenerator < Rails::Generators::Base
    source_root File.expand_path('templates', __dir__)

    desc "This generator adds a React app."

    def install_js_dependencies
      say "Installing @shopify/sewing-kit dependencies"
      system("yarn add "\
        "@shopify/sewing-kit "\
        "typescript@~3.8.0 "\
        "react@~16.11.0 "\
        "react-dom@~16.11.0 "\
        "@types/react@~16.9.0 "\
        "@types/react-dom@~16.9.0 ") unless Rails.env.test?
    end

    def create_tsconfig
      copy_file("tsconfig.json")
    end
  end
end
