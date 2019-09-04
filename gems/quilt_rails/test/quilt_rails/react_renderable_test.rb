# frozen_string_literal: true
module Quilt
  class ReactRenderableTest < Minitest::Test
    include Quilt::ReactRenderable

    def test_render_react_calls_reverse_proxy_with_server_uri_and_csrf
      Rails.env.stubs(:test?).returns(false)
      url = "#{Quilt.configuration.react_server_protocol}://#{Quilt.configuration.react_server_host}"

      assert_equal(render_react, reverse_proxy(url, headers: { 'X-CSRF-Token': form_authenticity_token }))
    end

    def test_render_react_errors_in_tests
      Rails.env.stubs(:test?).returns(true)
      assert_raises Quilt::ReactRenderable::DoNotIntegrationTestError do
        render_react
      end
    end

    private

    # Stubbing this method the mixin calls
    def reverse_proxy(url, headers: {})
      "called with #{url} and #{headers}"
    end

    # Stubbing this method the mixin calls
    def form_authenticity_token
      'foo'
    end
  end
end
