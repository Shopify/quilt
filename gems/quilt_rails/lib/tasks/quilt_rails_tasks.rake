namespace :quilt do
  desc "Install @shopify/react-server with common configuration"
  task install: :environment do
    puts "Installing @shopify/react-server and @shopify/sewing-kit..."
    system("yarn add @shopify/sewing-kit @shopify/react-server")

    uiDir = "/app/ui"
    fullUiPath = "#{Rails.root}#{uiDir}"

    FileUtils.mkdir(fullUiPath) unless Dir.exists?(fullUiPath)

    filesToWrite = {"#{uiDir}/index.tsx" =>
"import * as React from 'react';
import {AppProvider, Page, Card} from '@shopify/polaris';

function App() {
  return (
    <AppProvider>
      <Page title=\"Hello\">
        <Card sectioned>Hi there</Card>
      </Page>
    </AppProvider>
  );
}

export default App;
    ",
    "/config/routes.rb" => "mount Quilt::Engine, at: \"/\""}


    filesToWrite.each do |path, content|

      fullPath = "#{Rails.root}#{path}"

      if File.exists?(fullPath)
        puts "skipped writing #{path}, already exists".yellow
      else
        File.open(fullPath, 'w+') do |file|
          file.write(content)
          puts "wrote    #{path}".green
        end
      end
    end
  end
end
