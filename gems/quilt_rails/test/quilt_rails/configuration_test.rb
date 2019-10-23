# frozen_string_literal: true
require 'test_helper'

module Quilt
  class ConfigurationTest < Minitest::Test
    def setup
      @initial_react_server_host = Quilt.configuration.react_server_host
      @initial_react_server_protocol = Quilt.configuration.react_server_protocol
    end

    def teardown
      Quilt.configuration.react_server_host = @initial_react_server_host
      Quilt.configuration.react_server_protocol = @initial_react_server_protocol
    end

    def test_react_server_host_defaults
      assert_equal('localhost:8081', Quilt.configuration.react_server_host)
    end

    def test_allows_react_server_host_to_be_configured
      url = 'localhost:2222'

      Quilt.configure do |configuration|
        configuration.react_server_host = url
      end

      assert_equal(url, Quilt.configuration.react_server_host)
    end

    def test_react_server_protocol_defaults
      assert_equal('http', Quilt.configuration.react_server_protocol)
    end

    def test_allows_react_server_protocol_to_be_configured
      protocol = 'https'

      Quilt.configure do |configuration|
        configuration.react_server_protocol = protocol
      end

      assert_equal(protocol, Quilt.configuration.react_server_protocol)
    end
  end
end
