# frozen_string_literal: true

require 'rails-reverse-proxy'

module Quilt
  module ReactRenderable
    include ReverseProxy::Controller

    def render_react(headers: {})
      raise DoNotIntegrationTestError if Rails.env.test?

      # Allow concurrent loading to prevent this thread from blocking class
      # loading in controllers called by the Node server.
      ActiveSupport::Dependencies.interlock.permit_concurrent_loads do
        call_proxy(headers)
      end
    end

    private

    def call_proxy(headers)
      if defined? ShopifySecurityBase
        ShopifySecurityBase::HTTPHostRestriction.whitelist([Quilt.configuration.react_server_host]) do
          proxy(headers)
        end
      else
        proxy(headers)
      end
    end

    def proxy(headers)
      url = "#{Quilt.configuration.react_server_protocol}://#{Quilt.configuration.react_server_host}"
      Quilt::Logger.log("[ReactRenderable] proxying to React server at #{url}")

      unless headers.blank?
        Quilt::Logger.log("[ReactRenderable] applying custom headers #{headers.inspect}")
      end

      begin
        reverse_proxy(url, headers: headers.merge('X-CSRF-Token': form_authenticity_token)) do |callbacks|
          callbacks.on_response do |status_code, _response|
            Quilt::Logger.log("[ReactRenderable] #{url} returned #{status_code}")
          end
        end
      rescue Errno::ECONNREFUSED
        raise ReactServerNoResponseError, url
      end
    end

    class ReactServerNoResponseError < StandardError
      def initialize(url)
        # rubocop:disable LineLength
        super "Errno::ECONNREFUSED: Waiting for React server to boot up. If this error presists verify that @shopify/react-server is configured on #{url}"
        # rubocop:enable LineLength
      end
    end

    class DoNotIntegrationTestError < StandardError
      def initialize
        # rubocop:disable LineLength
        super "Do not try to use Rails integration tests on your quilt_rails app. Instead use Jest and @shopify/react-testing to test your React application directly."
        # rubocop:enable LineLength
      end
    end
  end
end
