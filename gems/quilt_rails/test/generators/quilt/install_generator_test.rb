# frozen_string_literal: true

require 'test_helper'
require 'rails/generators'
require 'generators/quilt/install_generator'

class QuiltInstallGeneratorTest < Rails::Generators::TestCase
  tests Quilt::InstallGenerator
  destination File.expand_path("./tmp", File.dirname(__FILE__))

  setup do
    prepare_destination
    provide_existing_routes_file
  end

  test "creates tsconfig.json" do
    run_generator
    assert_file "tsconfig.json" do |tsconfig|
      assert_match '"extends": "@shopify/typescript-configs/application.json"', tsconfig
    end
  end

  test "creates the main React app" do
    run_generator
    assert_file "app/ui/index.tsx" do |app|
      assert_match "import React from 'react';", app
      assert_match "function App() {", app
      assert_match "export default App;", app
    end
  end

  test "adds engine to routes" do
    run_generator
    assert_file "config/routes.rb" do |routes|
      assert_match "mount Quilt::Engine, at: '/'", routes
    end
  end
end
