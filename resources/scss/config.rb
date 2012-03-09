sass_path = File.dirname(__FILE__)
css_dir = "../css"
javascripts_dir = "../../lib"
images_dir = "../images"

relative_assets = true

# environment = :production
# environment = :development
output_style = (environment == :production) ? :compressed : :expanded
