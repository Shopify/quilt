# frozen_string_literal: true

module Quilt
  module Performance
    class Navigation
      attr_accessor :start
      attr_accessor :time_to_complete
      attr_accessor :target
      attr_accessor :events
      attr_accessor :result
      attr_accessor :metadata
      attr_accessor :connection

      def self.from_params(params)
        params.transform_keys! { |key| key.underscore.to_sym }
        params.require(:details)

        attributes = {
          start: params[:details][:start],
          time_to_complete: params[:details][:duration],
          target: params[:details][:target],
          result: params[:details][:result],
          events: (params[:details][:events] || []).map do |event|
            Event.from_params(event)
          end,
          metadata: NavigationMetadata.from_params(params[:metadata] || {}),
        }

        Navigation.new(**attributes)
      end

      def initialize(
        start:,
        time_to_complete:,
        target:,
        result:,
        events: [],
        metadata: {}
      )
        @start = start
        @time_to_complete = time_to_complete
        @target = target
        @result = result
        @events = events
        @metadata = metadata
      end

      def events_by_type(target_type)
        events.select do |event|
          event.type == target_type
        end
      end

      def resource_events
        style_events = events_by_type(Event::TYPE[:style_download])
        script_events = events_by_type(Event::TYPE[:script_download])
        style_events.concat(script_events)
      end

      def events_with_size
        resource_events.select do |event|
          event.has_metadata? && event.metadata.has_size?
        end
      end

      def time_to_usable
        usable_event = events_by_type(Event::TYPE[:usable]).first
        return usable_event.start - start unless usable_event.nil?

        time_to_complete
      end

      def total_download_size
        events_with_size.reduce(nil) do |total, current|
          current_size = current.metadata.size
          return current_size + total unless total.nil?
          current_size
        end
      end

      def total_duration_by_event_type(type)
        events = events_by_type(type)

        events.reduce(0) do |total, current_event|
          total + (current_event.duration || 0)
        end
      end

      def cache_effectiveness
        events = events_with_size

        if events.empty? || events.any? { |event| event.metadata.size.nil? }
          return nil
        end

        cached_events = events.select do |event|
          # this is not actually checking the size of an array,
          # there is no EventMetadata#any? method, so this check is being tripped erroneously.
          # rubocop:disable Style/ZeroLengthPredicate
          event.metadata.size == 0
          # rubocop:enable
        end
        cached_events.length / events.length
      end
    end
  end
end
