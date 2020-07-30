# frozen_string_literal: true

require "test_helper"
require "action_controller"

module Quilt
  class RoutingTest < ActionDispatch::IntegrationTest
    include ActiveSupport::Testing::Isolation

    class PerformanceReportController < ActionController::Base; end
    class UiController < ActionController::Base; end

    setup { boot_dummy }

    test "routes on app without routes" do
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
      Rails.application.routes.draw do
        mount(Quilt::Engine, at: '/quilt')
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
      Rails.application.routes.draw do
        post '/performance_report', to: 'quilt/routing_test/performance_report#create'
        get '/*path', to: 'quilt/routing_test/ui#index'
        root 'quilt/routing_test/ui#index'
      end

      assert_recognizes(
        { controller: "quilt/routing_test/performance_report", action: "create" },
        { path: "/performance_report", method: "post" }
      )
      assert_recognizes(
        { controller: "quilt/routing_test/ui", action: "index", path: "anything" },
        { path: "/anything" }
      )
      assert_recognizes(
        { controller: "quilt/routing_test/ui", action: "index" },
        { path: "/" }
      )
    end

    private

    def boot_dummy
      Rails.env = "development"
      require_relative "../dummy/config/environment"
      @routes = Rails.application.routes
      @controller = nil
    end
  end
end
