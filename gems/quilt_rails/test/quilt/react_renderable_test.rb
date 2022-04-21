# frozen_string_literal: true

module Quilt
  class ReactRenderableTest < Minitest::Test
    include Quilt::ReactRenderable

    def test_render_react_calls_reverse_proxy_with_server_uri_and_csrf
      Rails.env.stubs(:test?).returns(false)
      url = "#{Quilt.configuration.react_server_protocol}://#{Quilt.configuration.react_server_host}"

      assert_equal(
        render_react,
        reverse_proxy(
          url,
          headers: { "X-Request-ID": request.request_id, "X-Quilt-Data": "{}" }
        )
      )
    end

    def test_render_react_calls_with_custom_headers
      Rails.env.stubs(:test?).returns(false)
      url = "#{Quilt.configuration.react_server_protocol}://#{Quilt.configuration.react_server_host}"

      render_result = render_react(headers: { "x-custom-header": "test" })
      headers = {
        "x-custom-header": "test",
        "X-Request-ID": request.request_id,
        "X-Quilt-Data": "{}",
      }
      proxy_result = reverse_proxy(url, headers: headers)

      assert_equal(render_result, proxy_result)
    end

    def test_render_react_calls_reverse_proxy_with_header_data
      Rails.env.stubs(:test?).returns(false)
      url = "#{Quilt.configuration.react_server_protocol}://#{Quilt.configuration.react_server_host}"

      headers = { "X-Request-ID": request.request_id, "X-Quilt-Data": '{"X-Foo":"bar"}' }
      assert_equal(
        render_react(data: { "X-Foo": "bar" }),
        reverse_proxy(url, headers: headers)
      )
    end

    def test_render_react_calls_reverse_proxy_with_header_data_that_contains_unicode_characters
      Rails.env.stubs(:test?).returns(false)
      url = "#{Quilt.configuration.react_server_protocol}://#{Quilt.configuration.react_server_host}"

      headers = { "X-Request-ID": request.request_id, "X-Quilt-Data": '{"X-Foo":"Ate\u015f"}' }
      assert_equal(
        render_react(data: { "X-Foo": "Ateş" }),
        reverse_proxy(url, headers: headers)
      )
    end

    def test_no_test_errors_in_tests
      Rails.env.stubs(:test?).returns(true)

      error = assert_raises(Quilt::ReactRenderable::DoNotIntegrationTestError) do
        render_react
      end

      assert_equal(<<~MSG.squish, error.message)
        Please don't test React views with Ruby.
        Jest and @shopify/react-testing should be used to test React components.
        If you meant to query your Rails application, please check your integration test for errors.
      MSG
    end

    def test_no_errors_if_integration_test_error_config_is_false
      Quilt.configure do |config|
        config.allow_integration_test = true
      end

      Rails.env.stubs(:test?).returns(true)

      url = "#{Quilt.configuration.react_server_protocol}://#{Quilt.configuration.react_server_host}"

      headers = { "X-Request-ID": request.request_id, "X-Quilt-Data": '{"X-Foo":"bar"}' }
      assert_equal(
        render_react(data: { "X-Foo": "bar" }),
        reverse_proxy(url, headers: headers)
      )

      Quilt.configure do |config|
        config.allow_integration_test = false
      end
    end

    def test_render_react_errors_in_tests
      Rails.env.stubs(:test?).returns(false)
      expects(:reverse_proxy).raises(Errno::ECONNREFUSED)

      error = assert_raises(Quilt::ReactRenderable::ReactServerNoResponseError) do
        render_react
      end

      assert_equal(<<~MSG.squish, error.message)
        Connection refused while waiting for React server to boot up.
        If this error persists, verify that @shopify/react-server is configured on http://localhost:8081.
      MSG
    end

    private

    # Stubbing this method the mixin calls
    def reverse_proxy(url, headers: {})
      "called with #{url} and #{headers}"
    end

    # Stubbing this method the mixin calls
    def form_authenticity_token
      "foo"
    end

    # Stubbing request that exist in a controller
    def request
      @request ||= ActionDispatch::TestRequest.create.tap do |request|
        request.request_id = SecureRandom.uuid
      end
    end
  end
end
