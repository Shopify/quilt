# frozen_string_literal: true

module Quilt
  class InstallGenerator < Rails::Generators::Base
    source_root File.expand_path('templates', __dir__)

    desc "This generator mounts the Quilt engine and adds a React app."

    def install_js_dependencies
      say "Installing @shopify/react-server and @shopify/sewing-kit dependencies"
      system("yarn add "\
        "@shopify/sewing-kit "\
        "@shopify/react-server "\
        "typescript "\
        "react "\
        "react-dom "\
        "@types/react "\
        "@types/react-dom") unless Rails.env.test?
    end

    def create_tsconfig
      tsconfig_path = "tsconfig.json"

      unless File.exist?(tsconfig_path)
        copy_file "tsconfig.json", tsconfig_path

        log(tsconfig_path, 'wrote')
      end
    end

    def create_app_file
      app_path = "app/ui/index.tsx"

      unless File.exist?(app_path)
        copy_file "App.tsx", app_path

        log("React App at #{app_path}", 'wrote')
      end
    end

    def create_route_file
      routes_path = "config/routes.rb"

      if File.exist?(routes_path)
        route "mount Quilt::Engine, at: '/'"
      else
        copy_file "routes.rb", routes_path
      end

      say "Added Quilt engine mount"
    end
  end
end
