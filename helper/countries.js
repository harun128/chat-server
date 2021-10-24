const { count } = require("../models/User")

const countries = [
    {
        id : 1,
        key:"turkey",
        name : "Türkiye",
        img:"turkey.png"
    },
    {
        id: 2,
        key:"england",
        name : "United Kingdom",
        img : "england.png"
    },
    {
        id :3 ,
        key:"germany",
        name : "Germany",
        img : "germany.png"
    },
    {
        id: 4,
        key:"france",
        name : "France",
        img : "france.png"
    },
    {
        id : 5,
        key:"italy",
        name: "Italy",
        img : "italy.png"
    }
]

exports.countries = countries;
exports.countryId =(country) => {
    for (let index = 0; index < countries.length; index++) {
        const element = array[index];
        if(element.key == country){
            return element.id;
        }
        
    }
}