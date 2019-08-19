class QuiltGenerator < Rails::Generators::Base
  source_root File.expand_path('templates', __dir__)

  desc "This generator creates an initializer file at config/initializers"

  def install_js_dependencies
    log("Installing @shopify/react-server and @shopify/sewing-kit dependencies", 'info')
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
    route "mount Quilt::Engine, at: '/'"

    log("Added Quilt engine mount", "info")
  end

  private

  def log(message, type)
    puts "quilt:#{type}   #{message}"
  end
end
