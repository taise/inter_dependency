require 'sinatra'
require 'sinatra/reloader'

get '/' do
  @egonets = Dir.glob("public/json/*").map do |json|
    File.basename(json, ".json")
  end
  erb :index
end
