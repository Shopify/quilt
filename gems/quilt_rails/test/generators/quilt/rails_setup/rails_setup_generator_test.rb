# frozen_string_literal: true

require 'test_helper'
require 'rails/generators'
require 'generators/quilt/rails_setup/rails_setup_generator'

class QuiltRailsSetupGeneratorTest < Rails::Generators::TestCase
  tests Quilt::RailsSetupGenerator
  destination File.expand_path("./tmp", File.dirname(__FILE__))

  setup do
    prepare_destination
    provide_existing_routes_file
  end

  test "creates Procfile" do
    run_generator
    assert_file "Procfile" do |file|
      assert_match "node: node build/server/main.js\nweb: bundle exec rails server -p $PORT -e $RAILS_ENV", file
    end
  end

  test "adds engine to routes" do
    run_generator
    assert_file "config/routes.rb" do |routes|
      assert_match "mount Quilt::Engine, at: '/'", routes
    end
  end
end
