require 'thor'

namespace :quilt do

  class Cli < Thor
    include Thor::Actions
  end

  desc "Install @shopify/react-server with common configuration"
  task :install do
    log("Installing @shopify/react-server and @shopify/sewing-kit dependencies", 'info')
    system("yarn add @shopify/sewing-kit @shopify/react-server")

    uiDir = "/app/ui"
    appPath = "#{uiDir}/index.tsx"

    FileUtils.mkdir("#{Rails.root}#{uiDir}") unless Dir.exists?("#{Rails.root}#{uiDir}")

    if File.exists?("#{Rails.root}#{appPath}")
      log("Skipped creating React App at #{uiDir}/index.tsx. File already exists", 'info')

    else
      File.open("#{Rails.root}#{appPath}", 'w+') do |file|
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

    routesPath = "/config/routes.rb"

    if File.exists?("#{Rails.root}#{routesPath}")
      cli :insert_into_file, "#{Rails.root}#{routesPath}", "  mount Quilt::Engine, at: \"/\"\n", :after => "Rails.application.routes.draw do\n"

      log("Route file exists at config/routes.rb... mounting Quilt engine within exisiting file", "wrote")
    else
      File.open("#{Rails.root}#{routesPath}", 'w+') do |file|
        file.write("Rails.application.routes.draw do
          mount Quilt::Engine, at: \"/\"
        end"
        )

        log("Route file at config/routes.rb", "wrote")
      end
    end

    log("Completed Quilt installation", "info")
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
