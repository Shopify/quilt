require 'thor'

namespace :quilt do

  class Cli < Thor
    include Thor::Actions
  end

  desc "Install @shopify/react-server with common configuration"
  task :install do

    log("Installing @shopify/react-server and @shopify/sewing-kit dependencies", 'info')
    # system("yarn add @shopify/sewing-kit @shopify/react-server")

    uiDir = "/app/ui"
    fullUiPath = "#{Rails.root}#{uiDir}"

    # assets = Rails.root.join 'vendor/assets'


    appPath = "#{Rails.root}#{uiDir}/index.tsx"

    FileUtils.mkdir(fullUiPath) unless Dir.exists?(fullUiPath)

    if File.exists?(appPath)
      log("Skipped creating React App at #{uiDir}/index.tsx. File already exists", 'info')

    else
      File.open(appPath, 'w+') do |file|
        file.write(
"import React from 'react';

function App() {
  return (
    <div>Hello Quilt</div>
  );
}

export default App;
        ")
        log("React App at #{uiDir}/index.tsx", 'wrote')
      end
    end

    routesPath = "#{Rails.root}/config/routes.rb"
    routesContent = "mount Quilt::Engine, at: \"/\""

    if File.exists?(routesPath)
      cli :insert_into_file, routesPath, "  mount Quilt::Engine, at: \"/\"\n", :after => "Rails.application.routes.draw do\n"

      log("Route file exists at config/routes.rb... mounting Quilt engine within exisiting file", "wrote")
    else
      File.open(routesPath, 'w+') do |file|
        file.write("Rails.application.routes.draw do
          mount Quilt::Engine, at: \"/\"
        end"
        )

        log("React App at config/routes.rb", "wrote")
      end
    end

    log("Completed Quilt installation", "infor")
  end

  private

  def log(message, type)
    color = type == 'info' ? :yellow : :green
    puts "quilt:#{type}   #{message}".colorize(color)
  end

  def cli(*args)
    Cli.new.send *args
  end

end
