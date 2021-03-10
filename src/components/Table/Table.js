// import { useEffect, useState } from 'react';
import s from './Table.module.css';

export default function Table({data, headers}) {

    const validate = (key, clientObj) => {
        if (key === "Phone" && (clientObj[key].length !==12 || clientObj[key].slice(0,2)!=="+1" )) {
            return false;
        }
        if (key === "Email" && !(/^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/.test(clientObj[key]) )) {
            return false;
        }
        if (key === "Age" && (!Number.isInteger(Number(clientObj[key])) || clientObj[key] < 21)) {
            return false;
        }
        if (key === "Experience" && (clientObj[key] < 0 || clientObj[key] > clientObj["Age"])) {
            return false;
        }
        if (key === "Yearly Income" && (clientObj[key] > 1000000)) {
            return false;
        }
        if (key === "Has children" && !(clientObj[key]==="TRUE" || clientObj[key]==="FALSE" || clientObj[key]==="")) {
            return false;
        }
        if (key === "License number" && !(clientObj[key].length===6 && /^[A-Za-z0-9]+$/.test(clientObj[key]))) {
            return false;
        }
        if (key === "Expiration date" && dateNotValid(clientObj[key])) {
            return false;
        }
        return true;
    }

    function dateNotValid(date) {
        if (date.includes('-')) {
            const dateArr = date.split('-');
            if (dateArr[0].length === 4) {
                const year = dateArr[0];
                const month = dateArr[1];
                const day = dateArr[2];
                return isExpirationValid(year, month, day);
            }
        }
        if (date.includes('/')) {
            const dateArr = date.split('/');
            if (dateArr[2].length === 4) {
                const year = dateArr[2];
                const month = dateArr[0];
                const day = dateArr[1];
                return isExpirationValid(year, month, day);
            }
        }
        return true;
    }

    function isExpirationValid(year, month, day) {
        if (month > 12 || month < 1 || day > 31 || day < 1) {
            return true;
        }
        const expirationDate = new Date(year, month - 1, day);
        const currentDate = Date.now();
        return expirationDate - currentDate > 0 ? false : true;
    }

    return (
        <table className={s.tableClients}>
            <thead>
                <tr>
                    <th>ID</th>
                    {headers.map((header, index) => (<th key={index}>{header}</th>))}
                </tr>
            </thead>

            <tbody>
                {data.map((client) => {
                    const clientKeys = Object.keys(client);
                    return (<tr key={client.ID}>
                        {clientKeys.map((key, idx) => {
                            return validate(key, client)
                                ? (<td key={idx}>{client[key]}</td>)
                                : (<td key={idx} className={s.error} >{client[key]}</td>)
                        })}
                    </tr>)
                })}
            </tbody>
        </table>
    )
}