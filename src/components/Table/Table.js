import { useEffect, useRef } from 'react';
import validateDate from "validate-date";
import s from './Table.module.css';

export default function Table({ data, headers }) {
    const tableBody = useRef(null);
    useEffect(() => {
        const a = null;
        const b = null;
        console.log(a===b);
        if (!tableBody.current) {
            return;
        }

        const normalizedHeaders = headers.map(header => header.includes(' ')
            ? header.split(' ').join('.')
            : header);

        const objOfTableColumns = normalizedHeaders.reduce((accObj, normalizedHeader) => {
            if (normalizedHeader === "ID" || normalizedHeader === "Full.Name" || normalizedHeader === "License.states" || normalizedHeader === "Duplicate.with") {
                return accObj;
            }
            const collection = tableBody.current.querySelectorAll(`.${normalizedHeader}`);
            return { ...accObj, [normalizedHeader]: collection };
        }, {})

        for (const key in objOfTableColumns) {
            validate(key, objOfTableColumns)
        }

        function validate(key, clientObj) {
            const collection = clientObj[key];
            switch (key) {
                case "Phone":
                    collection.forEach(item => {
                        if (item.textContent.length !== 12 || item.textContent.slice(0, 2) !== "+1") {
                            item.classList.add(s.error);
                        }
                    })
                    break;

                case "Email":
                    collection.forEach(item => {
                        if (!/^([a-z0-9_.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/.test(item.textContent)) {
                            item.classList.add(s.error);
                        }
                    })
                    break;

                case "Age":
                    collection.forEach(item => {
                        if (!Number.isInteger(Number(item.textContent)) || item.textContent < 21) {
                            item.classList.add(s.error);
                        }
                    })
                    break;

                case "Experience":
                    collection.forEach((item, idx) => {
                        if (item.textContent < 0 || +item.textContent > +clientObj["Age"][idx].textContent) {
                            item.classList.add(s.error);
                        }
                    })
                    break;

                case "Yearly.Income":
                    collection.forEach(item => {
                        if (isNaN(item.textContent) || item.textContent < 0 || item.textContent > 1000000) {
                            item.classList.add(s.error);
                        }
                    })
                    break;

                case "Has.children":
                    collection.forEach(item => {
                        if (!(item.textContent==="TRUE" || item.textContent==="FALSE" || item.textContent==="")) {
                            item.classList.add(s.error);
                        }
                    })
                    break;

                case "License.number":
                    collection.forEach(item => {
                        if (!(item.textContent.length===6 && /^[A-Za-z0-9]+$/.test(item.textContent))) {
                            item.classList.add(s.error);
                        }
                    })
                    break;

                case "Expiration.date":
                    collection.forEach(item => {
                        if (dateNotValid(item.textContent)) {
                            item.classList.add(s.error);
                        }
                    })
                    break;

                default:
                    break;
            }
        }

        function dateNotValid(date) {
            if (!validateDate(date, "boolean")) {
                    return true;
                }
            if (date.includes('-')) {
                const dateArr = date.split('-');
                if (dateArr[0].length === 4) {
                    const year = dateArr[0];
                    const month = dateArr[1];
                    const day = dateArr[2];
                    return isExpirationDateExpired(year, month, day);
                }
            }
            if (date.includes('/')) {
                const dateArr = date.split('/');
                if (dateArr[2].length === 4) {
                    const year = dateArr[2];
                    const month = dateArr[0];
                    const day = dateArr[1];
                    return isExpirationDateExpired(year, month, day);
                }
            }
        }

        function isExpirationDateExpired(year, month, day) {
        const expirationDate = new Date(year, month - 1, day);
        const currentDate = Date.now();
        return expirationDate - currentDate > 0 ? false : true;
        }

    }, [headers])

    return (
        <div className={s.wrapBlock} >
            <table className={s.tableClients}>
                <thead>
                    <tr>
                        <th>ID</th>
                        {headers.map((header, index) => (<th key={index}>{header}</th>))}
                    </tr>
                </thead>

                <tbody ref={tableBody}>
                    {data.map((client) => {
                        const clientKeys = Object.keys(client);
                        return (<tr key={client.ID}>
                            {clientKeys.map((key, idx) => <td key={idx} className={key}>{client[key]}</td>)}
                        </tr>)
                    })}
                </tbody>
            </table>
        </div>
    )
}