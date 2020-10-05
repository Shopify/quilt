# frozen_string_literal: true

require 'test_helper'
require 'rails/generators'
require 'generators/quilt/react_setup/react_setup_generator'

class QuiltReactSetupGeneratorTest < Rails::Generators::TestCase
  tests Quilt::ReactSetupGenerator
  destination File.expand_path("./tmp", File.dirname(__FILE__))
  self.default_arguments = %w(--skip-yarn)

  setup do
    prepare_destination
  end

  test "creates tsconfig.json" do
    run_generator
    assert_file "tsconfig.json" do |tsconfig|
      assert_match '"extends": "@shopify/typescript-configs/application.json"', tsconfig
    end
  end
end
