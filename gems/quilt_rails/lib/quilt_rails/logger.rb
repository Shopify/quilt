# frozen_string_literal: true

module Quilt
  module Logger
    def self.log(string)
      ActiveSupport::Deprecation.warn(<<~MSG.squish)
        Quilt::Logger.log is deprecated. Please use Quilt.logger instead.
      MSG
      Quilt.configuration.logger.info(string)
    end
  end

  class << self
    delegate(:logger, to: :configuration)
  end
end
