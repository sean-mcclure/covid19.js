/*! covid19.js v1.1.1 | (c) Created by Sean McClure - MIT License */
//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
covid = {
    "urls": urls = {
        "countries": "https://raw.githubusercontent.com/coviddata/coviddata/master/docs/v1/countries/stats_pretty.json",
        "regions": "https://raw.githubusercontent.com/coviddata/coviddata/master/docs/v1/regions/stats_pretty.json",
        "places": "https://raw.githubusercontent.com/coviddata/coviddata/master/docs/v1/places/stats_pretty.json",
        "fips": "https://collaboratescience.com/covid19/fips.json"
    },
    "fetch_data": function fetch_data(key, url) {
        fetch(url).then(response => response.text()).then(data => {
            covid[key] = JSON.parse(data)
        });
    },
    "fetch_all_data": function fetch_all_data() {
        Object.values(covid.urls).forEach(function(url, i) {
            covid.fetch_data(Object.keys(covid.urls)[i], url)
        })
    },
    "cap_first_letter": function cap_first_letter(str) {
        var res = []
        var strs = str.split(" ")
        strs.forEach(function(elem) {
            res.push(elem.charAt(0).toUpperCase() + elem.substring(1))
        })
        return (res.join(" "))
    },
    "get_time_series_countries": function get_time_series_countries(category = "cumulative", type = "cases", country = "Canada") {
        var res = []
        covid.countries.forEach(function(elem) {
            if (elem.country.name === covid.cap_first_letter(country)) {
                Object.keys(elem.dates).forEach(function(date, i) {
                    var inner = {}
                    inner.date = date
                    inner.value = Object.values(elem.dates)[i][category][type]
                    res.push(inner)
                })
            }
        })
        return (res)
    },
    "get_time_series_regions": function get_time_series_regions(category = "cumulative", type = "cases", region = "Ontario") {
        var res = []
        covid.regions.forEach(function(elem) {
            if (elem.region.name === covid.cap_first_letter(region)) {
                Object.keys(elem.dates).forEach(function(date, i) {
                    var inner = {}
                    inner.date = date
                    inner.value = Object.values(elem.dates)[i][category][type]
                    res.push(inner)
                })
            }
        })
        return (res)
    },
    "get_time_series_fips": function get_time_series_fips(category = "cumulative", type = "cases", fips = "36061") {
        var res = []
        var place = covid.get_place_from_fips(fips)[0].place
        var province_state = covid.get_place_from_fips(fips)[0]["Province_State"]
        covid.places.forEach(function(elem) {
            if (elem.place.name.includes(covid.cap_first_letter(place)) && elem.place.region.name.includes(covid.cap_first_letter(province_state))) {
                Object.keys(elem.dates).forEach(function(date, i) {
                    var inner = {}
                    inner.date = date
                    inner.value = Object.values(elem.dates)[i][category][type]
                    res.push(inner)
                })
            }
        })
        return (res)
    },
    "get_time_series": function get_time_series(category, type, location) {
        var res;
        if (covid.get_all_countries().includes(covid.cap_first_letter(location))) {
            res = covid.get_time_series_countries(category, type, location)
        }
        if (covid.get_all_regions().includes(covid.cap_first_letter(location))) {
            res = covid.get_time_series_regions(category, type, location)
        }
        if (covid.get_all_places().includes(covid.cap_first_letter(location))) {
            res = covid.get_time_series_places(category, type, location)
        }
        return (res)
    },
    "get_time_series_multiple": function get_time_series_multiple(category = "cumulative", type = "cases", location_arr = ["Germany", "Italy", "France", "United Kingdom"]) {
        if (covid.get_all_countries().includes(covid.cap_first_letter(location_arr[0]))) {
            var all_res_series = {}
            location_arr.forEach(function(country) {
                all_res_series[country] = covid.get_time_series(category, type, country)
            })
        }
        if (covid.get_all_regions().includes(covid.cap_first_letter(location_arr[0]))) {
            var all_res_series = {}
            location_arr.forEach(function(region) {
                all_res_series[region] = covid.get_time_series(category, type, region)
            })
        }
        if (covid.get_all_fips().includes(covid.cap_first_letter(location_arr[0]))) {
            var all_res_series = {}
            location_arr.forEach(function(fips) {
                all_res_series[fips] = covid.get_time_series_fips(category, type, fips)
            })
        }
        return (all_res_series)
    },
    "get_time_series_multiple_sum": function get_time_series_multiple_sum(category = "cumulative", type = "cases", location_arr = ["Germany", "Italy", "France", "United Kingdom"]) {
        var totals = {}
        var keeps = []
        Object.values(covid.get_time_series_multiple("cumulative", "cases", location_arr)).forEach(function(elem) {
            elem.forEach(function(obj) {
                if (!keeps.includes(obj.date)) {
                    totals[obj.date] = [obj.value]
                } else {
                    totals[obj.date].push(obj.value)
                }
                keeps.push(obj.date)
            })
        })
        var res = {}
        Object.values(totals).forEach(function(arr, i) {
            res[Object.keys(totals)[i]] = arr.reduce((a, b) => a + b, 0)
        })
        return (res)
    },
    "check_if_country": function check_if_country(country_or_region) {
        var res = false
        if (covid.get_all_countries().includes(country_or_region)) {
            res = true
        } else {
            res = false
        }
        return (res)
    },
    "check_if_region": function check_if_region(country_or_region) {
        var res = false
        if (covid.get_all_regions().includes(country_or_region)) {
            res = true
        } else {
            res = false
        }
        return (res)
    },
    "get_all_countries": function get_all_countries() {
        var res = []
        covid.countries.forEach(function(elem) {
            res.push(elem.country.name)
        })
        return (res)
    },
    "get_all_regions": function get_all_regions() {
        var res = []
        covid.regions.forEach(function(elem) {
            res.push(elem.region.name)
        })
        return (res)
    },
    "get_all_places": function get_all_places() {
        var res = []
        covid.places.forEach(function(elem) {
            res.push(elem.place.name)
        })
        return (res)
    },
    "get_all_fips": function get_all_fips() {
        var res = []
        covid.fips.forEach(function(elem) {
            res.push(elem["FIPS"])
        })
        return (res)
    },
    "get_location_report": function get_location_report(location) {
        var totals = {}
        var types = ["cases", "deaths", "recoveries"]
        types.forEach(function(type) {
            var temp_vals = []
            covid.get_time_series("new", type, location).forEach(function(elem) {
                temp_vals.push(elem.value)
            })
            totals[type] = temp_vals.reduce((a, b) => a + b, 0)
        })
        return (totals)
    },
    "get_global_report": function get_global_report() {
        var reports = []
        covid.get_all_countries().forEach(function(country) {
            reports.push(covid.get_location_report(country))
        })
        var cases = []
        var deaths = []
        var recoveries = []
        reports.forEach(function(report) {
            cases.push(report.cases)
            deaths.push(report.deaths)
            recoveries.push(report.recoveries)
        })
        var total_cases = cases.reduce((a, b) => a + b, 0)
        var total_deaths = deaths.reduce((a, b) => a + b, 0)
        var total_recoveries = recoveries.reduce((a, b) => a + b, 0)
        var final = {}
        final.cases = total_cases
        final.deaths = total_deaths
        final.recoveries = total_recoveries
        return (final)
    },
    "check_if_location_in_data": function check_if_location_in_data(location) {
        res = false
        if (covid.get_all_countries().includes(covid.cap_first_letter(location)) || covid.get_all_regions().includes(covid.cap_first_letter(location))) {
            res = true
        } else {
            res = false
        }
        return (res)
    },
    "get_available_dates": function get_available_dates() {
        return (Object.keys(covid.countries[0].dates))
    },
    "get_countries_and_regions": function get_countries_and_regions() {
        var countries_regions = []
        covid.regions.forEach(function(elem) {
            var inner = {}
            inner["country"] = elem.region.country.name
            inner["region"] = elem.region.name
            countries_regions.push(inner)
        })
        return (countries_regions)
    },
    "get_country_from_region": function get_country_from_region(region) {
        var res = ""
        covid.get_countries_and_regions().forEach(function(elem) {
            if (elem.region === covid.cap_first_letter(region)) {
                res = elem.country
            }
        })
        return (res)
    },
    "get_regions_from_country": function get_regions_from_country(country) {
        var res = []
        covid.get_countries_and_regions().forEach(function(elem) {
            if (elem.country === covid.cap_first_letter(country)) {
                res.push(elem.region)
            }
        })
        return (res)
    },
    "check_if_country_has_region": function check_if_country_has_region(country) {
        var res = false
        if (covid.get_regions_from_country(country).length > 0) {
            res = true
        }
        return (res)
    },
    "find_code_by_country": function find_code_by_country(country) {
        var res = false
        covid.country_codes.forEach(function(elem) {
            if (elem.Country.includes(covid.cap_first_letter(country))) {
                res = elem.country_code
            }
        })
        return (res)
    },
    "find_code_by_region": function find_code_by_region(region) {
        var res = false
        var country = covid.get_country_from_region(region)
        covid.country_codes.forEach(function(elem) {
            if (elem.Country.includes(covid.cap_first_letter(country))) {
                res = elem.country_code
            }
        })
        return (res)
    },
    "get_flag_url": function get_flag_url(country_code) {
        var url = "https://collaboratescience.com/corona/flags/" + country_code + ".png"
        return (url)
    },
    "get_country_flag": function get_country_flag(location) {
        if (covid.check_if_country(covid.cap_first_letter(location))) {
            var country_code = covid.find_code_by_country(covid.cap_first_letter(location)).toLowerCase()
        } else {
            var country_code = covid.find_code_by_region(covid.cap_first_letter(location)).toLowerCase()
        }
        var res = covid.get_flag_url(country_code)
        return (res)
    },
    "get_fips_from_place": function get_fips_from_place(place) {
        var res = []
        covid.fips.forEach(function(elem) {
            if (elem["Admin2"] === covid.cap_first_letter(place)) {
                var inner = {}
                inner["FIPS"] = elem["FIPS"]
                inner["Province_State"] = elem["Province_State"]
                res.push(inner)
            }
        })
        return (res)
    },
    "get_place_from_fips": function get_place_from_fips(fips) {
        var res = []
        covid.fips.forEach(function(elem) {
            if (elem["FIPS"] === fips) {
                var inner = {}
                inner["FIPS"] = elem["FIPS"]
                inner["place"] = elem["Admin2"]
                inner["Province_State"] = elem["Province_State"]
                inner["Country_Region"] = elem["Country_Region"]
                res.push(inner)
            }
        })
        return (res)
    },
    "country_codes": country_codes = [{
        "Country": "Afghanistan",
        "country_code": "AF"
    }, {
        "Country": "Albania",
        "country_code": "AL"
    }, {
        "Country": "Algeria",
        "country_code": "DZ"
    }, {
        "Country": "American Samoa",
        "country_code": "AS"
    }, {
        "Country": "Andorra",
        "country_code": "AD"
    }, {
        "Country": "Angola",
        "country_code": "AO"
    }, {
        "Country": "Anguilla",
        "country_code": "AI"
    }, {
        "Country": "Antarctica",
        "country_code": "AQ"
    }, {
        "Country": "Antigua and Barbuda",
        "country_code": "AG"
    }, {
        "Country": "Argentina",
        "country_code": "AR"
    }, {
        "Country": "Armenia",
        "country_code": "AM"
    }, {
        "Country": "Aruba",
        "country_code": "AW"
    }, {
        "Country": "Australia",
        "country_code": "AU"
    }, {
        "Country": "Austria",
        "country_code": "AT"
    }, {
        "Country": "Azerbaijan",
        "country_code": "AZ"
    }, {
        "Country": "Bahamas (the)",
        "country_code": "BS"
    }, {
        "Country": "Bahrain",
        "country_code": "BH"
    }, {
        "Country": "Bangladesh",
        "country_code": "BD"
    }, {
        "Country": "Barbados",
        "country_code": "BB"
    }, {
        "Country": "Belarus",
        "country_code": "BY"
    }, {
        "Country": "Belgium",
        "country_code": "BE"
    }, {
        "Country": "Belize",
        "country_code": "BZ"
    }, {
        "Country": "Benin",
        "country_code": "BJ"
    }, {
        "Country": "Bermuda",
        "country_code": "BM"
    }, {
        "Country": "Bhutan",
        "country_code": "BT"
    }, {
        "Country": "Bolivia",
        "country_code": "BO"
    }, {
        "Country": "Bonaire",
        "country_code": "BQ"
    }, {
        "Country": "Bosnia",
        "country_code": "BA"
    }, {
        "Country": "Botswana",
        "country_code": "BW"
    }, {
        "Country": "Bouvet Island",
        "country_code": "BV"
    }, {
        "Country": "Brazil",
        "country_code": "BR"
    }, {
        "Country": "British Indian Ocean Territory",
        "country_code": "IO"
    }, {
        "Country": "Brunei Darussalam",
        "country_code": "BN"
    }, {
        "Country": "Bulgaria",
        "country_code": "BG"
    }, {
        "Country": "Burkina Faso",
        "country_code": "BF"
    }, {
        "Country": "Burundi",
        "country_code": "BI"
    }, {
        "Country": "Cabo Verde",
        "country_code": "CV"
    }, {
        "Country": "Cambodia",
        "country_code": "KH"
    }, {
        "Country": "Cameroon",
        "country_code": "CM"
    }, {
        "Country": "Canada",
        "country_code": "CA"
    }, {
        "Country": "Cayman Islands",
        "country_code": "KY"
    }, {
        "Country": "Central African Republic",
        "country_code": "CF"
    }, {
        "Country": "Chad",
        "country_code": "TD"
    }, {
        "Country": "Chile",
        "country_code": "CL"
    }, {
        "Country": "China",
        "country_code": "CN"
    }, {
        "Country": "Christmas Island",
        "country_code": "CX"
    }, {
        "Country": "Cocos Islands",
        "country_code": "CC"
    }, {
        "Country": "Colombia",
        "country_code": "CO"
    }, {
        "Country": "Comoros",
        "country_code": "KM"
    }, {
        "Country": "Congo Republic",
        "country_code": "CD"
    }, {
        "Country": "Congo",
        "country_code": "CG"
    }, {
        "Country": "Cook Islands",
        "country_code": "CK"
    }, {
        "Country": "Costa Rica",
        "country_code": "CR"
    }, {
        "Country": "Croatia",
        "country_code": "HR"
    }, {
        "Country": "Cuba",
        "country_code": "CU"
    }, {
        "Country": "Curaçao",
        "country_code": "CW"
    }, {
        "Country": "Cyprus",
        "country_code": "CY"
    }, {
        "Country": "Czechia",
        "country_code": "CZ"
    }, {
        "Country": "Côte d'Ivoire",
        "country_code": "CI"
    }, {
        "Country": "Denmark",
        "country_code": "DK"
    }, {
        "Country": "Djibouti",
        "country_code": "DJ"
    }, {
        "Country": "Dominica",
        "country_code": "DM"
    }, {
        "Country": "Dominican Republic",
        "country_code": "DO"
    }, {
        "Country": "Ecuador",
        "country_code": "EC"
    }, {
        "Country": "Egypt",
        "country_code": "EG"
    }, {
        "Country": "El Salvador",
        "country_code": "SV"
    }, {
        "Country": "Equatorial Guinea",
        "country_code": "GQ"
    }, {
        "Country": "Eritrea",
        "country_code": "ER"
    }, {
        "Country": "Estonia",
        "country_code": "EE"
    }, {
        "Country": "Eswatini",
        "country_code": "SZ"
    }, {
        "Country": "Ethiopia",
        "country_code": "ET"
    }, {
        "Country": "Falkland Islands",
        "country_code": "FK"
    }, {
        "Country": "Faroe Islands",
        "country_code": "FO"
    }, {
        "Country": "Fiji",
        "country_code": "FJ"
    }, {
        "Country": "Finland",
        "country_code": "FI"
    }, {
        "Country": "France",
        "country_code": "FR"
    }, {
        "Country": "French Guiana",
        "country_code": "GF"
    }, {
        "Country": "French Polynesia",
        "country_code": "PF"
    }, {
        "Country": "French Southern Territories",
        "country_code": "TF"
    }, {
        "Country": "Gabon",
        "country_code": "GA"
    }, {
        "Country": "Gambia",
        "country_code": "GM"
    }, {
        "Country": "Georgia",
        "country_code": "GE"
    }, {
        "Country": "Germany",
        "country_code": "DE"
    }, {
        "Country": "Ghana",
        "country_code": "GH"
    }, {
        "Country": "Gibraltar",
        "country_code": "GI"
    }, {
        "Country": "Greece",
        "country_code": "GR"
    }, {
        "Country": "Greenland",
        "country_code": "GL"
    }, {
        "Country": "Grenada",
        "country_code": "GD"
    }, {
        "Country": "Guadeloupe",
        "country_code": "GP"
    }, {
        "Country": "Guam",
        "country_code": "GU"
    }, {
        "Country": "Guatemala",
        "country_code": "GT"
    }, {
        "Country": "Guernsey",
        "country_code": "GG"
    }, {
        "Country": "Guinea",
        "country_code": "GN"
    }, {
        "Country": "Guinea-Bissau",
        "country_code": "GW"
    }, {
        "Country": "Guyana",
        "country_code": "GY"
    }, {
        "Country": "Haiti",
        "country_code": "HT"
    }, {
        "Country": "Heard Island and McDonald Islands",
        "country_code": "HM"
    }, {
        "Country": "Holy See (the)",
        "country_code": "VA"
    }, {
        "Country": "Honduras",
        "country_code": "HN"
    }, {
        "Country": "Hong Kong",
        "country_code": "HK"
    }, {
        "Country": "Hungary",
        "country_code": "HU"
    }, {
        "Country": "Iceland",
        "country_code": "IS"
    }, {
        "Country": "India",
        "country_code": "IN"
    }, {
        "Country": "Indonesia",
        "country_code": "ID"
    }, {
        "Country": "Iran",
        "country_code": "IR"
    }, {
        "Country": "Iraq",
        "country_code": "IQ"
    }, {
        "Country": "Ireland",
        "country_code": "IE"
    }, {
        "Country": "Isle of Man",
        "country_code": "IM"
    }, {
        "Country": "Israel",
        "country_code": "IL"
    }, {
        "Country": "Italy",
        "country_code": "IT"
    }, {
        "Country": "Jamaica",
        "country_code": "JM"
    }, {
        "Country": "Japan",
        "country_code": "JP"
    }, {
        "Country": "Jersey",
        "country_code": "JE"
    }, {
        "Country": "Jordan",
        "country_code": "JO"
    }, {
        "Country": "Kazakhstan",
        "country_code": "KZ"
    }, {
        "Country": "Kenya",
        "country_code": "KE"
    }, {
        "Country": "Kiribati",
        "country_code": "KI"
    }, {
        "Country": "Korea Democratic",
        "country_code": "KP"
    }, {
        "Country": "Korea",
        "country_code": "KR"
    }, {
        "Country": "Kuwait",
        "country_code": "KW"
    }, {
        "Country": "Kyrgyzstan",
        "country_code": "KG"
    }, {
        "Country": "Lao People's Democratic Republic",
        "country_code": "LA"
    }, {
        "Country": "Latvia",
        "country_code": "LV"
    }, {
        "Country": "Lebanon",
        "country_code": "LB"
    }, {
        "Country": "Lesotho",
        "country_code": "LS"
    }, {
        "Country": "Liberia",
        "country_code": "LR"
    }, {
        "Country": "Libya",
        "country_code": "LY"
    }, {
        "Country": "Liechtenstein",
        "country_code": "LI"
    }, {
        "Country": "Lithuania",
        "country_code": "LT"
    }, {
        "Country": "Luxembourg",
        "country_code": "LU"
    }, {
        "Country": "Macao",
        "country_code": "MO"
    }, {
        "Country": "Madagascar",
        "country_code": "MG"
    }, {
        "Country": "Malawi",
        "country_code": "MW"
    }, {
        "Country": "Malaysia",
        "country_code": "MY"
    }, {
        "Country": "Maldives",
        "country_code": "MV"
    }, {
        "Country": "Mali",
        "country_code": "ML"
    }, {
        "Country": "Malta",
        "country_code": "MT"
    }, {
        "Country": "Marshall Islands",
        "country_code": "MH"
    }, {
        "Country": "Martinique",
        "country_code": "MQ"
    }, {
        "Country": "Mauritania",
        "country_code": "MR"
    }, {
        "Country": "Mauritius",
        "country_code": "MU"
    }, {
        "Country": "Mayotte",
        "country_code": "YT"
    }, {
        "Country": "Mexico",
        "country_code": "MX"
    }, {
        "Country": "Micronesia",
        "country_code": "FM"
    }, {
        "Country": "Moldova",
        "country_code": "MD"
    }, {
        "Country": "Monaco",
        "country_code": "MC"
    }, {
        "Country": "Mongolia",
        "country_code": "MN"
    }, {
        "Country": "Montenegro",
        "country_code": "ME"
    }, {
        "Country": "Montserrat",
        "country_code": "MS"
    }, {
        "Country": "Morocco",
        "country_code": "MA"
    }, {
        "Country": "Mozambique",
        "country_code": "MZ"
    }, {
        "Country": "Myanmar",
        "country_code": "MM"
    }, {
        "Country": "Namibia",
        "country_code": "NA"
    }, {
        "Country": "Nauru",
        "country_code": "NR"
    }, {
        "Country": "Nepal",
        "country_code": "NP"
    }, {
        "Country": "Netherlands",
        "country_code": "NL"
    }, {
        "Country": "New Caledonia",
        "country_code": "NC"
    }, {
        "Country": "New Zealand",
        "country_code": "NZ"
    }, {
        "Country": "Nicaragua",
        "country_code": "NI"
    }, {
        "Country": "Niger",
        "country_code": "NE"
    }, {
        "Country": "Nigeria",
        "country_code": "NG"
    }, {
        "Country": "Niue",
        "country_code": "NU"
    }, {
        "Country": "Norfolk Island",
        "country_code": "NF"
    }, {
        "Country": "Northern Mariana Islands",
        "country_code": "MP"
    }, {
        "Country": "Norway",
        "country_code": "NO"
    }, {
        "Country": "Oman",
        "country_code": "OM"
    }, {
        "Country": "Pakistan",
        "country_code": "PK"
    }, {
        "Country": "Palau",
        "country_code": "PW"
    }, {
        "Country": "Palestine",
        "country_code": "PS"
    }, {
        "Country": "Panama",
        "country_code": "PA"
    }, {
        "Country": "Papua New Guinea",
        "country_code": "PG"
    }, {
        "Country": "Paraguay",
        "country_code": "PY"
    }, {
        "Country": "Peru",
        "country_code": "PE"
    }, {
        "Country": "Philippines",
        "country_code": "PH"
    }, {
        "Country": "Pitcairn",
        "country_code": "PN"
    }, {
        "Country": "Poland",
        "country_code": "PL"
    }, {
        "Country": "Portugal",
        "country_code": "PT"
    }, {
        "Country": "Puerto Rico",
        "country_code": "PR"
    }, {
        "Country": "Qatar",
        "country_code": "QA"
    }, {
        "Country": "Republic of North Macedonia",
        "country_code": "MK"
    }, {
        "Country": "Romania",
        "country_code": "RO"
    }, {
        "Country": "Russian Federation (the)",
        "country_code": "RU"
    }, {
        "Country": "Rwanda",
        "country_code": "RW"
    }, {
        "Country": "Réunion",
        "country_code": "RE"
    }, {
        "Country": "Saint Barthélemy",
        "country_code": "BL"
    }, {
        "Country": "Saint Helena",
        "country_code": "SH"
    }, {
        "Country": "Saint Kitts and Nevis",
        "country_code": "KN"
    }, {
        "Country": "Saint Lucia",
        "country_code": "LC"
    }, {
        "Country": "Saint Martin (French part)",
        "country_code": "MF"
    }, {
        "Country": "Saint Pierre and Miquelon",
        "country_code": "PM"
    }, {
        "Country": "Saint Vincent and the Grenadines",
        "country_code": "VC"
    }, {
        "Country": "Samoa",
        "country_code": "WS"
    }, {
        "Country": "San Marino",
        "country_code": "SM"
    }, {
        "Country": "Sao Tome and Principe",
        "country_code": "ST"
    }, {
        "Country": "Saudi Arabia",
        "country_code": "SA"
    }, {
        "Country": "Senegal",
        "country_code": "SN"
    }, {
        "Country": "Serbia",
        "country_code": "RS"
    }, {
        "Country": "Seychelles",
        "country_code": "SC"
    }, {
        "Country": "Sierra Leone",
        "country_code": "SL"
    }, {
        "Country": "Singapore",
        "country_code": "SG"
    }, {
        "Country": "Sint Maarten",
        "country_code": "SX"
    }, {
        "Country": "Slovakia",
        "country_code": "SK"
    }, {
        "Country": "Slovenia",
        "country_code": "SI"
    }, {
        "Country": "Solomon Islands",
        "country_code": "SB"
    }, {
        "Country": "Somalia",
        "country_code": "SO"
    }, {
        "Country": "South Africa",
        "country_code": "ZA"
    }, {
        "Country": "South Georgia and the South Sandwich Islands",
        "country_code": "GS"
    }, {
        "Country": "South Sudan",
        "country_code": "SS"
    }, {
        "Country": "Spain",
        "country_code": "ES"
    }, {
        "Country": "Sri Lanka",
        "country_code": "LK"
    }, {
        "Country": "Sudan",
        "country_code": "SD"
    }, {
        "Country": "Suriname",
        "country_code": "SR"
    }, {
        "Country": "Svalbard and Jan Mayen",
        "country_code": "SJ"
    }, {
        "Country": "Sweden",
        "country_code": "SE"
    }, {
        "Country": "Switzerland",
        "country_code": "CH"
    }, {
        "Country": "Syrian Arab Republic",
        "country_code": "SY"
    }, {
        "Country": "Taiwan",
        "country_code": "TW"
    }, {
        "Country": "Tajikistan",
        "country_code": "TJ"
    }, {
        "Country": "Tanzania",
        "country_code": "TZ"
    }, {
        "Country": "Thailand",
        "country_code": "TH"
    }, {
        "Country": "Timor-Leste",
        "country_code": "TL"
    }, {
        "Country": "Togo",
        "country_code": "TG"
    }, {
        "Country": "Tokelau",
        "country_code": "TK"
    }, {
        "Country": "Tonga",
        "country_code": "TO"
    }, {
        "Country": "Trinidad and Tobago",
        "country_code": "TT"
    }, {
        "Country": "Tunisia",
        "country_code": "TN"
    }, {
        "Country": "Turkey",
        "country_code": "TR"
    }, {
        "Country": "Turkmenistan",
        "country_code": "TM"
    }, {
        "Country": "Turks and Caicos Islands",
        "country_code": "TC"
    }, {
        "Country": "Tuvalu",
        "country_code": "TV"
    }, {
        "Country": "Uganda",
        "country_code": "UG"
    }, {
        "Country": "Ukraine",
        "country_code": "UA"
    }, {
        "Country": "United Arab Emirates",
        "country_code": "AE"
    }, {
        "Country": "United Kingdom of Great Britain",
        "country_code": "GB"
    }, {
        "Country": "United States Minor Outlying Islands",
        "country_code": "UM"
    }, {
        "Country": "United States of America",
        "country_code": "US"
    }, {
        "Country": "Uruguay",
        "country_code": "UY"
    }, {
        "Country": "Uzbekistan",
        "country_code": "UZ"
    }, {
        "Country": "Vanuatu",
        "country_code": "VU"
    }, {
        "Country": "Venezuela",
        "country_code": "VE"
    }, {
        "Country": "Viet Nam",
        "country_code": "VN"
    }, {
        "Country": "Virgin Islands British",
        "country_code": "VG"
    }, {
        "Country": "Virgin Islands U.S.",
        "country_code": "VI"
    }, {
        "Country": "Wallis and Futuna",
        "country_code": "WF"
    }, {
        "Country": "Western Sahara",
        "country_code": "EH"
    }, {
        "Country": "Yemen",
        "country_code": "YE"
    }, {
        "Country": "Zambia",
        "country_code": "ZM"
    }, {
        "Country": "Zimbabwe",
        "country_code": "ZW"
    }, {
        "Country": "Åland Islands",
        "country_code": "AX"
    }]
}
covid.fetch_all_data()