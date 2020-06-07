# frozen_string_literal: true

module SewingKit
  class InstallGenerator < Rails::Generators::Base
    source_root File.expand_path('templates', __dir__)

    desc "This generator creates a sewing-kit config file."

    def initialize(args, *options)
      @application_name = Rails.application.class.module_parent.to_s.underscore
      super(args, *options)
    end

    def create_package_json
      package_json_path = "package.json"

      copy_file(package_json_path)
      gsub_file(package_json_path, "\${application_name}", @application_name)
    end

    def create_sk_config
      sk_config_path = "config/sewing-kit.config.ts"

      copy_file("sewing-kit.config.ts", sk_config_path)
      gsub_file(sk_config_path, "\${application_name}", @application_name)
    end

    def create_config_files
      copy_file(".editorconfig")
      copy_file(".eslintignore")
      copy_file(".prettierignore")
    end
  end
end
