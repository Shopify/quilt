# frozen_string_literal: true
require 'test_helper'

module Quilt
  class ConfigurationTest < Minitest::Test
    def setup
      @original_configuration = Quilt.configuration
      Quilt.instance_variable_set(:@configuration, Quilt::Configuration.new)
    end

    def teardown
      Quilt.instance_variable_set(:@configuration, @original_configuration)
    end

    def test_react_server_host_default
      assert_equal('localhost:8081', Quilt.configuration.react_server_host)
    end

    def test_react_server_host_configured
      url = 'localhost:2222'

      Quilt.configure do |config|
        config.react_server_host = url
      end

      assert_equal(url, Quilt.configuration.react_server_host)
    end

    def test_react_server_protocol_default
      assert_equal('http', Quilt.configuration.react_server_protocol)
    end

    def test_react_server_protocol_configured
      protocol = 'https'

      Quilt.configure do |config|
        config.react_server_protocol = protocol
      end

      assert_equal(protocol, Quilt.configuration.react_server_protocol)
    end

    def test_logger_default
      assert_kind_of(::Logger, Quilt.configuration.logger)
    end

    def test_logger_configured
      custom_logger = ::Logger.new(nil)

      Quilt.configure do |config|
        config.logger = custom_logger
      end

      assert_same(custom_logger, Quilt.configuration.logger)
    end

    def test_mount_default
      assert_predicate(Quilt.configuration, :mount?)
    end

    def test_mount_configured
      Quilt.configure do |config|
        config.mount = false
      end

      refute_predicate(Quilt.configuration, :mount?)
    end
  end
end
