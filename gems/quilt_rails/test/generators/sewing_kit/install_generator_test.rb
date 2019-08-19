
require 'test_helper'
require 'rails/generators'
require 'generators/sewing_kit/install_generator'

class InstallGeneratorTest < Rails::Generators::TestCase
  tests SewingKit::InstallGenerator
  destination File.expand_path("tmp/sewing_kit", File.dirname(__FILE__))

  setup do
    prepare_destination
  end

  test "creates a sewing-kit file" do
    run_generator
    assert_file "config/sewing-kit.config.ts"
  end
end
