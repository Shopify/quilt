require 'rails-reverse-proxy';

module Quilt
  module ReactRenderable
    include ReverseProxy::Controller

    def render_react
      host = "#{Quilt.configuration.react_server_protocol}://#{Quilt.configuration.react_server_host}"
      reverse_proxy(host)
    end
  end
end
