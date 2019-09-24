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

  test "creates a sewing-kit file" do
    run_generator
    assert_file "config/sewing-kit.config.ts" do |config|
      assert_match "export default function sewingKitConfig(_plugins: Plugins, _env: Env)", config
    end
  end
end
