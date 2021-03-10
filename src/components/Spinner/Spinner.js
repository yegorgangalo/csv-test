import { CgSpinnerTwoAlt } from 'react-icons/cg';
import s from './Spinner.module.css'

export default function Spinner({classNames=""}) {
    return <CgSpinnerTwoAlt className={`${s.iconSpin} ${classNames}`}/>;
}