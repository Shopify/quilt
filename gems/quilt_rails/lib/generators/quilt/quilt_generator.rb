class QuiltGenerator < Rails::Generators::NamedBase
  source_root File.expand_path('templates', __dir__)


  def copy_app_file
    copy_file "App.tsx", "app/ui/index.tsx"
  end
end
