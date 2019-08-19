module SewingKit
  class InstallGenerator < Rails::Generators::Base
    source_root File.expand_path('templates', __dir__)

    desc "This generator creates a sewing-kit config file."

    def create_config
      configPath = "config/sewing-kit.config.ts"

      if File.exist? configPath
        say "Sewing-kit config already exists"
      else
        copy_file "sewing-kit.config.ts", configPath

        say "Sewing-kit config"
      end

    end
  end
end

