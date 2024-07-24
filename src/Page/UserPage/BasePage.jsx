import { useLocation } from "react-router-dom"
import Header from "../../Component/Base/Header"
import Sidebar from "../../Component/Base/Sidebar"
import TableMasterData from "../../Component/Table/TableMasterData"
import TableLogBook from "../../Component/Table/TableLogbook";
import TableTransaction from "../../Component/Table/TableTransaction";
import TableLokasi from "../../Component/Table/TableLokasi";
import TableReport from "../../Component/Table/TableReport";

function BasePage() {

    const location = useLocation();
    const pathSegments = location.pathname.split('/').filter(segment => segment !== '');
    return (
        <div className="body pe-md-5">
            <div className="container-fluid position-relative">
                <div className="row h-100 pt-4">
                    <Sidebar />
                    <Header />

                    <div className="
                    col-12  h-100 
                    "
                    >
                        <div className="row h-100 " >
                            <div className="col-2 d-none d-md-block   pe-0   shadow border h-100">

                            </div>
                            <div className="col-12  pt-4  col-md-10  ps-md-5 ps-4 pe-md-3 pe-4    bg-darker-white">
                                <div className="col-12 pt-5 ps-0 ps-md-3 pe-0 pe-md-3  ">
                                    <div className="col-12 bg-white py-3 px-3">
                                        <div className="row">
                                            <div className=" col-12 text-grey  px-3">
                                                admin
                                                {pathSegments.map((segment, index) => (
                                                    <span key={index}>
                                                        {' / '}
                                                        {index === pathSegments.length - 1 ? (
                                                            <span className="fw-bold">{segment}</span>
                                                        ) : (
                                                            segment
                                                        )}
                                                    </span>
                                                ))}
                                                <hr></hr>
                                            </div>


                                            <div className="col-12">
                                                {location.pathname.includes("masterdata/produk") ?
                                                    <TableMasterData
                                                    />
                                                    :
                                                    <></>
                                                }
                                            </div>

                                            <div className="col-12">
                                                {location.pathname.includes("transaction") ?
                                                    <TableTransaction
                                                    />
                                                    :
                                                    <></>
                                                }
                                            </div>

                                            <div className="col-12">
                                                {location.pathname.includes("logbook") ?
                                                    <TableLogBook
                                                    />
                                                    :
                                                    <></>
                                                }
                                            </div>

                                            
                                            <div className="col-12">
                                                {location.pathname.includes("report") ?
                                                    <TableReport
                                                    />
                                                    :
                                                    <></>
                                                }
                                            </div>

                                            <div className="col-12">
                                                {location.pathname.includes("lokasi") ?
                                                    <TableLokasi
                                                    />
                                                    :
                                                    <></>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    )
}
export default BasePage