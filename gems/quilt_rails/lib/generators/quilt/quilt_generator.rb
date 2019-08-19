class QuiltGenerator < Rails::Generators::Base
  source_root File.expand_path('templates', __dir__)

  desc "This generator creates an initializer file at config/initializers"

  def install_js_dependencies
    log("Installing @shopify/react-server and @shopify/sewing-kit dependencies", 'info')
    system("yarn add @shopify/sewing-kit @shopify/react-server")
  end

  def create_app_file
    uiDir = "/app/ui"
    appPath = "#{uiDir}/index.tsx"

    FileUtils.mkdir("#{Rails.root}#{uiDir}") unless Dir.exists?("#{Rails.root}#{uiDir}")

    if File.exists?("#{Rails.root}#{appPath}")
      log("Skipped creating React App at #{uiDir}/index.tsx. File already exists", 'info')
    else
      copy_file "App.tsx", appPath
      log("React App at #{appPath}", 'wrote')
    end
  end

  def create_route_file
    route "mount Quilt::Engine, at: \"/\"\n"

    log("Added Quilt engine mount", "info")
  end

  private

  def log(message, type)
    color = type == 'info' ? :yellow : :green
    puts "quilt:#{type}   #{message}".colorize(color)
  end
end
