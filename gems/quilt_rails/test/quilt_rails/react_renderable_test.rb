# frozen_string_literal: true
module Quilt
  class ReactRenderableTest < Minitest::Test
    include Quilt::ReactRenderable

    def test_render_react_calls_reverse_proxy_with_server_uri
      url = "#{Quilt.configuration.react_server_protocol}://#{Quilt.configuration.react_server_host}"
      assert_equal(render_react, reverse_proxy(url))
    end

    def reverse_proxy(url)
      "called with #{url}"
    end
  end
end
