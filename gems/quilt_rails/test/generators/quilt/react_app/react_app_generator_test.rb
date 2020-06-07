# frozen_string_literal: true

require 'test_helper'
require 'rails/generators'
require 'generators/quilt/react_app/react_app_generator'

class QuiltReactAppGeneratorTest < Rails::Generators::TestCase
  tests Quilt::ReactAppGenerator
  destination File.expand_path("./tmp", File.dirname(__FILE__))

  setup do
    prepare_destination
  end

  test "creates the main React app" do
    run_generator
    assert_file "app/ui/index.tsx" do |app|
      assert_match "import React from 'react';", app
      assert_match "function App() {", app
      assert_match "export default App;", app
    end
  end
end
