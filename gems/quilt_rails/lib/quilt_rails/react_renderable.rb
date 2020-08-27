# frozen_string_literal: true

require 'rails-reverse-proxy'

module Quilt
  module ReactRenderable
    include ReverseProxy::Controller

    def render_react(headers: {}, data: {})
      raise DoNotIntegrationTestError if Rails.env.test?

      # Allow concurrent loading to prevent this thread from blocking class
      # loading in controllers called by the Node server.
      ActiveSupport::Dependencies.interlock.permit_concurrent_loads do
        call_proxy(headers, data)
      end
    end

    private

    def call_proxy(headers, data)
      if defined? ShopifySecurityBase
        ShopifySecurityBase::HTTPHostRestriction.whitelist([Quilt.configuration.react_server_host]) do
          proxy(headers, data)
        end
      else
        proxy(headers, data)
      end
    end

    def proxy(headers, data)
      url = "#{Quilt.configuration.react_server_protocol}://#{Quilt.configuration.react_server_host}"
      Quilt.logger.info("[ReactRenderable] proxying to React server at #{url}")

      unless headers.blank?
        Quilt.logger.info("[ReactRenderable] applying custom headers #{headers.inspect}")
      end

      begin
        reverse_proxy(
          url,
          headers: headers.merge('X-Request-ID': request.request_id, 'X-Quilt-Data': data.to_json)
        ) do |callbacks|
          callbacks.on_response do |status_code, _response|
            Quilt.logger.info("[ReactRenderable] #{url} returned #{status_code}")
          end
        end
      rescue Errno::ECONNREFUSED
        raise ReactServerNoResponseError, url
      end
    end

    class ReactServerNoResponseError < StandardError
      def initialize(url)
        super(<<~MSG.squish)
          Errno::ECONNREFUSED: Waiting for React server to boot up.
          If this error persists verify that @shopify/react-server is configured on #{url}"
        MSG
      end
    end

    class DoNotIntegrationTestError < StandardError
      def initialize
        super(<<~MSG.squish)
          Do not try to use Rails integration tests on your quilt_rails app.
          Instead use Jest and @shopify/react-testing to test your React application directly."
        MSG
      end
    end
  end
end
