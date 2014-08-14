require 'sinatra'
require 'sinatra/reloader'

get '/' do
  files = Dir.glob("public/json/*").map do |json|
    File.basename(json, ".egonet.json")
  end
  @egonets = files.sort_by {|egonet| egonet.to_i}
  erb :index
end
