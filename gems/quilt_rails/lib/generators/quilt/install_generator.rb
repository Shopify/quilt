module Quilt
  class InstallGenerator < Rails::Generators::Base
    source_root File.expand_path('templates', __dir__)

    desc "This generator mounts the Quilt engine and adds a React app."

    def install_js_dependencies
      say "Installing @shopify/react-server and @shopify/sewing-kit dependencies"
      system("yarn add @shopify/sewing-kit @shopify/react-server") unless Rails.env.test?
    end

    def create_app_file
      appPath = "app/ui/index.tsx"

      unless File.exist? appPath
        copy_file "App.tsx", appPath

        log("React App at #{appPath}", 'wrote')
      end

    end

    def create_route_file
      routesPath = "config/routes.rb"

      if File.exist? routesPath
        route "mount Quilt::Engine, at: '/'"
      else
        copy_file "routes.rb", routesPath
      end

      say "Added Quilt engine mount"
    end
  end
end
