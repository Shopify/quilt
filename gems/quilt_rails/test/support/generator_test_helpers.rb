# frozen_string_literal: true

module GeneratorTestHelpers
  TEMPLATE_PATH = File.expand_path("../templates", __FILE__)

  def provide_existing_routes_file
    copy_to_generator_root("config", "routes.rb")
  end

  private

  def copy_to_generator_root(destination, template)
    template_file = File.join(TEMPLATE_PATH, destination, template)
    destination = File.join(destination_root, destination)

    FileUtils.mkdir_p(destination)
    FileUtils.cp(template_file, destination)
  end
end
