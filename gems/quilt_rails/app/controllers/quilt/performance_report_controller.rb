# frozen_string_literal: true

module Quilt
  class PerformanceReportController < ActionController::Base
    include Quilt::Performance::Reportable
    protect_from_forgery with: :null_session

    def create
      process_report

      render(json: { result: 'success' }, status: 200)
    rescue ActionController::ParameterMissing => error
      render(json: { error: error.message, status: 422 })
    end
  end
end
