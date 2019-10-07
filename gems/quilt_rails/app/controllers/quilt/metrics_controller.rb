# frozen_string_literal: true

module Quilt
  class MetricsController < ApplicationController
    before_action :underscore_params!

    def index
      puts params
    end

    private

    def underscore_params!
      underscore_hash = -> (hash) do
        hash.transform_keys!(&:underscore)
        hash.each do |key, value|
          if value.is_a?(ActionController::Parameters)
            underscore_hash.call(value)
          elsif value.is_a?(Array)
            value.each do |item|
              next unless item.is_a?(ActionController::Parameters)
              underscore_hash.call(item)
            end
          end
        end
      end
      underscore_hash.call(params)
    end
  end
end
