/*! covid19.js v1.1.1 | (c) Created by Sean McClure - MIT License */
//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
covid = {
    "hold_value": hold_value = {},
    "hold_value.corona_dates": hold_value.corona_dates = [],
    "hold_value.delay_cnt": hold_value.delay_cnt = -1,
    "hold_value.date_cnt": hold_value.date_cnt = 0,
    "dedupe_array": function dedupe_array(arr) {
        new_arr = arr.filter(function(item, pos) {
            return arr.indexOf(item) == pos;
        })
        return (new_arr)
    },
    "remove_from_array": function remove_from_array(arr, elem) {
        new_arr = arr.filter(function(x) {
            return (x !== elem)
        })
        return (new_arr)
    },
    "sort_object": function sort_object(obj) {
        items = Object.keys(obj).map(function(key) {
            return [key, obj[key]];
        });
        items.sort(function(first, second) {
            return second[1] - first[1];
        });
        sorted_obj = {}
        Object.keys(items).forEach(function(elem, i) {
            var k = Object.keys(items)[i]
            var v = Object.values(items)[i]
            use_key = v[0]
            use_value = v[1]
            sorted_obj[use_key] = use_value
        })
        return (sorted_obj)
    },
    "get_everything_after": function get_everything_after(str, character_choice) {
        new_str = str.split(character_choice).pop();
        return (new_str)
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
    "delay_multiple": function delay_multiple(options) {
        var index = 0;

        function delayed_loop() {
            setTimeout(function() {
                if (typeof(options.function) == 'function') {
                    covid.call_callback(options.function())
                } else {
                    eval(options['function'])
                }
                index++;
                if (index < options['iterations']) {
                    delayed_loop();
                }
            }, options['delay'])
        }
        delayed_loop();
    },
    "urls": urls = {
        "time_series_confirmed": "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv",
        "time_series_deaths": "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv",
        "time_series_recovered": "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv",
        "daily_reports": "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/XX-XX-XXXX.csv"
    },
    "clean_first_commas_from_states": function clean_first_commas_from_states(data) {
        var res = []
        var lines = data.split("\n")
        lines.forEach(function(line) {
            if (line !== "") {
                if (line.split(",")[0].includes('"')) {
                    var first_comma_removed = line.replace(",", " ")
                    res.push(first_comma_removed)
                } else {
                    res.push(line)
                }
            }
        })
        return (res)
    },
    "clean_commas_from_countries": function clean_commas_from_countries(data) {
        var res = data.split("Korea, South").join("Korea South").split("Bahamas, The").join("Bahamas").split("Gambia, The").join("Gambia")
        return (res)
    },
    "convert_fetched_csv_to_json": function convert_fetched_csv_to_json(data) {
        var cleaned_countries = covid.clean_commas_from_countries(data)
        var use_data = covid.clean_first_commas_from_states(cleaned_countries)
        var res = []
        use_data.forEach(function(elem, i) {
            var inner = {}
            if (i === 0) {
                header_elems = elem.split(",")
            } else {
                elem.split(",").forEach(function(data_point, j) {
                    if (typeof(header_elems[j]) !== "undefined") {
                        inner[header_elems[j].trim()] = data_point
                    }
                })
                res.push(inner)
            }
        })
        return (res)
    },
    "convert_json_to_line_data": function convert_json_to_line_data(data) {
        var outer = []
        date_cnt = 0
        data.forEach(function(elem) {
            var inner = []
            Object.keys(elem).forEach(function(look_for_date, i) {
                if (look_for_date.includes("/") && !look_for_date.includes("Province") && !look_for_date.includes("State") && !look_for_date.includes("Country")) {
                    date_cnt++
                    inner_inner = {}
                    inner_inner["index"] = date_cnt
                    if (Math.sign(Number(Object.values(elem)[i])) < 0) {
                        inner_inner["value"] = 0
                    } else {
                        inner_inner["value"] = Number(Object.values(elem)[i])
                    }
                    inner_inner["true_date"] = look_for_date //.split("/").join("-")
                    inner.push(inner_inner)
                } else {
                    if (look_for_date.includes("Country/Region")) {
                        inner.push(elem["Country/Region"].split('"').join('').trim())
                    }
                    if (look_for_date.includes("Province")) {
                        inner.push(elem["Province/State"].split('"').join('').trim())
                    }
                }
            })
            outer.push(inner)
            date_cnt = 0
        })
        return (outer)
    },
    "get_all_countries": function get_all_countries(choice) {
        var res = []
        covid.fetch_results[choice].forEach(function(elem, i) {
            res.push(elem[1])
        })
        return (covid.dedupe_array(res))
    },
    "get_all_country_states": function get_all_country_states(choice, country) {
        var res = []
        covid.fetch_results[choice].forEach(function(elem, i) {
            if (elem[1] === country) {
                res.push(elem[0])
            }
        })
        return (res)
    },
    "check_if_country_has_state": function check_if_country_has_state(country) {
        var check = covid.get_all_country_states("deaths", country)
        if (check.length === 0 || check[0] === "") {
            var res = false
        } else {
            var res = true
        }
        return (res)
    },
    "find_time_series_with_state": function find_time_series_with_state(choice, state, country) {
        var res = {}
        covid.fetch_results[choice].forEach(function(elem) {
            if (elem[0] === state && elem[1] === country) {
                var res_temp = covid.remove_from_array(elem, country)
                res[elem[0]] = covid.remove_from_array(res_temp, state)
            }
            if (elem[0] === "" && elem[1] === country) {
                var res_temp = covid.remove_from_array(elem, country)
                res[elem[1]] = covid.remove_from_array(res_temp, "")
            }
        })
        return (res)
    },
    "find_time_series_with_country": function find_time_series_with_country(choice, country) {
        var res = {}
        covid.fetch_results[choice].forEach(function(elem) {
            if (elem[1] === country) {
                var res_temp = covid.remove_from_array(elem, "")
                res[elem[1]] = covid.remove_from_array(res_temp, country)
            }
        })
        return (res)
    },
    "get_data_dates": function get_data_dates(data) {
        var temp_dates = covid.remove_from_array(covid.get_everything_after(data.split('\n')[0], "Long").split(","), "")
        hold_value.date_cnt++
        if (hold_value.date_cnt === 1) {
            temp_dates.forEach(function(elem) {
                var pieces = elem.split("/")
                if (pieces[0].length < 2) {
                    var new_month = "0" + pieces[0]
                } else {
                    var new_month = pieces[0]
                }
                if (pieces[1].length < 2) {
                    var new_day = "0" + pieces[1]
                } else {
                    var new_day = pieces[1]
                }
                var new_year = pieces[2].replace("20", "2020")
                covid.hold_value.corona_dates.push(new_month.trim() + "-" + new_day.trim() + "-" + new_year.trim())
            })
        }
    },
    "get_available_dates" : function get_available_dates() {
        return(covid.hold_value.corona_dates)
    },
    "get_report_by_country_and_state": function get_report_by_country_and_state(date, country, state) {
        var res = {}
        covid.fetch_results_reports[date].forEach(function(elem) {
            if (elem["Country/Region"] === country && elem["Province/State"] === state) {
                res["deaths"] = elem["Deaths"]
                res["confirmed"] = elem["Confirmed"]
                res["recovered"] = elem["Recovered"]
            }
        })
        return (res)
    },
    "get_global_report": function get_global_report(choice) {
        // since cumulative, only need most recent report
        var use_choice = choice.charAt(0).toUpperCase() + choice.slice(1)
        var global_res = []
        var most_recent_report = covid.fetch_results_reports[covid.hold_value.corona_dates[covid.hold_value.corona_dates.length - 1].trim()]
        most_recent_report.forEach(function(elem) {
            if (elem[use_choice] !== "" && typeof(elem[use_choice]) !== 'undefined') {
                global_res.push(Number(elem[use_choice]))
            }
        })
        return (global_res.reduce((a, b) => a + b, 0))
    },
    "order_totals_by_country": function order_totals_by_country(choice) {
        // since cumulative, only need most recent report
        var use_choice = choice.charAt(0).toUpperCase() + choice.slice(1)
        var res = {}
        var most_recent_report = covid.fetch_results_reports[covid.hold_value.corona_dates[covid.hold_value.corona_dates.length - 1].trim()]
        most_recent_report.forEach(function(elem) {
            if (elem[use_choice] !== "" && typeof(elem[use_choice]) !== 'undefined') {
                if (Object.keys(res).includes(elem["Country/Region"])) {
                    res[elem["Country/Region"]].push(Number(elem[use_choice]))
                } else {
                    res[elem["Country/Region"]] = [Number(elem[use_choice])]
                }
            }
        })
        return (res)
    },
    "order_totals_by_state": function order_totals_by_state(choice) {
        // since cumulative, only need most recent report
        var use_choice = choice.charAt(0).toUpperCase() + choice.slice(1)
        var res = {}
        var most_recent_report = covid.fetch_results_reports[covid.hold_value.corona_dates[covid.hold_value.corona_dates.length - 1].trim()]
        most_recent_report.forEach(function(elem) {
            if (elem[use_choice] !== "" && typeof(elem[use_choice]) !== 'undefined') {
                if (Object.keys(res).includes(elem["Province/State"])) {
                    if (elem["Province/State"] === "") {
                        elem["Province/State"] = elem["Country/Region"]
                        res[elem["Province/State"]].push(Number(elem[use_choice]))
                    } else {
                        res[elem["Province/State"]].push(Number(elem[use_choice]))
                    }
                } else {
                    if (elem["Province/State"] === "") {
                        elem["Province/State"] = elem["Country/Region"]
                        res[elem["Province/State"]] = [Number(elem[use_choice])]
                    } else {
                        res[elem["Province/State"]] = [Number(elem[use_choice])]
                    }
                }
            }
        })
        return (res)
    },
    "sort_totals_by_country": function sort_totals_by_country(choice) {
        var totals = covid.order_totals_by_country(choice)
        res = {}
        Object.keys(totals).forEach(function(elem, i) {
            res[elem] = Object.values(totals)[i].reduce((a, b) => a + b, 0)
        })
        var res_sorted = covid.sort_object(res)
        return (res_sorted)
    },
    "sort_totals_by_state": function sort_totals_by_state(choice) {
        var totals = covid.order_totals_by_state(choice)
        res = {}
        Object.keys(totals).forEach(function(elem, i) {
            res[elem] = Object.values(totals)[i].reduce((a, b) => a + b, 0)
        })
        var res_sorted = covid.sort_object(res)
        return (res_sorted)
    },
    "get_longs_and_lats": function get_longs_and_lats(choice) {
        var res = []
        var most_recent_report = covid.fetch_results_reports[covid.hold_value.corona_dates[covid.hold_value.corona_dates.length - 1].trim()]
        var all_deaths = []
        var all_confirmed = []
        var all_recovered = []
        most_recent_report.forEach(function(elem) {
            all_deaths.push(elem.Deaths)
            all_confirmed.push(elem.Confirmed)
            all_recovered.push(elem.Recovered)
        })
        most_recent_report.forEach(function(elem, i) {
            var inner = {}
            inner.state = elem["Province/State"]
            inner.country = elem["Country/Region"]
            inner.longitude = elem["Longitude"]
            inner.latitude = elem["Latitude"]
            res.push(inner)
        })
        return (res)
    },
    "fetch_corona_data": function fetch_corona_data(choice) {
        if (choice == "confirmed") {
            var url = covid.urls.time_series_confirmed
        }
        if (choice == "deaths") {
            var url = covid.urls.time_series_deaths
        }
        if (choice == "recovered") {
            var url = covid.urls.time_series_recovered
        }
        fetch(url).then(response => response.text()).then(data => {
            covid.get_data_dates(data)
            var use_data = covid.convert_fetched_csv_to_json(data)
            covid.fetch_results[choice] = covid.convert_json_to_line_data(use_data)
        });
    },
    "fetch_corona_reports": function fetch_corona_reports(date) {
        var url = urls.daily_reports.replace("XX-XX-XXXX", date)
        fetch(url).then(response => response.text()).then(data => {
            covid.fetch_results_reports[date] = covid.convert_fetched_csv_to_json(data)
        });
    },
    "get_states_and_countries": function get_states_and_countries() {
        var use_choice = "Deaths"
        var res = []
        var most_recent_report = covid.fetch_results_reports[covid.hold_value.corona_dates[covid.hold_value.corona_dates.length - 1].trim()]
        most_recent_report.forEach(function(elem) {
            if (elem[use_choice] !== "" && typeof(elem[use_choice]) !== 'undefined') {
                var inner = {}
                inner.country = elem["Country/Region"]
                inner.state = elem["Province/State"]
                res.push(inner)
            }
        })
        return (res)
    },
    "get_country_from_state": function get_country_from_state(state) {
        var res = ""
        var states_and_countries = covid.get_states_and_countries()
        states_and_countries.forEach(function(elem) {
            if (elem["state"] === state) {
                res = elem["country"]
            }
            if (state === "Korea South") {
                res = "Korea South"
            }
        })
        return (res)
    },
    "fetch_results": fetch_results = {},
    "fetch_results_reports": fetch_results_reports = {},
    "find_country_by_code" : function find_country_by_code(search_code) {
    var res = false
    covid.country_codes.forEach(function(elem) {
        if(elem.country_code === search_code.toUpperCase()) {
            res = elem.Country
        }
    })
    return(res)
},

"find_code_by_country" : function find_code_by_country(search_country) {
    var res = false
    covid.country_codes.forEach(function(elem) {
        if(elem.Country.includes(search_country)) {
            res = elem.country_code
        }
    })
    return(res)
},
"country_codes" : country_codes = [{
    "Country": "Afghanistan",
    "country_code": "AF"
  },
  {
    "Country": "Albania",
    "country_code": "AL"
  },
  {
    "Country": "Algeria",
    "country_code": "DZ"
  },
  {
    "Country": "American Samoa",
    "country_code": "AS"
  },
  {
    "Country": "Andorra",
    "country_code": "AD"
  },
  {
    "Country": "Angola",
    "country_code": "AO"
  },
  {
    "Country": "Anguilla",
    "country_code": "AI"
  },
  {
    "Country": "Antarctica",
    "country_code": "AQ"
  },
  {
    "Country": "Antigua and Barbuda",
    "country_code": "AG"
  },
  {
    "Country": "Argentina",
    "country_code": "AR"
  },
  {
    "Country": "Armenia",
    "country_code": "AM"
  },
  {
    "Country": "Aruba",
    "country_code": "AW"
  },
  {
    "Country": "Australia",
    "country_code": "AU"
  },
  {
    "Country": "Austria",
    "country_code": "AT"
  },
  {
    "Country": "Azerbaijan",
    "country_code": "AZ"
  },
  {
    "Country": "Bahamas (the)",
    "country_code": "BS"
  },
  {
    "Country": "Bahrain",
    "country_code": "BH"
  },
  {
    "Country": "Bangladesh",
    "country_code": "BD"
  },
  {
    "Country": "Barbados",
    "country_code": "BB"
  },
  {
    "Country": "Belarus",
    "country_code": "BY"
  },
  {
    "Country": "Belgium",
    "country_code": "BE"
  },
  {
    "Country": "Belize",
    "country_code": "BZ"
  },
  {
    "Country": "Benin",
    "country_code": "BJ"
  },
  {
    "Country": "Bermuda",
    "country_code": "BM"
  },
  {
    "Country": "Bhutan",
    "country_code": "BT"
  },
  {
    "Country": "Bolivia",
    "country_code": "BO"
  },
  {
    "Country": "Bonaire",
    "country_code": "BQ"
  },
  {
    "Country": "Bosnia",
    "country_code": "BA"
  },
  {
    "Country": "Botswana",
    "country_code": "BW"
  },
  {
    "Country": "Bouvet Island",
    "country_code": "BV"
  },
  {
    "Country": "Brazil",
    "country_code": "BR"
  },
  {
    "Country": "British Indian Ocean Territory",
    "country_code": "IO"
  },
  {
    "Country": "Brunei Darussalam",
    "country_code": "BN"
  },
  {
    "Country": "Bulgaria",
    "country_code": "BG"
  },
  {
    "Country": "Burkina Faso",
    "country_code": "BF"
  },
  {
    "Country": "Burundi",
    "country_code": "BI"
  },
  {
    "Country": "Cabo Verde",
    "country_code": "CV"
  },
  {
    "Country": "Cambodia",
    "country_code": "KH"
  },
  {
    "Country": "Cameroon",
    "country_code": "CM"
  },
  {
    "Country": "Canada",
    "country_code": "CA"
  },
  {
    "Country": "Cayman Islands",
    "country_code": "KY"
  },
  {
    "Country": "Central African Republic",
    "country_code": "CF"
  },
  {
    "Country": "Chad",
    "country_code": "TD"
  },
  {
    "Country": "Chile",
    "country_code": "CL"
  },
  {
    "Country": "China",
    "country_code": "CN"
  },
  {
    "Country": "Christmas Island",
    "country_code": "CX"
  },
  {
    "Country": "Cocos Islands",
    "country_code": "CC"
  },
  {
    "Country": "Colombia",
    "country_code": "CO"
  },
  {
    "Country": "Comoros",
    "country_code": "KM"
  },
  {
    "Country": "Congo Republic",
    "country_code": "CD"
  },
  {
    "Country": "Congo",
    "country_code": "CG"
  },
  {
    "Country": "Cook Islands",
    "country_code": "CK"
  },
  {
    "Country": "Costa Rica",
    "country_code": "CR"
  },
  {
    "Country": "Croatia",
    "country_code": "HR"
  },
  {
    "Country": "Cuba",
    "country_code": "CU"
  },
  {
    "Country": "Curaçao",
    "country_code": "CW"
  },
  {
    "Country": "Cyprus",
    "country_code": "CY"
  },
  {
    "Country": "Czechia",
    "country_code": "CZ"
  },
  {
    "Country": "Côte d'Ivoire",
    "country_code": "CI"
  },
  {
    "Country": "Denmark",
    "country_code": "DK"
  },
  {
    "Country": "Djibouti",
    "country_code": "DJ"
  },
  {
    "Country": "Dominica",
    "country_code": "DM"
  },
  {
    "Country": "Dominican Republic",
    "country_code": "DO"
  },
  {
    "Country": "Ecuador",
    "country_code": "EC"
  },
  {
    "Country": "Egypt",
    "country_code": "EG"
  },
  {
    "Country": "El Salvador",
    "country_code": "SV"
  },
  {
    "Country": "Equatorial Guinea",
    "country_code": "GQ"
  },
  {
    "Country": "Eritrea",
    "country_code": "ER"
  },
  {
    "Country": "Estonia",
    "country_code": "EE"
  },
  {
    "Country": "Eswatini",
    "country_code": "SZ"
  },
  {
    "Country": "Ethiopia",
    "country_code": "ET"
  },
  {
    "Country": "Falkland Islands",
    "country_code": "FK"
  },
  {
    "Country": "Faroe Islands",
    "country_code": "FO"
  },
  {
    "Country": "Fiji",
    "country_code": "FJ"
  },
  {
    "Country": "Finland",
    "country_code": "FI"
  },
  {
    "Country": "France",
    "country_code": "FR"
  },
  {
    "Country": "French Guiana",
    "country_code": "GF"
  },
  {
    "Country": "French Polynesia",
    "country_code": "PF"
  },
  {
    "Country": "French Southern Territories",
    "country_code": "TF"
  },
  {
    "Country": "Gabon",
    "country_code": "GA"
  },
  {
    "Country": "Gambia",
    "country_code": "GM"
  },
  {
    "Country": "Georgia",
    "country_code": "GE"
  },
  {
    "Country": "Germany",
    "country_code": "DE"
  },
  {
    "Country": "Ghana",
    "country_code": "GH"
  },
  {
    "Country": "Gibraltar",
    "country_code": "GI"
  },
  {
    "Country": "Greece",
    "country_code": "GR"
  },
  {
    "Country": "Greenland",
    "country_code": "GL"
  },
  {
    "Country": "Grenada",
    "country_code": "GD"
  },
  {
    "Country": "Guadeloupe",
    "country_code": "GP"
  },
  {
    "Country": "Guam",
    "country_code": "GU"
  },
  {
    "Country": "Guatemala",
    "country_code": "GT"
  },
  {
    "Country": "Guernsey",
    "country_code": "GG"
  },
  {
    "Country": "Guinea",
    "country_code": "GN"
  },
  {
    "Country": "Guinea-Bissau",
    "country_code": "GW"
  },
  {
    "Country": "Guyana",
    "country_code": "GY"
  },
  {
    "Country": "Haiti",
    "country_code": "HT"
  },
  {
    "Country": "Heard Island and McDonald Islands",
    "country_code": "HM"
  },
  {
    "Country": "Holy See (the)",
    "country_code": "VA"
  },
  {
    "Country": "Honduras",
    "country_code": "HN"
  },
  {
    "Country": "Hong Kong",
    "country_code": "HK"
  },
  {
    "Country": "Hungary",
    "country_code": "HU"
  },
  {
    "Country": "Iceland",
    "country_code": "IS"
  },
  {
    "Country": "India",
    "country_code": "IN"
  },
  {
    "Country": "Indonesia",
    "country_code": "ID"
  },
  {
    "Country": "Iran",
    "country_code": "IR"
  },
  {
    "Country": "Iraq",
    "country_code": "IQ"
  },
  {
    "Country": "Ireland",
    "country_code": "IE"
  },
  {
    "Country": "Isle of Man",
    "country_code": "IM"
  },
  {
    "Country": "Israel",
    "country_code": "IL"
  },
  {
    "Country": "Italy",
    "country_code": "IT"
  },
  {
    "Country": "Jamaica",
    "country_code": "JM"
  },
  {
    "Country": "Japan",
    "country_code": "JP"
  },
  {
    "Country": "Jersey",
    "country_code": "JE"
  },
  {
    "Country": "Jordan",
    "country_code": "JO"
  },
  {
    "Country": "Kazakhstan",
    "country_code": "KZ"
  },
  {
    "Country": "Kenya",
    "country_code": "KE"
  },
  {
    "Country": "Kiribati",
    "country_code": "KI"
  },
  {
    "Country": "Korea Democratic",
    "country_code": "KP"
  },
  {
    "Country": "Korea",
    "country_code": "KR"
  },
  {
    "Country": "Kuwait",
    "country_code": "KW"
  },
  {
    "Country": "Kyrgyzstan",
    "country_code": "KG"
  },
  {
    "Country": "Lao People's Democratic Republic",
    "country_code": "LA"
  },
  {
    "Country": "Latvia",
    "country_code": "LV"
  },
  {
    "Country": "Lebanon",
    "country_code": "LB"
  },
  {
    "Country": "Lesotho",
    "country_code": "LS"
  },
  {
    "Country": "Liberia",
    "country_code": "LR"
  },
  {
    "Country": "Libya",
    "country_code": "LY"
  },
  {
    "Country": "Liechtenstein",
    "country_code": "LI"
  },
  {
    "Country": "Lithuania",
    "country_code": "LT"
  },
  {
    "Country": "Luxembourg",
    "country_code": "LU"
  },
  {
    "Country": "Macao",
    "country_code": "MO"
  },
  {
    "Country": "Madagascar",
    "country_code": "MG"
  },
  {
    "Country": "Malawi",
    "country_code": "MW"
  },
  {
    "Country": "Malaysia",
    "country_code": "MY"
  },
  {
    "Country": "Maldives",
    "country_code": "MV"
  },
  {
    "Country": "Mali",
    "country_code": "ML"
  },
  {
    "Country": "Malta",
    "country_code": "MT"
  },
  {
    "Country": "Marshall Islands",
    "country_code": "MH"
  },
  {
    "Country": "Martinique",
    "country_code": "MQ"
  },
  {
    "Country": "Mauritania",
    "country_code": "MR"
  },
  {
    "Country": "Mauritius",
    "country_code": "MU"
  },
  {
    "Country": "Mayotte",
    "country_code": "YT"
  },
  {
    "Country": "Mexico",
    "country_code": "MX"
  },
  {
    "Country": "Micronesia",
    "country_code": "FM"
  },
  {
    "Country": "Moldova",
    "country_code": "MD"
  },
  {
    "Country": "Monaco",
    "country_code": "MC"
  },
  {
    "Country": "Mongolia",
    "country_code": "MN"
  },
  {
    "Country": "Montenegro",
    "country_code": "ME"
  },
  {
    "Country": "Montserrat",
    "country_code": "MS"
  },
  {
    "Country": "Morocco",
    "country_code": "MA"
  },
  {
    "Country": "Mozambique",
    "country_code": "MZ"
  },
  {
    "Country": "Myanmar",
    "country_code": "MM"
  },
  {
    "Country": "Namibia",
    "country_code": "NA"
  },
  {
    "Country": "Nauru",
    "country_code": "NR"
  },
  {
    "Country": "Nepal",
    "country_code": "NP"
  },
  {
    "Country": "Netherlands",
    "country_code": "NL"
  },
  {
    "Country": "New Caledonia",
    "country_code": "NC"
  },
  {
    "Country": "New Zealand",
    "country_code": "NZ"
  },
  {
    "Country": "Nicaragua",
    "country_code": "NI"
  },
  {
    "Country": "Niger",
    "country_code": "NE"
  },
  {
    "Country": "Nigeria",
    "country_code": "NG"
  },
  {
    "Country": "Niue",
    "country_code": "NU"
  },
  {
    "Country": "Norfolk Island",
    "country_code": "NF"
  },
  {
    "Country": "Northern Mariana Islands",
    "country_code": "MP"
  },
  {
    "Country": "Norway",
    "country_code": "NO"
  },
  {
    "Country": "Oman",
    "country_code": "OM"
  },
  {
    "Country": "Pakistan",
    "country_code": "PK"
  },
  {
    "Country": "Palau",
    "country_code": "PW"
  },
  {
    "Country": "Palestine",
    "country_code": "PS"
  },
  {
    "Country": "Panama",
    "country_code": "PA"
  },
  {
    "Country": "Papua New Guinea",
    "country_code": "PG"
  },
  {
    "Country": "Paraguay",
    "country_code": "PY"
  },
  {
    "Country": "Peru",
    "country_code": "PE"
  },
  {
    "Country": "Philippines",
    "country_code": "PH"
  },
  {
    "Country": "Pitcairn",
    "country_code": "PN"
  },
  {
    "Country": "Poland",
    "country_code": "PL"
  },
  {
    "Country": "Portugal",
    "country_code": "PT"
  },
  {
    "Country": "Puerto Rico",
    "country_code": "PR"
  },
  {
    "Country": "Qatar",
    "country_code": "QA"
  },
  {
    "Country": "Republic of North Macedonia",
    "country_code": "MK"
  },
  {
    "Country": "Romania",
    "country_code": "RO"
  },
  {
    "Country": "Russian Federation (the)",
    "country_code": "RU"
  },
  {
    "Country": "Rwanda",
    "country_code": "RW"
  },
  {
    "Country": "Réunion",
    "country_code": "RE"
  },
  {
    "Country": "Saint Barthélemy",
    "country_code": "BL"
  },
  {
    "Country": "Saint Helena",
    "country_code": "SH"
  },
  {
    "Country": "Saint Kitts and Nevis",
    "country_code": "KN"
  },
  {
    "Country": "Saint Lucia",
    "country_code": "LC"
  },
  {
    "Country": "Saint Martin (French part)",
    "country_code": "MF"
  },
  {
    "Country": "Saint Pierre and Miquelon",
    "country_code": "PM"
  },
  {
    "Country": "Saint Vincent and the Grenadines",
    "country_code": "VC"
  },
  {
    "Country": "Samoa",
    "country_code": "WS"
  },
  {
    "Country": "San Marino",
    "country_code": "SM"
  },
  {
    "Country": "Sao Tome and Principe",
    "country_code": "ST"
  },
  {
    "Country": "Saudi Arabia",
    "country_code": "SA"
  },
  {
    "Country": "Senegal",
    "country_code": "SN"
  },
  {
    "Country": "Serbia",
    "country_code": "RS"
  },
  {
    "Country": "Seychelles",
    "country_code": "SC"
  },
  {
    "Country": "Sierra Leone",
    "country_code": "SL"
  },
  {
    "Country": "Singapore",
    "country_code": "SG"
  },
  {
    "Country": "Sint Maarten",
    "country_code": "SX"
  },
  {
    "Country": "Slovakia",
    "country_code": "SK"
  },
  {
    "Country": "Slovenia",
    "country_code": "SI"
  },
  {
    "Country": "Solomon Islands",
    "country_code": "SB"
  },
  {
    "Country": "Somalia",
    "country_code": "SO"
  },
  {
    "Country": "South Africa",
    "country_code": "ZA"
  },
  {
    "Country": "South Georgia and the South Sandwich Islands",
    "country_code": "GS"
  },
  {
    "Country": "South Sudan",
    "country_code": "SS"
  },
  {
    "Country": "Spain",
    "country_code": "ES"
  },
  {
    "Country": "Sri Lanka",
    "country_code": "LK"
  },
  {
    "Country": "Sudan",
    "country_code": "SD"
  },
  {
    "Country": "Suriname",
    "country_code": "SR"
  },
  {
    "Country": "Svalbard and Jan Mayen",
    "country_code": "SJ"
  },
  {
    "Country": "Sweden",
    "country_code": "SE"
  },
  {
    "Country": "Switzerland",
    "country_code": "CH"
  },
  {
    "Country": "Syrian Arab Republic",
    "country_code": "SY"
  },
  {
    "Country": "Taiwan",
    "country_code": "TW"
  },
  {
    "Country": "Tajikistan",
    "country_code": "TJ"
  },
  {
    "Country": "Tanzania",
    "country_code": "TZ"
  },
  {
    "Country": "Thailand",
    "country_code": "TH"
  },
  {
    "Country": "Timor-Leste",
    "country_code": "TL"
  },
  {
    "Country": "Togo",
    "country_code": "TG"
  },
  {
    "Country": "Tokelau",
    "country_code": "TK"
  },
  {
    "Country": "Tonga",
    "country_code": "TO"
  },
  {
    "Country": "Trinidad and Tobago",
    "country_code": "TT"
  },
  {
    "Country": "Tunisia",
    "country_code": "TN"
  },
  {
    "Country": "Turkey",
    "country_code": "TR"
  },
  {
    "Country": "Turkmenistan",
    "country_code": "TM"
  },
  {
    "Country": "Turks and Caicos Islands",
    "country_code": "TC"
  },
  {
    "Country": "Tuvalu",
    "country_code": "TV"
  },
  {
    "Country": "Uganda",
    "country_code": "UG"
  },
  {
    "Country": "Ukraine",
    "country_code": "UA"
  },
  {
    "Country": "United Arab Emirates",
    "country_code": "AE"
  },
  {
    "Country": "United Kingdom of Great Britain",
    "country_code": "GB"
  },
  {
    "Country": "United States Minor Outlying Islands",
    "country_code": "UM"
  },
  {
    "Country": "United States of America",
    "country_code": "US"
  },
  {
    "Country": "Uruguay",
    "country_code": "UY"
  },
  {
    "Country": "Uzbekistan",
    "country_code": "UZ"
  },
  {
    "Country": "Vanuatu",
    "country_code": "VU"
  },
  {
    "Country": "Venezuela",
    "country_code": "VE"
  },
  {
    "Country": "Viet Nam",
    "country_code": "VN"
  },
  {
    "Country": "Virgin Islands British",
    "country_code": "VG"
  },
  {
    "Country": "Virgin Islands U.S.",
    "country_code": "VI"
  },
  {
    "Country": "Wallis and Futuna",
    "country_code": "WF"
  },
  {
    "Country": "Western Sahara",
    "country_code": "EH"
  },
  {
    "Country": "Yemen",
    "country_code": "YE"
  },
  {
    "Country": "Zambia",
    "country_code": "ZM"
  },
  {
    "Country": "Zimbabwe",
    "country_code": "ZW"
  },
  {
    "Country": "Åland Islands",
    "country_code": "AX"
  }
]
}
function fetch_all_data() {
covid.fetch_corona_data("confirmed", {})
covid.fetch_corona_data("deaths", {})
covid.fetch_corona_data("recovered", {})
covid.call_once_satisfied({
    "condition": "covid.hold_value.corona_dates.length > 0",
    "function": function() {
        covid.delay_multiple({
            "delay": 40,
            "iterations": covid.hold_value.corona_dates.length,
            "function": function() {
                covid.hold_value.delay_cnt++
                covid.fetch_corona_reports(covid.hold_value.corona_dates[covid.hold_value.delay_cnt].trim())
            }
        })
    }
})
}
fetch_all_data()
covid.call_once_satisfied({
    "condition": "Object.keys(covid.fetch_results_reports).length > 0 && Object.keys(covid.fetch_results_reports).length === covid.hold_value.corona_dates.length",
    "function": function() {
        covid.hold_value.loaded_state = true
        console.log("All data loaded. Everything ready!")
    }
})
covid.hold_value.loaded_state = false