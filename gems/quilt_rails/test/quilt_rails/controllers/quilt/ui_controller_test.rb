# frozen_string_literal: true

require "test_helper"
require "action_controller"

module QuiltRails
  module Quilt
    class UiControllerTest < ActionDispatch::IntegrationTest
      include ActiveSupport::Testing::Isolation

      setup { boot_dummy }

      test "error when no react server" do
        time = Benchmark.realtime { get("/") }

        assert_response(:internal_server_error)
        assert_operator(time, :in?, (10..12))
      end

      private

      def boot_dummy
        Rails.env = "development"
        require_relative "../../../dummy/config/environment"
        @routes = Rails.application.routes
        @controller = nil
      end
    end
  end
end
