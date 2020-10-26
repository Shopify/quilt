# frozen_string_literal: true

require "test_helper"
require "action_controller"

module QuiltRails
  class RoutingTest < ActionDispatch::IntegrationTest
    include ActiveSupport::Testing::Isolation

    class PerformanceReportController < ActionController::Base; end
    class UiController < ActionController::Base; end

    test "routes on app without routes" do
      boot_dummy

      assert_recognizes(
        { controller: "quilt/performance_report", action: "create" },
        { path: "/performance_report", method: "post" }
      )
      assert_recognizes(
        { controller: "quilt/ui", action: "index", path: "anything" },
        { path: "/anything" }
      )
      # Use after https://github.com/rails/rails/pull/39981 is released.
      # assert_recognizes(
      #   { controller: "quilt/ui", action: "index" },
      #   { path: "/" }
      # )
    end

    test "routes on app with engine mount" do
      boot_dummy

      Rails.application.routes.draw do
        mount(::Quilt::Engine, at: '/quilt')
      end

      assert_recognizes(
        { controller: "quilt/performance_report", action: "create" },
        { path: "/quilt/performance_report", method: "post" }
      )
      assert_recognizes(
        { controller: "quilt/ui", action: "index", path: "anything" },
        { path: "/quilt/anything" }
      )
      # Use after https://github.com/rails/rails/pull/39981 is released.
      # assert_recognizes(
      #   { controller: "quilt/ui", action: "index" },
      #   { path: "/path" }
      # )
    end

    test "routes on app with custom controllers" do
      boot_dummy

      Rails.application.routes.draw do
        post '/performance_report', to: 'quilt_rails/routing_test/performance_report#create'
        get '/*path', to: 'quilt_rails/routing_test/ui#index'
        root 'quilt_rails/routing_test/ui#index'
      end

      assert_recognizes(
        { controller: "quilt_rails/routing_test/performance_report", action: "create" },
        { path: "/performance_report", method: "post" }
      )
      assert_recognizes(
        { controller: "quilt_rails/routing_test/ui", action: "index", path: "anything" },
        { path: "/anything" }
      )
      assert_recognizes(
        { controller: "quilt_rails/routing_test/ui", action: "index" },
        { path: "/" }
      )
    end

    test "routes on app with mounting disabled" do
      ::Quilt.configuration.mount = false

      boot_dummy

      assert_recognizes(
        { controller: "rails/welcome", action: "index" },
        { path: "/" }
      )
    end

    private

    def boot_dummy
      Rails.env = "development"
      require_relative "../../dummy/config/environment"
      @routes = Rails.application.routes
      @controller = nil
    end
  end
end
