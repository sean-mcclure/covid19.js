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
    "fetch_results_reports": fetch_results_reports = {}
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