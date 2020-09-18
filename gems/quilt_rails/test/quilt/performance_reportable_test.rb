# frozen_string_literal: true
require 'test_helper'
require 'statsd-instrument'

module Quilt
  class PerformanceReportableTest < Minitest::Test
    include Quilt::Performance::Reportable

    def setup
      @request = ActionDispatch::TestRequest.create('CONTENT_TYPE' => 'application/json')
      @params = ActionController::Parameters.new
    end

    def test_process_report_sends_a_distribution_for_events
      @params = ActionController::Parameters.new(
        'connection' => {
          'rtt' => 100,
          'downlink' => 2,
          'effectiveType' => '3g',
          'type' => '4g',
        },
        'navigations' => [],
        'events' => [{
          'type' => 'ttfb',
          'start' => 2,
          'duration' => 1000,
        }, {
          'type' => 'kitty-cat cuddle',
          'start' => 100,
          'duration' => 999999,
        }],
      )

      StatsD
        .expects(:distribution)
        .with('time_to_first_byte', 2, tags: {
          browser_connection_type: '3g',
        })
      StatsD
        .expects(:distribution)
        .with('kitty-cat cuddle', 100, tags: {
          browser_connection_type: '3g',
        })

      process_report
    end

    def test_process_report_sends_distributions_for_navigations
      @params = ActionController::Parameters.new(
        'connection' => {
          'rtt' => 100,
          'downlink' => 2,
          'effectiveType' => '3g',
          'type' => '4g',
        },
        'navigations' => [
          {
            'details' => {
              'start' => 12312312,
              'duration' => 23924,
              'target' => '/',
              'events' => [
                {
                  'type' => 'script',
                  'start' => 23123,
                  'duration' => 124,
                },
                {
                  'type' => 'style',
                  'start' => 23,
                  'duration' => 14,
                },
              ],
              'result' => 0,
            },
            'metadata' => {
              'index' => 0,
              'supportsDetailedTime' => true,
              'supportsDetailedEvents' => true,
            },
          },
        ],
        'events' => [],
      )

      StatsD
        .expects(:distribution)
        .with('navigation_complete', 23924, tags: {
          browser_connection_type: '3g',
        })
      StatsD
        .expects(:distribution)
        .with('navigation_usable', 23924, tags: {
          browser_connection_type: '3g',
        })

      process_report
    end

    def test_process_report_sends_extra_distributions_for_navigations_when_event_metadata_present
      @params = ActionController::Parameters.new(
        'connection' => {
          'rtt' => 100,
          'downlink' => 2,
          'effectiveType' => '3g',
          'type' => '4g',
        },
        'navigations' => [
          {
            'details' => {
              'start' => 12312312,
              'duration' => 23924,
              'target' => '/',
              'events' => [
                {
                  'type' => 'script',
                  'start' => 23123,
                  'duration' => 124,
                  'metadata' => {
                    'name' => 'foo.css',
                    'size' => 2123,
                  },
                },
                {
                  'type' => 'style',
                  'start' => 23,
                  'duration' => 14,
                  'metada' => {
                    'name' => 'foo.js',
                    'size' => 99999,
                  },
                },
              ],
              'result' => 0,
            },
            'metadata' => {
              'index' => 0,
              'supportsDetailedTime' => true,
              'supportsDetailedEvents' => true,
            },
          },
        ],
        'events' => [],
      )

      StatsD
        .expects(:distribution)
        .with('navigation_complete', 23924, tags: {
          browser_connection_type: '3g',
        })
      StatsD
        .expects(:distribution)
        .with('navigation_usable', 23924, tags: {
          browser_connection_type: '3g',
        })
      StatsD
        .expects(:distribution)
        .with('navigation_download_size', 2123, tags: {
          browser_connection_type: '3g',
        })
      StatsD
        .expects(:distribution)
        .with('navigation_cache_effectiveness', 0, tags: {
          browser_connection_type: '3g',
        })

      process_report
    end

    def test_process_report_includes_custom_tags_from_on_event
      @params = ActionController::Parameters.new(
        'connection' => {
          'rtt' => 100,
          'downlink' => 2,
          'effectiveType' => '3g',
          'type' => '4g',
        },
        'navigations' => [],
        'events' => [{
          'type' => 'ttfb',
          'start' => 3,
          'duration' => 1000,
        }, {
          'type' => 'kitty-cat cuddle',
          'start' => 42,
          'duration' => 999999,
        }],
      )

      StatsD
        .expects(:distribution)
        .with('time_to_first_byte', 3, tags: {
          browser_connection_type: '3g',
          connection_type: '4g',
        })
      StatsD
        .expects(:distribution)
        .with('kitty-cat cuddle', 42, tags: {
          browser_connection_type: '3g',
          connection_type: '4g',
        })

      process_report do |client|
        client.on_event do |event, tags|
          tags[:connection_type] = event.connection.type
        end
      end
    end

    def test_process_report_includes_custom_tags_from_on_navigation
      @params = ActionController::Parameters.new(
        'connection' => {
          'rtt' => 100,
          'downlink' => 2,
          'effectiveType' => '3g',
          'type' => '4g',
        },
        'navigations' => [
          {
            'details' => {
              'start' => 12312312,
              'duration' => 2321,
              'target' => '/',
              'events' => [],
              'result' => 0,
            },
            'metadata' => {
              'index' => 0,
              'supportsDetailedTime' => true,
              'supportsDetailedEvents' => true,
            },
          },
          {
            'details' => {
              'start' => 2939,
              'duration' => 999,
              'target' => '/foo',
              'events' => [],
              'result' => 0,
            },
            'metadata' => {
              'index' => 1,
              'supportsDetailedTime' => true,
              'supportsDetailedEvents' => true,
            },
          },
        ],
        'events' => [],
      )

      StatsD
        .expects(:distribution)
        .with('navigation_complete', 2321, tags: {
          browser_connection_type: '3g',
          navigation_target: '/',
        })
      StatsD
        .expects(:distribution)
        .with('navigation_usable', 2321, tags: {
          browser_connection_type: '3g',
          navigation_target: '/',
        })
      StatsD
        .expects(:distribution)
        .with('navigation_complete', 999, tags: {
          browser_connection_type: '3g',
          navigation_target: '/foo',
        })
      StatsD
        .expects(:distribution)
        .with('navigation_usable', 999, tags: {
          browser_connection_type: '3g',
          navigation_target: '/foo',
        })

      process_report do |client|
        client.on_navigation do |navigation, tags|
          tags[:navigation_target] = navigation.target
        end
      end
    end

    def test_process_report_sends_custom_metrics_from_callbacks
      @params = ActionController::Parameters.new(
        'connection' => {
          'rtt' => 100,
          'downlink' => 2,
          'effectiveType' => '3g',
          'type' => '4g',
        },
        'navigations' => [
          {
            'details' => {
              'start' => 12312312,
              'duration' => 2321,
              'target' => '/',
              'events' => [],
              'result' => 0,
            },
            'metadata' => {
              'index' => 0,
              'supportsDetailedTime' => true,
              'supportsDetailedEvents' => true,
            },
          },
        ],
        'events' => [{
          'type' => 'ttfb',
          'start' => 2,
          'duration' => 1000,
        }],
      )

      StatsD
        .expects(:distribution)
        .with('custom_event_metric', 12345, tags: {
          browser_connection_type: '3g',
          custom: 'tag',
        })
      StatsD
        .expects(:distribution)
        .with('custom_navigation_metric', 6789, tags: {
          browser_connection_type: '3g',
          custom: 'tag2',
        })
      StatsD
        .expects(:distribution)
        .with("time_to_first_byte", 2, tags: {
          browser_connection_type: '3g',
        })
      StatsD
        .expects(:distribution)
        .with("navigation_complete", 2321, tags: {
          browser_connection_type: '3g',
        })
      StatsD
        .expects(:distribution)
        .with("navigation_usable", 2321, tags: {
          browser_connection_type: '3g',
        })

      process_report do |client|
        client.on_event do |_event, tags|
          client.distribution('custom_event_metric', 12345, tags.merge(custom: 'tag'))
        end

        client.on_navigation do |_navigation, tags|
          client.distribution('custom_navigation_metric', 6789, tags.merge(custom: 'tag2'))
        end
      end
    end

    def test_process_report_calls_distribution_callback_for_each_distribution
      @params = ActionController::Parameters.new(
        'connection' => {
          'rtt' => 100,
          'downlink' => 2,
          'effectiveType' => '3g',
          'type' => '4g',
        },
        'navigations' => [
          {
            'details' => {
              'start' => 12312312,
              'duration' => 23924,
              'target' => '/',
              'events' => [
                {
                  'type' => 'script',
                  'start' => 23123,
                  'duration' => 124,
                  'metadata' => {
                    'name' => 'foo.css',
                    'size' => 2123,
                  },
                },
                {
                  'type' => 'style',
                  'start' => 23,
                  'duration' => 14,
                  'metada' => {
                    'name' => 'foo.js',
                    'size' => 99999,
                  },
                },
              ],
              'result' => 0,
            },
            'metadata' => {
              'index' => 0,
              'supportsDetailedTime' => true,
              'supportsDetailedEvents' => true,
            },
          },
        ],
        'events' => [],
      )

      times_called = 0
      spy = proc { times_called += 1 }

      process_report do |client|
        client.on_distribution(&spy)
      end

      assert_equal(times_called, 4)
    end

    def test_replaces_omitted_connection_param_with_default_value
      @params = ActionController::Parameters.new(
        'navigations' => [],
        'events' => [{
          'type' => 'ttfb',
          'start' => 2,
          'duration' => 1000,
        }, {
          'type' => 'kitty-cat cuddle',
          'start' => 100,
          'duration' => 999999,
        }],
      )

      StatsD
        .expects(:distribution)
        .with('time_to_first_byte', 2, tags: {
          browser_connection_type: 'unknown',
        })
      StatsD
        .expects(:distribution)
        .with('kitty-cat cuddle', 100, tags: {
          browser_connection_type: 'unknown',
        })

      process_report
    end

    def test_parses_plaintext_to_json
      @request = ActionDispatch::TestRequest.create(
        'CONTENT_TYPE' => 'text/plain',
        'RAW_POST_DATA' => JSON.generate(
          'navigations' => [],
          'events' => [{
            'type' => 'ttfb',
            'start' => 2,
            'duration' => 1000,
          }, {
            'type' => 'kitty-cat cuddle',
            'start' => 100,
            'duration' => 999999,
          }],
        )
      )

      StatsD
        .expects(:distribution)
        .with('time_to_first_byte', 2, tags: {
          browser_connection_type: 'unknown',
        })
      StatsD
        .expects(:distribution)
        .with('kitty-cat cuddle', 100, tags: {
          browser_connection_type: 'unknown',
        })

      process_report
    end

    private

    # rubocop:disable Style/TrivialAccessors
    def params
      @params
    end

    def request
      @request
    end
    # rubocop:enable Style/TrivialAccessors
  end
end
