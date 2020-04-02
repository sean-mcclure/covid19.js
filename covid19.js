/*! covid19.js v1.1.1 | (c) Created by Sean McClure - MIT License */
//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
covid = {
    "urls": urls = {
        "countries": "https://raw.githubusercontent.com/coviddata/coviddata/master/docs/v1/countries/stats_pretty.json",
        "regions": "https://raw.githubusercontent.com/coviddata/coviddata/master/docs/v1/regions/stats_pretty.json",
        "places": "https://raw.githubusercontent.com/coviddata/coviddata/master/docs/v1/places/stats_pretty.json",
        "fips": "https://collaboratescience.com/covid19/fips.json",
        "country_codes": "https://collaboratescience.com/covid19/country_codes.json"
    },
    "dynamo_load" : function dynamo_load(url) {
        var script = document.createElement("script")
        script.src = url
        document.head.appendChild(script)
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
        if (covid.get_all_fips().includes(covid.cap_first_letter(location))) {
            res = covid.get_time_series_fips(category, type, location)
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
            if(typeof(covid.get_time_series("new", type, location)) !== "undefined") {
            covid.get_time_series("new", type, location).forEach(function(elem) {
                temp_vals.push(elem.value)
            })
            }
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
            if (elem.Country.includes(covid.cap_first_letter(country.split(" ")[0].trim()))) {
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
            var country_code = covid.find_code_by_country(covid.cap_first_letter(location))
        } else {
            var country_code = covid.find_code_by_region(covid.cap_first_letter(location))
        }
        var res = covid.get_flag_url(country_code.toLowerCase())
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
    "call_callback": function call_callback(cb) {
        cb
    },
    "call_once_satisfied": function call_once_satisfied(props) {
        if (eval(props['condition'])) {
            if (typeof(props.function) == 'function') {
                covid.call_callback(props.function())
            } else {
                eval(props['function'])
            }
        } else {
            setTimeout(function() {
                call_once_satisfied(props)
            }, 100)
        }
    },
    "run_sir_model" : function run_sir_model(beta = 0.1, gamma = 0.05) {
        return(run_sir(beta, gamma))
    },
    "run_regression_on_time_series" : function run_regression_on_time_series(time_series, type) {
        var res = {}
        var data_prepped_for_regression = []
        time_series.forEach(function(elem, i) {
            var inner = []
            inner.push(i)
            inner.push(elem.value)
            data_prepped_for_regression.push(inner)
        })
        if(type === "linear") {
            regression_results = methods.linear(data_prepped_for_regression, { order: 2, precision: 2, period: null });
        }
        if(type === "exponential") {
            regression_results = methods.exponential(data_prepped_for_regression, { order: 2, precision: 2, period: null });
        }
        if(type === "logarithmic") {
            regression_results = methods.logarithmic(data_prepped_for_regression, { order: 2, precision: 2, period: null });
        }
        if(type === "power") {
            regression_results = methods.power(data_prepped_for_regression, { order: 2, precision: 2, period: null });
        }
        if(type === "polynomial") {
            regression_results = methods.polynomial(data_prepped_for_regression, { order: 2, precision: 2, period: null });
        }
        var predicted_results = []
        regression_results.points.forEach(function(arr) {
            var inner_f = {}
            inner_f.index = arr[0]
            inner_f.value = arr[1]
            predicted_results.push(inner_f)
        })
        res.predicted_results = predicted_results
        res.r_squared = regression_results.r2
        res.equation = regression_results.string
        res.predict = regression_results.predict
    return(res)
    }
}
covid.fetch_all_data()
covid.dynamo_load("https://collaboratescience.com/covid19/sir_bundle.js")
covid.dynamo_load("https://collaboratescience.com/covid19/regression_bundle.js")
covid.is_ready = false
covid.call_once_satisfied({
    "condition" : "typeof(covid.countries) !== 'undefined' && typeof(covid.regions) !== 'undefined' && typeof(covid.places) !== 'undefined' && typeof(covid.fips) !== 'undefined' && typeof(covid.country_codes) !== 'undefined'",
    "function" : function() {
         covid.is_ready = true
    }
})