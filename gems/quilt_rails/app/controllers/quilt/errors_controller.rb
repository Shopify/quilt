# frozen_string_literal: true

module Quilt
  class ErrorsController < ActionController::Base
    protect_from_forgery except: :proxy_misconfigured

    def proxy_misconfigured
      render js: "alert('It seems your proxy is misconfigured, you can do this, this and that to make it work again');"
    end
  end
end
