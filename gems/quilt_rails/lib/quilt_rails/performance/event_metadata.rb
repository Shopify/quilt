# frozen_string_literal: true

module Quilt
  module Performance
    class EventMetadata
      attr_accessor :name
      attr_accessor :size

      def self.from_params(params)
        EventMetadata.new(
          name: params[:name],
          size: params[:size],
        )
      end

      def initialize(name:, size:)
        @name = name
        @size = size
      end

      def has_size?
        !size.nil?
      end
    end
  end
end
