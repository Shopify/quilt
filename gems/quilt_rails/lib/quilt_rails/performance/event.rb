# frozen_string_literal: true

module Quilt
  module Performance
    class Event
      TYPE = {
        time_to_first_byte: 'ttfb',
        time_to_first_paint: 'ttfp',
        time_to_first_contentful_paint: 'ttfcp',
        dom_content_loaded: 'dcl',
        first_input_delay: 'fid',
        load: 'load',
        long_task: 'longtask',
        usable: 'usable',
        graphql: 'graphql',
        script_download: 'script',
        style_download: 'style',
      }

      attr_accessor :type
      attr_accessor :start
      attr_accessor :duration
      attr_accessor :metadata
      attr_accessor :connection

      def self.from_params(params)
        params.require([:type, :start, :duration])

        attributes = {
          type: params[:type],
          start: params[:start],
          duration: params[:duration],
          metadata: nil,
        }

        if params[:metadata]
          attributes[:metadata] = EventMetadata.from_params(params[:metadata])
        end

        Event.new(**attributes)
      end

      def initialize(type:, start:, duration:, metadata:)
        @type = type
        @start = start
        @duration = duration
        @metadata = metadata
      end

      def value
        raw_value = if type == TYPE[:first_input_delay]
          duration
        else
          start
        end

        raw_value.round
      end

      def metric_name
        type_name = TYPE.key(type)
        if LIFECYCLE[type_name].nil?
          type
        else
          LIFECYCLE[type_name]
        end
      end

      def has_metadata?
        !metadata.nil?
      end
    end
  end
end
