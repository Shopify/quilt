# frozen_string_literal: true
module Quilt
  class Configuration
    attr_accessor :react_server_host, :react_server_protocol

    def initialize
      @react_server_host = ENV['SERVICE_URL'] || 'localhost:8081'
      @react_server_protocol = ENV['SERVICE_PROTOCOL'] || 'http'
    end
  end

  def self.configuration
    @configuration ||= Configuration.new
  end

  def self.configure
    yield(configuration)
  end
end
