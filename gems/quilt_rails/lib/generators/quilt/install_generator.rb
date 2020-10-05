# frozen_string_literal: true

module Quilt
  class InstallGenerator < Rails::Generators::Base
    def run_all_generators
      generate("quilt:rails_setup")
      generate("quilt:react_setup")
      generate("quilt:react_app")
    end
  end
end
