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
  spec.summary     = "A turn-key solution for integrating server-rendered React into your Rails app using Quilt libraries."
  spec.description = "A turn-key solution for integrating server-rendered React into your Rails app using Quilt libraries."
  spec.license     = "MIT"

  spec.files = Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.md"]

  spec.metadata['allowed_push_host'] = 'https://rubygems.org'

  spec.add_dependency 'railties', '>= 3.2.0'
  spec.add_dependency 'rails-reverse-proxy', '~> 0.9.0'
  spec.add_dependency 'statsd-instrument', '>= 2.8.0'

  spec.add_development_dependency 'rubocop', '~> 0.74'
  spec.add_development_dependency 'rubocop-git', '~> 0.1.3'
end
