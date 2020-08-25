# frozen_string_literal: true

require "test_helper"
require "action_controller"

module QuiltRails
  class LoggerTest < ActiveSupport::TestCase
    include ActiveSupport::Testing::Isolation

    test "sets rails logger" do
      boot_dummy

      assert_same(Rails.logger, ::Quilt.configuration.logger)
    end

    private

    def boot_dummy
      Rails.env = "development"
      require_relative "../dummy/config/environment"
      @routes = Rails.application.routes
      @controller = nil
    end
  end
end
