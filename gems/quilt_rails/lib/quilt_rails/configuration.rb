# frozen_string_literal: true
module Quilt
  class Configuration
    attr_accessor :react_server_host, :react_server_protocol

    def initialize
      ip = ENV['REACT_SERVER_IP'] || 'localhost'
      port = ENV['REACT_SERVER_PORT'] || 8081

      @react_server_host = "#{ip}:#{port}"
      @react_server_protocol = ENV['REACT_SERVER_PROTOCOL'] || 'http'
    end
  end

  def self.configuration
    @configuration ||= Configuration.new
  end

  def self.configure
    yield(configuration)
  end
end
