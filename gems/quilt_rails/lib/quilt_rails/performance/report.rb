# frozen_string_literal: true

module Quilt
  module Performance
    class Report
      attr_accessor :events
      attr_accessor :navigations
      attr_accessor :connection

      def self.from_params(params)
        params.transform_keys! { |key| key.underscore.to_sym }
        params[:connection] = { effectiveType: 'unknown' } if params[:connection].blank?

        connection = Connection.from_params(params[:connection])

        Report.new(
          connection: connection,
          navigations: (params[:navigations] || []).map do |navigation|
            navigation = Navigation.from_params(navigation)
            navigation.connection = connection
            navigation
          end,
          events: (params[:events] || []).map do |event|
            event = Event.from_params(event)
            event.connection = connection
            event
          end,
        )
      end

      def initialize(events:, navigations:, connection:)
        @events = events
        @navigations = navigations
        @connection = connection
      end
    end
  end
end
