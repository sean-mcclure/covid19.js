# covid19.js

The **covid19.js** library can be used to create JS applications related to Corona Virus. Data comes from the [repository](https://github.com/CSSEGISandData/COVID-19) by **Johns Hopkins CSSE**. This library ingests the data from coviddata/covid-api[https://github.com/coviddata/covid-api] repository.

## Include in Your Project
```markup
<script src="covid19.min.js"></script>
```

### CDN
```markup
<script src='https://collaboratescience.com/covid19/covid19.min.js'></script>
```

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
 - @param {string} **country_or_region** (choose *country_or_region*)

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

## Support
Reach out to [Sean McClure](https://twitter.com/sean_a_mcclure) if you need assistance or would like to see additional useful functions added to this library.

## Data Issues
Unfortunately the [data source](https://github.com/CSSEGISandData/COVID-19) by **Johns Hopkins CSSE** undergoes constant [revisions](https://github.com/CSSEGISandData/COVID-19/issues) to its formatting (column names, state formats, etc.). This library does its best to stay on top of these changes. Since changing over to the coviddata/covid-api[https://github.com/coviddata/covid-api] repository we expect things to be much more stable. If you encounter an issue with the consistency of results returned by the methods in this library please raise an issue on this repo.