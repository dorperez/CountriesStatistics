$(document).ready(async () => {
    ;
    //Tables Types
    const statsTableType = "statsTable"
    const regionTableType = "regionTable"
    const currencyTable = "currencyTable"

    // Api Calls
    const getAllCountries = async () => $.ajax(`https://restcountries.com/v3.1/all`)
    const getSearchedCountries = async (countryName) => $.ajax(`https://restcountries.com/v3.1/name/${countryName}`)


    // Statics
    const getCitizensNumber = (countriesArr) => {
        if (!Array.isArray(countriesArr)) {
            countriesArr = [countriesArr]
        }
        let totalCitezens = 0
        countriesArr.map((singleCountry) => {
            totalCitezens += singleCountry.population
        })
        return totalCitezens
    }

    const getCitizensAverage = (countriesArr) => {
        if (!Array.isArray(countriesArr)) {
            countriesArr = [countriesArr]
        }
        const totalCitizens = getCitizensNumber(countriesArr)
        return Math.round(totalCitizens / countriesArr.length)
    }

    const getCountriesRegionsArr = (countriesArr) => {
        const regionsCounter = {}
        countriesArr.map((singleCountry) => {
            if (!regionsCounter[singleCountry.region]) regionsCounter[singleCountry.region] = 0
            regionsCounter[singleCountry.region]++
        })
        return regionsCounter
    }

    const getCountriesStatsArr = (countriesArr) => {
        return countriesArr.map((country) => {
            const currencies = country.currencies ? Object.values(country.currencies)[0] : null
            return {
                countryName: country.name.common,
                countryImage: country.flags.png,
                countryPopulation: getCitizensNumber(country),
                currencyName: currencies ? currencies.name : 'Not Found',
                currencySymbol: currencies ? currencies.symbol : 'Not Found',
            }
        })
    }

    const getCountriesWithTheSameCurrency = (countriesArr) => {
        const countriesWithTheSameCurrency = []
        countriesArr.map((singleCountry) => {
            const currencyShortName = singleCountry.currencies ? Object.keys(singleCountry.currencies) : 'Not Found'
            if (!countriesWithTheSameCurrency[currencyShortName]) countriesWithTheSameCurrency[currencyShortName] = 0
            countriesWithTheSameCurrency[currencyShortName]++
        })
        return countriesWithTheSameCurrency
    }

    //UI Prints
    const printStatsCard = (countriesArr) => {
        console.log("Number of Countries:", countriesArr.length)
        console.log("Number of Total Citezens:", getCitizensNumber(countriesArr))
        console.log("Average Citizens From All Countries:", getCitizensAverage(countriesArr))

        const html = `
        <div class="statsCard">
        <h4>Number of Countries...... <span>${countriesArr.length}</span></h4>
        <h4>Number of Total Citezens...... <span>${getCitizensNumber(countriesArr)}</span></h4>
        <h4>Average Citizens From All Countries...... <span>${getCitizensAverage(countriesArr)}</span></h4>
        </div>`
        $(".statsCardContainer").append(html)
    }

    const printCountriesStats = (countriesArr) => {
        $(`.tablesContainer`).html(``)
        $(`.statsCardContainer`).html(``)

        const regionsArr = getCountriesRegionsArr(countriesArr)
        const statsArr = getCountriesStatsArr(countriesArr)
        const countriesWithSameCurrency = getCountriesWithTheSameCurrency(countriesArr)
        printStatsCard(countriesArr)
        printTableToDom(statsArr, statsTableType)
        printTableToDom(regionsArr, regionTableType)
        printTableToDom(countriesWithSameCurrency, currencyTable)
        console.log(countriesWithSameCurrency)
    }


    // אני יודע שלא הייתי אמור לעשות ככה אבל כבר הושקעתי אז אדע לפעם הבאה
    const printTableToDom = (countriesObjectsArr, typeOfTable) => {

        let tablekeyTitle = ""
        let tableValueTitle = ""
        const countryCurrencyTitle = "Country Currency"

        switch (typeOfTable) {
            case statsTableType:
                tablekeyTitle = "Country Name"
                tableValueTitle = "Number Of Citizens"
                break;

            case regionTableType:
                tablekeyTitle = "Region"
                tableValueTitle = "Number Of Countries"
                break;

            case currencyTable:
                tablekeyTitle = "Currency"
                tableValueTitle = "Number Of Countries"
                break;
        }

        const html = `
        <div class=tableWrapper>
          <table class="countriesStatsTable">
            <thead>
              <tr>
                <th>${tablekeyTitle}</th>
                <th>${tableValueTitle}</th>
                ${typeOfTable === statsTableType ? `<th>${countryCurrencyTitle}</th>` : ''}
              </tr>
            </thead>
            <tbody class="tableData-${typeOfTable}">

            </tbody>
          </table>
        </div>
      `

        $(`.tablesContainer`).append(html)

        if (typeOfTable === regionTableType) {
            for (continent in countriesObjectsArr) {
                const html = `
                <tr>
                <td>${continent}</td>
                <td>${countriesObjectsArr[continent]}</td>
                </tr>
                `
                $(`.tableData-${typeOfTable}`).append(html)
            }
        } else if (typeOfTable === statsTableType) {
            countriesObjectsArr.map((country) => {

                const countryName = country.countryName
                const countryImage = country.countryImage
                const countryPopulation = country.countryPopulation
                const currencyName = country.currencyName
                const currencySymbol = country.currencySymbol

                console.log(country);

                key = Object.values(country)[0]
                value = Object.values(country)[1]
                const html = `
                <tr>
                <td class="trWithFlag">${countryName}<img width="25px" src="${countryImage}"></img></td>
                <td>${countryPopulation}</td>
                <td>${currencyName} ${currencySymbol}</td>
                </tr>
                `
                $(`.tableData-${typeOfTable}`).append(html)
            })
        } else if (typeOfTable === currencyTable) {
            for (currency in countriesObjectsArr) {
                const html = `
                <tr>
                <td>${currency}</td>
                <td>${countriesObjectsArr[currency]}</td>
                </tr>
                `
                $(`.tableData-${typeOfTable}`).append(html)
            }
        }
    }

    // Events
    $("#allCountriesButton").click(async (event) => {
        event.preventDefault()
        printCountriesStats(await getAllCountries())
    })

    $("#searchButton").click(async (event) => {
        event.preventDefault()
        const countryName = $("#countryInput").val()
        if (!countryName) return alert("Please fill the name of the country")
        printCountriesStats(await getSearchedCountries($("#countryInput").val()))
    })

})