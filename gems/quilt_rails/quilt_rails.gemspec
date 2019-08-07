$:.push File.expand_path("lib", __dir__)

# Maintain your gem's version:
require "quilt_rails/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |spec|
  spec.name        = "quilt_rails"
  spec.version     = Quilt::VERSION
  spec.authors     = ["Mathew Allen"]
  spec.email       = ["mathew.allen@shopify.com"]
  spec.homepage    = "https://github.com/Shopify/quilt/tree/master/gems/quilt_rails"
  spec.summary     = "A turn-key solution for integrating server-rendered react into your Rails app using Quilt libraries."
  spec.description = "A turn-key solution for integrating server-rendered react into your Rails app using Quilt libraries."
  spec.license     = "MIT"

  # Prevent pushing this gem to RubyGems.org. To allow pushes either set the 'allowed_push_host'
  # to allow pushing to a single host or delete this section to allow pushing to any host.
  if spec.respond_to?(:metadata)
    spec.metadata["allowed_push_host"] = "TODO: Set to 'http://mygemserver.com'"
  else
    raise "RubyGems 2.0 or newer is required to protect against " \
      "public gem pushes."
  end

  spec.files = Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.md"]

  spec.add_dependency 'railties', '>= 3.2.0'
  spec.add_dependency 'rails-reverse-proxy', '~> 0.9.0'
end
