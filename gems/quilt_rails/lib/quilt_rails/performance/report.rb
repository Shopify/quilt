# frozen_string_literal: true

module Quilt
  module Performance
    class Report
      attr_accessor :events
      attr_accessor :navigations
      attr_accessor :connection

      class << self
        def from_params(params)
          params.transform_keys! { |key| key.underscore.to_sym }
          params[:connection] = { effectiveType: 'unknown' } if params[:connection].blank?

          connection = Connection.from_params(params[:connection])

          Report.new(
            connection: connection,
            navigations: build_navigations(params[:navigations], connection: connection),
            events: build_events(params[:events], connection: connection),
          )
        end

        private

        def build_navigations(navigations_params, connection:)
          navigations_params ||= []
          navigations_params.map do |navigation|
            navigation = Navigation.from_params(navigation)
            navigation.connection = connection
            navigation
          end
        end

        def build_events(events_params, connection:)
          events_params ||= []
          events_params.map do |event|
            event = Event.from_params(event)
            event.connection = connection
            event
          end
        end
      end

      def initialize(events:, navigations:, connection:)
        @events = events
        @navigations = navigations
        @connection = connection
      end
    end
  end
end
