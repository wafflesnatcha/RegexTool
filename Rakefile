project_path = File.join(File.dirname(__FILE__))
sass_path = File.join(project_path, 'resources', 'scss')
js_file = File.join(project_path, 'lib', 'script.js')
manifest_file = File.join(project_path, 'cache.manifest')

task :default => [:usage]

task :usage do
	puts "production    makes project production-server ready"
	puts "compress      package and compress all javascript into a single file"
	puts "manifest      assemble cache.manifest with the appropriate content"
	puts "clean         clean up the project directory"
end

task :production do
	print `compass compile "#{sass_path}" -e production --force`
end

task :manifest do
	puts "building manifest..."

	f = File.open(manifest_file, "w")
	f.write("CACHE MANIFEST\n# ")
	f.write(`date "+%Y-%m-%d %H:%M:%S"`)
	f.write("\nNETWORK:\n*\n\nCACHE:\n")

	text = File.read(File.join(project_path, "index.html"))
	# text = text.gsub(/<\!--((?!-->)[\s\S]*?)-->/i, "")
	
	files = text.scan(/<(?:script [^>]*?src|link [^>]*?href)=["']((?!["']).+?)["'][^>]*\/?>/i)
	
	files.each do |file|
		f.write("#{file[0]}\n")
	end
end

task :compress do
	puts "compressing scripts..."

	text = File.read(File.join(project_path, "index.html"))
	text = text.gsub(/<\!--([\s\S]*?)-->/i, "")

	scripts = text.scan(/<script [^>]*src=(["'])((?!\1).+?)(\1)[^>]*>\s*<\/script>/i)

	yuicompressor = `bash -lc "type -p yuicompressor.jar"`
	puts "yuicompressor.jar: #{yuicompressor}"
	if (!yuicompressor)
		f = File.open(js_file, "w")
	end
	scripts.each do |script|
		s = File.join(project_path, script[1])
		puts "  #{script[1]}"
		if (!yuicompressor)
			f.write(File.read(s))
		else
			# puts "compressing into #{js_file}..."
			results = `bash -lc 'java -jar "#{yuicompressor}" --type=js >> "#{js_file}"'`
		end
	end
end

task :clean do
	print `rm -r "#{sass_path}/.sass-cache/" #{js_file} 2>/dev/null`
end
