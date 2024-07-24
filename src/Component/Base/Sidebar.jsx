import { useLocation } from 'react-router-dom'
import { useNavigate } from "react-router-dom"

import { RiArrowDropDownLine } from "react-icons/ri";
import { Box } from '@chakra-ui/react';
import { useState } from 'react';

function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    const [isOn, setIsOn] = useState(false);

    const handleToggle = () => {
        setIsOn(prevIsOn => !prevIsOn);
    };

    return (

        <div className="col-2 d-none d-md-block  position-fixed ps-1   h-100  ">
            <div className="row  sidebar h-100   position-relative">
                <div className="container-fluid ps-0 ">
                    <div className="row  ps-0  " >




                        <div className={
                            `col-12 button-sidebar shadow-sm py-1  ${location.pathname.includes("/transaction") ? "active" : ""
                            }`
                        }

                            onClick={location.pathname.includes("/transaction")
                                ?
                                ""
                                :
                                () => navigate("/transaction")
                            }

                        >
                            <div
                                className={
                                    `w-100 py-2 fw-bold text-uppercase d-flex justify-content-start ps-1 
                                }`
                                }

                            >
                                <div className='ps-4'>
                                    Transaction
                                </div>

                            </div>
                        </div>

                        <div className={
                            `col-12  button-sidebar shadow-sm py-2 ${location.pathname.includes("/logbook") ? "active" : ""
                            }`
                        }
                            onClick={location.pathname.includes("/logbook")
                                ?
                                ""
                                :
                                () => navigate("/logbook")
                            }
                        >
                            <div className=
                                'w-100 py-1 fw-bold text-uppercase d-flex justify-content-start ps-1'
                            >
                                <div className='ps-4'>
                                    LogBook
                                </div>
                            </div>
                        </div>

                        <div className={
                            `col-12  button-sidebar shadow-sm py-2 ${location.pathname.includes("/report") ? "active" : ""
                            }`
                        }
                            onClick={location.pathname.includes("/report")
                                ?
                                ""
                                :
                                () => navigate("/report")
                            }
                        >
                            <div className=
                                'w-100 py-1 fw-bold text-uppercase d-flex justify-content-start ps-1'
                            >
                                <div className='ps-4'>
                                Report
                                </div>
                            </div>
                        </div>


                    </div>

                </div>
            </div>
        </div >
    )
}
export default Sidebar