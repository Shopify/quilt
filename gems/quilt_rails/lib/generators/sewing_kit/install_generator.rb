# frozen_string_literal: true

module SewingKit
  class InstallGenerator < Rails::Generators::Base
    source_root File.expand_path('templates', __dir__)

    desc "This generator creates a sewing-kit config file."

    def create_config
      config_path = "config/sewing-kit.config.ts"

      if File.exist?(config_path)
        say "Sewing kit config already exists"
      else
        copy_file "sewing-kit.config.ts", config_path

        say "Sewing kit config"
      end
    end
  end
end
