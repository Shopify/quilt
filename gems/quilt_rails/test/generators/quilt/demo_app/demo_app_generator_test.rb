# frozen_string_literal: true

require 'test_helper'
require 'rails/generators'
require 'generators/quilt/demo_app/demo_app_generator'

class QuiltDemoAppGeneratorTest < Rails::Generators::TestCase
  tests Quilt::DemoAppGenerator
  destination File.expand_path("./tmp", File.dirname(__FILE__))

  setup do
    prepare_destination
    provide_existing_sewing_kit_config_file
  end

  test "creates the main React app" do
    run_generator
    assert_file "app/ui/foundation/App.tsx" do |app|
      assert_match "import React from 'react';", app
      assert_match "export function App({", app
      assert_match "<Polaris>", app
    end
  end

  test "edit sewing-kit config" do
    run_generator
    assert_file "config/sewing-kit.config.ts" do |sk_config|
      assert_match "import {join} from 'path';", sk_config
      assert_match "autoInclude: [", sk_config
      assert_match "../node_modules/@shopify/polaris/esnext/styles/_public-api.scss", sk_config
    end
  end
end
