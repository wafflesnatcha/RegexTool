root_path = File.join(File.dirname(__FILE__))
sass_path = File.join(root_path, 'resources', 'scss')
js_file = File.join(root_path, 'lib', 'script.js')
manifest_file = 'cache.manifest'
fallback_file = 'offline.html'

task :default => [:usage]

task :usage do
	# puts "compress      package and compress all javascript into a single file"
	puts "manifest      write cache.manifest with the appropriate content"
	puts "production    makes project production-server ready"
	puts "clean         clean up the project directory"
end

task :production do
	print `compass compile "#{sass_path}" -e production --force`
end

task :manifest do
	
	def scan_html(filename, root_dir)
		files = []
		text = File.read(File.join(root_dir, filename))
		match = text.scan(/<(?:script [^>]*?src|link [^>]*?href)=["']((?!["']).+?)["'][^>]*\/?>/i)
		match.each do |m|
			files.push(m[0])
			if(m[0].match(/^(?!http).*.css$/i))
				files+= scan_css(m[0], root_dir)
			end
		end
		return files
	end
	
	def scan_css(filename, root_dir)
		files = []
		path = File.expand_path(filename, root_dir)
		text = File.read(path)
		match = text.scan(/url\(['"]?([^\)]+?)['"]?\)/i)
		match.each do |m|
			name = File.expand_path(File.join(File.dirname(path), m[0]), root_dir)
			files.push(name.sub(File.expand_path(root_dir) + "/", ""))
		end
		return files
	end

	puts "building manifest..."
	files = []
	files+= scan_html("index.html", root_path)
	
	date = `date "+%Y-%m-%d %H:%M:%S"`.chomp
	cache = files.uniq.sort.join("\n")
	
	text = <<-EOF
CACHE MANIFEST
# #{date}

CACHE:
#{cache}

FALLBACK:
#{fallback_file}

NETWORK:
*
EOF

	f = File.open(File.join(root_path, manifest_file), "w")
	f.write(text);
	f.close()
end

=begin
task :compress do
	puts "compressing scripts..."

	text = File.read(File.join(root_path, "index.html"))
	text = text.gsub(/<\!--([\s\S]*?)-->/i, "")

	scripts = text.scan(/<script [^>]*src=(["'])((?!\1).+?)(\1)[^>]*>\s*<\/script>/i)

	yuicompressor = `bash -lc "type -p yuicompressor.jar"`
	puts "yuicompressor.jar: #{yuicompressor}"
	if (!yuicompressor)
		f = File.open(js_file, "w")
	end
	scripts.each do |script|
		s = File.join(root_path, script[1])
		puts "  #{script[1]}"
		if (!yuicompressor || !s.match(/.min.js$/i))
			f.write(File.read(s))
		else
			# puts "compressing into #{js_file}..."
			results = `bash -lc 'java -jar "#{yuicompressor}" --type=js >> "#{js_file}"'`
		end
	end
end
=end

task :clean do
	print `rm -r "#{sass_path}/.sass-cache/" #{js_file} 2>/dev/null`
end
