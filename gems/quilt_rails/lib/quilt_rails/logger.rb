# frozen_string_literal: true

module Quilt
  module Logger
    def self.log(string)
      if Rails.logger.nil?
        puts string
      else
        Rails.logger.info(string)
      end
    end
  end
end
