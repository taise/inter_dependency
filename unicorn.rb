@base_dir = Dir.pwd
@tmp_dir  = File.join(@base_dir, "tmp")
@log_dir  = File.join(@base_dir, "log")

worker_processes  2
working_directory @base_dir

timeout 300
listen  8081

pid File.join(@tmp_dir, "unicorn.pid")

#log
stdout_path File.join(@log_dir, "unicorn.log")
stderr_path File.join(@log_dir, "unicorn_error.log")
