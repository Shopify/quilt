# frozen_string_literal: true

require "quilt_rails/performance/event_metadata"
require "quilt_rails/performance/event"
require "quilt_rails/performance/connection"
require "quilt_rails/performance/navigation_metadata"
require "quilt_rails/performance/navigation"
require "quilt_rails/performance/report"
require "quilt_rails/performance/client"
require "quilt_rails/performance/reportable"

module Quilt
  module Performance
    LIFECYCLE = {
      time_to_first_byte: 'time_to_first_byte',
      time_to_first_contentful_paint: 'time_to_first_contentful_paint',
      time_to_first_paint: 'time_to_first_paint',
      dom_content_loaded: 'dom_content_loaded',
      first_input_delay: 'first_input_delay',
      load: 'dom_load',
    }

    NAVIGATION = {
      complete: 'navigation_complete',
      usable: 'navigation_usable',
      download_size: 'navigation_download_size',
      cache_effectiveness: 'navigation_cache_effectiveness',
    }
  end
end
