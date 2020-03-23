# covid19.js

The **covid19.js** library can be used to fetch daily updated data from the COVID Data [Repository](https://github.com/CSSEGISandData/COVID-19) by **Johns Hopkins CSSE**. The library provides a set of useful functions for fetching both daily report and time series data since recording started.

## Include in Your Project
```markup
<script src="covid19.min.js"></script>
```

### CDN
```markup
<script src='https://collaboratescience.com/covid19/covid19.min.js'></script>
```

## Ready State

covid19.js takes a few seconds on load to fetch all necessary data. When the browser console shows:

    All data loaded. Everything ready!

...all data has been loaded and covid19 functions are ready to use. Your application can check the ready status by confirming the global state variable is true:

    covid.hold_value.loaded_state

#### output

    true

## METHODS & EXAMPLES

## Reported Data

### get_global_report

#### returns
 - @returns {object} (summary object with global total *deaths*, *confirmed*, *recovered*)

#### example
    covid.get_global_report()

#### output

    {deaths: 14634, confirmed: 350591, recovered: 448473}

### get_country_report
#### parameters
 - @param {string} **country** (choose *country*)

#### returns
 - @returns {object} (summary object with country total *deaths*, *confirmed*, *recovered*)

#### example
    covid.get_country_report("Italy")

#### output

    {deaths: 4825, confirmed: 53578, recovered: 6072}

### get_state_report
#### parameters
 - @param {string} **state** (choose *state*)

#### returns
 - @returns {object} (summary object with state total *deaths*, *confirmed*, *recovered*)

#### example
    covid.get_state_report("California")

#### output

    {deaths: 24, confirmed: 1364, recovered: 0}

### get_report_by_country_and_state
#### parameters
 - @param {string} **date** (choose report *date*)
 - @param {string} **country** (choose *country*)
 - @param {string} **state** (choose *state*)

#### returns
 - @returns {object} (summary object with state total *deaths*, *confirmed*, *recovered*)

#### example
    covid.get_report_by_country_and_state("03-06-2020", "Canada", "British Columbia")

#### output

    {deaths: "0", confirmed: "21", recovered: "3"}

### sort_totals_by_country
#### parameters
 - @param {string} **choice** (choose between *deaths*, *confirmed*, *recovered*)

#### returns
 - @returns {object} (sorted object by country with choice values)

#### example
    covid.sort_totals_by_country("recovered")

#### output

    {
        China:  67017,
        Iran:  4590,
        Italy:  2335,
        Spain:  517,
        Korea South:  510,
        Cruise Ship:  325,
        Japan:  118,
        Singapore:  105,
        Bahrain:  60,
        Germany:  46,
    ...

### sort_totals_by_state
#### parameters
 - @param {string} **choice** (choose between *deaths*, *confirmed*, *recovered*)

#### returns
 - @returns {object} (sorted object by states with choice values)

#### example
    covid.sort_totals_by_state("deaths")

#### output

    {
        Hubei:  3085,
        Italy:  1809,
        Iran:  724,
        Spain:  289,
        France:  91,
        Korea South:  75,
        Washington:  40,
        Henan:  22,
    ...

### find_time_series_with_state
#### parameters
 - @param {string} **choice** (choose between *deaths*, *confirmed*, *recovered*)
 - @param {string} **state** (choose *state*)
 - @param {string} **country** (choose *country*)

#### returns
 - @returns {object} (time series object for chosen state)

#### example
    covid.find_time_series_with_state("recovered", "California", "US")

#### output

    [
        ...
        {index:  47,  value:  0,  true_date:  "3/8/20"}
        {index:  48,  value:  0,  true_date:  "3/9/20"}
        {index:  49,  value:  2,  true_date:  "3/10/20"}
        {index:  50,  value:  2,  true_date:  "3/11/20"}
        {index:  51,  value:  6,  true_date:  "3/12/20"}
        {index:  52,  value:  6,  true_date:  "3/13/20"}
        {index:  53,  value:  6,  true_date:  "3/14/20"}
        {index:  54,  value:  6,  true_date:  "3/15/20"}
    ]

### find_time_series_with_country
#### parameters
 - @param {string} **choice** (choose between *deaths*, *confirmed*, *recovered*)
 - @param {string} **country** (choose *country*)

#### returns
 - @returns {object} (time series object for chosen country)

#### example
    covid.find_time_series_with_country("recovered", "US")

#### output

    [
        ...
        {index:  47,  value:  0,  true_date:  "3/8/20"}
        {index:  48,  value:  0,  true_date:  "3/9/20"}
        {index:  49,  value:  2,  true_date:  "3/10/20"}
        {index:  50,  value:  2,  true_date:  "3/11/20"}
        {index:  51,  value:  6,  true_date:  "3/12/20"}
        {index:  52,  value:  6,  true_date:  "3/13/20"}
        {index:  53,  value:  6,  true_date:  "3/14/20"}
        {index:  54,  value:  6,  true_date:  "3/15/20"}
    ]

## Utility Methods

### get_all_countries
#### parameters
 - @param {string} **choice** (choose between *deaths*, *confirmed*, *recovered*)

#### returns
 - @returns {array} (all countries listed in COVID Data)

#### example
    covid.get_all_countries("deaths")

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

### get_all_country_states
#### parameters
 - @param {string} **choice** (choose between *deaths*, *confirmed*, *recovered*)
 -  @param {string} **country** (choose *country*)

#### returns
 - @returns {array} (all states associated with chosen country)

#### example
    covid.get_all_country_states("deaths", "US")

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

### check_if_country_has_state
#### parameters
 -  @param {string} **country** (choose *country*)

#### returns
 - @returns {boolean} (true/false whether chosen country has associated states)

#### example
    covid.check_if_country_has_state("Italy")

#### output
    false

### get_available_dates

#### returns
 - @returns {array} (all available dates in JHU CSSE data)

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

### get_states_and_countries
#### returns
 - @returns {array} (array of objects with all state and country pairs)

#### example
    covid.get_states_and_countries()

#### output

      [
           {country:  "China",  state:  "Hubei"}
           {country:  "Italy",  state:  ""}
           {country:  "Iran",  state:  ""}
           {country:  ""Korea South"",  state:  ""}
           {country:  "Spain",  state:  ""}
           {country:  "Germany",  state:  ""}
           {country:  "France",  state:  "France"}
           ...

### get_country_from_state
#### parameters
 - @param {string} **state** (choose *state*)

#### returns
 - @returns {string} (name of country associated with state)

#### example
    covid.get_country_from_state("Faroe Islands")

#### output

    "Denmark"

### find_code_by_country
#### parameters
 - @param {string} **country** (choose *country*)

#### returns
 - @returns {string} (name of country associated with code)

#### example
    covid.find_code_by_country("Dominican")

#### output

    "DO"

### find_country_by_code
#### parameters
 - @param {string} **code** (choose *code*)

#### returns
 - @returns {string} (country code associated with country)

#### example
    covid.find_country_by_code("DO")

#### output

    "Dominican Republic"

### get_longs_and_lats
#### parameters
 - @param {string} **choice** (choose between *deaths*, *confirmed*, *recovered*)

#### returns
 - @returns {array} (array of objects with longitudes and latitudes for every country/state)

#### example
    covid.get_longs_and_lats("confirmed")

#### output

    [
        {state:  "Hubei",  country:  "China",  longitude:  "112.2707 ",  latitude:  "30.9756"}
        {state:  "",  country:  "Italy",  longitude:  "12.5674 ",  latitude:  "41.8719"}
        {state:  "",  country:  "Iran",  longitude:  "53.688 ",  latitude:  "32.4279"}
        {state:  "",  country:  ""Korea South"",  longitude:  "127.7669 ",  latitude:  "35.9078"}
    ...

## Support
Reach out to [Sean McClure](https://twitter.com/sean_a_mcclure) if you need assistance or would like to see additional useful functions added to this library.