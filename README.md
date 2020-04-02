# covid19.js

The **covid19.js** library can be used to create *web applications* based off covid19 data. The original data source is the [CSSEGISandData/COVID-19 repository](https://github.com/CSSEGISandData/COVID-19) by **Johns Hopkins CSSE**, and leverages the [coviddata/coviddata](https://github.com/coviddata/covid-api) repository for more reliable data formatting.

## Include in Your Project
```markup
<script src="covid19.min.js"></script>
```

### CDN
```markup
<script src='https://collaboratescience.com/covid19/covid19.min.js'></script>
```

### EXAMPLE APPLICATION
[Corona Application](https://collaboratescience.com/corona/)

![enter image description here](https://collaboratescience.com/corona/corona_app.gif)

## READY STATE
#### There is a ~1 second delay before all required files are loaded to run covid19.js. To ensure your application does not call a method that is unavailable you can check the library's ready state like this:

    covid.is_ready = true

#### example (using Azle.js)

    az.call_once_satisfied({
        "condition" : "covid.is_ready",
        "function" : function() {
            az.load_scripts([scripts/prepare.js", "scripts/responsive.js", "scripts/visuals.js"]) // load your application's scripts here
        }
    })

## CORE OBJECTS
#### You can access the raw data from the following objects:

#### object

    covid.countries

#### output

    country:
        key: "united-states"
        name: "United States"
    dates:
        2020-01-22:
            new:
                cases: 1
                deaths: 0
                recoveries: 0
            cumulative:
                cases: 1
                deaths: 0
                recoveries: 0

#### object

    covid.regions

#### output

    region:
        key: "hubei-china"
        name: "Hubei"
        full_name: "Hubei, China"
        country:
            location_type: "country"
            key: "china"
            name: "China"
    dates:
        2020-01-22:
            new:
                cases: 444
                deaths: 17
                recoveries: 28
            cumulative:
                cases: 444
                deaths: 17
                recoveries: 28

#### object

    covid.places

#### output

    place:
        key: "new-york-city-new-york-united-states"
        name: "New York City"
        full_name: "New York City, New York, United States"
        country:
            location_type: "country"
            key: "united-states"
            name: "United States"
        region:
            location_type: "region"
            key: "new-york-united-states"
            name: "New York"
            full_name: "New York, United States"
            country:
                location_type: "country"
                key: "united-states"
                name: "United States"
    dates:
        2020-03-01:
            new:
                cases: 1
                deaths: 0
                recoveries: 0
            cumulative:
                cases: 1
                deaths: 0
                recoveries: 0

## METHODS & EXAMPLES

## Reported Data

### get_global_report

#### returns
 - @returns {object} (summary object with global total *cases*, *deaths*, *recoveries*)

#### example
    covid.get_global_report()

#### output

    {cases: 531574, deaths: 24016, recoveries: 123334}

### get_location_report
#### parameters
 - @param {string} **location** (choose *location*)

#### returns
 - @returns {object} (summary object with country total *cases*, *deaths*, *recoveries*)

#### example
    covid.get_location_report("Wyoming")

#### output

    {cases: 53, deaths: 0, recoveries: 0}

### get_time_series
#### parameters
 - @param {string} **category** (choose between *cumulative* and *new*)
 - @param {string} **type** (choose between *cases*, *deaths*, and *recoveries*)
 - @param {string} **location** (choose *country*, *region*, or *fips*)

#### returns
 - @returns {object} (time series object for chosen location)

#### example
    covid.get_time_series("cumulative", "cases", "California")

#### output

    [
        ...
        {date: "2020-03-21", value: 1364},
        {date: "2020-03-22", value: 1646},
        {date: "2020-03-23", value: 2108},
        {date: "2020-03-24", value: 2538},
        {date: "2020-03-25", value: 2998},
        {date: "2020-03-26", value: 3899}
    ]

### get_time_series_multiple
#### parameters
 - @param {string} **category** (choose between *cumulative* and *new*)
 - @param {string} **type** (choose between *cases*, *deaths*, and *recoveries*)
 - @param {string} **location_arr** (an array of *countries*, *regions*, or *fips*)

#### returns
 - @returns {object} (time series object of all time series for chosen locations)

#### example
    covid.get_time_series_multiple("cumulative", "cases", ["Germany", "Italy", "France", "United Kingdom"])

#### output

    {
        Germany: (62) [{…}, {…}, {…}, {…}, ...
        Italy: (59) [{…}, {…}, {…}, {…}, ...
        France: (66) [{…}, {…}, {…}, {…}, ...
        United Kingdom: (59) [{…}, {…}, {…}, {…}, ....
    }

### get_time_series_multiple_sum
#### parameters
 - @param {string} **category** (choose between *cumulative* and *new*)
 - @param {string} **type** (choose between *cases*, *deaths*, and *recoveries*)
 - @param {string} **location_arr** (an array of *countries*, *regions*, or *fips*)

#### returns
 - @returns {object} (time series object with summed time series for locations chosen)

#### example
    covid.get_time_series_multiple_sum("cumulative", "cases", ["Germany", "Italy", "France", "United Kingdom"])

#### output

    {
        2020-01-28: 8,
        2020-01-29: 9,
        2020-01-30: 9,
        2020-01-31: 14,
        2020-02-01: 18,
        ...
    }

## Utility Methods

### get_all_countries

#### returns
 - @returns {array} (all countries listed in data)

#### example
    covid.get_all_countries()

#### output
     [
         "Thailand",
         "Japan",
         "Singapore",
         "Nepal",
         "Malaysia",
         "Canada",
         "Australia",
         "Cambodia"
         ...
    ]

### get_all_regions

#### returns
 - @returns {array} (all regions listed in data)

#### example
    covid.get_all_regions()

#### output
    [
        "Washington",
        "New York",
        "California",
        "Massachusetts",
        "Diamond Princess",
        "Grand Princess",
        "Georgia"
        ...
    ]

### get_all_places

#### returns
 - @returns {array} (all places listed in data)

#### example
    covid.get_all_places()

#### output
    [
        "New York City",
        "Westchester",
        "Nassau",
        "Suffolk","
        ...
    ]

### get_all_fips

#### returns
 - @returns {array} (all fips listed in data)

#### example
    covid.get_all_fips()

#### output
    [
        "45001",
        "22001",
        "51001",
        "16001",
        "19001",
        ...
    ]

### get_fips_from_place

#### parameters
 - @param {string} **place** (choose *place*)

#### returns
 - @returns {array with object} (fips associated with place)

#### example
    covid.get_fips_from_place("New York City")

#### output

    [{
       FIPS: "36061",
       Province_State: "New York"
    }]

### get_place_from_fips

#### parameters
 - @param {string} **fips** (choose *fips*)

#### returns
 - @returns {array with object} (place details associated with fips)

#### example
    covid.get_place_from_fips("48027")

#### output

    [{
        FIPS: "48027",
        place: "Bell",
        Province_State: "Texas",
        Country_Region: "US"
    }]

### check_if_country_has_region
#### parameters
 -  @param {string} **country** (choose *country*)

#### returns
 - @returns {boolean} (true/false whether chosen country has states)

#### example
    covid.check_if_country_has_region("Italy")

#### output
    false

### get_available_dates

#### returns
 - @returns {array} (all available dates in data)

#### example
    covid.get_available_dates()

#### output

    [
        ...
        "03-12-2020",
        "03-13-2020",
        "03-14-2020",
        "03-15-2020",
        "03-16-2020",
        "03-17-2020",
        "03-18-2020",
        "03-19-2020"
    ]

### get_countries_and_regions
#### returns
 - @returns {array} (array of objects with all country and region pairs)

#### example
    covid.get_countries_and_regions()

#### output

      [
          {country: "China", region: "Hubei"},
          {country: "United States", region: "New York"},
          {country: "France", region: "France"},
          {country: "United States", region: "New Jersey"},
          {country: "United Kingdom", region: "United Kingdom"},
          {country: "United States", region: "California"}
          ...
      ]

### get_country_from_region
#### parameters
 - @param {string} **region** (choose *region*)

#### returns
 - @returns {string} (name of country associated with region)

#### example
    covid.get_country_from_region("Faroe Islands")

#### output

    "Denmark"

### get_regions_from_country
#### parameters
 - @param {string} **country** (choose *country*)

#### returns
 - @returns {array} (all regions associated with country)

#### example
    covid.get_regions_from_country("Canada")

#### output

    [
        "Alberta",
        "British Columbia",
        "Diamond Princess",
        "Manitoba",
        "New Brunswick",
        "Newfoundland and Labrador",
        "Nova Scotia"
        ...
    ]

### find_code_by_country
#### parameters
 - @param {string} **country** (choose *country*)

#### returns
 - @returns {string} (country code associated with country)

#### example
    covid.find_code_by_country("Dominican")

#### output

    "DO"

### find_code_by_region
#### parameters
 - @param {string} **region** (choose *region*)

#### returns
 - @returns {string} (country code associated with region)

#### example
    covid.find_code_by_region("Gibraltar")

#### output

    "GB"

### check_if_location_in_data
#### parameters
 - @param {string} **location** (choose *location*)

#### returns
 - @returns {boolean} (true/false depending on whether location is in data)

#### example
    covid.check_if_location_in_data("Los Angeles")

#### output

### check_if_country
#### parameters
 - @param {string} **country_or_region** (choose *country_or_region*)

#### returns
 - @returns {boolean} (true/false depending on whether location is a country)

#### example
    covid.check_if_country("Italy")

#### output

    true

### check_if_region
#### parameters
 - @param {string} **country_or_region** (choose *country_or_region*)

#### returns
 - @returns {boolean} (true/false depending on whether location is a region)

#### example
    covid.check_if_region("Canada")

#### output

    false

### get_country_flag
#### parameters
 - @param {string} **location** (choose *location*)

#### returns
 - @returns {string} (image URL of country or region flag)

#### example
    covid.get_country_flag("Bulgaria")

#### output

    "https://collaboratescience.com/corona/flags/bg.png"

## Modeling

### run_sir_model
#### parameters
 - @param {float} **beta** (choose *rate of infection*)
 - @param {float} **gamma** (choose *rate of recovery*)

#### returns
 - @returns {array} (plottable x and y values for all 3 compartments (susceptible, infectious and recovered/removed))

#### example
    covid.run_sir_model(0.1, 0.05)

#### output
    [
        {name: "S", x: Array(2001), y: Array(2001)},
        {name: "I", x: Array(2001), y: Array(2001)},
        {name: "R", x: Array(2001), y: Array(2001)}
    ]

### run_regression_on_time_series
#### parameters
 - @param {object} **time_series** (pass *time_series* calculated using get_time_series method)

#### returns
@returns {object} (regression object containing *predicted_results*, *r_squared*, *equation* and *predict* function)
- - *predicted_results*: plottable x (index) and y (predicted) values presented in same format as results from get_time_series method)
- - *r_squared*: coefficient of determination (proportion of variance explained by independent variables)
- - *equation*: string representation of linear equation with slope and intercept
- - *predict* function: a function that can be used to predict a new value

#### example
    var my_series = covid.get_time_series("cumulative", "cases", "Canada")
    var reg_results = covid.run_regression_on_time_series(my_series)

#### output
    {
        predicted_results : [
                                ...
                                {index: 61, value: 2879.86},
                                {index: 62, value: 2949.76},
                                {index: 63, value: 3019.66},
                                {index: 64, value: 3089.56},
                                {index: 65, value: 3159.46},
                                {index: 66, value: 3229.36}
                            ],
        r_squared : 0.41,
        equation : "y = 69.9x + -1384.04",
        predict : x => {…}
    }

## Support
Reach out to [Sean McClure](https://twitter.com/sean_a_mcclure) if you need assistance or would like to see additional useful functions added to this library.

## Data Issues
If you encounter issues with the consistency of results returned by this library please raise an issue on this repo.