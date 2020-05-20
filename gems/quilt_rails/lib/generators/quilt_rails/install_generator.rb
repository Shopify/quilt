# frozen_string_literal: true

module QuiltRails
  class InstallGenerator < Rails::Generators::Base
    def run_all_generators
      generate("sewing_kit:install")
      generate("quilt:install")
    end
  end
end
