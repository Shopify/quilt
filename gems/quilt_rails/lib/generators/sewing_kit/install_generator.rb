module SewingKit
  class InstallGenerator < Rails::Generators::Base
    source_root File.expand_path('templates', __dir__)

    desc "This generator creates a sewing-kit config file."

    def create_config
      configPath = "config/sewing-kit.config.ts"

      if File.exist? configPath
        log("Sewing-kit config already exists", 'info')
      else
        copy_file "sewing-kit.config.ts", configPath

        log("Sewing-kit config", 'wrote')
      end

    end

    private

    def log(message, type)
      puts "sewing_kit:#{type}   #{message}"
    end
  end
end
