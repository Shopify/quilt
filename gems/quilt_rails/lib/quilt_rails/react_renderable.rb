require 'rails-reverse-proxy';

module Quilt
  module ReactRenderable
    include ReverseProxy::Controller

    def render_react
      url = "#{Quilt.configuration.react_server_protocol}://#{Quilt.configuration.react_server_host}"
      Rails.logger.info("[ReactRenderable] proxying to React server at #{url}")

      reverse_proxy(host) do |callbacks|
        callbacks.on_response do |status_code, _response|
          Rails.logger.info("[ReactRenderable] #{url} returned #{status_code}")
        end
      end
    end
  end
end
