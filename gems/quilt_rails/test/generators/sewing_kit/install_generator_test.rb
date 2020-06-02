# frozen_string_literal: true

require 'test_helper'
require 'rails/generators'
require 'generators/sewing_kit/install_generator'

class SewingKitInstallGeneratorTest < Rails::Generators::TestCase
  tests SewingKit::InstallGenerator
  destination File.expand_path("./tmp", File.dirname(__FILE__))

  setup do
    prepare_destination
  end

  test "creates package.json file" do
    run_generator
    assert_file "package.json" do |file|
      assert_match "\"name\": \"dummy\",", file
      assert_match "\"sideEffects\": false", file
      assert_match "\"eslintConfig\": {", file
      assert_match "\"prettier\": \"@shopify/prettier-config\"", file
      assert_match "\"stylelint\": {", file
    end
  end

  test "creates a sewing-kit file" do
    run_generator
    assert_file "config/sewing-kit.config.ts" do |config|
      assert_match "export default function sewingKitConfig(plugins: Plugins)", config
      assert_match "name: \"dummy\",", config
      assert_match "plugins: [", config
    end
  end

  test "creates a .editorconfig file" do
    run_generator
    assert_file ".editorconfig" do |config|
      assert_match "indent_size = 2", config
      assert_match "indent_style = space", config
    end
  end

  test "creates a .eslintignore file" do
    run_generator
    assert_file ".eslintignore" do |config|
      assert_match "node_modules", config
      assert_match "build", config
    end
  end

  test "creates a .prettierignore file" do
    run_generator
    assert_file ".prettierignore" do |config|
      assert_match "node_modules", config
      assert_match "tmp", config
    end
  end
end
