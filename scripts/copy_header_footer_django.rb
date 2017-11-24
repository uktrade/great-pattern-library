#!/usr/bin/ruby
# encoding: UTF-8

# this script copies the header/footer html files from great-pattern-library
# and adds all the necessary variables and template logic
# for django templates used in directory-header-footer

# directory-header-footer directory must exist parallel to great-pattern-library

PATTLIB_DIR = "./shared-header-footer/"
DIR_HEADER_FOOTER = "../directory-header-footer/directory_header_footer/templates/directory_header_footer/"

def build_header()
  pattlib_header = File.read(PATTLIB_DIR+"header.html")
  header = "{% load static %}\n" + pattlib_header
  header = header.split(/(t\-links\"\>)(\s)/)
  header[2] = "\n        {% if not sso_is_logged_in %}\n"
  header = header.join.split(/(.)(\" class\=\"reg)/)
  header[1] = '{{ sso_register_url }}'
  header = header.join.split(/(.)(\" class\=\"signin)/)
  header[1] = '{{ sso_login_url }}'
  header = header.join.split(/(in\<\/a\>\s+\<\/li\>)(\s)/)
  header[2] = "\n        {% else %}\n"
  header = header.join.split(/(.)(\" class\=\"pro)/)
  header[1] = '{{ sso_profile_url }}'
  header = header.join.split(/(.)(\" class\=\"signout)/)
  header[1] = '{{ sso_logout_url }}'
  header = header.join.split(/(out\<\/a\>\s+\<\/li\>)(\s)/)
  header[2] = "\n        {% endif %}\n"
  header = replace(header.join)
  write_file("header.html", header, DIR_HEADER_FOOTER)
end

def build_footer()
  pattlib_footer = File.read(PATTLIB_DIR+"footer.html")
  footer = "{% load static %}\n" + pattlib_footer
  footer = replace(footer)
  write_file("footer", footer, DIR_HEADER_FOOTER)
end

def write_file(filename, data, dest)
  file = File.new("#{dest}#{filename}", "w")
  if file
    file.syswrite(data)
    puts "Written #{dest}#{filename}"
  else
    puts "Unable to write to file"
  end
end

def replace(html)
  html.gsub!(/\/shared\-header\-footer\/DfIT\_WHITE_AW\.png/, "{% static 'images/DfIT_WHITE_AW.png' %}")
  html.gsub!(/\/shared\-header\-footer\/hm\_government\_logo\_horizontal\.svg/, "{% static 'images/hm-gov-horizontal.svg' %}")
  html.gsub!(/\/shared\-header\-footer\/eig\-logo\-stacked\.svg/, "{% static 'images/eig-logo-stacked.svg' %}")
  # personas
  html.gsub!(/http\:\/\/export\.great\.gov\.uk\/new/, "{{ header_footer_urls.new_to_exporting }}")
  html.gsub!(/http\:\/\/export\.great\.gov\.uk\/occasional/, "{{ header_footer_urls.occasional_exporter }}")
  html.gsub!(/http\:\/\/export\.great\.gov\.uk\/regular/, "{{ header_footer_urls.regular_exporter }}")
  # articles
  html.gsub!(/http\:\/\/export\.great\.gov\.uk\/market\-research/, "{{ header_footer_urls.guidance_market_research }}")
  html.gsub!(/http\:\/\/export\.great\.gov\.uk\/customer\-insight/, "{{ header_footer_urls.guidance_customer_insight }}")
  html.gsub!(/http\:\/\/export\.great\.gov\.uk\/finance/, "{{ header_footer_urls.guidance_finance }}")
  html.gsub!(/http\:\/\/export\.great\.gov\.uk\/business\-planning/, "{{ header_footer_urls.guidance_business_planning }}")
  html.gsub!(/http\:\/\/export\.great\.gov\.uk\/getting\-paid/, "{{ header_footer_urls.guidance_getting_paid }}")
  html.gsub!(/http\:\/\/export\.great\.gov\.uk\/operations\-and\-compliance/, "{{ header_footer_urls.guidance_operations_and_compliance }}")
  # services
  html.gsub!(/http\:\/\/find\-a\-buyer\.export\.great\.gov\.uk/, "{{ header_footer_urls.services_fab }}")
  html.gsub!(/http\:\/\/selling\-online\-overseas\.export\.great\.gov\.uk/, "{{ header_footer_urls.services_soo }}")
  html.gsub!(/http\:\/\/opportunities\.export\.great\.gov\.uk/, "{{ header_footer_urls.services_exopps }}")
  html.gsub!(/http\:\/\/export\.great\.gov\.uk\/get\-finance/, "{{ header_footer_urls.services_get_finance }}")
  html.gsub!(/http\:\/\/events\.trade\.gov\.uk/, "{{ header_footer_urls.services_events }}")
  # info
  html.gsub!(/http\:\/\/export\.great\.gov\.uk\/about/, "{{ header_footer_urls.info_about }}")
  html.gsub!(/http\:\/\/contactus\.trade\.gov\.uk/, "{{ header_footer_urls.info_contact_us }}")
  html.gsub!(/http\:\/\/export\.great\.gov\.uk\/privacy\-and\-cookies/, "{{ header_footer_urls.info_privacy_and_cookies }}")
  html.gsub!(/http\:\/\/export\.great\.gov\.uk\/terms\-and\-conditions/, "{{ header_footer_urls.info_terms_and_conditions }}")
  html.gsub!(/https\:\/\/www\.gov\.uk\/government\/organisations\/department\-for\-international\-trade/, "{{ header_footer_urls.info_dit }}")
  html.gsub!(/http\:\/\/great\.gov\.uk/, "{{ header_footer_urls.great_home }}")
  # export home
  html.gsub!(/http\:\/\/export\.great\.gov\.uk/, "{{ header_footer_urls.great_export_home }}")
  return html
end

build_footer()
build_header()
