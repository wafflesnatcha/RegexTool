ROOT = File.dirname(__FILE__)
CONFIG = {
	'path_root' => ROOT,
	'path_scss' => File.join(ROOT, 'resources', 'scss'),
	'index_file' => 'index.html',
	'manifest_file' => 'cache.manifest',
	'offline_file' => 'offline.html',
	'compiledjs_file' => 'lib/script.js'
}

task :default do
	exec("rake --rakefile '#{__FILE__}' --tasks")
end

desc "Make project ready for deployment"
task :production => ["compass:production", "manifest", "compass:cache"] do
end

desc "Update cache.manifest with the appropriate content"
task :manifest do
	def scan_html(filename, root_dir)
		files = []
		text = File.read(File.join(root_dir, filename))
		match = text.scan(/<(?:script [^>]*?src|link [^>]*?href)=["']((?!["']).+?)["'][^>]*\/?>/i)
		match.each do |m|
			files.push(m[0])
			if (m[0].match(/^(?!http).*.css$/i))
				files += scan_css(m[0], root_dir)
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
	files += scan_html("index.html", CONFIG['path_root'])
	date = `date "+%Y-%m-%d %H:%M:%S"`.chomp
	cache = files.uniq.sort.join("\n")
	text = <<-EOF
CACHE MANIFEST
# #{date}

CACHE:
#{cache}

FALLBACK:
#{CONFIG['offline_file']}

NETWORK:
*
EOF

	f = File.open(File.join(CONFIG['path_root'], CONFIG['manifest_file']), "w")
	f.write(text);
	f.close()
end

namespace :compass do
	task :development do
		system("cd '#{CONFIG['path_scss']}' &>/dev/null && compass compile --time -e development")
	end
	
	task :production do
		system("cd '#{CONFIG['path_scss']}' &>/dev/null && compass compile --time -e production --force")
	end
	
	task :cache do
		system("find '#{CONFIG['path_root']}' -type d -name '.sass-cache' -prune -print -exec rm -r \\{\\} \\;")
	end
end

=begin
desc "Package and compress JavaScripts into a single file"
task :compress do
	compiledjs_file = File.join(ROOT, CONFIG['compiledjs_file'])
	text = File.read(File.join(CONFIG['path_root'], "index.html"))
	text = text.gsub(/<\!--([\s\S]*?)-->/i, "")
	scripts = text.scan(/<script [^>]*src=(["'])((?!\1).+?)(\1)[^>]*>\s*<\/script>/i)
	yuicompressor = `bash -lc "type -p yuicompressor.jar"`
	puts "yuicompressor.jar: #{yuicompressor}"
	if (!yuicompressor)
		f = File.open(compiledjs_file, "w")
	end
	scripts.each do |script|
		s = File.join(CONFIG['path_root'], script[1])
		puts "  #{script[1]}"
		if (!yuicompressor || !s.match(/.min.js$/i))
			f.write(File.read(s))
		else
			# puts "compressing into #{compiledjs_file}..."
			results = `bash -lc 'java -jar "#{yuicompressor}" --type=js >> "#{compiledjs_file}"'`
		end
	end
end
=end

