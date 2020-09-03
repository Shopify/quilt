# frozen_string_literal: true

module Quilt
  class HeaderCsrfStrategy
    HEADER = "x-shopify-react-xhr"
    HEADER_VALUE = "1"

    def initialize(controller)
      @controller = controller
    end

    def handle_unverified_request
      raise NoSameSiteHeaderError unless same_site?
    end

    private

    def same_site?
      @controller.request.headers[HEADER] == HEADER_VALUE
    end

    def fallback_handler
      ActionController::RequestForgeryProtection::ProtectionMethods::Exception.new(@controller)
    end

    class NoSameSiteHeaderError < StandardError
      def initialize
        super(<<~MSG.squish)
          CSRF verification failed. This request is missing the
          `x-shopify-react-xhr` header, or it does not have the expected value.
        MSG
      end
    end
  end
end
