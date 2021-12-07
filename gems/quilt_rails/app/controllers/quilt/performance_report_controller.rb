# frozen_string_literal: true

module Quilt
  class PerformanceReportController < ActionController::Base
    include Quilt::Performance::Reportable
    protect_from_forgery with: :null_session

    MAX_THREADS = 25

    def create
      Thread.new do
        process_report
      rescue # rubocop:disable Lint/SuppressedException
      end if Thread.list.count < MAX_THREADS

      render(plain: '{"result":"success"}', status: 200)
    end
  end
end
