# frozen_string_literal: true

module Quilt
  module Performance
    class Client
      def initialize(report)
        @report = report
        @base_tags = {
          browser_connection_type: report.connection.effective_type,
        }.freeze

        @distribution_callback = proc { |_name, _value, _tags| nil }
        @event_callback = proc { |_event, _tags| {} }
        @navigation_callback = proc { |_navigation, _tags| {} }
      end

      def self.send!(report)
        client = Client.new(report)

        # Allow the user to customize things
        if block_given?
          yield(client)
        end

        client.send(:process_report!)
      end

      def distribution(metric_name, value, tags = {})
        @distribution_callback.call(metric_name, value, tags)
        StatsD.distribution(metric_name, value, tags: tags) unless Rails.env.dev?
      end

      def on_navigation(&block)
        @navigation_callback = block
      end

      def on_event(&block)
        @event_callback = block
      end

      def on_distribution(&block)
        @distribution_callback = block
      end

      private

      def process_report!
        report_events
        report_navigations
      end

      def report_events
        @report.events.each do |event|
          event_tags = @base_tags.dup
          @event_callback.call(event, event_tags)

          distribution(event.metric_name, event.value, event_tags)
        end
      end

      def report_navigations
        @report.navigations.each do |navigation|
          tags = @base_tags.dup
          @navigation_callback.call(navigation, tags)
          send_default_navigation_distributions(navigation, tags)
          send_conditional_navigation_distributions(navigation, tags)
        end
      end

      def send_default_navigation_distributions(navigation, tags)
        distribution(NAVIGATION[:complete], navigation.time_to_complete, tags)
        distribution(NAVIGATION[:usable], navigation.time_to_usable, tags)
      end

      def send_conditional_navigation_distributions(navigation, tags)
        size = navigation.total_download_size
        distribution(NAVIGATION[:download_size], size, tags) unless size.nil?

        effectiveness = navigation.cache_effectiveness
        distribution(NAVIGATION[:cache_effectiveness], effectiveness, tags) unless effectiveness.nil?
      end
    end
  end
end
