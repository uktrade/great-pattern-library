#!/usr/bin/ruby
# encoding: UTF-8

# this script copies the header/footer html files from great-pattern-library
# and adds all the necessary variables and template logic
# for django templates used in directory-header-footer
# directory-header-footer directory must exist parallel to great-pattern-library

require 'fileutils'

PATTLIB_DIR = './shared-header-footer/'.freeze
DIR_HTML = '../directory-header-footer/directory_header_footer/templates/directory_header_footer/'.freeze
DIR_IMG = '../directory-header-footer/directory_header_footer/static/images/'.freeze
DIR_JS = '../directory-header-footer/directory_header_footer/static/Dit-Pattern-Styling/public/js/'.freeze
DIR_CSS = '../directory-header-footer/directory_header_footer/static/Dit-Pattern-Styling/public/css/'.freeze

def build_header
  puts '*** Building HEADER TEMPLATE ***'
  pattlib_header = File.read(PATTLIB_DIR + 'header.html')
  header = "{% load static %}\n" + pattlib_header
  header = header.split(/(account\-links\"\>)(\s)/)
  header[2] = "\n        {% block login_state %}\n        {% if not sso_is_logged_in %}\n"
  header = header.join.split(/(.)(\" class\=\"register)/)
  header[1] = '{{ sso_register_url }}'
  header = header.join.split(/(.)(\" class\=\"signin)/)
  header[1] = '{{ sso_login_url }}'
  header = header.join.split(%r{(in\<\/a\>\<\/li\>)(\s)})
  header[2] = "\n        {% else %}\n"
  header = header.join.split(/(.)(\" class\=\"profile)/)
  header[1] = '{{ sso_profile_url }}'
  header = header.join.split(/(.)(\" class\=\"signout)/)
  header[1] = '{{ sso_logout_url }}'
  header = header.join.split(%r{(out\<\/a\>\<\/li\>)(\s)})
  header[2] = "\n        {% endif %}\n        {% endblock %}\n"
  replace(header.join)
end

def build_footer
  puts '*** Building FOOTER TEMPLATE ***'
  pattlib_footer = File.read(PATTLIB_DIR + 'footer.html')
  footer = "{% load static %}\n" + pattlib_footer
  footer = footer.split(/(copyright )(2[0-9]{3})/)
  footer[2] = '{% now "Y" %}'
  replace(footer.join)
end

def build_css
  puts '*** Replacing image paths in CSS ***'
  css = File.read(PATTLIB_DIR + 'style.css')
  replace_css(css)
end

def write_file(filename, data, dest)
  file = File.new("#{dest}#{filename}", 'w')
  if file
    file.syswrite(data)
    puts "Written #{dest}#{filename}"
  else
    puts 'Unable to write to file'
  end
end

def replace(html)
  html.gsub!(
    %r{\/shared\-header\-footer\/DfIT\_WHITE_AW\.png},
    "{% static 'images/DfIT_WHITE_AW.png' %}"
  )
  html.gsub!(
    %r{\/shared\-header\-footer\/eig\-logo\-stacked\.svg},
    "{% static 'images/eig-logo-stacked.svg' %}"
  )
  # personas
  html.gsub!(
    %r{http\:\/\/great\.gov\.uk\/new},
    '{{ header_footer_urls.new_to_exporting }}'
  )
  html.gsub!(
    %r{http\:\/\/great\.gov\.uk\/occasional},
    '{{ header_footer_urls.occasional_exporter }}'
  )
  html.gsub!(
    %r{http\:\/\/great\.gov\.uk\/regular},
    '{{ header_footer_urls.regular_exporter }}'
  )
  html.gsub!(
    %r{http\:\/\/great\.gov\.uk\/customer\-insight},
    '{{ header_footer_urls.guidance_customer_insight }}'
  )
  html.gsub!(
    %r{http\:\/\/great\.gov\.uk\/custom},
    '{{ header_footer_urls.custom_page }}'
  )
  # articles
  html.gsub!(
    %r{http\:\/\/great\.gov\.uk\/market\-research},
    '{{ header_footer_urls.guidance_market_research }}'
  )
  html.gsub!(
    %r{http\:\/\/great\.gov\.uk\/finance},
    '{{ header_footer_urls.guidance_finance }}'
  )
  html.gsub!(
    %r{http\:\/\/great\.gov\.uk\/business\-planning},
    '{{ header_footer_urls.guidance_business_planning }}'
  )
  html.gsub!(
    %r{http\:\/\/great\.gov\.uk\/getting\-paid},
    '{{ header_footer_urls.guidance_getting_paid }}'
  )
  html.gsub!(
    %r{http\:\/\/great\.gov\.uk\/operations\-and\-compliance},
    '{{ header_footer_urls.guidance_operations_and_compliance }}'
  )
  # services
  html.gsub!(
    %r{http\:\/\/find\-a\-buyer\.export\.great\.gov\.uk},
    '{{ header_footer_urls.services_fab }}'
  )
  html.gsub!(
    %r{http\:\/\/selling\-online\-overseas\.export\.great\.gov\.uk},
    '{{ header_footer_urls.services_soo }}'
  )
  html.gsub!(
    %r{http\:\/\/opportunities\.export\.great\.gov\.uk},
    '{{ header_footer_urls.services_exopps }}'
  )
  html.gsub!(
    %r{http\:\/\/great\.gov\.uk\/get\-finance},
    '{{ header_footer_urls.services_get_finance }}'
  )
  html.gsub!(
    %r{http\:\/\/events\.trade\.gov\.uk},
    '{{ header_footer_urls.services_events }}'
  )
  # info
  html.gsub!(
    %r{http\:\/\/great\.gov\.uk\/about},
    '{{ header_footer_urls.info_about }}'
  )
  html.gsub!(
    %r{https\:\/\/contact\-us\.export\.great\.gov\.uk\/directory\/FeedbackForm},
    '{{ header_footer_urls.info_contact_us }}'
  )
  html.gsub!(
    %r{http\:\/\/great\.gov\.uk\/privacy\-and\-cookies},
    '{{ header_footer_urls.info_privacy_and_cookies }}'
  )
  html.gsub!(
    %r{http\:\/\/great\.gov\.uk\/terms\-and\-conditions},
    '{{ header_footer_urls.info_terms_and_conditions }}'
  )
  html.gsub!(
    %r{https\:\/\/www\.gov\.uk\/government\/organisations\/department\-for\-international\-trade},
    '{{ header_footer_urls.info_dit }}'
  )
  html.gsub!(
    %r{http\:\/\/great\.gov\.uk},
    '{{ header_footer_urls.great_export_home }}'
  )
  # footer year
  html.gsub!(
    %r{2018},
    '{% now "Y" %}'
  )
  html
end

def replace_css(css)
  css.gsub!(/shared\-header\-footer/, 'static/icons')
  css
end

def copy_images
  puts '*** Copying IMAGES ***'
  src = Dir.glob("#{PATTLIB_DIR}*.{svg,png,gif}")
  src.each do |file|
    filename = File.basename file
    FileUtils.cp(file, DIR_IMG + filename)
    puts "Copied #{filename} to #{DIR_IMG + filename}"
  end
end

def copy_js
  puts '*** Copying JS ***'
  script = "#{PATTLIB_DIR}script.js"
  FileUtils.cp(script, "#{DIR_JS}script.js")
  puts "Copied #{script} to #{DIR_JS}script.js"
  third_party = "#{PATTLIB_DIR}third-party.js"
  FileUtils.cp(third_party, "#{DIR_JS}third-party.js")
end

copy_js
copy_images
write_file('footer.html', build_footer, DIR_HTML)
write_file('header.html', build_header, DIR_HTML)
write_file('main.css', build_css, DIR_CSS)
