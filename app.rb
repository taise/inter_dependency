require 'sinatra'
require 'sinatra/reloader'
require 'coffee-script'

get '/' do
  files = Dir.glob("public/json/*").map do |json|
    File.basename(json, ".egonet.json")
  end
  @egonets = files.sort_by {|egonet| egonet.to_i}
  erb :index
end

get '/coffee/*.js' do
  filename = params[:splat].first
  coffee "../public/coffee/#{filename}".to_sym
end
