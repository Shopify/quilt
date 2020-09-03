# frozen_string_literal: true

require "test_helper"
require "action_controller"

module QuiltRails
  module Quilt
    class UiControllerTest < ActionDispatch::IntegrationTest
      include ActiveSupport::Testing::Isolation

      setup { boot_dummy }

      test "react render error" do
        get("/")

        assert_select("h1", "Waiting for React Sever to boot up.")
        assert_select("meta[http-equiv='refresh']") do |selector, *|
          assert_equal("3;URL='/'", selector[:content])
        end
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
