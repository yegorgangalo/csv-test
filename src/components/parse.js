import {useRef, /* useEffect, */ useState} from 'react';
import { CSVReader } from 'react-papaparse';
import { dsvFormat } from 'd3-dsv';
import Table from './Table';

const { IDLE, PENDING, ERROR, SUCCESS } = {
    IDLE: 'idle',
    PENDING: 'pending',
    ERROR: 'error',
    SUCCESS: 'success'

}

export default function ReaderCSV() {
    const [dataCSV, setDataCSV] = useState();
    const [headersCSV, setHeadersCSV] = useState();
    const [status, setStatus] = useState(IDLE);
    const buttonRef = useRef();

    const phoneNormalize = (phoneNumber) => {
        if (phoneNumber.length === 10) {
            return "+1"+phoneNumber;
        }
        if (phoneNumber.length === 11 && phoneNumber.slice(0, 1) === "1") {
            return "+"+phoneNumber;
        }
        return phoneNumber;
    }

    const licenseNormalize = (license) => {
        if (license.includes(',')) {
            const licenseArr = license.split(',');
            const shortCutLicenseArr = licenseArr.map(license => license.trim().slice(0, 2).toUpperCase())
            return shortCutLicenseArr.join(", ");
        }
        if (license.includes('|')) {
            const licenseArr = license.split('|');
            const shortCutLicenseArr = licenseArr.map(license => license.trim().slice(0, 2).toUpperCase())
            return shortCutLicenseArr.join(", ");
        }
        if (license.includes(' ')) {
            const licenseArr = license.split(' ');
            const shortCutLicenseArr = licenseArr.map(license => license.trim().slice(0, 2).toUpperCase())
            return shortCutLicenseArr.join(", ");
        }
        return license;
    }

    // const dateNormalize = (date) => {
    //     if (date.includes('-')) {
    //         const dateArr = date.split('-');
    //         if (dateArr[0].length === 4) {
    //             const year = dateArr[0];
    //             const month = dateArr[1];
    //             const day = dateArr[2];
    //         }
    //     }
    //     const currentDate = Date.now();
    // }

    const handleOpenDialog = (event) => {
        buttonRef.current && buttonRef.current.open(event);
    }

    const handleOnFileLoad = (arrOfObjCSV) => {
        setStatus(PENDING);
        arrOfObjCSV.shift();

        const trimmedArrOfArrCSV = arrOfObjCSV.map(({ data }) =>
            data.map(el => el.trim())
        )

        trimmedArrOfArrCSV[0].push("Duplicate with");
        setHeadersCSV(trimmedArrOfArrCSV[0]);

        const arrOfStrings = trimmedArrOfArrCSV.map(el => el.join(';'));
        const strCSV = arrOfStrings.join('\n');
        const parsedClientsCSV = dsvFormat(";").parse(strCSV);
        const error = parsedClientsCSV.reduce((error, client) => {
            if (!client["Full Name"] || !client["Phone"] || !client["Email"]) {
                error = true;
            }
            return error;
        }, false)
        if (error) {
            setStatus(ERROR);
            return;
        }
        const normalizedClients = parsedClientsCSV.map(client => {

            return {
                ...client,
                "Phone": phoneNormalize(client["Phone"]),
                "Email": client["Email"].toLowerCase(),
                "Yearly Income": Number(client["Yearly Income"]).toFixed(2),
                "Has children": client["Has children"].toUpperCase(),
                "License states": licenseNormalize(client["License states"])
                // "Expiration date": dateNormalize(client["Expiration date"])
            };
        })
        const clientsWithDublicateProp = normalizedClients.map((client, idx) => ({ "ID": idx + 1, ...client, "Duplicate with": [] }));
        clientsWithDublicateProp.forEach(({ID, Phone, Email}) => {
            clientsWithDublicateProp.forEach(client => {
                if (client.ID !== ID && (client.Phone === Phone || client.Email === Email)) {
                    client["Duplicate with"] = ID;
                    // client["Duplicate with"].push(ID);
                }
            })
        })
        setDataCSV(clientsWithDublicateProp);
        setStatus(SUCCESS);
  }

  const handleOnError = (err, file, inputElem, reason) => {
      console.log(err, file, inputElem, reason);
  }

    return (
      <>
        <CSVReader
          ref={buttonRef}
          onFileLoad={handleOnFileLoad}
          onError={handleOnError}
        >
          {({ file }) => (
            <>
              <button type='button' onClick={handleOpenDialog}>
                Import users
              </button>
            </>
          )}
        </CSVReader>
        {status===SUCCESS && <Table data={dataCSV} headers={headersCSV} />}
        {status===ERROR && <h1>Error</h1>}
        {status===PENDING && <h1>Loading...</h1>}
      </>
    )
}