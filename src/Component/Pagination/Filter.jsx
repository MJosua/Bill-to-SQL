import { Select } from "@chakra-ui/react"

function Filter(
    {
        handleLimitChange,
        limit,
    }
) {
    return (
        <div className="col-12  px-0   ">
            <div className="container-fluid px-0">
                <div className="row d-flex text-primary px-0 justify-content-end">
                    <div className="col-6 text-secondary   user-select-none d-flex align-items-center">

                        Show

                    </div>
                    <div className="col-6 d-flex px-0 align-items-center">
                        <Select
                            size={"sm"}
                            onChange={(event) => handleLimitChange(event.target.value)}
                        >
                            <option value="10">
                                10
                            </option>
                            <option value="25">
                                25
                            </option>
                            <option value="50">
                                50
                            </option>
                            <option value="100">
                                100
                            </option>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Filter