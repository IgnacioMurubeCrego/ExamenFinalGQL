import { Contact } from "../types.ts";

export const contactBuilder = async (surnameAndNames : string, phoneNum : string) : Promise<Contact> => {

    const newContact = {
      surnameAndNames : surnameAndNames,
      phoneNum : phoneNum,
      country : "",
      time : ""
    }

    const apiKey = '/GVsqJbBkQgjat2hbbNq/A==4t8R6CfLGubMkAjQ';
    let url : URL = new URL(`https://api.api-ninjas.com/v1/validatephone?number=${phoneNum}`);

    const headers = new Headers({
      'X-Api-Key': apiKey
    });

    type numberValidationRes = {
      "is_valid": boolean,
      "is_formatted_properly": boolean,
      "country": string,
      "location": string,
      "timezones": [
        string
      ],
      "format_national": string,
      "format_international": string,
      "format_e164": string,
      "country_code": number
    }

    const numberData : Promise<numberValidationRes> = await fetch(url, { headers }).then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            throw new Error(`Error: ${response.status} ${text}`);
          });
        }
        return response.json();
      })
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error('Phone validation Request failed:', error.message);
      });

      newContact.country = (await (numberData)).country;

      type CityData =   {
        "name": string,
        "latitude": number,
        "longitude": number,
        "country": string,
        "population": number,
        "is_capital": boolean
      }
    
    
    url = new URL(`https://api.api-ninjas.com/v1/city?country=${newContact.country}`);

    const cityData : Promise<CityData> = await fetch(url, { headers }).then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            throw new Error(`Error: ${response.status} ${text}`);
          });
        }
        return response.json();
      })
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error('Country Request failed:', error.message);
      });

      newContact.country = (await cityData).country;

      const latitude = (await cityData).latitude;
      const longitude = (await cityData).longitude;

      type WorldTime = {
        "timezone": string,
        "datetime": string,
        "date": string,
        "year": string,
        "month": string,
        "day": string,
        "hour": string,
        "minute": string,
        "second": string,
        "day_of_week": string
      }

      url = new URL(`https://api.api-ninjas.com/v1/worldtime?`);
      url.searchParams.append('lat', String(latitude));
      url.searchParams.append('lon', String(longitude));
      
      const worldTime : Promise<WorldTime> = await fetch(url, { headers }).then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            throw new Error(`Error: ${response.status} ${text}`);
          });
        }
        return response.json();
      })
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error('Country Request failed:', error.message);
      });

      newContact.time = (await worldTime).datetime;

    return newContact;
} 