# frozen_string_literal: true

require "active_support/ordered_options"

module Quilt
  class Configuration < ActiveSupport::OrderedOptions
    def initialize
      super
      react_server_ip   = ENV['REACT_SERVER_IP'] || "localhost"
      react_server_port = ENV['REACT_SERVER_PORT'] || 8081

      self.react_server_host     = "#{react_server_ip}:#{react_server_port}"
      self.react_server_protocol = ENV['REACT_SERVER_PROTOCOL'] || "http"
      self.mount                 = true
    end

    def mount?
      mount
    end
  end

  def self.configuration
    @configuration ||= Configuration.new
  end

  def self.configure
    yield(configuration)
  end
end
