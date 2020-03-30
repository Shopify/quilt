# frozen_string_literal: true
require 'test_helper'

module Quilt
  class HeaderCsrfStrategyTest < Minitest::Test
    def test_raises_an_exception_if_the_samesite_header_is_missing
      DummyRequest.any_instance.stubs(:headers).returns({})
      strategy = HeaderCsrfStrategy.new(DummyController.new)

      assert_raises HeaderCsrfStrategy::NoSameSiteHeaderError do
        strategy.handle_unverified_request
      end
    end

    def test_raises_an_exception_if_the_samesite_header_has_an_unexpected_value
      headers = {}
      headers[HeaderCsrfStrategy::HEADER] = 'hi hello this is not the value you are looking for'
      DummyRequest.any_instance.stubs(:headers).returns(headers)
      strategy = HeaderCsrfStrategy.new(DummyController.new)

      assert_raises HeaderCsrfStrategy::NoSameSiteHeaderError do
        strategy.handle_unverified_request
      end
    end

    def test_noops_if_the_samesite_header_is_present
      headers = {}
      headers[HeaderCsrfStrategy::HEADER] = HeaderCsrfStrategy::HEADER_VALUE
      DummyRequest.any_instance.stubs(:headers).returns(headers)
      strategy = HeaderCsrfStrategy.new(DummyController.new)

      strategy.handle_unverified_request
    end
  end
end

class DummyController
  def request
    DummyRequest.new
  end
end

class DummyRequest
end
