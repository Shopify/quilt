# frozen_string_literal: true

module Quilt
  class RailsSetupGenerator < Rails::Generators::Base
    source_root File.expand_path('templates', __dir__)

    desc "This generator mounts the Quilt engine and add Procfile."

    def create_procfile_entry
      procfile_path = "Procfile"

      if File.exist?(procfile_path)
        append_file(procfile_path, File.read(File.expand_path(find_in_source_paths(procfile_path))))
      else
        copy_file(procfile_path)
      end
    end

    def create_route_file
      routes_path = "config/routes.rb"

      if File.exist?(routes_path)
        route("mount Quilt::Engine, at: '/'")
      else
        copy_file("routes.rb", routes_path)
      end

      say("Added Quilt engine mount")
    end
  end
end
