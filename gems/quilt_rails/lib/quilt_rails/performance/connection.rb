# frozen_string_literal: true

module Quilt
  module Performance
    class Connection
      attr_accessor :downlink
      attr_accessor :effective_type
      attr_accessor :rtt
      attr_accessor :type

      def self.from_params(params)
        params.transform_keys! { |key| key.underscore.to_sym }

        Connection.new(
          downlink: params[:downlink],
          effective_type: params[:effective_type],
          rtt: params[:rtt],
          type: params[:type]
        )
      end

      def initialize(downlink:, effective_type:, rtt:, type:)
        @downlink = downlink
        @effective_type = effective_type
        @rtt = rtt
        @type = type
      end
    end
  end
end
