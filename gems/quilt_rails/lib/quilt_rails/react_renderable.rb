# frozen_string_literal: true

require "rails-reverse-proxy"

module Quilt
  module ReactRenderable
    include ReverseProxy::Controller

    def render_react(headers: {}, data: {})
      if Rails.env.test? && !Quilt.configuration.allow_integration_test
        raise DoNotIntegrationTestError
      end

      # Allow concurrent loading to prevent this thread from blocking class
      # loading in controllers called by the Node server.
      ActiveSupport::Dependencies.interlock.permit_concurrent_loads do
        call_proxy(headers, data)
      end
    end

    private

    def call_proxy(headers, data)
      if defined? ShopifySecurityBase
        # rubocop:disable Naming/InclusiveLanguage
        allowlist = ShopifySecurityBase::HTTPHostRestriction.respond_to?(:allowlist) ? :allowlist : :whitelist
        # rubocop:enable Naming/InclusiveLanguage
        ShopifySecurityBase::HTTPHostRestriction.send(allowlist, [Quilt.configuration.react_server_host]) do
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
        data_json = JSON.generate(data.as_json, ascii_only: true)
        reverse_proxy(
          url,
          headers: headers.merge("X-Request-ID": request.request_id, "X-Quilt-Data": data_json)
        )
      rescue Errno::ECONNREFUSED
        raise ReactServerNoResponseError, url
      end
    end

    class ReactServerNoResponseError < StandardError
      def initialize(url)
        super(<<~MSG.squish)
          Connection refused while waiting for React server to boot up.
          If this error persists, verify that @shopify/react-server is configured on #{url}.
        MSG
      end
    end

    class DoNotIntegrationTestError < StandardError
      def initialize
        super(<<~MSG.squish)
          Please don't test React views with Ruby.
          Jest and @shopify/react-testing should be used to test React components.

          If you meant to query your Rails application, please check your integration test for errors.
        MSG
      end
    end
  end
end
