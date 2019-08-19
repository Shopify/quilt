
require 'test_helper'
require 'generators/shopify_app/install/install_generator'

class InstallGeneratorTest < Rails::Generators::TestCase
  tests ShopifyApp::Generators::InstallGenerator
  destination File.expand_path("../tmp", File.dirname(__FILE__))

  setup do
    prepare_destination
    provide_existing_gemfile
    provide_existing_application_file
    provide_existing_routes_file
    provide_existing_application_controller
  end

  test "mounts the route file" do
    run_generator
    assert_file "config/routes.rb" do |routes|
      puts routes
      assert_match 'Quilt', routes
    end
  end
end
