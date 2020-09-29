# frozen_string_literal: true

module Quilt
  class TrustedUiServerCsrfStrategy
    def initialize(controller)
      @controller = controller
    end

    def handle_unverified_request
      return if node_server_side_render?

      fallback_handler.handle_unverified_request
    end

    private

    def node_server_side_render?
      @controller.request.headers['x-shopify-server-side-rendered'] == '1'
    end

    def fallback_handler
      ActionController::RequestForgeryProtection::ProtectionMethods::Exception.new(@controller)
    end
  end
end
