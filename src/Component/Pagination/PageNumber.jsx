import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

function PageNumber({
    totalPage,
    page,
    handlePageDecrement,
    pageIndices,
    handlePageIncrement,
    handlePageChange,


}) {
    return (
        <div className="col-12">
            {totalPage !== 0 && page && (
                <div className="col-12 d-flex justify-content-center mt-3">
                    <nav aria-label="Page navigation example">
                        <ul className="pagination text_muted">

                            {page === 1 ?
                                <>
                                </>
                                :
                                <li className="page-item pointer d-flex align-items-center fs-6">
                                    <a className="page-link text-dark d-flex align-items-center"
                                        style={{ height: "37px" }}
                                        onClick={handlePageDecrement}
                                    >
                                        <BsChevronLeft />
                                    </a>
                                </li>
                            }




                            {!([1, 2, 3, 4, 5, 6].includes(page)) ?
                                <>

                                    <li

                                        className="page-item d-flex align-items-center fs-6">
                                        <a className="page-link text-muted"
                                            style={{ height: "37px" }}
                                            onClick={() => handlePageChange(1)}
                                            href="#"
                                        >
                                            1
                                        </a>
                                    </li>
                                    <li

                                        className="page-item d-flex align-items-center fs-6">
                                        <a className="user-select-none page-link text-muted"
                                            style={{ height: "37px" }}

                                        >
                                            ...
                                        </a>
                                    </li>

                                </>

                                :
                                ""
                            }

                            {pageIndices.map(index => {
                                // Calculate the range of pages to display
                                const start = Math.max(1, page - 3);
                                const end = Math.min(totalPage, page + 3);
                                // Only render page numbers within the range
                                if (index + 1 >= start && index + 1 <= end) {
                                    return (
                                        <li className="page-item d-flex align-items-center  fs-6" key={index}>
                                            <a className={("page-link ") + (page === index + 1 ? "fw-bold text-selected" : "text-muted")}
                                                style={{ height: "37px" }}
                                                onClick={() => handlePageChange(index + 1)}
                                                href="#"
                                            >
                                                {index + 1}
                                            </a>
                                        </li>
                                    );
                                }
                                return null;
                            })}

                            {!([totalPage, totalPage - 1, totalPage - 2, totalPage - 3, totalPage - 4, totalPage - 5].includes(page)) ?
                                <>

                                    <li

                                        className="page-item d-flex align-items-center fs-6">
                                        <a className="user-select-none page-link text-muted"
                                            style={{ height: "37px" }}

                                        >
                                            ...
                                        </a>
                                    </li>

                                    <li

                                        className="page-item d-flex align-items-center fs-6">
                                        <a className="page-link text-muted"
                                            style={{ height: "37px" }}
                                            onClick={() => handlePageChange(totalPage)}
                                            href="#"
                                        >
                                            {totalPage}
                                        </a>
                                    </li>


                                </>

                                :
                                ""
                            }


                            {page === totalPage ?
                                <>
                                </>
                                :
                                <li className="page-item d-flex align-items-center fs-6">
                                <a className="page-link text-dark pointer d-flex align-items-center"
                                    style={{ height: "37px" }}
                                    onClick={handlePageIncrement}
                                >
                                    <BsChevronRight />
                                </a>
                            </li>
                            }

                           



                        </ul>
                    </nav>
                </div>
            )}
        </div>
    )
}

export default PageNumber