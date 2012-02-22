sass_path = File.dirname(__FILE__)
css_path = File.join(sass_path, "..", "css")
images_dir = "../images"

relative_assets = true

# output_style = :compressed
output_style = :expanded   # :nested, :expanded, :compact, :compressed
environment = :production