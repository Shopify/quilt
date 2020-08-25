# frozen_string_literal: true
require 'test_helper'

module Quilt
  class LoggerTest < ActiveSupport::TestCase
    test "logger delegate" do
      assert_same(Quilt.configuration.logger, Quilt.logger)
    end

    test "log deprecation" do
      assert_deprecated do
        Quilt::Logger.log("something")
      end
    end
  end
end
