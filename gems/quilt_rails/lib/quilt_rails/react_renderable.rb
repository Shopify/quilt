# frozen_string_literal: true

require 'rails-reverse-proxy'

module Quilt
  module ReactRenderable
    include ReverseProxy::Controller

    def render_react
      url = "#{Quilt.configuration.react_server_protocol}://#{Quilt.configuration.react_server_host}"
      ReactRenderable.log("[ReactRenderable] proxying to React server at #{url}")

      reverse_proxy(url) do |callbacks|
        callbacks.on_response do |status_code, _response|
          ReactRenderable.log("[ReactRenderable] #{url} returned #{status_code}")
        end
      end
    end

    def self.log(string)
      if Rails.logger.nil?
        puts string
      else
        Rails.logger.info(string)
      end
    end
  end
end
