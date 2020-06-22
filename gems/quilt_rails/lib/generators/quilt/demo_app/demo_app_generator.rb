# frozen_string_literal: true

module Quilt
  class DemoAppGenerator < Rails::Generators::Base
    source_root File.expand_path('templates', __dir__)
    desc "This generator adds a demo React app with all the quilt toolings."

    def install_js_dependencies
      say "Installing application js dependencies"
      system("yarn add "\
        "@shopify/react-router "\
        "@shopify/polaris "\
        "@shopify/react-async "\
        "@shopify/react-network "\
        "@shopify/react-performance "\
        "@shopify/react-i18n "\
        "@shopify/react-i18n-universal-provider") unless Rails.env.test?
    end

    def add_polaris_sk_config
      file_path = "config/sewing-kit.config.ts"

      unless File.exist?(file_path)
        inject_into_file(
          file_path,
          File.read(File.expand_path(find_in_source_paths('path_import.ts'))),
          after: "/* eslint-env node */"
        )

        gsub_file(
          file_path,
          /plugins:\s*\[/, "plugins: [#{File.read(File.expand_path(find_in_source_paths('polaris_sass_plugin.ts')))}"
        )
      end
    end

    def create_app_files
      template_director = "app-ui"
      app_ui_director = "app/ui"
      app_ui_files = [
        "index.ts",
        "components/index.ts",
        "components/NotFound/index.ts",
        "components/NotFound/NotFound.tsx",
        "components/NotFound/illustrations/index.ts",
        "components/NotFound/illustrations/404.svg",
        "features/index.ts",
        "features/Home/index.tsx",
        "features/Home/Home.tsx",
        "features/Home/illustrations/index.ts",
        "features/Home/illustrations/empty-state.svg",
        "features/Home/translations/en.json",
        "foundation/App.tsx",
        "foundation/I18n.tsx",
        "foundation/Polaris.tsx",
        "foundation/Routes.tsx",
      ]

      app_ui_files.each do |file_path|
        copy_file "#{template_director}/#{file_path}", "#{app_ui_director}/#{file_path}"
      end
    end

    def format_files
      say "Perform file formating"
      system("yarn sewing-kit format --fix") unless Rails.env.test?
    end
  end
end
