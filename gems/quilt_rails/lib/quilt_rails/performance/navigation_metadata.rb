# frozen_string_literal: true

module Quilt
  module Performance
    class NavigationMetadata
      attr_accessor :index
      attr_accessor :supports_detailed_time
      attr_accessor :supports_detailed_events

      def self.from_params(params = {})
        NavigationMetadata.new(
          index: params[:index],
          supports_detailed_time: params[:supports_detailed_time],
          supports_detailed_events: params[:supports_detailed_events],
        )
      end

      def initialize(index:, supports_detailed_events:, supports_detailed_time:)
        @index = index
        @supports_detailed_time = supports_detailed_time
        @supports_detailed_events = supports_detailed_events
      end

      def has_size?
        !size.nil?
      end
    end
  end
end
